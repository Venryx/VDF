class VDFLoadOptions
{
	loadUnknownTypesAsAnonymous: boolean;
	constructor(loadUnknownTypesAsAnonymous: boolean = false)
	{
		this.loadUnknownTypesAsAnonymous = loadUnknownTypesAsAnonymous;
	}
}

class VDFLoader
{
	static ToVDFNode(vdfFile: string, loadOptions?: VDFLoadOptions, firstObjTextCharPos: number = 0, parentSharedData?: {poppedOutPropValueCount: number}): VDFNode
	{
		vdfFile = vdfFile.replace(/\r\n/g, "\n");
		if (!loadOptions)
			loadOptions = new VDFLoadOptions();

		var objNode = new VDFNode();

		var sharedData = { poppedOutPropValueCount: 0 };
		var depth = 0;
		var liveItemNode = new VDFNode();
		var liveItemPropName: string = null;
		var liveItemPropValueNode: VDFNode = null;
		var lastMetadataStartToken = VDFTokenType.None;

		var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
		while (parser.GetNextToken() != null)
		{
			var lastToken = parser.tokens.length > 1 ? parser.tokens[parser.tokens.length - 2] : null;
			var token = parser.tokens.last();
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if (token.type == VDFTokenType.ItemSeparator)
				{
					if (liveItemNode.metadata_type == null && liveItemNode.baseValue == null && liveItemNode.items.length == 0 && liveItemNode.propertyCount == 0) // special case; if the item we're just now wrapping up had no value set
						liveItemNode.baseValue = "";
					objNode.PushItem(liveItemNode);
					liveItemNode = new VDFNode();
					if (parser.nextCharPos >= vdfFile.length || ['|', '}', '\n'].contains(vdfFile[parser.nextCharPos])) // special case; if we see that the next item has no text representing it, set its base-value to ""
						liveItemNode.baseValue = "";
				}

				if (token.type == VDFTokenType.MetadataStartMarker || token.type == VDFTokenType.WiderMetadataStartMarker)
					lastMetadataStartToken = token.type;
				else if (token.type == VDFTokenType.Metadata_BaseValue)
					if (lastMetadataStartToken == VDFTokenType.WiderMetadataStartMarker)
						objNode.metadata_type = token.text;
					else
						liveItemNode.metadata_type = token.text;
				else if (token.type == VDFTokenType.Data_BaseValue)
					if (token.text == "#")
					{
						//liveItemNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
						var poppedOutPropValueItemTextPositions = VDFLoader.FindPoppedOutChildDataTextPositions(vdfFile, VDFLoader.FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), VDFLoader.FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentSharedData.poppedOutPropValueCount);
						for (var i in poppedOutPropValueItemTextPositions)
							objNode.PushItem(VDFLoader.ToVDFNode(vdfFile, loadOptions, poppedOutPropValueItemTextPositions[i], sharedData));
						parentSharedData.poppedOutPropValueCount++;
					}
					else
						liveItemNode.baseValue = token.text;
				else if (token.type == VDFTokenType.Data_PropName)
				{
					liveItemPropName = token.text;
					liveItemPropValueNode = new VDFNode();
				}
				else if (token.type == VDFTokenType.DataStartMarker)
					if (liveItemPropName != null) // if data of a prop
						liveItemPropValueNode = VDFLoader.ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, sharedData);
					else // if data of an item
					{
						if (lastToken != null && lastToken.type == VDFTokenType.DataEndMarker) // if starting another key-value-pair-pseudo-object of a dictionary, be sure to add last one
							objNode.PushItem(liveItemNode);
						liveItemNode = VDFLoader.ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, sharedData);
					}
				else if (token.type == VDFTokenType.DataEndMarker)
				{
					if (liveItemPropName != null) // property of object
					{
						//if (livePropValueNode.items.length > 0 || livePropValueNode.propertyCount > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
						liveItemNode.SetProperty(liveItemPropName, liveItemPropValueNode);
						liveItemPropName = null;
						liveItemPropValueNode = null;
					}
					else if (liveItemPropValueNode != null) // must be item-of-type-list of a list, or key-value-pair-pseudo-object of a dictionary
						liveItemNode.PushItem(liveItemPropValueNode);
				}
				else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		// add final item, if not yet added
		if (liveItemNode.metadata_type != null || liveItemNode.baseValue != null || liveItemNode.items.length > 0 || liveItemNode.propertyCount > 0)
		{
			if (liveItemNode.metadata_type == null && liveItemNode.baseValue == null && liveItemNode.items.length == 0 && liveItemNode.propertyCount == 0) // special case; if the item we're just now wrapping up had no value set
				liveItemNode.baseValue = "";
			objNode.PushItem(liveItemNode);
		}

		// note; slightly messy, but seems the best practically; if only one value as obj's data, and obj does not have wider-metadata (i.e. isn't List or Dictionary), then include it both as obj's value and as its solitary item's value
		if (objNode.items.length == 1) // if only one child, and child is not a list
		{
			objNode.baseValue = objNode.items[0].baseValue;
			if (objNode.items[0].items.length == 0) // don't grab metadata from something that has its own items
			{
				objNode.metadata_type = objNode.items[0].metadata_type;
				for (var propName in objNode.items[0].properties)
					objNode.SetProperty(propName, objNode.items[0][propName]);
			}
		}

		return objNode;
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
	static FindPoppedOutChildDataTextPositions(vdfFile: string, parentIndentDepth: number, searchStartPos: number, poppedOutChildDataIndex: number): Array<number>
	{
		var result = new Array<number>();

		var poppedOutChildDatasReached = 0;
		var indentsOnThisLine = 0;
		for (var i = searchStartPos; i < vdfFile.length; i++)
		{
			var ch = vdfFile[i];
			if (ch == '\n')
				indentsOnThisLine = 0;
			else if (ch == '\t')
				indentsOnThisLine++;
			else
			{
				if (indentsOnThisLine == parentIndentDepth + 1)
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
				else if (indentsOnThisLine <= parentIndentDepth) // we've reached a peer of the parent, so break
					break;
			}
		}

		return result;
	}
}