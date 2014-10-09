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
	public static VDFNode ToVDFNode(string text, Type declaredType = null, VDFLoadOptions loadOptions = null, int objIndent = 0)
	{
		text = (text ?? "").Replace("\r\n", "\n");
		loadOptions = loadOptions ?? new VDFLoadOptions();

		// parse all tokens
		// ==========

		var parser = new VDFTokenParser(text, 0);
		while (parser.MoveNextToken()) {}

		// figure out obj-type
		// ==========

		int depth = 0;
		var tokensNotInDataMarkers = new List<VDFToken>();
		foreach (VDFToken token in parser.tokens)
		{
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			if (depth == 0)
				tokensNotInDataMarkers.Add(token);
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		var isInlineList = tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.ItemSeparator);

		VDFToken objMetadataBaseValueToken = null;
		VDFToken objMetadataEndMarkerToken = null;
		if (isInlineList)
		{
			if (tokensNotInDataMarkers.Count >= 2 && tokensNotInDataMarkers[1].type == VDFTokenType.WiderMetadataEndMarker)
			{
				objMetadataBaseValueToken = tokensNotInDataMarkers[0];
				objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
			}
			else if (tokensNotInDataMarkers.Count >= 1 && tokensNotInDataMarkers[0].type == VDFTokenType.WiderMetadataEndMarker)
				objMetadataEndMarkerToken = tokensNotInDataMarkers[0];
		}
		else
			if (tokensNotInDataMarkers.Count >= 2 && (tokensNotInDataMarkers[1].type == VDFTokenType.WiderMetadataEndMarker || (tokensNotInDataMarkers[0].type == VDFTokenType.MetadataBaseValue && tokensNotInDataMarkers[1].type == VDFTokenType.MetadataEndMarker)))
			{
				objMetadataBaseValueToken = tokensNotInDataMarkers[0];
				objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
			}
			else if (tokensNotInDataMarkers.Count >= 1 && (tokensNotInDataMarkers[0].type == VDFTokenType.WiderMetadataEndMarker || tokensNotInDataMarkers[0].type == VDFTokenType.MetadataEndMarker))
				objMetadataEndMarkerToken = tokensNotInDataMarkers[0];

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
		if (objTypeStr == null)
			if (isInlineList)
				objTypeStr = "System.Collections.IList";
			//else if (tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.DataPropName) && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak))
			else if (tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.PoppedOutDataStartMarker) && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak))
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

		// calculate token depths
		// ==========

		isInlineList = isInlineList || (typeof(IList).IsAssignableFrom(objType) && tokensNotInDataMarkers.Any(a=>a != objMetadataBaseValueToken && a != objMetadataEndMarkerToken) && tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.LineBreak)); // update based on new knowledge of obj-type

		var firstNonObjMetadataGroupToken = objMetadataEndMarkerToken != null ? parser.tokens.FirstOrDefault(a=>a.position > objMetadataEndMarkerToken.position) : parser.tokens.FirstOrDefault();
		var hasPoppedOutChildren = !isInlineList && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak);

		// calculate token depths, based on our new knowledge of whether we're dealing with an inline-list (in that case, consider the "|"-separated text blocks as being a depth lower)
		// (note: 'depth' is increased not only by '{' chars, but also inferred/virtual '{' chars, e.g. to the left and right of item vdf-text)
		depth = 0;
		int inPoppedOutBlockAtIndent = -1;
		var hasDepth0DataBlocks = false;
		var tokensAtDepth0 = new List<VDFToken>();
		var tokensAtDepth1 = new List<VDFToken>(); // note: this may actually contain some tokens deeper than 1 (I haven't made sure)
		for (var i = 0; i < parser.tokens.Count; i++)
		{
			var lastToken = i > 0 ? parser.tokens[i - 1] : null;
			var token = parser.tokens[i];

			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			else if (hasPoppedOutChildren)
			{
				if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) // if inferred a virtual '{' char before us (for object)
				{
					depth++;
					inPoppedOutBlockAtIndent = FindIndentDepthOfLineContainingCharPos(text, token.position) + 1;
				}
				else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == VDFTokenType.LineBreak && FindIndentDepthOfLineContainingCharPos(text, token.position) == inPoppedOutBlockAtIndent - 1) // if inferred a virtual '}' char before us (for object)
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
		}

		// create the object's VDFNode, and load in the data
		// ==========

		var objNode = new VDFNode();
		objNode.metadata_type = objTypeStr;

		// if List, parse items
		if (typeof(IList).IsAssignableFrom(objType))
			if (isInlineList)
			{
				var firstDepth1Token = tokensAtDepth1.FirstOrDefault();
				var lastDepth0MetadataEndMarkerToken = parser.tokens.LastOrDefault(a=>a.type == VDFTokenType.MetadataEndMarker || a.type == VDFTokenType.WiderMetadataEndMarker);
				var firstItemTextPos = firstDepth1Token != null ? firstDepth1Token.position : (lastDepth0MetadataEndMarkerToken != null ? lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.Length : 0);
				var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker) : tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.ItemSeparator);
				var firstItemText = text.Substring(firstItemTextPos, (firstItemEnderToken != null ? firstItemEnderToken.position : text.Length) - firstItemTextPos);
				if (firstItemEnderToken != null || firstItemText.Length > 0) // (if there's an item separator or depth-0-data-end-marker, we can go ahead and infer that a zero-length sub-section represents an actual object)
					objNode.items.Add(ToVDFNode(firstItemText, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));

				foreach (VDFToken token in tokensAtDepth0)
					if (token.type == VDFTokenType.ItemSeparator)
					{
						var itemTextPos = token.position + token.text.Length + (hasDepth0DataBlocks ? 1 : 0);
						var itemEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == (hasDepth0DataBlocks ? VDFTokenType.DataEndMarker : VDFTokenType.ItemSeparator) && a.position >= itemTextPos);
						var itemText = text.Substring(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.Length) - itemTextPos);
						objNode.items.Add(ToVDFNode(itemText, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));
					}
			}
			else
				for (var i = 0; i < tokensAtDepth0.Count; i++)
				{
					VDFToken token = tokensAtDepth0[i];
					if (token.type == VDFTokenType.LineBreak && tokensAtDepth1.Any(a=>a.position > token.position) && tokensAtDepth1.FirstOrDefault(a=>a.position > token.position).text.StartsWith("\t"))
					{
						var itemTextPos = tokensAtDepth1.FirstOrDefault(a=>a.position > token.position).position + (objIndent + 1);
						var itemEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak && a.position >= itemTextPos);
						var itemText = text.Substring(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.Length) - itemTextPos);
						objNode.items.Add(ToVDFNode(itemText, objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent + 1));
					}
				}

		// parse keys-and-values/properties (depending on whether we're a Dictionary)
		for (var i = 0; i < parser.tokens.Count; i++)
		{
			var token = parser.tokens[i];
			var next3Tokens = parser.tokens.GetRange(i + 1, Math.Min(3, parser.tokens.Count - (i + 1)));

			if (token.type == VDFTokenType.DataPropName && tokensAtDepth0.Contains(token))
			{
				var propName = token.text.TrimStart(new[]{'\t'});
				Type propValueType;
				if (typeof(IDictionary).IsAssignableFrom(objType))
					propValueType = objType.IsGenericType ? objType.GetGenericArguments()[1] : null;
				else
					propValueType = objTypeInfo.propInfoByName.ContainsKey(propName) ? objTypeInfo.propInfoByName[propName].GetPropType() : null;

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
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker && a.position >= propValueTextPos);
					if (objTypeInfo.popOutChildren) // maybe temp; special handling for types with pop-out-children enabled
						propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName && a.position > propValueTextPos);
					var propValueText = text.Substring(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.Length) - propValueTextPos);
					objNode.properties.Add(propName, ToVDFNode(propValueText, propValueType, loadOptions, objIndent + 1));
				}
			}
		}

		// parse base-value (if applicable)
		var firstPropNameToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName);
		var firstBaseValueToken = parser.tokens.FirstOrDefault(a=>a.type == VDFTokenType.DataBaseValue);
		if (firstBaseValueToken != null && (firstPropNameToken == null || firstBaseValueToken.position < firstPropNameToken.position))
			objNode.baseValue = firstBaseValueToken.text;

		return objNode;
	}

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
	static int FindIndentDepthOfLineContainingCharPos(string text, int charPos)
	{
		int lineIndentDepth = 0;
		if (text[charPos] != '\n')
			for (var i = charPos + 1; i < text.Length && text[i] != '\n'; i++) // search up, starting at the next char
				if (text[i] == '\t')
					lineIndentDepth++;
		for (var i = charPos; i > 0 && (text[i] != '\n' || i == charPos); i--) // search down, starting from the char itself
			if (text[i] == '\t')
				lineIndentDepth++;
		return lineIndentDepth;
	}
}