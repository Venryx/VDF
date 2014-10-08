using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public class VDFLoadOptions
{
	public object message;
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;
	//public List<string> extraSearchAssemblyNames; // maybe add this option later

	public VDFLoadOptions(object message = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null)
	{
		this.message = message;
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
	}
}

public static class VDFLoader
{
	public static VDFNode ToVDFNode<T>(string text, VDFLoadOptions loadOptions = null) { return ToVDFNode(text, typeof(T), loadOptions); }
	public static VDFNode ToVDFNode(string text, VDFLoadOptions loadOptions, Type declaredType = null) { return ToVDFNode(text, declaredType, loadOptions); }
	public static VDFNode ToVDFNode(string text, Type declaredType = null, VDFLoadOptions loadOptions = null, int objIndent = 0)
	{
		text = (text ?? "").Replace("\r\n", "\n");
		loadOptions = loadOptions ?? new VDFLoadOptions();

		// pre-parse all the tokens for our depth level
		var parser = new VDFTokenParser(text, 0);
		int depth = 0;
		var tokensAtDepth0 = new List<VDFToken>();
		var tokensAtDepth1 = new List<VDFToken>();
		int inPoppedOutBlockAtIndent = -1;
		while (parser.MoveNextToken())
		{
			VDFToken lastToken = parser.tokens.Count - 2 >= 0 ? parser.tokens[parser.tokens.Count - 2] : null;
			VDFToken token = parser.tokens[parser.tokens.Count - 1];
			if (token.type == VDFTokenType.DataEndMarker)
			{
				depth--;
				if (depth < 0)
					break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			}

			if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) // if inferred a virtual '{' char before us
			{
				depth++;
				inPoppedOutBlockAtIndent = FindIndentDepthOfLineContainingCharPos(text, token.position) + 1;
			}
			if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.LineBreak) // if inferred a virtual '{' char before us
				depth++;
			else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == VDFTokenType.LineBreak && FindIndentDepthOfLineContainingCharPos(text, token.position) == inPoppedOutBlockAtIndent - 1) // if inferred a virtual '}' char before us
			{
				depth--;
				inPoppedOutBlockAtIndent = -1;
			}

			if (depth == 0)
				tokensAtDepth0.Add(token);
			else if (depth == 1)
				tokensAtDepth1.Add(token);

			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}

		//var objIndent = FindIndentDepthOfLineContainingCharPos(text, 0);
		var firstWiderMetadataToken = parser.tokens.FirstOrDefault(a => a.type == VDFTokenType.WiderMetadataEndMarker);
		var firstPropNameToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName);
		var firstBaseValueToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataBaseValue);
		var firstDataStartMarkerToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataStartMarker);
		var firstPoppedOutDataStartMarkerToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.PoppedOutDataStartMarker);
		var firstLineBreakToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak);

		// if we can tell it's a List, update the tokens-at-depth-0 list to not include the for-item tokens
		// ('depth' is increased not only by '{' chars, but also inferred/virtual '{' chars to the left and right of item vdf-text)
		var hasDepth0DataBlocks = false;
		var hasWiderMetadata = firstWiderMetadataToken != null && (firstPropNameToken == null || firstWiderMetadataToken.position < firstPropNameToken.position);
		var hasListOrDictionaryChildren = firstLineBreakToken != null && (firstPropNameToken == null || firstLineBreakToken.position < firstPropNameToken.position) && (firstBaseValueToken == null || firstLineBreakToken.position < firstBaseValueToken.position);
		hasListOrDictionaryChildren = hasListOrDictionaryChildren || tokensAtDepth0.Any(a=>a.type == VDFTokenType.ItemSeparator);

		var inferredDictionary = false;
		var inferredList = false;
		if ((hasWiderMetadata || hasListOrDictionaryChildren))
			if (tokensAtDepth0.Any(a=>FindNextDepthXCharYPos(text, 0, 1, ',', '[', ']') != -1 || FindNextDepthXCharYPos(text, 0, 0, ',', '[', ']') != -1))
				inferredDictionary = true;
			else
				inferredList = true;
		var inlineItems = firstLineBreakToken == null || parser.tokens.IndexOf(firstLineBreakToken) >= 4;

		if (typeof(IList).IsAssignableFrom(declaredType) || inferredList || typeof(IDictionary).IsAssignableFrom(declaredType) || inferredDictionary)
		{
			tokensAtDepth0 = new List<VDFToken>();
			tokensAtDepth1 = new List<VDFToken>();

			VDFToken widerMetadataEndMarkerToken = null;
			if (parser.tokens.Count >= 2 && parser.tokens[0].type == VDFTokenType.MetadataBaseValue && parser.tokens[1].type == VDFTokenType.WiderMetadataEndMarker)
				widerMetadataEndMarkerToken = parser.tokens[1];
			else if (parser.tokens.Count >= 1 && parser.tokens[0].type == VDFTokenType.WiderMetadataEndMarker)
				widerMetadataEndMarkerToken = parser.tokens[0];
			VDFToken firstNonMetadataGroupToken = widerMetadataEndMarkerToken != null ? parser.tokens.FirstOrDefault(a=>a.position > widerMetadataEndMarkerToken.position) : parser.tokens.FirstOrDefault();

			depth = 0;
			inPoppedOutBlockAtIndent = -1;
			for (var i = 0; i < parser.tokens.Count; i++)
			{
				var lastToken = i > 0 ? parser.tokens[i - 1] : null;
				var token = parser.tokens[i];

				if (token.type == VDFTokenType.DataEndMarker)
				{
					depth--;
					if (depth < 0)
						break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
				}
				else if (inlineItems)
				{
					if (token.type == VDFTokenType.ItemSeparator && !hasDepth0DataBlocks && depth == 1 && lastToken != null && lastToken.type != VDFTokenType.ItemSeparator) // if inferred a virtual '}' char before us
						depth--;
					else if (token.type != VDFTokenType.ItemSeparator && token.type != VDFTokenType.DataStartMarker && depth == 0 && (firstNonMetadataGroupToken == token || (lastToken != null && lastToken.type == VDFTokenType.ItemSeparator))) // if inferred a virtual '{' char before us
						depth++;
				}
				else
					if (firstNonMetadataGroupToken != token && firstLineBreakToken != token && token.type == VDFTokenType.LineBreak) // if inferred a virtual '}' char before us
						depth--;
					else if (token.type != VDFTokenType.LineBreak && depth == 0 && lastToken != null && lastToken.type == VDFTokenType.LineBreak) // if inferred a virtual '{' char before us
						depth++;

				if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) // if inferred a virtual '{' char before us
				{
					depth++;
					inPoppedOutBlockAtIndent = FindIndentDepthOfLineContainingCharPos(text, token.position) + 1;
				}
				if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.LineBreak) // if inferred a virtual '{' char before us
					depth++;
				else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == VDFTokenType.LineBreak && FindIndentDepthOfLineContainingCharPos(text, token.position) == inPoppedOutBlockAtIndent - 1) // if inferred a virtual '}' char before us
				{
					depth--;
					inPoppedOutBlockAtIndent = -1;
				}

				if (depth == 0)
					tokensAtDepth0.Add(token);
				else if (depth == 1)
					tokensAtDepth1.Add(token);

				if (token.type == VDFTokenType.DataStartMarker)
				{
					if (depth == 0)
						hasDepth0DataBlocks = true;
					depth++;
				}
			}
		}

		var objNode = new VDFNode();

		// non-metadata-based inference first
		if (inferredList)
			objNode.metadata_type = "System.Collections.IList";
		else if (inferredDictionary)
			objNode.metadata_type = "System.Collections.IDictionary";

		// metadata-based type retrieval/inferrence
		for (int i = 0; i < tokensAtDepth0.Count; i++)
		{
			var token = tokensAtDepth0[i];
			var nextToken = tokensAtDepth0.Count > i + 1 ? tokensAtDepth0[i + 1] : null;
			if (token.type == VDFTokenType.MetadataEndMarker)
				objNode.metadata_type = objNode.metadata_type ?? ""; // if type is not already set, set it to an empty string, for type-inference later
			else if (token.type == VDFTokenType.MetadataBaseValue)
				if (nextToken.type == VDFTokenType.WiderMetadataEndMarker)
					if (FindNextDepthXCharYPos(token.text, 0, 1, ',', '[', ']') != -1) // e.g. "Dictionary[string,object]>>"
						objNode.metadata_type = token.text;
					else if (FindNextDepthXCharYPos(token.text, 0, 0, ',', '[', ']') != -1) // e.g. "string,object>>"
						objNode.metadata_type = "Dictionary[" + token.text + "]";
					else if (token.text == ",")
						objNode.metadata_type = "System.Collections.IDictionary";
					else if (token.text.Contains("[")) // e.g. "List[string]>>"
						objNode.metadata_type = token.text;
					else // e.g. "string>>"
						objNode.metadata_type = "List[" + token.text + "]";
				else
					objNode.metadata_type = token.text;
		}

		Type objType = declaredType;
		if (objNode.metadata_type != null && objNode.metadata_type.Length > 0)
		{
			var fromMetadataType = VDF.GetTypeByVName(objNode.metadata_type, loadOptions);
			if (objType == null || objType.IsAssignableFrom(fromMetadataType)) // if there is no declared type, or the from-metadata type is more specific than the declared type
				objType = fromMetadataType;
		}
		if (objType == null)
			objType = typeof(string); // string is the default/fallback type
		var objTypeInfo = VDFTypeInfo.Get(objType);

		// if List, parse items
		if (typeof(IList).IsAssignableFrom(objType))
		{
			if (inlineItems)
			{
				var firstDepth1Token = parser.tokens.FirstOrDefault(a => !tokensAtDepth0.Contains(a));
				var lastDepth0MetadataEndMarkerToken = parser.tokens.LastOrDefault(a=>a.type == VDFTokenType.MetadataEndMarker || a.type == VDFTokenType.WiderMetadataEndMarker);
				var firstItemTextPos = firstDepth1Token != null ? firstDepth1Token.position : (lastDepth0MetadataEndMarkerToken != null ? lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.Length : 0);
				var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(a => a.type == VDFTokenType.DataEndMarker) : tokensAtDepth0.FirstOrDefault(a => a.type == VDFTokenType.ItemSeparator);
				var firstItemText = text.Substring(firstItemTextPos, (firstItemEnderToken != null ? firstItemEnderToken.position : text.Length) - firstItemTextPos);
				if (firstItemEnderToken != null || firstItemText.Length > 0) // (if there's an item separator or depth-0-data-end-marker, we can go ahead and infer that a zero-length sub-section represents an actual object)
					objNode.items.Add(ToVDFNode(firstItemText, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));

				foreach (VDFToken token in tokensAtDepth0)
					if (token.type == VDFTokenType.ItemSeparator)
					{
						var itemTextPos = token.position + token.text.Length + (hasDepth0DataBlocks ? 1 : 0);
						var itemEnderToken = tokensAtDepth0.FirstOrDefault(a => a.type == (hasDepth0DataBlocks ? VDFTokenType.DataEndMarker : VDFTokenType.ItemSeparator) && a.position >= itemTextPos);
						var itemText = text.Substring(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.Length) - itemTextPos);
						objNode.items.Add(ToVDFNode(itemText, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));
					}
			}
			else
				foreach (var token in tokensAtDepth1)
				{
					if (token.type != VDFTokenType.PoppedOutDataStartMarker && token.type != VDFTokenType.LineBreak && token.position > 0)
						if (FindIndentDepthOfLineContainingCharPos(text, token.position) == objIndent + 1)
						{
							var itemTextPos = token.position + (objIndent + 1);
							var itemEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak && a.position >= itemTextPos);
							var itemText = text.Substring(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.Length) - itemTextPos);
							objNode.items.Add(ToVDFNode(itemText, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent + 1));
						}
						else
							break;
				}
		}

		// parse keys-and-values/properties (depending on whether we're a Dictionary)
		for (int i = 0; i < parser.tokens.Count; i++)
		{
			//var lastToken = i > 0 ? parser.tokens[i - 1] : null;
			var token = parser.tokens[i];
			//var nextToken = parser.tokens.Count > i + 1 ? parser.tokens[i + 1] : null;
			var next3Tokens = parser.tokens.GetRange(i + 1, Math.Min(3, parser.tokens.Count - (i + 1)));

			var targetDepthForPropNameTokens = typeof(IDictionary).IsAssignableFrom(objType) ? tokensAtDepth1 : tokensAtDepth0;
			if (token.type == VDFTokenType.DataPropName && targetDepthForPropNameTokens.Contains(token))
			{
				Type propValueType;
				if (typeof(IDictionary).IsAssignableFrom(objType))
					propValueType = objType.IsGenericType ? objType.GetGenericArguments()[0] : null;
				else
					propValueType = objTypeInfo != null && objTypeInfo.propInfoByName.ContainsKey(token.text) ? objTypeInfo.propInfoByName[token.text].GetPropType() : null;

				var propName = token.text.TrimStart(new[]{'\t'});
				if (!token.text.StartsWith("\t")) // if this property *key*/*definition* is inline
				{
					var propValueTextPos = next3Tokens[1].position;
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>(a.type == VDFTokenType.DataEndMarker || a.type == VDFTokenType.PoppedOutDataEndMarker) && a.position >= propValueTextPos);
					var propValueText = text.Substring(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.Length) - propValueTextPos);
					objNode.properties.Add(propName, ToVDFNode(propValueText, propValueType, loadOptions, objIndent));
				}
				else // if this property *key*/*definition* is popped-out
				{
					var propValueTextPos = next3Tokens[1].position;
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak && a.position >= propValueTextPos);
					var propValueText = text.Substring(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.Length) - propValueTextPos);
					objNode.properties.Add(propName, ToVDFNode(propValueText, propValueType, loadOptions, objIndent + 1));
				}
			}
			else if (typeof(IDictionary).IsAssignableFrom(objType) && tokensAtDepth0.Contains(token) && token.type == VDFTokenType.PoppedOutDataEndMarker)
				break;
			//else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
			//	break;
		}

		// parse base-value (if applicable)
		if (firstBaseValueToken != null && (firstPropNameToken == null || firstBaseValueToken.position < firstPropNameToken.position))
			objNode.baseValue = firstBaseValueToken.text;

		return objNode;
	}

	static int FindNextDepthXCharYPos(string text, int searchStartPos, int targetDepth, char ch, char depthStartChar, char depthEndChar)
	{
		int depth = 0;
		for (int i = searchStartPos; i < text.Length && depth >= 0; i++)
			if (text[i] == depthStartChar)
				depth++;
			else if (text[i] == ch && depth == targetDepth)
				return i;
			else if (text[i] == depthEndChar)
				depth--;
		return -1;
	}
	/*static int FindNextDepthXItemSeparatorCharPos(string text, int searchStartPos, int targetDepth)
	{
		int depth = 0;
		var parser = new VDFTokenParser(text, searchStartPos);
		while (parser.MoveNextToken() && depth >= 0) // use parser, so we don't have to deal with special '|' symbol usage, for separating '@@' literal-markers from the end of a troublesome string (i.e. "Bad string.@@")
			if (parser.tokens.Last().type == VDFTokenType.DataStartMarker)
				depth++;
			else if (parser.tokens.Last().type == VDFTokenType.ItemSeparator && depth == targetDepth)
				return parser.nextCharPos - 1; /*is this correct?*#/
			else if (parser.tokens.Last().type == VDFTokenType.DataEndMarker)
			{
				depth--;
				if (depth < 0)
					break;
			}
		return -1;
	}*/
	static int FindIndentDepthOfLineContainingCharPos(string text, int charPos)
	{
		int lineIndentDepth = 0;
		for (int i = charPos; i > 0 && text[i] != '\n'; i--)
			if (text[i] == '\t')
				lineIndentDepth++;
		return lineIndentDepth;
	}
	static int FindNextLineBreakCharPos(string text, int searchStartPos)
	{
		for (int i = searchStartPos; i < text.Length; i++)
			if (text[i] == '\n')
				return i;
		return -1;
	}
	static List<int> FindPoppedOutChildTextPositions(string text, int parentIndentDepth, int searchStartPos, int poppedOutChildDataIndex)
	{
		var result = new List<int>();

		int poppedOutChildDatasReached = 0;
		int indentsOnThisLine = 0;
		bool inLiteralMarkers = false;
		for (int i = searchStartPos; i < text.Length; i++)
		{
			char? lastChar = i > 0 ? text[i - 1] : (char?)null;
			char ch = text[i];
			char? nextChar = i < text.Length - 1 ? text[i + 1] : (char?)null;
			char? nextNextChar = i < text.Length - 2 ? text[i + 2] : (char?)null;

			if (lastChar != '@' && ch == '@' && nextChar == '@' && (!inLiteralMarkers || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) // special case; escape literals
			{
				inLiteralMarkers = !inLiteralMarkers;
				i++; // increment index by one extra, so as to have the next char processed be the first char after literal-marker
				continue; // skip processing of literal-marker
			}
			if (inLiteralMarkers) // don't do any token processing, (other than the literal-block-related stuff), until end-literal-marker is reached
				continue;

			if (ch == '\n')
				indentsOnThisLine = 0;
			else if (ch == '\t')
				indentsOnThisLine++;
			else if (indentsOnThisLine == parentIndentDepth + 1)
			{
				if (poppedOutChildDatasReached == 0 || ch == '#')
					poppedOutChildDatasReached++;
				if (poppedOutChildDatasReached == poppedOutChildDataIndex + 1)
					result.Add(i);
				if (poppedOutChildDatasReached > poppedOutChildDataIndex + 1) // we just finished processing the given popped-out child-data, so break
					break;

				int nextLineBreakCharPos = FindNextLineBreakCharPos(text, i);
				if (nextLineBreakCharPos != -1)
					i = nextLineBreakCharPos - 1; // we only care about the tabs, and the first non-tab char; so skip to next line, once we process first non-tab char
				else
					break; // last line, so break
			}
			else if (indentsOnThisLine <= parentIndentDepth && poppedOutChildDatasReached > 0) // if we've reached a peer of the parent, break
				break;
		}

		return result;
	}
}