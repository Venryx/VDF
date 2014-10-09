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
	static ToVDFNode(text: string, declaredTypeName?: string, loadOptions?: VDFLoadOptions): VDFNode;
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
		for (var i in parser.tokens.indexes())
		{
			var token = parser.tokens[i];
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
				objTypeStr = "System.Collections.IList";

		// some further inference based on token analysis
		if (objTypeStr == null)
			if (isInlineList)
				objTypeStr = "System.Collections.IList";
			else if (tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.DataPropName) && tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.LineBreak))
				objTypeStr = "System.Collections.IList";

		var objTypeName = declaredTypeName;
		if (objTypeStr != null && objTypeStr.length > 0)
			objTypeName = objTypeStr; // note: dropped CS functionality of making sure metadata-type (objTypeStr) is more specific than obj-type
		if (objTypeName == null)
			objTypeName = "string"; // string is the default/fallback type (note, though, that if the below code finds properties, it'll just add them to the VDFNode anyway)
		var objTypeInfo = VDFTypeInfo.Get(objTypeName);

		// calculate token depths
		// ==========

		isInlineList = isInlineList || typeof(IList).IsAssignableFrom(objType) && tokensNotInDataMarkers.Any(a=>a != objMetadataBaseValueToken && a != objMetadataEndMarkerToken) && tokensNotInDataMarkers.All(a=>a.type != VDFTokenType.LineBreak); // update based on new knowledge of obj-type

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

		// parse keys-and-values/properties (depending on whether we're a Dictionary)
		for (int i = 0; i < parser.tokens.Count; i++)
		{
			var token = parser.tokens[i];
			var next3Tokens = parser.tokens.GetRange(i + 1, Math.Min(3, parser.tokens.Count - (i + 1)));

			if (token.type == VDFTokenType.DataPropName && tokensAtDepth0.Contains(token))
			{
				var propName = token.text.TrimStart(new[]{'\t'});
				Type propValueType;
				if (typeof(IDictionary).IsAssignableFrom(objType))
					propValueType = objType.IsGenericType ? objType.GetGenericArguments()[0] : null;
				else
					propValueType = objTypeInfo != null && objTypeInfo.propInfoByName.ContainsKey(propName) ? objTypeInfo.propInfoByName[propName].GetPropType() : null;

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

	static FindNextDepthXCharYPos(vdfFile: string, searchStartPos: number, targetDepth: number, ch: string, depthStartChar: string, depthEndChar: string): number
	{
		var depth = 0;
		for (var i = searchStartPos; i < vdfFile.length && depth >= 0; i++)
			if (vdfFile[i] == depthStartChar)
				depth++;
			else if (vdfFile[i] == ch && depth == targetDepth)
				return i;
			else if (vdfFile[i] == depthEndChar)
				depth--;
		return -1;
	}
	static FindNextDepthXItemSeparatorCharPos(vdfFile: string, searchStartPos: number, targetDepth: number): number
	{
		var depth = 0;
		var parser = new VDFTokenParser(vdfFile, searchStartPos);
		while (parser.MoveNextToken() && depth >= 0) // use parser, so we don't have to deal with special '|' symbol usage, for separating '@@' literal-markers from the end of a troublesome string (i.e. "Bad string.@@")
			if (parser.tokens[parser.tokens.length - 1].type == VDFTokenType.DataStartMarker)
				depth++;
			else if (parser.tokens[parser.tokens.length - 1].type == VDFTokenType.ItemSeparator && depth == targetDepth)
				return parser.nextCharPos - 1;
			else if (parser.tokens[parser.tokens.length - 1].type == VDFTokenType.DataEndMarker)
			{
				depth--;
				if (depth < 0)
					break;
			}
		return -1;
	}
	static FindIndentDepthOfLineContainingCharPos(vdfFile: string, charPos: number): number
	{
		var lineIndentDepth = 0;
		for (var i = charPos - 1; i > 0 && vdfFile[i] != '\n'; i--)
			if (vdfFile[i] == '\t')
				lineIndentDepth++;
		return lineIndentDepth;
	}
	static FindNextLineBreakCharPos(vdfFile: string, searchStartPos: number): number
	{
		for (var i = searchStartPos; i < vdfFile.length; i++)
			if (vdfFile[i] == '\n')
				return i;
		return -1;
	}
	static FindPoppedOutChildTextPositions(vdfFile: string, parentIndentDepth: number, searchStartPos: number, poppedOutChildDataIndex: number): Array<number>
	{
		var result = new Array<number>();

		var poppedOutChildDatasReached = 0;
		var indentsOnThisLine = 0;
		var inLiteralMarkers = false;
		for (var i = searchStartPos; i < vdfFile.length; i++)
		{
			var lastChar = i > 0 ? vdfFile[i - 1] : null;
			var ch = vdfFile[i];
			var nextChar = i < vdfFile.length - 1 ? vdfFile[i + 1] : null;
			var nextNextChar = i < vdfFile.length - 2 ? vdfFile[i + 2] : null;

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
					result.push(i);
				if (poppedOutChildDatasReached > poppedOutChildDataIndex + 1) // we just finished processing the given popped-out child-data, so break
					break;

				var nextLineBreakCharPos = VDFLoader.FindNextLineBreakCharPos(vdfFile, i);
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