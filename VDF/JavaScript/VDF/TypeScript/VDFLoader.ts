class VDFLoadOptions
{
	message: any;
	inferCompatibleTypesForUnknownTypes: boolean;
	constructor(message?: any, inferCompatibleTypesForUnknownTypes: boolean = false)
	{
		this.message = message;
		this.inferCompatibleTypesForUnknownTypes = inferCompatibleTypesForUnknownTypes;
	}
}

class VDFLoader
{
	static ToVDFNode(text: string, loadOptions: VDFLoadOptions, declaredTypeName?: string, objIndent?: number): VDFNode;
	static ToVDFNode(text: string, declaredTypeName?: string, loadOptions?: VDFLoadOptions, objIndent?: number): VDFNode;
	static ToVDFNode(text: List<VDFToken>, loadOptions: VDFLoadOptions, declaredTypeName?: string, objIndent?: number): VDFNode;
	static ToVDFNode(text: List<VDFToken>, declaredTypeName?: string, loadOptions?: VDFLoadOptions, objIndent?: number): VDFNode;
	static ToVDFNode(arg1: any, arg2?: any, arg3?: any, objIndent: number = 0): VDFNode
	{
		var tokens: List<VDFToken>;
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;

		if (arg1 instanceof List)
			tokens = arg1;
		else
		{
			/*var parser_ = new VDFTokenParser(arg1, 0);
			while (parser_.MoveNextToken()) { };
			tokens = parser_.tokens;*/

			tokens = VDFTokenParser.ParseTokens(arg1);
		}
		if (typeof arg2 == "string" || arg3 instanceof VDFLoadOptions)
			{ declaredTypeName = arg2; loadOptions = arg3; }
		else
			{ declaredTypeName = arg3; loadOptions = arg2; }
		loadOptions = loadOptions || new VDFLoadOptions();

		// pre-process/fix tokens
		// ==========

		// if we're a non-list object
		var depth;
		for (var i0 = 0; i0 < 2; i0++) // probably temp
			if ((declaredTypeName != null && !(declaredTypeName == "IList" || declaredTypeName.indexOf("List[") == 0)) || (tokens.Count > 0 && tokens[0].type == VDFTokenType.MetadataBaseValue && tokens[0].text.indexOf(",") != -1)) // todo: should check for comma char only at depth 0
			{
				depth = 0;
				var hasItems = false;
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
					if (hasItems && depth == 0 && [VDFTokenType.DataStartMarker, VDFTokenType.DataEndMarker].indexOf(token.type) != -1)
						tokens.RemoveAt(i--);

					if (token.type == VDFTokenType.DataStartMarker)
						depth++;
				}
				if (hasItems) // if we had items (and therefore made the fixes), fix up the tokens' position-and-index properties
					VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
			}

		// figure out obj-type
		// ==========

		/*var depth = 0;
		var tokensNotInDataMarkers = new List<VDFToken>("VDFToken");
		for (var i = 0; i < tokens.length; i++)
		{
			var token: VDFToken = tokens[i];
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			if (depth == 0)
				tokensNotInDataMarkers.Add(token);
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		var isInlineList = tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.ItemSeparator);

		var objMetadataBaseValueToken: VDFToken = null;
		var objMetadataEndMarkerToken: VDFToken = null;
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
				objMetadataEndMarkerToken = tokensNotInDataMarkers[0];*/

		depth = 0;
		var tokensAtDepth0 = new List<VDFToken>("VDFToken");
		for (var i in tokens.indexes())
		{
			var token = tokens[i];
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			if (depth == 0)
				tokensAtDepth0.Add(token);
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		var isList = declaredTypeName != null && (declaredTypeName == "IList" || declaredTypeName.indexOf("List[") == 0); //typeof(IList).IsAssignableFrom(declaredType);
		for (var i = 0; i < tokensAtDepth0.Count; i++)
		{
			var lastToken = <VDFToken>(i - 1 >= 0 ? tokensAtDepth0[i - 1] : null);
			var token = <VDFToken>tokensAtDepth0[i];
			if (lastToken != null && lastToken.type == VDFTokenType.DataEndMarker && token.type == VDFTokenType.DataStartMarker)
				isList = true;
		}

		var objMetadataBaseValueToken: VDFToken = null;
		var objMetadataEndMarkerToken: VDFToken = null;
		if (tokensAtDepth0.Count >= 2 && ([VDFTokenType.WiderMetadataEndMarker, VDFTokenType.MetadataEndMarker].indexOf(tokensAtDepth0[1].type) != -1))
		{
			objMetadataBaseValueToken = tokensAtDepth0[0];
			objMetadataEndMarkerToken = tokensAtDepth0[1];
		}
		else if (tokensAtDepth0.Count >= 1 && ([VDFTokenType.WiderMetadataEndMarker, VDFTokenType.MetadataEndMarker].indexOf(tokensAtDepth0[0].type) != -1))
			objMetadataEndMarkerToken = tokensAtDepth0[0];

		var objTypeStr: string = null;
		if (objMetadataBaseValueToken != null)
		{
			objTypeStr = objMetadataBaseValueToken.text;

			// do some expanding of obj-type-str (if applicable)
			if (objMetadataEndMarkerToken.type == VDFTokenType.WiderMetadataEndMarker && objTypeStr.indexOf("[") == -1)
				if (objTypeStr == ",")
					objTypeStr = "IDictionary";
				else if (VDFLoader.FindNextDepthXCharYPos(objTypeStr, 0, 0, ',', '[', ']') != -1) // e.g. "string,object>>"
					objTypeStr = "Dictionary[" + objTypeStr + "]";
				else // e.g. "string>>"
					objTypeStr = "List[" + objTypeStr + "]";
		}
		else if (objMetadataEndMarkerToken != null)
			if (objMetadataEndMarkerToken.type == VDFTokenType.MetadataEndMarker)
				objTypeStr = ""; // if type is not already set, set it to an empty string, for type-inference later
			else
				objTypeStr = "IList";

		// some further inference based on token analysis
		if (objTypeStr == null && isList)
			objTypeStr = "System.Collections.IList";

		var objTypeName = declaredTypeName;
		if (objTypeStr != null && objTypeStr.length > 0)
		{
			// porting-note: this is only a limited implementation of CS functionality of making sure metadata-type (objTypeStr) is more specific than declared-type (objTypeName)
			if (objTypeName == null || ["object", "IList", "IDictionary"].indexOf(objTypeName) != -1) // if there is no declared type, or the from-metadata type is more specific than the declared type (i.e. declared type is most basic type 'object')
				objTypeName = objTypeStr;
		}
		if (objTypeName == null)
			objTypeName = "string"; // string is the default/fallback type (note, though, that if the below code finds properties, it'll just add them to the VDFNode anyway)
		var objTypeInfo = VDFTypeInfo.Get(objTypeName);

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
				objNode.AddItem(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
			}
		}

		// if not list (i.e. if perhaps object or dictionary), parse keys-and-values/properties (depending on whether we're a dictionary)
		if (objTypeName == null || (objTypeName != "IList" && objTypeName.indexOf("List[") != 0))
			for (var i = 0; i < tokens.Count; i++)
			{
				var token: VDFToken = tokens[i];
				var next3Tokens = tokens.GetRange(i + 1, Math.min(3, tokens.Count - (i + 1)));

				if (token.type == VDFTokenType.DataPropName && tokensAtDepth0.Contains(token))
				{
					var propName = token.text.replace(/^\t+/, "");
					var propValueTypeName: string;
					if (objTypeName.indexOf("Dictionary[") == 0)
						propValueTypeName = VDF.GetGenericParametersOfTypeName(objTypeName)[1];
					else
						propValueTypeName = objTypeInfo.propInfoByName[propName] ? objTypeInfo.propInfoByName[propName].propVTypeName : null;

					if (next3Tokens.Count < 2 || next3Tokens[1].type == VDFTokenType.DataEndMarker) // if (as Dictionary) we have no items
						objNode.SetProperty(propName, VDFLoader.ToVDFNode(new List<VDFToken>("VDFToken"), propValueTypeName, loadOptions, objIndent));
					else
					{
						var propValueToken = next3Tokens[1];
						var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>(a.type == VDFTokenType.DataEndMarker || a.type == VDFTokenType.PoppedOutDataEndMarker) && a.index > propValueToken.index);
						objNode.SetProperty(propName, VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueToken, propValueEnderToken), propValueTypeName, loadOptions, objIndent));
					}
				}
			}

		// parse base-value (if applicable)
		if (objNode.items.Count == 0 && objNode.properties.Count == 0)
		{
			var firstPropNameToken = tokens.FirstOrDefault(a => a.type == VDFTokenType.DataPropName);
			var firstBaseValueToken = tokens.FirstOrDefault(a => a.type == VDFTokenType.DataBaseValue);
			if (firstBaseValueToken != null && (firstPropNameToken == null || firstBaseValueToken.position < firstPropNameToken.position))
				objNode.baseValue = firstBaseValueToken.text;
		}

		return objNode;
	}
	static GetTokenRange_Tokens(tokens: List<VDFToken>, firstToken: VDFToken, enderToken: VDFToken): List<VDFToken>
	{
		//return tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index, a.text)).ToList();

		var result = new List<VDFToken>("VDFToken");
		for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
			result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
		return result;
	}

	static FindNextDepthXCharYPos(text: string, searchStartPos: number, targetDepth: number, ch: string, depthStartChar: string, depthEndChar: string): number
	{
		var depth = 0;
		for (var i = searchStartPos; i < text.length && depth >= 0; i++)
			if (text[i] == depthStartChar)
				depth++;
			else if (text[i] == ch && depth == targetDepth)
				return i;
			else if (text[i] == depthEndChar)
				depth--;
		return -1;
	}
	static GetIndentDepthOfToken(tokens: List<VDFToken>, token: VDFToken): number
	{
		var firstTokenOfLine: VDFToken = null;
		for (var i = token.index - 1; firstTokenOfLine == null; i--)
			if (tokens[i].type == VDFTokenType.LineBreak || i == 0)
				if (tokens.Count > i + 1)
					firstTokenOfLine = tokens[i + 1];
					
		var result = 0;
		for (var i = 0; i < firstTokenOfLine.text.length; i++)
			if (firstTokenOfLine.text[i] == '\t')
				result++;
			else
				break;
		return result;
	}
}