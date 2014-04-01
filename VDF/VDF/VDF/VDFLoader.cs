using System;
using System.Collections.Generic;
using System.Runtime.Serialization;

class VDFLoadNode
{
	public string beforeChildren; // todo; break point
	public string afterChildren;
	public List<object> children = new List<object>();
	public T ToType<T>()
	{
		//var result = (T)Activator.CreateInstance(typeof(T));
		//var result = ((Func<T>)Expression.Lambda(typeof(Func<object>), Expression.New(typeof(T).GetConstructors()[0])).Compile())();
		var result = (T)FormatterServices.GetUninitializedObject(typeof(T));
		return result;
	}
}

static class VDFLoader
{
	static VDFLoader() { VDFExtensions.Init(); }
	public static VDFLoadNode ToVDFNode(string vdfFile, int firstTextCharPos = 0)
	{
		var objNode = new VDFLoadNode();

		int objIndentDepth = 0;
		for (int i = firstTextCharPos - 1; i > 0 && vdfFile[i] != '\n'; i--)
			if (vdfFile[i] == '\t')
				objIndentDepth++;

		int depth = 0;
		int poppedOutChildDataCount = 0;
		var parser = new VDFTokenParser(vdfFile, firstTextCharPos);
		Token token;
		while ((token = parser.GetNextToken()) != null)
		{
			if (token.type == TokenType.EndDataBracket)
				depth--;

			if (depth < 0)
				break; // found our ending bracket, thus no more data (we parse the prop values as we parse the prop definitions)
			if (depth == 0)
			{
				if (token.type == TokenType.Data_PropName)
					objNode.beforeChildren += token.text;
				else if (token.type == TokenType.StartDataBracket)
				{
					objNode.beforeChildren += token.text; // "{"
					depth++;
					objNode.children.Add(ToVDFNode(vdfFile, parser.nextCharPos));
				}
				else if (token.type == TokenType.EndDataBracket)
					objNode.afterChildren += "}";
				else if (token.type == TokenType.LineBreak) // no more prop definitions, thus no more data (we parse the prop values as we parse the prop definitions)
					break;
			}
			else if (depth == 1)
			{
				if (token.type == TokenType.Data_Base)
				{
					if (token.text == "#")
					{
						objNode.children.Add(ToVDFNode(vdfFile, FindPoppedOutChildDataFirstTextCharPos(vdfFile, objIndentDepth, parser.nextCharPos, poppedOutChildDataCount)));
						poppedOutChildDataCount++;
					}
					else
						objNode.children.Add(token.text);
				}
			}

			if (token.type == TokenType.StartDataBracket)
				depth++;
		}

		return objNode;
	}

	static int FindPoppedOutChildDataFirstTextCharPos(string vdfFile, int parentIndentDepth, int searchStartPos, int poppedOutChildDataIndex)
	{
		int poppedOutChildDatasProcessed = 0;
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
					if (poppedOutChildDatasProcessed == poppedOutChildDataIndex)
						return i;
					else
						poppedOutChildDatasProcessed++;
			}
		}

		return -1;
	}
}