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
			var parser_ = new VDFTokenParser(arg1, 0);
			while (parser_.MoveNextToken()) { };
			tokens = parser_.tokens;
		}
		if (typeof arg2 == "string" || arg3 instanceof VDFLoadOptions)
			{ declaredTypeName = arg2; loadOptions = arg3; }
		else
			{ declaredTypeName = arg3; loadOptions = arg2; }
		loadOptions = loadOptions || new VDFLoadOptions();

		// figure out obj-type
		// ==========

		var depth = 0;
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
				objMetadataEndMarkerToken = tokensNotInDataMarkers[0];

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
		if (objTypeStr == null)
			if (isInlineList)
				objTypeStr = "IList";
			else if (tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.PoppedOutDataStartMarker) && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak) && (declaredTypeName == null || declaredTypeName == "object"))
				objTypeStr = "IList";

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

		// calculate token depths
		// ==========

		isInlineList = isInlineList || ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0) && tokensNotInDataMarkers.Any(a=>a != objMetadataBaseValueToken && a != objMetadataEndMarkerToken) && tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.LineBreak)); // update based on new knowledge of obj-type

		var firstNonObjMetadataGroupToken = objMetadataEndMarkerToken != null ? tokens.FirstOrDefault(a=>a.position > objMetadataEndMarkerToken.position) : tokens.FirstOrDefault();
		var hasPoppedOutChildren = !isInlineList && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak);

		// calculate token depths, based on our new knowledge of whether we're dealing with an inline-list (in that case, consider the "|"-separated text blocks as being a depth lower)
		// (note: 'depth' is increased not only by '{' chars, but also inferred/virtual '{' chars, e.g. to the left and right of item vdf-text)
		depth = 0;
		var inPoppedOutBlockAtIndent = -1;
		var hasDepth0DataBlocks = false;
		var tokensAtDepth0 = new List<VDFToken>("VDFToken");
		var tokensAtDepth1 = new List<VDFToken>("VDFToken"); // note: this may actually contain some tokens deeper than 1 (I haven't made sure)
		for (var i = 0; i < tokens.Count; i++)
		{
			var lastToken = i > 0 ? tokens[i - 1] : null;
			var token: VDFToken = tokens[i];

			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			else if (hasPoppedOutChildren)
			{
				if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) // if inferred a virtual '{' char before us (for object)
				{
					depth++;
					inPoppedOutBlockAtIndent = VDFLoader.GetIndentDepthOfToken(tokens, token) + 1;
				}
				else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == VDFTokenType.LineBreak && VDFLoader.GetIndentDepthOfToken(tokens, token) == inPoppedOutBlockAtIndent - 1) // if inferred a virtual '}' char before us (for object)
				{
					depth--;
					inPoppedOutBlockAtIndent = -1;
				}

				if (objTypeName == "IList" || objTypeName.indexOf("List[") == 0)
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

		var getTokenAtIndex = (index: number): VDFToken=>tokens.Count > index ? tokens[index] : null;
		var getTokenRange_tokens = (firstToken: VDFToken, enderToken: VDFToken): List<VDFToken>=>
		{
			var result = new List<VDFToken>("VDFToken");
			for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
				result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
			return result;
		};

		// if List, parse items
		if ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0))
			if (isInlineList)
			{
				var firstDepth1Token = tokensAtDepth1.FirstOrDefault();
				var lastDepth0MetadataEndMarkerToken = tokens.LastOrDefault(a=>a.type == VDFTokenType.MetadataEndMarker || a.type == VDFTokenType.WiderMetadataEndMarker);
				var firstItemToken = firstDepth1Token || (lastDepth0MetadataEndMarkerToken != null ? tokens.FirstOrDefault(a=>a.position == lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.length) : tokens.First());
				var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker) : tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.ItemSeparator);
				if (firstItemEnderToken != null || firstItemEnderToken == null || firstItemEnderToken.position > firstItemToken.position) // (if there's an item separator or depth-0-data-end-marker, we can go ahead and infer that a zero-length sub-section represents an actual object)
					objNode.AddItem(VDFLoader.ToVDFNode(getTokenRange_tokens(firstItemToken, firstItemEnderToken), VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));

				for (var i in tokensAtDepth0.indexes())
				{
					var token: VDFToken = tokensAtDepth0[i];
					if (token.type == VDFTokenType.ItemSeparator)
					{
						var itemToken = getTokenAtIndex(token.index + 1 + (hasDepth0DataBlocks ? 1 : 0)); //tokens.First(a=>a.position >= token.position + token.text.Length + (hasDepth0DataBlocks ? 1 : 0));
						var itemEnderToken = itemToken != null ? tokensAtDepth0.FirstOrDefault(a=>a.type == (hasDepth0DataBlocks ? VDFTokenType.DataEndMarker : VDFTokenType.ItemSeparator) && a.position >= itemToken.position) : null;
						objNode.AddItem(VDFLoader.ToVDFNode(itemToken != null ? getTokenRange_tokens(itemToken, itemEnderToken) : new List<VDFToken>("VDFToken"), VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
					}
				}
			}
			else
				for (var i = 0; i < tokensAtDepth0.Count; i++)
				{
					var token: VDFToken = tokensAtDepth0[i];
					if (token.type == VDFTokenType.LineBreak && tokensAtDepth1.Any(a=>a.position > token.position) && tokensAtDepth1.FirstOrDefault(a=>a.position > token.position).text.indexOf("\t") == 0)
					{
						var itemToken = getTokenAtIndex(token.index + 1); //tokens.First(a => a.position > token.position); // note: item-token's text includes tab char
						var itemEnderToken = itemToken != null ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak && a.position >= itemToken.position) : null;
						var itemTokens = itemToken != null ? getTokenRange_tokens(itemToken, itemEnderToken) : new List<VDFToken>("VDFToken");
						if (itemTokens.Count > 0)
							itemTokens[0].text = itemTokens[0].text.substr(1);
						objNode.AddItem(VDFLoader.ToVDFNode(itemTokens, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
					}
				}

		// parse keys-and-values/properties (depending on whether we're a Dictionary)
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
				else if (token.text.indexOf("\t") != 0) // if this property *key*/*definition* is inline
				{
					var propValueToken = next3Tokens[1];
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>(a.type == VDFTokenType.DataEndMarker || a.type == VDFTokenType.PoppedOutDataEndMarker) && a.position >= propValueToken.position);
					objNode.SetProperty(propName, VDFLoader.ToVDFNode(getTokenRange_tokens(propValueToken, propValueEnderToken), propValueTypeName, loadOptions, objIndent));
				}
				else // if this property *key*/*definition* is popped-out
				{
					var propValueToken = next3Tokens[1];
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName && a.position > propValueToken.position);
					objNode.SetProperty(propName, VDFLoader.ToVDFNode(getTokenRange_tokens(propValueToken, propValueEnderToken), propValueTypeName, loadOptions, objIndent + 1));
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