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
					if (hasItems && depth == 0 && (token.type == VDFTokenType.DataStartMarker || token.type == VDFTokenType.DataEndMarker))
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

		// create the object's VDFNode, and load in the data
		// ==========

		var objNode = new VDFNode();
		objNode.metadata_type = objTypeStr;
		
		// if list, parse items
		//if (typeof(IList).IsAssignableFrom(objType))
		for (var i = 0; i < tokensAtDepth0.Count; i++)
		{
			var token = tokensAtDepth0[i];
			if (token.type == VDFTokenType.DataStartMarker)
			{
				var itemFirstToken = token.index + 1 < tokens.Count ? tokens[token.index + 1] : null; //tokens.First(a=>a.position >= token.position + token.text.Length + (hasDepth0DataBlocks ? 1 : 0));
				var itemEnderToken = itemFirstToken != null ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker && a.index > itemFirstToken.index) : null;
				objNode.items.Add(ToVDFNode(GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions, objIndent));
			}
		}

		// if not list (i.e. if perhaps object or dictionary), parse keys-and-values/properties (depending on whether we're a dictionary)
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
					else
					{
						var propValueToken = next3Tokens[1];
						var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>(a.type == VDFTokenType.DataEndMarker || a.type == VDFTokenType.PoppedOutDataEndMarker) && a.index > propValueToken.index);
						objNode.properties.Add(propName, ToVDFNode(GetTokenRange_Tokens(tokens, propValueToken, propValueEnderToken), propValueType, loadOptions, objIndent));
					}
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
	static List<VDFToken> GetTokenRange_Tokens(List<VDFToken> tokens, VDFToken firstToken, VDFToken enderToken)
	{
		//return tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index, a.text)).ToList();

		var result = new List<VDFToken>();
		for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
			result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
		return result;
	}

	static int FindNextDepthXCharYPos(string text, int searchStartPos, int targetDepth, char ch, char depthStartChar, char depthEndChar)
	{
		var depth = 0;
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
		foreach (char ch in firstTokenOfLine.text)
			if (ch == '\t')
				result++;
			else
				break;
		return result;
	}
}