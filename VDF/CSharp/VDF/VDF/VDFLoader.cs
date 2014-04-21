using System;
using System.Collections.Generic;
using System.Linq;

public class VDFLoadOptions
{
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;
	//public List<string> extraSearchAssemblyNames; // maybe add this option later

	public VDFLoadOptions(Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null)
	{
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
	}
}

public static class VDFLoader
{
	public static VDFNode ToVDFNode(string vdfFile, VDFLoadOptions loadOptions = null, int firstObjTextCharPos = 0)
	{
		int temp = 0;
		return ToVDFNode(vdfFile, loadOptions, firstObjTextCharPos, ref temp);
	}
	public static VDFNode ToVDFNode(string vdfFile, VDFLoadOptions loadOptions, int firstObjTextCharPos, ref int parentPoppedOutPropValueCount)
	{
		vdfFile = vdfFile.Replace("\r\n", "\n");
		if (loadOptions == null)
			loadOptions = new VDFLoadOptions();

		var objNode = new VDFNode();

		int depth = 0;
		var liveItemNode = new VDFNode();
		string liveItemPropName = null;
		bool dataIsPoppedOut = false;
		int poppedOutPropValueCount = 0;
		VDFNode liveItemPropValueNode = null;
		var firstMetadataStartToken = VDFTokenType.None;
		var lastMetadataStartToken = VDFTokenType.None;

		var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
		while (parser.GetNextToken() != null)
		{
			VDFToken lastToken = parser.tokens.Count > 1 ? parser.tokens[parser.tokens.Count - 2] : null;
			VDFToken token = parser.tokens.Last();
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if (token.type == VDFTokenType.ItemSeparator)
				{
					objNode.items.Add(liveItemNode);
					liveItemNode = new VDFNode();
				}

				if (token.type == VDFTokenType.MetadataStartMarker || token.type == VDFTokenType.WiderMetadataStartMarker)
				{
					if (firstMetadataStartToken == VDFTokenType.None)
						firstMetadataStartToken = token.type;
					lastMetadataStartToken = token.type;
				}
				else if (token.type == VDFTokenType.Metadata_BaseValue)
					if (lastMetadataStartToken == VDFTokenType.WiderMetadataStartMarker)
						objNode.metadata_type = token.text == "" ? "List[object]" : (token.text == "," ? "Dictionary[object,object]" : token.text);
					else
						liveItemNode.metadata_type = token.text;
				else if (token.type == VDFTokenType.Data_BaseValue)
					if (token.text == "#")
					{
						//liveItemNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
						List<int> poppedOutPropValueItemTextPositions = FindPoppedOutChildDataTextPositions(vdfFile, FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentPoppedOutPropValueCount);
						foreach (int pos in poppedOutPropValueItemTextPositions)
							objNode.items.Add(ToVDFNode(vdfFile, loadOptions, pos, ref poppedOutPropValueCount));
						parentPoppedOutPropValueCount++;
						dataIsPoppedOut = true;
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
						liveItemPropValueNode = ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, ref poppedOutPropValueCount);
					else // if data of an item
					{
						if (lastToken != null && lastToken.type == VDFTokenType.DataEndMarker) // if starting another key-value-pair-pseudo-object of a dictionary, be sure to add last one
							objNode.items.Add(liveItemNode);
						liveItemNode = ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, ref poppedOutPropValueCount);
					}
				else if (token.type == VDFTokenType.DataEndMarker)
				{
					if (liveItemPropName != null) // property of object
					{
						//if (livePropValueNode.items.Count > 0 || livePropValueNode.properties.Count > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
						liveItemNode.properties.Add(liveItemPropName, liveItemPropValueNode);
						liveItemPropName = null;
						liveItemPropValueNode = null;
					}
					else if (liveItemPropValueNode != null) // must be item-of-type-list of a list, or key-value-pair-pseudo-object of a dictionary
						liveItemNode.items.Add(liveItemPropValueNode);
				}
				else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		if (!dataIsPoppedOut) // if data is in-line, (meaning we're adding the items as we pass their last char), add final item
			objNode.items.Add(liveItemNode);

		// if only one item, and obj does not have wider-metadata (i.e. isn't explicitly a List or Dictionary), then assume it is the data of objNode itself
		if (objNode.items.Count == 1 && firstMetadataStartToken != VDFTokenType.WiderMetadataStartMarker)
			objNode = objNode.items[0];

		return objNode;
	}

	static int FindIndentDepthOfLineContainingCharPos(string vdfFile, int charPos)
	{
		int lineIndentDepth = 0;
		for (int i = charPos - 1; i > 0 && vdfFile[i] != '\n'; i--)
			if (vdfFile[i] == '\t')
				lineIndentDepth++;
		return lineIndentDepth;
	}
	static int FindNextLineBreakCharPos(string vdfFile, int searchStartPos)
	{
		for (int i = searchStartPos; i < vdfFile.Length; i++)
			if (vdfFile[i] == '\n')
				return i;
		return -1;
	}
	static List<int> FindPoppedOutChildDataTextPositions(string vdfFile, int parentIndentDepth, int searchStartPos, int poppedOutChildDataIndex)
	{
		var result = new List<int>();

		int poppedOutChildDatasReached = 0;
		int indentsOnThisLine = 0;
		for (int i = searchStartPos; i < vdfFile.Length; i++)
		{
			char ch = vdfFile[i];
			if (ch == '\n')
				indentsOnThisLine = 0;
			else if (ch == '\t')
				indentsOnThisLine++;
			else if (indentsOnThisLine == parentIndentDepth + 1)
			{
				if (poppedOutChildDatasReached == 0 || ch == '#')
					poppedOutChildDatasReached++;
				if (poppedOutChildDatasReached == poppedOutChildDataIndex + 1)
					result.Add(i);
				if (poppedOutChildDatasReached > poppedOutChildDataIndex + 1) // we just finished processing the given popped-out child-data, so break
					break;

				int nextLineBreakCharPos = FindNextLineBreakCharPos(vdfFile, i);
				if (nextLineBreakCharPos != -1)
					i = nextLineBreakCharPos - 1; // we only care about the tabs, and the first non-tab char; so skip to next line, once we process first non-tab char
				else
					break; // last line, so break
			}
			else if (indentsOnThisLine <= parentIndentDepth) // we've reached a peer of the parent, so break
				break;
		}

		return result;
	}
}