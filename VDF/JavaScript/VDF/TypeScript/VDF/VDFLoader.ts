﻿class VDFLoadOptions
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

		var depth = 0;
		var sharedData = {poppedOutPropValueCount: 0};
		var livePropName: string = null;
		var livePropValueNode: VDFNode = null;
		var lastMetadata_type: string = null;
		var lastMetadataStartToken = VDFTokenType.None;

		var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
		while (parser.GetNextToken() != null)
		{
			var lastToken: VDFToken = parser.tokens.length > 1 ? parser.tokens[parser.tokens.length - 2] : null;
			var token = parser.tokens.last();
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if ((lastToken == null || lastToken.type == VDFTokenType.ItemSeparator) && token.type == VDFTokenType.ItemSeparator) // special case; if there's an empty area where our value data should be
					objNode.PushItem(new VDFNode("", lastMetadata_type));
				if (token.type == VDFTokenType.ItemSeparator && (parser.nextCharPos >= vdfFile.length || vdfFile[parser.nextCharPos] == '}' || vdfFile[parser.nextCharPos] == '\n'))
					objNode.PushItem(new VDFNode(""));

				if (token.type == VDFTokenType.MetadataStartMarker || token.type == VDFTokenType.SpecialMetadataStartMarker)
					lastMetadataStartToken = token.type;
				else if (token.type == VDFTokenType.Metadata_BaseValue)
				{
					if (objNode.metadata_type == null && (lastMetadataStartToken == VDFTokenType.SpecialMetadataStartMarker || (!token.text.startsWith("List[") && !token.text.startsWith("Dictionary["))))
						objNode.metadata_type = token.text;
					else // if we're supposed to be finding these tokens as nodes, to fill list-obj
						lastMetadata_type = token.text; //Type.GetType(vdfToken.text);
				}
				else if (token.type == VDFTokenType.Data_BaseValue)
				{
					if (token.text == "#")
					{
						//objNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
						var poppedOutPropValueItemTextPositions: Array<number> = VDFLoader.FindPoppedOutChildDataTextPositions(vdfFile, VDFLoader.FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), VDFLoader.FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentSharedData.poppedOutPropValueCount);
						for (var key in poppedOutPropValueItemTextPositions)
							objNode.PushItem(VDFLoader.ToVDFNode(vdfFile, loadOptions, poppedOutPropValueItemTextPositions[key], sharedData));
						parentSharedData.poppedOutPropValueCount++;
					}
					else
					{
						// note; slightly messy, but seems the best practically; if there's only one base-like-value as obj's data, and obj has no type metadata (i.e. it's not explicitly a list), then include it both as obj's base-value and as its solitary item
						if (objNode.items.length == 0 && objNode.metadata_type == null)
						{
							objNode.baseValue = token.text;
							objNode.metadata_type = lastMetadata_type;
							objNode.PushItem(new VDFNode(token.text, lastMetadata_type));
						}
						else // if it turns out there was more than one item
						{
							if (objNode.baseValue != null) // if we already put the first-item as obj's base-value, remove it
							{
								objNode.baseValue = null;
								objNode.metadata_type = null;
							}
							objNode.PushItem(new VDFNode(token.text, lastMetadata_type));
						}
					}
				}
				else if (token.type == VDFTokenType.Data_PropName)
				{
					livePropName = token.text;
					livePropValueNode = new VDFNode();
				}
				else if (token.type == VDFTokenType.DataStartMarker)
					livePropValueNode = VDFLoader.ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, sharedData);
				else if (token.type == VDFTokenType.DataEndMarker)
				{
					if (livePropName != null) // property of object
					{
						//if (livePropValueNode.items.Count > 0 || livePropValueNode.properties.Count > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
						objNode.SetProperty(livePropName, livePropValueNode);
						livePropName = null;
						livePropValueNode = null;
					}
					else // must be key-value-pair-pseudo-object of a dictionary
						objNode.PushItem(livePropValueNode);
				}
				else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
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