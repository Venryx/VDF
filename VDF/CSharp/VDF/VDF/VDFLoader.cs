using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;

class VDFLoadOptions
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

static class VDFLoader
{
	public static VDFNode ToVDFNode(string vdfFile, VDFLoadOptions loadOptions = null, int firstObjTextCharPos = 0) { int temp = 0; return ToVDFNode(vdfFile, loadOptions, firstObjTextCharPos, ref temp); }
	public static VDFNode ToVDFNode(string vdfFile, VDFLoadOptions loadOptions, int firstObjTextCharPos, ref int parentPoppedOutPropValueCount)
	{
		vdfFile = vdfFile.Replace("\r\n", "\n");
		if (loadOptions == null)
			loadOptions = new VDFLoadOptions();

		var objNode = new VDFNode();

		int depth = 0;
		int poppedOutPropValueCount = 0;
		string livePropName = null;
		VDFNode livePropValueNode = null;
		string lastMetadata_type = null;
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
				if ((lastToken == null || lastToken.type == VDFTokenType.ItemSeparator) && token.type == VDFTokenType.ItemSeparator) // special case; if there's an empty area where our value data should be
					objNode.items.Add(new VDFNode {baseValue = "", metadata_type = lastMetadata_type});
				if (token.type == VDFTokenType.ItemSeparator && (parser.nextCharPos >= vdfFile.Length || vdfFile[parser.nextCharPos] == '}' || vdfFile[parser.nextCharPos] == '\n'))
						objNode.items.Add(new VDFNode { baseValue = "" });

				if (token.type == VDFTokenType.MetadataStartMarker || token.type == VDFTokenType.SpecialMetadataStartMarker)
					lastMetadataStartToken = token.type;
				else if (token.type == VDFTokenType.Metadata_BaseValue)
				{
					var type = VDF.GetTypeByVName(token.text, loadOptions); //Type.GetType(vdfToken.text);
					if (objNode.metadata_type == null && (lastMetadataStartToken == VDFTokenType.SpecialMetadataStartMarker || (!typeof(IList).IsAssignableFrom(type) && !typeof(IDictionary).IsAssignableFrom(type))))
						objNode.metadata_type = token.text;
					else // if we're supposed to be finding these tokens as nodes, to fill list-obj
						lastMetadata_type = token.text; //Type.GetType(vdfToken.text);
				}
				else if (token.type == VDFTokenType.Data_BaseValue)
				{
					if (token.text == "#")
					{
						//objNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
						List<int> poppedOutPropValueItemTextPositions = FindPoppedOutChildDataTextPositions(vdfFile, FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentPoppedOutPropValueCount);
						foreach (int pos in poppedOutPropValueItemTextPositions)
							objNode.items.Add(ToVDFNode(vdfFile, loadOptions, pos, ref poppedOutPropValueCount));
						parentPoppedOutPropValueCount++;
					}
					else
						objNode.items.Add(new VDFNode {baseValue = token.text, metadata_type = lastMetadata_type});
				}
				else if (token.type == VDFTokenType.Data_PropName)
				{
					livePropName = token.text;
					livePropValueNode = new VDFNode();
				}
				else if (token.type == VDFTokenType.DataStartMarker)
					livePropValueNode = ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, ref poppedOutPropValueCount);
				else if (token.type == VDFTokenType.DataEndMarker)
				{
					if (livePropName != null) // property of object
					{
						//if (livePropValueNode.items.Count > 0 || livePropValueNode.properties.Count > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
						objNode.properties.Add(livePropName, livePropValueNode);
						livePropName = null;
						livePropValueNode = null;
					}
					else // must be key-value-pair-pseudo-object of a dictionary
						objNode.items.Add(livePropValueNode);
				}
				else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}

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
			else
			{
				if (indentsOnThisLine == parentIndentDepth + 1)
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
		}

		return result;
	}
}