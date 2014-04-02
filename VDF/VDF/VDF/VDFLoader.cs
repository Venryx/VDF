using System.Collections.Generic;

static class VDFLoader
{
	static VDFLoader() { VDFExtensions.Init(); }
	public static VDFNode ToVDFNode(string vdfFile, int firstObjTextCharPos = 0)
	{
		var objNode = new VDFNode();

		int depth = 0;
		int poppedOutChildDataCount = 0;
		string livePropName = null;
		VDFNode livePropValueNode = null;
		var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
		Token token;
		while ((token = parser.GetNextToken()) != null)
		{
			if (token.type == TokenType.EndDataBracket)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if (token.type == TokenType.Metadata_BaseValue)
					objNode.metadata = token.text;
				else if (token.type == TokenType.Data_PropName)
				{
					livePropName = token.text;
					livePropValueNode = new VDFNode();
				}
				else if (token.type == TokenType.StartDataBracket)
					livePropValueNode = ToVDFNode(vdfFile, parser.nextCharPos);
				else if (token.type == TokenType.EndDataBracket)
				{
					//if (livePropValueNode.items.Count > 0 || livePropValueNode.properties.Count > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
					objNode.properties.Add(livePropName, livePropValueNode);
					livePropName = null;
					livePropValueNode = null;
				}
				else if (token.type == TokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			else if (depth == 1)
			{
				if (token.type == TokenType.Data_BaseValue)
				{
					if (token.text == "#")
					{
						//objNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
						List<int> poppedOutChildDataTextPositions = FindPoppedOutChildDataTextPositions(vdfFile, FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, poppedOutChildDataCount);
						foreach (int pos in poppedOutChildDataTextPositions)
							livePropValueNode.items.Add(ToVDFNode(vdfFile, pos));
						poppedOutChildDataCount += poppedOutChildDataTextPositions.Count;
					}
					else
						livePropValueNode.items.Add(token.text);
				}
			}

			if (token.type == TokenType.StartDataBracket)
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