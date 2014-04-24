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
	public class VDFLoader_SharedData { public int poppedOutPropValueCount; }
	public static VDFNode ToVDFNode<T>(string vdfFile, VDFLoadOptions loadOptions = null, int firstObjTextCharPos = 0, VDFLoader_SharedData parentSharedData = null) { return ToVDFNode(vdfFile, typeof(T), loadOptions, firstObjTextCharPos, parentSharedData); }
	public static VDFNode ToVDFNode(string vdfFile, VDFLoadOptions loadOptions, Type declaredType = null, int firstObjTextCharPos = 0, VDFLoader_SharedData parentSharedData = null) { return ToVDFNode(vdfFile, declaredType, loadOptions, firstObjTextCharPos, parentSharedData); }
	public static VDFNode ToVDFNode(string vdfFile, Type declaredType = null, VDFLoadOptions loadOptions = null, int firstObjTextCharPos = 0, VDFLoader_SharedData parentSharedData = null)
	{
		vdfFile = vdfFile.Replace("\r\n", "\n");
		loadOptions = loadOptions ?? new VDFLoadOptions();

		var objNode = new VDFNode();
		var objType = declaredType;
		if (objType == null && FindNextDepthXItemSeparatorCharPos(vdfFile, firstObjTextCharPos, 0) != -1) // if obj-data has item-separators (of its depth-level), we can infer that it's a List
			objType = typeof(IList);
		var livePropAddNode = objType != null && typeof(IList).IsAssignableFrom(objType) ? new VDFNode() : objNode; // if list, create a new node for holding the about-to-be-reached props
		var livePropAddNodeTypeInfo = livePropAddNode != objNode ? VDFTypeInfo.Get(objType.IsGenericType ? objType.GetGenericArguments()[0] : typeof(object)) : (objType != null ? VDFTypeInfo.Get(objType) : null);

		var sharedData = new VDFLoader_SharedData();
		int depth = 0;
		bool dataIsPoppedOut = false;
		string livePropName = null;

		var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
		while (parser.MoveNextToken())
		{
			VDFToken token = parser.tokens.Last();
			if (token.type == VDFTokenType.DataEndMarker)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if (token.type == VDFTokenType.ItemSeparator)
				{
					objNode.items.Add(livePropAddNode);
					livePropAddNode = new VDFNode();
				}

				if (token.type == VDFTokenType.WiderMetadataEndMarker) // if end of wider-metadata (i.e. end of metadata for List or Dictionary)
				{
					objNode.metadata_type = objNode.metadata_type ?? "List[object]"; // if metadata-type text is empty, infer it to mean "List[object]"
					objType = VDF.GetTypeByVName(objNode.metadata_type, loadOptions);
					if (objType != null && typeof (IList).IsAssignableFrom(objType)) // if obj is List (as opposed to Dictionary)
					{
						livePropAddNode = new VDFNode(); // we found out we're a list, so create a new item-node to hold the about-to-be-reached props
						livePropAddNodeTypeInfo = VDFTypeInfo.Get(objType.GetGenericArguments()[0]);
					}
				}
				else if (token.type == VDFTokenType.MetadataEndMarker)
				{
					if (objNode.metadata_type == null) // if metadata-type text is empty, set metadata-type to an empty string, for type-inference later
						objNode.metadata_type = "";
				}
				else if (token.type == VDFTokenType.Metadata_BaseValue)
					if (parser.PeekNextChars(2) == ">>") // if wider-metadata (i.e. metadata for List or Dictionary)
					{
						objNode.metadata_type = token.text == "," ? "Dictionary[object,object]" : token.text;
						objNode.metadata_type = FindNextDepthXCharYPos(objNode.metadata_type, 0, 0, ',', '[', ']') != -1 ? "Dictionary[" + objNode.metadata_type + "]" : objNode.metadata_type; // if has generic-params without root-type, infer root type to be "Dictionary"
						objNode.metadata_type = !objNode.metadata_type.Contains("[") ? "List[" + objNode.metadata_type + "]" : objNode.metadata_type; // if has no generic-params, infer root type to be "List"
						objType = VDF.GetTypeByVName(objNode.metadata_type, loadOptions);
						if (objType != null && typeof(IList).IsAssignableFrom(objType)) // if obj is List (as opposed to Dictionary)
						{
							livePropAddNode = new VDFNode(); // we found out we're a list, so create a new item-node to hold the about-to-be-reached props
							livePropAddNodeTypeInfo = VDFTypeInfo.Get(objType.GetGenericArguments()[0]);
						}
					}
					else
					{
						livePropAddNode.metadata_type = token.text;
						livePropAddNodeTypeInfo = VDFTypeInfo.Get(VDF.GetTypeByVName(token.text, loadOptions));
					}
				else if (token.type == VDFTokenType.Data_BaseValue)
					if (token.text == "#")
					{
						List<int> poppedOutPropValueItemTextPositions = FindPoppedOutChildTextPositions(vdfFile, FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentSharedData.poppedOutPropValueCount);
						if (typeof(IList).IsAssignableFrom(objType) || poppedOutPropValueItemTextPositions.Count > 1) // if known to be a List, either by type-marking or inference
							foreach (int pos in poppedOutPropValueItemTextPositions)
								objNode.items.Add(ToVDFNode(vdfFile, declaredType != null ? (declaredType.IsGenericType ? declaredType.GetGenericArguments()[0] : typeof(object)) : null, loadOptions, pos, sharedData));
						else
							objNode = ToVDFNode(vdfFile, declaredType != null ? (declaredType.IsGenericType ? declaredType.GetGenericArguments()[0] : typeof(object)) : null, loadOptions, poppedOutPropValueItemTextPositions[0], sharedData);
						parentSharedData.poppedOutPropValueCount++;
						dataIsPoppedOut = true;
					}
					else
						livePropAddNode.baseValue = token.text;
				else if (token.type == VDFTokenType.Data_PropName)
					livePropName = token.text;
				else if (token.type == VDFTokenType.DataStartMarker)
					if (livePropName != null)
						if (typeof(IDictionary).IsAssignableFrom(objType)) // dictionary key-value-pair
							livePropAddNode.properties.Add(livePropName, ToVDFNode(vdfFile, objType.GetGenericArguments()[0], loadOptions, parser.nextCharPos, sharedData));
						else // property
							livePropAddNode.properties.Add(livePropName, ToVDFNode(vdfFile, livePropAddNodeTypeInfo != null && livePropAddNodeTypeInfo.propInfoByName.ContainsKey(livePropName) ? livePropAddNodeTypeInfo.propInfoByName[livePropName].GetPropType() : null, loadOptions, parser.nextCharPos, sharedData));
					else // if data of an in-list-list (at depth 0, which we are at, these are only ever for obj) (note; no need to set live-prop-add-node-type-info, because we know both obj and item have no properties, and so line above is unaffected by it)
						livePropAddNode = ToVDFNode(vdfFile, declaredType != null ? (declaredType.IsGenericType ? declaredType.GetGenericArguments()[0] : typeof(object)) : typeof(IList), loadOptions, parser.nextCharPos, sharedData);
				else if (token.type == VDFTokenType.DataEndMarker && livePropName != null) // end of in-list-list item-data-block, or property-data-block
					livePropName = null;
				else if (token.type == VDFTokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			if (token.type == VDFTokenType.DataStartMarker)
				depth++;
		}
		// if live-prop-add-node is not obj itself, and block wasn't empty, and data is in-line, (meaning we're adding the items as we pass their last char), add final item
		if (livePropAddNode != objNode && parser.tokens.Any(token=>new[]{VDFTokenType.DataStartMarker, VDFTokenType.Data_BaseValue, VDFTokenType.ItemSeparator}.Contains(token.type)) && !dataIsPoppedOut)
			objNode.items.Add(livePropAddNode);

		return objNode;
	}

	static int FindNextDepthXCharYPos(string vdfFile, int searchStartPos, int targetDepth, char ch, char depthStartChar, char depthEndChar)
	{
		int depth = 0;
		for (int i = searchStartPos; i < vdfFile.Length && depth >= 0; i++)
			if (vdfFile[i] == depthStartChar)
				depth++;
			else if (vdfFile[i] == ch && depth == targetDepth)
				return i;
			else if (vdfFile[i] == depthEndChar)
				depth--;
		return -1;
	}
	static int FindNextDepthXItemSeparatorCharPos(string vdfFile, int searchStartPos, int targetDepth)
	{
		int depth = 0;
		var parser = new VDFTokenParser(vdfFile, searchStartPos);
		while (parser.MoveNextToken() && depth >= 0) // use parser, so we don't have to deal with special '|' symbol usage, for separating '@@' literal-markers from the end of a troublesome string (i.e. "Bad string.@@")
			if (parser.tokens.Last().type == VDFTokenType.DataStartMarker)
				depth++;
			else if (parser.tokens.Last().type == VDFTokenType.ItemSeparator && depth == targetDepth)
				return parser.nextCharPos - 1;
			else if (parser.tokens.Last().type == VDFTokenType.DataEndMarker)
			{
				depth--;
				if (depth < 0)
					break;
			}
		return -1;
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
	static List<int> FindPoppedOutChildTextPositions(string vdfFile, int parentIndentDepth, int searchStartPos, int poppedOutChildDataIndex)
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