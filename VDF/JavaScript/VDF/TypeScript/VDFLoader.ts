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
	static ToVDFNode(text: string, loadOptions: VDFLoadOptions, declaredTypeName?: string): VDFNode;
	static ToVDFNode(text: string, declaredTypeName?: string, loadOptions?: VDFLoadOptions, objIndent?: number): VDFNode;
	static ToVDFNode(text: string, declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any, objIndent: number = 0): VDFNode
	{
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;
		if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions)
			{declaredTypeName = declaredTypeName_orLoadOptions; loadOptions = loadOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = loadOptions_orDeclaredTypeName; loadOptions = declaredTypeName_orLoadOptions;}
		text = (text || "").replace(/\r\n/g, "\n");
		loadOptions = loadOptions || new VDFLoadOptions();

		// parse all tokens
		// ==========

		var parser = new VDFTokenParser(text, 0);
		while (parser.MoveNextToken()) {}

		// figure out obj-type
		// ==========

		var depth = 0;
		var tokensNotInDataMarkers = new List<VDFToken>("VDFToken");
		for (var i = 0; i < parser.tokens.length; i++)
		{
			var token: VDFToken = parser.tokens[i];
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
					objTypeStr = "System.Collections.IDictionary";
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
			else if (tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.DataPropName) && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak))
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

		var firstNonObjMetadataGroupToken = objMetadataEndMarkerToken != null ? parser.tokens.FirstOrDefault(a=>a.position > objMetadataEndMarkerToken.position) : parser.tokens.FirstOrDefault();
		var hasPoppedOutChildren = !isInlineList && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak);

		// calculate token depths, based on our new knowledge of whether we're dealing with an inline-list (in that case, consider the "|"-separated text blocks as being a depth lower)
		// (note: 'depth' is increased not only by '{' chars, but also inferred/virtual '{' chars, e.g. to the left and right of item vdf-text)
		depth = 0;
		var inPoppedOutBlockAtIndent = -1;
		var hasDepth0DataBlocks = false;
		var tokensAtDepth0 = new List<VDFToken>("VDFToken");
		var tokensAtDepth1 = new List<VDFToken>("VDFToken"); // note: this may actually contain some tokens deeper than 1 (I haven't made sure)
		for (var i = 0; i < parser.tokens.Count; i++)
		{
			var lastToken = i > 0 ? parser.tokens[i - 1] : null;
			var token: VDFToken = parser.tokens[i];

			if (token.type == VDFTokenType.DataEndMarker)
				depth--;
			else if (hasPoppedOutChildren)
			{
				if (depth == 0 && lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) // if inferred a virtual '{' char before us (for object)
				{
					depth++;
					inPoppedOutBlockAtIndent = VDFLoader.FindIndentDepthOfLineContainingCharPos(text, token.position) + 1;
				}
				else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == VDFTokenType.LineBreak && VDFLoader.FindIndentDepthOfLineContainingCharPos(text, token.position) == inPoppedOutBlockAtIndent - 1) // if inferred a virtual '}' char before us (for object)
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

		// if List, parse items
		if ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0))
			if (isInlineList)
			{
				var firstDepth1Token = tokensAtDepth1.FirstOrDefault();
				var lastDepth0MetadataEndMarkerToken = parser.tokens.LastOrDefault(a=>a.type == VDFTokenType.MetadataEndMarker || a.type == VDFTokenType.WiderMetadataEndMarker);
				var firstItemTextPos = firstDepth1Token != null ? firstDepth1Token.position : (lastDepth0MetadataEndMarkerToken != null ? lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.length : 0);
				var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker) : tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.ItemSeparator);
				var firstItemText = text.substr(firstItemTextPos, (firstItemEnderToken != null ? firstItemEnderToken.position : text.length) - firstItemTextPos);
				if (firstItemEnderToken != null || firstItemText.length > 0) // (if there's an item separator or depth-0-data-end-marker, we can go ahead and infer that a zero-length sub-section represents an actual object)
					objNode.AddItem(VDFLoader.ToVDFNode(firstItemText, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));

				for (var i = 0; i < tokensAtDepth0.Count; i++)
				{
					var token: VDFToken = tokensAtDepth0[i];
					if (token.type == VDFTokenType.ItemSeparator)
					{
						var itemTextPos = token.position + token.text.length + (hasDepth0DataBlocks ? 1 : 0);
						var itemEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == (hasDepth0DataBlocks ? VDFTokenType.DataEndMarker : VDFTokenType.ItemSeparator) && a.position >= itemTextPos);
						var itemText = text.substr(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.length) - itemTextPos);
						objNode.AddItem(VDFLoader.ToVDFNode(itemText, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
					}
				}
			}
			else
				for (var i = 0; i < tokensAtDepth1.Count; i++)
				{
					var token: VDFToken = tokensAtDepth1[i];
					if (token.type != VDFTokenType.PoppedOutDataStartMarker && token.type != VDFTokenType.LineBreak && token.position > 0)
						if (VDFLoader.FindIndentDepthOfLineContainingCharPos(text, token.position) == objIndent + 1)
						{
							var itemTextPos = token.position + (objIndent + 1);
							var itemEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.LineBreak && a.position >= itemTextPos);
							var itemText = text.substr(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.length) - itemTextPos);
							objNode.AddItem(VDFLoader.ToVDFNode(itemText, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent + 1));
						}
						else
							break;
				}

		// parse keys-and-values/properties (depending on whether we're a Dictionary)
		for (var i = 0; i < parser.tokens.Count; i++)
		{
			var token: VDFToken = parser.tokens[i];
			var next3Tokens = parser.tokens.GetRange(i + 1, Math.min(3, parser.tokens.Count - (i + 1)));

			if (token.type == VDFTokenType.DataPropName && tokensAtDepth0.Contains(token))
			{
				var propName = token.text.replace(/^\t+/, "");
				var propValueTypeName: string;
				if (objTypeName.indexOf("Dictionary[") == 0)
					propValueTypeName = VDF.GetGenericParametersOfTypeName(objTypeName)[1];
				else
					propValueTypeName = objTypeInfo.propInfoByName[propName] ? objTypeInfo.propInfoByName[propName].propVTypeName : null;

				if (token.text.indexOf("\t") != 0) // if this property *key*/*definition* is inline
				{
					var propValueTextPos = next3Tokens[1].position;
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>(a.type == VDFTokenType.DataEndMarker || a.type == VDFTokenType.PoppedOutDataEndMarker) && a.position >= propValueTextPos);
					var propValueText = text.substr(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.length) - propValueTextPos);
					objNode.SetProperty(propName, VDFLoader.ToVDFNode(propValueText, propValueTypeName, loadOptions, objIndent));
				}
				else // if this property *key*/*definition* is popped-out
				{
					var propValueTextPos = next3Tokens[1].position;
					var propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataEndMarker && a.position >= propValueTextPos);
					if (objTypeInfo.popOutChildren) // maybe temp; special handling for types with pop-out-children enabled
						propValueEnderToken = tokensAtDepth0.FirstOrDefault(a=>a.type == VDFTokenType.DataPropName && a.position > propValueTextPos);
					var propValueText = text.substr(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.length) - propValueTextPos);
					objNode.SetProperty(propName, VDFLoader.ToVDFNode(propValueText, propValueTypeName, loadOptions, objIndent + 1));
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
	static FindIndentDepthOfLineContainingCharPos(text: string, charPos: number): number
	{
		var lineIndentDepth = 0;
		if (text[charPos] != '\n')
			for (var i = charPos + 1; i < text.length && text[i] != '\n'; i++) // search up, starting at the next char
				if (text[i] == '\t')
					lineIndentDepth++;
		for (var i = charPos; i > 0 && (text[i] != '\n' || i == charPos); i--) // search down, starting from the char itself
			if (text[i] == '\t')
				lineIndentDepth++;
		return lineIndentDepth;
	}
}