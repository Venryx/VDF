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

class VDFLoader_LineInfo { fromLinePoppedOutGroupCount: number = 0; }
class VDFLoader
{
	static ToVDFNode(text: string, loadOptions: VDFLoadOptions, declaredTypeName?: string): VDFNode;
	static ToVDFNode(text: string, declaredTypeName?: string, loadOptions?: VDFLoadOptions, firstObjTextCharPos?: number, lineInfo?: VDFLoader_LineInfo): VDFNode;
	static ToVDFNode(text: string, declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any, firstObjTextCharPos: number = 0, lineInfo?: VDFLoader_LineInfo): VDFNode
	{
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;
		if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions)
			{declaredTypeName = declaredTypeName_orLoadOptions; loadOptions = loadOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = loadOptions_orDeclaredTypeName; loadOptions = declaredTypeName_orLoadOptions;}
		text = (text || "").replace(/\r\n/g, "\n");
		loadOptions = loadOptions || new VDFLoadOptions();

		var objNode = new VDFNode();
		var objTypeName = declaredTypeName;
		if (objTypeName == null && VDFLoader.FindNextDepthXItemSeparatorCharPos(text, firstObjTextCharPos, 0) != -1) // if obj-data has item-separators (of its depth-level), we can infer that it is a List
			objTypeName = "List[object]";
		var livePropAddNode = objTypeName != null && objTypeName.startsWith("List[") ? new VDFNode() : objNode; // if list, create a new node for holding the about-to-be-reached props
		var livePropAddNodeTypeInfo = livePropAddNode != objNode ? VDF.GetTypeInfo(VDF.GetGenericParametersOfTypeName(objTypeName)[0]) : (objTypeName != null ? VDF.GetTypeInfo(objTypeName) : null);

		lineInfo = lineInfo || new VDFLoader_LineInfo();

		var depth = 0;
		var dataIsPoppedOut = false;
		var livePropName: string = null;

		var parser = new VDFTokenParser(text, firstObjTextCharPos);
		while (parser.MoveNextToken())
		{
			var token = parser.tokens[parser.tokens.length - 1];
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if (token.type == VDFTokenType.ItemSeparator)
				{
					objNode.PushItem(livePropAddNode);
					livePropAddNode = new VDFNode();
				}

				if (token.type == VDFTokenType.WiderMetadataEndMarker) // if end of wider-metadata (i.e. end of metadata for List or Dictionary)
				{
					objNode.metadata_type = objNode.metadata_type || "List[object]"; // if metadata-type text is empty, infer it to mean "List[object]"
					objTypeName = objNode.metadata_type;
					if (objTypeName != null && objTypeName.startsWith("List[")) // if obj is List (as opposed to Dictionary)
					{
						livePropAddNode = new VDFNode(); // we found out we're a list, so create a new item-node to hold the about-to-be-reached props
						livePropAddNodeTypeInfo = VDF.GetTypeInfo(VDF.GetGenericParametersOfTypeName(objTypeName)[0]); // if primitive, there's no constructor
					}
				}
				else if (token.type == VDFTokenType.MetadataEndMarker)
				{
					if (objNode != livePropAddNode && livePropAddNode.metadata_type == null) // if live-prop-add-node metadata-type text is empty, set metadata-type to an empty string, for type-inference later
						livePropAddNode.metadata_type = "";
					else if (objNode.metadata_type == null) // if metadata-type text is empty, set metadata-type to an empty string, for type-inference later
						objNode.metadata_type = "";
				}
				else if (token.type == VDFTokenType.Metadata_BaseValue)
					if (parser.PeekNextChars(2) == ">>") // if wider-metadata (i.e. metadata for List or Dictionary)
					{
						objNode.metadata_type = token.text == "," ? "Dictionary[object,object]" : token.text;
						objNode.metadata_type = VDFLoader.FindNextDepthXCharYPos(objNode.metadata_type, 0, 0, ',', '[', ']') != -1 ? "Dictionary[" + objNode.metadata_type + "]" : objNode.metadata_type; // if has generic-params without root-type, infer root type to be "Dictionary"
						objNode.metadata_type = !objNode.metadata_type.contains("[") ? "List[" + objNode.metadata_type + "]" : objNode.metadata_type; // if has no generic-params, infer root type to be "List"
						objTypeName = objNode.metadata_type;
						if (objTypeName != null && objTypeName.startsWith("List[")) // if obj is List (as opposed to Dictionary)
						{
							livePropAddNode = new VDFNode(); // we found out we're a list, so create a new item-node to hold the about-to-be-reached props
							livePropAddNodeTypeInfo = VDF.GetTypeInfo(VDF.GetGenericParametersOfTypeName(objTypeName)[0]);
						}
					}
					else
					{
						livePropAddNode.metadata_type = token.text;
						livePropAddNodeTypeInfo = VDF.GetTypeInfo(token.text); // if primitive, there's no constructor
					}
				else if (token.type == VDFTokenType.Data_BaseValue)
					if (token.text == "#")
					{
						var poppedOutPropValueItemTextPositions = VDFLoader.FindPoppedOutChildTextPositions(text, VDFLoader.FindIndentDepthOfLineContainingCharPos(text, firstObjTextCharPos), parser.nextCharPos, lineInfo.fromLinePoppedOutGroupCount);
						if ((objTypeName != null && objTypeName.startsWith("List[")) || poppedOutPropValueItemTextPositions.length > 1) // if known to be a List, either by type-marking or inference
							for (var i in poppedOutPropValueItemTextPositions)
								objNode.PushItem(VDFLoader.ToVDFNode(text, declaredTypeName != null ? (VDF.GetGenericParametersOfTypeName(declaredTypeName)[0] || "object") : null, loadOptions, poppedOutPropValueItemTextPositions[i]));
						else
							objNode = VDFLoader.ToVDFNode(text, declaredTypeName != null ? (VDF.GetGenericParametersOfTypeName(declaredTypeName)[0] || "object") : null, loadOptions, poppedOutPropValueItemTextPositions[0]);
						lineInfo.fromLinePoppedOutGroupCount++;
						dataIsPoppedOut = true;
					}
					else
						livePropAddNode.baseValue = token.text;
				else if (token.type == VDFTokenType.Data_PropName)
					livePropName = token.text;
				else if (token.type == VDFTokenType.DataStartMarker)
					if (livePropName != null) // if data of a prop
						if (objTypeName && objTypeName.startsWith("Dictionary[")) // dictionary key-value-pair
							livePropAddNode.SetProperty(livePropName, VDFLoader.ToVDFNode(text, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, parser.nextCharPos, lineInfo));
						else // property
							livePropAddNode.SetProperty(livePropName, VDFLoader.ToVDFNode(text, livePropAddNodeTypeInfo != null && livePropAddNodeTypeInfo.propInfoByName[livePropName] ? livePropAddNodeTypeInfo.propInfoByName[livePropName].propVTypeName : null, loadOptions, parser.nextCharPos, lineInfo));
					else // if data of an in-list-list (at depth 0, which we are at, these are only ever for obj) (note; no need to set live-prop-add-node-type-info, because we know both obj and item have no properties, and so line above is unaffected by it)
						livePropAddNode = VDFLoader.ToVDFNode(text, declaredTypeName != null ? (VDF.GetGenericParametersOfTypeName(declaredTypeName)[0] || "object") : "List[object]", loadOptions, parser.nextCharPos, lineInfo);
				else if (token.type == VDFTokenType.DataEndMarker && livePropName != null) // end of in-list-list item-data-block, or property-data-block
					livePropName = null;
				else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		// if live-prop-add-node is not obj itself, and block wasn't empty, and data is in-line, (meaning we're adding the items as we pass their last char), add final item
		if (livePropAddNode != objNode && parser.tokens.filter(token=>[VDFTokenType.DataStartMarker, VDFTokenType.Data_BaseValue, VDFTokenType.ItemSeparator].contains(token.type)).length && !dataIsPoppedOut)
			objNode.PushItem(livePropAddNode);
		if (text == "") // special case
			objNode.baseValue = "";

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
	static FindNextDepthXItemSeparatorCharPos(text: string, searchStartPos: number, targetDepth: number): number
	{
		var depth = 0;
		var parser = new VDFTokenParser(text, searchStartPos);
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
	static FindIndentDepthOfLineContainingCharPos(text: string, charPos: number): number
	{
		var lineIndentDepth = 0;
		for (var i = charPos - 1; i > 0 && text[i] != '\n'; i--)
			if (text[i] == '\t')
				lineIndentDepth++;
		return lineIndentDepth;
	}
	static FindNextLineBreakCharPos(text: string, searchStartPos: number): number
	{
		for (var i = searchStartPos; i < text.length; i++)
			if (text[i] == '\n')
				return i;
		return -1;
	}
	static FindPoppedOutChildTextPositions(text: string, parentIndentDepth: number, searchStartPos: number, poppedOutChildDataIndex: number): Array<number>
	{
		var result = new Array<number>();

		var poppedOutChildDatasReached = 0;
		var indentsOnThisLine = 0;
		var inLiteralMarkers = false;
		for (var i = searchStartPos; i < text.length; i++)
		{
			var lastChar = i > 0 ? text[i - 1] : null;
			var ch = text[i];
			var nextChar = i < text.length - 1 ? text[i + 1] : null;
			var nextNextChar = i < text.length - 2 ? text[i + 2] : null;

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

				var nextLineBreakCharPos = VDFLoader.FindNextLineBreakCharPos(text, i);
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