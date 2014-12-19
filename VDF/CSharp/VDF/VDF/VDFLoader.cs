using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

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
	public static VDFNode ToVDFNode(string text, Type declaredType = null, VDFLoadOptions loadOptions = null, int objIndent = 0) { return ToVDFNode(VDFTokenParser.ParseTokens(text), declaredType, loadOptions, objIndent); }
	public static VDFNode ToVDFNode(List<VDFToken> tokens, Type declaredType = null, VDFLoadOptions loadOptions = null, int objIndent = 0)
	{
		loadOptions = loadOptions ?? new VDFLoadOptions();

		// pre-process/fix tokens
		// ==========

		// if we're a non-list object
		int depth;
		for (var i0 = 0; i0 < 2; i0++) // probably temp
			if ((declaredType != null && !typeof(IList).IsAssignableFrom(declaredType)) || (tokens.Count > 0 && tokens[0].type == VDFTokenType.MetadataBaseValue && tokens[0].text.Contains(","))) // todo: should check for comma char only at depth 0
			{
				depth = 0;
				bool hasItems = false;
				for (var i = 0; i < tokens.Count; i++)
				{
					var token = tokens[i];

					if (token.type == VDFTokenType.DataEndMarker)
						depth--;

					if (depth == 0 && !hasItems)
						if (token.type == VDFTokenType.DataStartMarker)
							hasItems = true;
						else if (token.type == VDFTokenType.DataPropName)
							break;
					// and yet we have items (i.e. data was ambiguous to parser, and was considered to be within popped-out items), fix tokens to have them end up as properties
					if (hasItems && depth == 0 && new[] {VDFTokenType.DataStartMarker, VDFTokenType.DataEndMarker}.Contains(token.type))
						tokens.RemoveAt(i--);

					if (token.type == VDFTokenType.DataStartMarker)
						depth++;
				}
				if (hasItems) // if we had items (and therefore made the fixes), fix up the tokens' position-and-index properties
					VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
			}

		// figure out obj-type
		// ==========

		depth = 0;
		var tokensAtDepth0 = new List<VDFToken>();
		foreach (VDFToken token in tokens)
		{
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			if (depth == 0)
				tokensAtDepth0.Add(token);
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		var isList = typeof(IList).IsAssignableFrom(declaredType);
		for (var i = 0; i < tokensAtDepth0.Count; i++)
		{
			var lastToken = i - 1 >= 0 ? tokensAtDepth0[i - 1] : null;
			var token = tokensAtDepth0[i];
			if (lastToken != null && lastToken.type == VDFTokenType.DataEndMarker && token.type == VDFTokenType.DataStartMarker)
				isList = true;
		}

		VDFToken objMetadataBaseValueToken = null;
		VDFToken objMetadataEndMarkerToken = null;
		if (tokensAtDepth0.Count >= 2 && (new[] {VDFTokenType.WiderMetadataEndMarker, VDFTokenType.MetadataEndMarker}.Contains(tokensAtDepth0[1].type)))
		{
			objMetadataBaseValueToken = tokensAtDepth0[0];
			objMetadataEndMarkerToken = tokensAtDepth0[1];
		}
		else if (tokensAtDepth0.Count >= 1 && (new[] {VDFTokenType.WiderMetadataEndMarker, VDFTokenType.MetadataEndMarker}.Contains(tokensAtDepth0[0].type)))
			objMetadataEndMarkerToken = tokensAtDepth0[0];

		string objTypeStr = null;
		if (objMetadataBaseValueToken != null)
		{
			objTypeStr = objMetadataBaseValueToken.text;

			// do some expanding of obj-type-str (if applicable)
			if (objMetadataEndMarkerToken.type == VDFTokenType.WiderMetadataEndMarker && !objTypeStr.Contains("["))
				if (objTypeStr == ",")
					objTypeStr = "System.Collections.IDictionary";
				else if (FindNextDepthXCharYPos(objTypeStr, 0, 0, ',', '[', ']') != -1) // e.g. "string,object>>"
					objTypeStr = "Dictionary[" + objTypeStr + "]";
				else // e.g. "string>>"
					objTypeStr = "List[" + objTypeStr + "]";
		}
		else if (objMetadataEndMarkerToken != null)
			if (objMetadataEndMarkerToken.type == VDFTokenType.MetadataEndMarker)
				objTypeStr = ""; // if type is not already set, set it to an empty string, for type-inference later
			else
				objTypeStr = "System.Collections.IList";

		// some further inference based on token analysis
		if (objTypeStr == null && isList)
			objTypeStr = "System.Collections.IList";

		Type objType = declaredType;
		if (objTypeStr != null && objTypeStr.Length > 0)
		{
			var fromMetadataType = VDF.GetTypeByVName(objTypeStr, loadOptions);
			if (objType == null || objType.IsAssignableFrom(fromMetadataType)) // if there is no declared type, or the from-metadata type is more specific than the declared type
				objType = fromMetadataType;
		}
		if (objType == null)
			objType = typeof(string); // string is the default/fallback type (note, though, that if the below code finds properties, it'll just add them to the VDFNode anyway)
		var objTypeInfo = VDFTypeInfo.Get(objType);

		// pre-process/fix tokens
		// ==========

		// if we're a non-list object and yet we have items (i.e. data was ambiguous to parser, and was considered to be within popped-out items), fix tokens to have them end up as properties
		/*var firstStartMarker = tokensAtDepth0.FirstOrDefault(a => a.type == VDFTokenType.DataStartMarker);
		var firstPropertyName = tokensAtDepth0.FirstOrDefault(a => a.type == VDFTokenType.DataPropName);
		if (!typeof(IList).IsAssignableFrom(objType) && (firstStartMarker != null && (firstPropertyName == null || firstStartMarker.index < firstPropertyName.index)))
		{
			for (var i = 0; i < tokensAtDepth0.Count; i++)
				if (new[] { VDFTokenType.DataStartMarker, VDFTokenType.DataEndMarker }.Contains(tokensAtDepth0[i].type))
					tokensAtDepth0.RemoveAt(i--);
			scanForDepth0Tokens(); // rescan
		}*/

		// calculate token depths
		// ==========

		isList = isList || (typeof(IList).IsAssignableFrom(objType)); // update based on new knowledge of obj-type

		/*var firstNonObjMetadataGroupToken = objMetadataEndMarkerToken != null ? tokens.FirstOrDefault(a=>a.position > objMetadataEndMarkerToken.position) : tokens.FirstOrDefault();
		var hasPoppedOutChildren = !isInlineList && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak);

		// calculate token depths, based on our new knowledge of whether we're dealing with an inline-list (in that case, consider the "|"-separated text blocks as being a depth lower)
		// (note: 'depth' is increased not only by '{' chars, but also inferred/virtual '{' chars, e.g. to the left and right of item vdf-text)
		depth = 0;
		int inPoppedOutBlockAtIndent = -1;
		var hasDepth0DataBlocks = false;
		var tokensAtDepth0 = new List<VDFToken>();
		var tokensAtDepth1 = new List<VDFToken>(); // note: this may actually contain some tokens deeper than 1 (I haven't made sure)
		for (var i = 0; i < tokens.Count; i++)
		{
			var lastToken = i > 0 ? tokens[i - 1] : null;
			var token = tokens[i];

			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			else if (hasPoppedOutChildren)
			{
				if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) // if inferred a virtual '{' char before us (for object)
				{
					depth++;
					inPoppedOutBlockAtIndent = GetIndentDepthOfToken(tokens, token) + 1;
				}
				else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == VDFTokenType.LineBreak && GetIndentDepthOfToken(tokens, token) == inPoppedOutBlockAtIndent - 1) // if inferred a virtual '}' char before us (for object)
				{
					depth--;
					inPoppedOutBlockAtIndent = -1;
				}

				if (typeof(IList).IsAssignableFrom(objType))
					if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.LineBreak) // if inferred a virtual '{' char before us (for child)
						depth++;
					else if (depth == 1 && token.type == VDFTokenType.LineBreak) // if inferred a virtual '}' char before us (for child)
						depth--;
			}
			else if (isInlineList)
			{
				if (token.type != VDFTokenType.ItemSeparator && token.type != VDFTokenType.DataStartMarker && depth == 0 && (firstNonObjMetadataGroupToken == token || (lastToken != null && lastToken.type == VDFTokenType.ItemSeparator))) // if inferred a virtual '{' char before us (for child)
					depth++;
				else if (token.type == VDFTokenType.ItemSeparator && !hasDepth0DataBlocks && depth == 1 && lastToken != null && lastToken.type != VDFTokenType.ItemSeparator) // if inferred a virtual '}' char before us (for child)
					depth--;
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
		}*/

		// create the object's VDFNode, and load in the data
		// ==========

		var objNode = new VDFNode();
		objNode.metadata_type = objTypeStr;

		var getTokenAtIndex = (Func<int, VDFToken>)(index=>tokens.Count > index ? tokens[index] : null);
		//var getTokenRange = (Func<int, int?, List<VDFToken>>)((index, count)=>tokens.GetRange(index, count ?? (tokens.Count - index)).Select(a=>new VDFToken(a.type, a.position - tokens[index].position, a.index - index/*, a.rawText*/, a.text)).ToList());
		//var getTokenRange_indexes = (Func<int, int?, List<VDFToken>>)((index, enderIndex)=>tokens.GetRange(index, (enderIndex ?? tokens.Count) - index).Select(a=>new VDFToken(a.type, a.position - tokens[index].position, a.index - index/*, a.rawText*/, a.text)).ToList());
		var getTokenRange_tokens = (Func<VDFToken, VDFToken, List<VDFToken>>)((firstToken, enderToken)=>tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index/*, a.rawText*/, a.text)).ToList());

		// if List, parse items
		/*if (typeof(IList).IsAssignableFrom(objType))
			if (isInlineList)
			{
				var firstDepth1Token = tokensAtDepth1.FirstOrDefault();
				var lastDepth0MetadataEndMarkerToken = tokens.LastOrDefault(a=>a.type == VDFTokenType.MetadataEndMarker || a.type == VDFTokenType.WiderMetadataEndMarker);
				var firstItemToken = firstDepth1Token ?? (lastDepth0MetadataEndMarkerToken != null ? tokens.FirstOrDefault(a=>a.position == lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.Length) : tokens.First());
				var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker) : tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.ItemSeparator);
				if (firstItemEnderToken != null || firstItemEnderToken == null || firstItemEnderToken.position > firstItemToken.position) // (if there's an item separator or depth-0-data-end-marker, we can go ahead and infer that a zero-length sub-section represents an actual object)
					objNode.items.Add(ToVDFNode(getTokenRange_tokens(firstItemToken, firstItemEnderToken), objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));

				foreach (VDFToken token in tokensAtDepth0)
					if (token.type == VDFTokenType.ItemSeparator)
					{
						var itemToken = getTokenAtIndex(token.index + 1 + (hasDepth0DataBlocks ? 1 : 0)); //tokens.First(a=>a.position >= token.position + token.text.Length + (hasDepth0DataBlocks ? 1 : 0));
						var itemEnderToken = itemToken != null ? tokensAtDepth0.FirstOrDefault(a=>a.type == (hasDepth0DataBlocks ? VDFTokenType.DataEndMarker : VDFTokenType.ItemSeparator) && a.position >= itemToken.position) : null;
						objNode.items.Add(ToVDFNode(itemToken != null ? getTokenRange_tokens(itemToken, itemEnderToken) : new List<VDFToken>(), objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));
					}
			}
			else
				foreach (VDFToken token in tokensAtDepth0)
				{
					VDFToken nextTokenAtDepth1 = tokensAtDepth1.FirstOrDefault(a=>a.position > token.position);
					if (token.type == VDFTokenType.LineBreak && nextTokenAtDepth1 != null && nextTokenAtDepth1.text.StartsWith("\t") && !nextTokenAtDepth1.text.StartsWith("\t\t"))
					{
						var itemToken = getTokenAtIndex(token.index + 1); //tokens.First(a => a.position > token.position); // note: item-token's text includes tab char
						var itemEnderToken = itemToken != null ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak && a.position >= itemToken.position) : null;
						var itemTokens = itemToken != null ? getTokenRange_tokens(itemToken, itemEnderToken) : new List<VDFToken>();
						if (itemTokens.Count > 0)
							itemTokens[0].text = itemTokens[0].text.Substring(1);
						objNode.items.Add(ToVDFNode(itemTokens, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));
					}
				}*/

		// sort of a hack; if List, and no depth-0 start-markers exist (i.e. there's only one item), add a start-marker and end-marker for the first and only item
		/*if (typeof(IList).IsAssignableFrom(objType) && !tokensAtDepth0.Any(a=>a.type == VDFTokenType.DataStartMarker))
		{
			int itemFirstTokenIndex;
			if (tokens.Count > 0 && tokens[0].type == VDFTokenType.WiderMetadataEndMarker)
				itemFirstTokenIndex = 1;
			else if (tokens.Count > 1 && tokens[0 + 1].type == VDFTokenType.WiderMetadataEndMarker)
				itemFirstTokenIndex = 2;
			else
				itemFirstTokenIndex = 0;
			tokens.Insert(itemFirstTokenIndex, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
			tokens.Add(new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
			VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
		}*/

		// if List, parse items
		//if (typeof(IList).IsAssignableFrom(objType))
		for (var i = 0; i < tokensAtDepth0.Count; i++)
		{
			var token = tokensAtDepth0[i];
			if (token.type == VDFTokenType.DataStartMarker)
			{
				var itemFirstToken = getTokenAtIndex(token.index + 1); //tokens.First(a=>a.position >= token.position + token.text.Length + (hasDepth0DataBlocks ? 1 : 0));
				var itemEnderToken = itemFirstToken != null ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker && a.index > itemFirstToken.index) : null;
				objNode.items.Add(ToVDFNode(getTokenRange_tokens(itemFirstToken, itemEnderToken), objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));
			}
		}

		// if object or dictionary, parse keys-and-values/properties (depending on whether we're a Dictionary)
		if (!typeof(IList).IsAssignableFrom(objType))
			for (var i = 0; i < tokens.Count; i++)
			{
				var token = tokens[i];
				var next3Tokens = tokens.GetRange(i + 1, Math.Min(3, tokens.Count - (i + 1)));

				if (token.type == VDFTokenType.DataPropName && tokensAtDepth0.Contains(token))
				{
					var propName = token.text.TrimStart(new[] {'\t'});
					Type propValueType;
					if (typeof(IDictionary).IsAssignableFrom(objType))
						propValueType = objType.IsGenericType ? objType.GetGenericArguments()[1] : null;
					else
						propValueType = objTypeInfo.propInfoByName.ContainsKey(propName) ? objTypeInfo.propInfoByName[propName].GetPropType() : null;

					if (next3Tokens.Count < 2 || next3Tokens[1].type == VDFTokenType.DataEndMarker) // if (as Dictionary) we have no items
						objNode.properties.Add(propName, ToVDFNode(new List<VDFToken>(), propValueType, loadOptions, objIndent));
					else //if (!token.text.StartsWith("\t")) // if this property *key*/*definition* is inline
					{
						var propValueToken = next3Tokens[1]; //next3Tokens.First(a=>a.type != VDFTokenType.DataStartMarker);
						var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>(a.type == VDFTokenType.DataEndMarker || a.type == VDFTokenType.PoppedOutDataEndMarker) && a.index > propValueToken.index);
						objNode.properties.Add(propName, ToVDFNode(getTokenRange_tokens(propValueToken, propValueEnderToken), propValueType, loadOptions, objIndent));
					}
					/*else // if this property *key*#/*definition* is popped-out
					{
						var propValueToken = next3Tokens[1];
						var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName && a.position > propValueToken.position);
						objNode.properties.Add(propName, ToVDFNode(getTokenRange_tokens(propValueToken, propValueEnderToken), propValueType, loadOptions, objIndent + 1));
					}*/
				}
			}

		// parse base-value (if applicable)
		if (objNode.items.Count == 0 && objNode.properties.Count == 0)
		{
			var firstPropNameToken = tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName);
			var firstBaseValueToken = tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataBaseValue);
			if (firstBaseValueToken != null && (firstPropNameToken == null || firstBaseValueToken.position < firstPropNameToken.position))
				objNode.baseValue = firstBaseValueToken.text;
		}

		return objNode;
	}
	/*public static void RestoreItemPropertiesAsRootProperties(VDFNode objNode)
	{
		foreach (VDFNode item in objNode.items)
			foreach (var key in item.properties.Keys)
				objNode.properties[key] = item.properties[key];
		objNode.items.Clear();
	}*/

	static int FindNextDepthXCharYPos(string text, int searchStartPos, int targetDepth, char ch, char depthStartChar, char depthEndChar)
	{
		int depth = 0;
		for (var i = searchStartPos; i < text.Length && depth >= 0; i++)
			if (text[i] == depthStartChar)
				depth++;
			else if (text[i] == ch && depth == targetDepth)
				return i;
			else if (text[i] == depthEndChar)
				depth--;
		return -1;
	}
	static int GetIndentDepthOfToken(List<VDFToken> tokens, VDFToken token)
	{
		VDFToken firstTokenOfLine = null;
		for (int i = token.index - 1; firstTokenOfLine == null; i--)
			if (tokens[i].type == VDFTokenType.LineBreak || i == 0)
				if (tokens.Count > i + 1)
					firstTokenOfLine = tokens[i + 1];
					
		var result = 0;
		for (int i = 0; i < firstTokenOfLine.text.Length; i++)
			if (firstTokenOfLine.text[i] == '\t')
				result++;
			else
				break;
		return result;
	}
}