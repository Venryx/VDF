using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;

class VDFLoadNode
{
	static object CreateNewInstanceOfType(Type type)
	{
		//return type.GetConstructors()[0].Invoke(null);
		//return ((Func<object>)Expression.Lambda(typeof(Func<object>), Expression.New(emptyConstructor)).Compile())();
		//return (T)Activator.CreateInstance(typeof(T));
		//return FormatterServices.GetUninitializedObject(type);
		ConstructorInfo emptyConstructor = type.GetConstructor(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic, null, Type.EmptyTypes, null);
		if (emptyConstructor != null)
			return emptyConstructor.Invoke(null);
		ConstructorInfo essentiallyEmptyConstructor = type.GetConstructors(BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic).Where(constr=>constr.GetParameters().All(param=>param.IsOptional)).FirstOrDefault(); // if all constructor arguments are optional
		if (essentiallyEmptyConstructor != null)
			return essentiallyEmptyConstructor.Invoke(Enumerable.Repeat(Type.Missing, essentiallyEmptyConstructor.GetParameters().Length).ToArray());
		return FormatterServices.GetUninitializedObject(type);
	}
	static object ConvertRawValueToType(object rawValue, Type type)
	{
		object result;
		if (rawValue is VDFLoadNode)
			result = ((VDFLoadNode)rawValue).ToObject(type); // tell node to return itself as the correct type
		else // must be a string
		{
			if (VDF.typeImporters_inline.ContainsKey(type))
				result = VDF.typeImporters_inline[type]((string)rawValue);
			else if (type.IsEnum)
				result = Enum.Parse(type, (string)rawValue);
			else // if no specific handler, try auto-converting string to the correct (primitive) type
				result = Convert.ChangeType(rawValue, type);
		}
		return result;
	}

	public string metadata;
	public List<object> items = new List<object>();
	public Dictionary<string, object> properties = new Dictionary<string, object>();
	public T ToObject<T>() { return (T)ToObject(typeof(T)); }
	public object ToObject(Type baseType)
	{
		if (baseType == typeof(string))
			return items[0]; // special case for properties of type 'string'; just return first item (there will always only be one, and it will always be a string)

		Type type = baseType;
		if (metadata != null)
			type = Type.GetType(metadata);
		var typeInfo = VDFTypeInfo.Get(type);
		object result = CreateNewInstanceOfType(type);
		for (int i = 0; i < items.Count; i++)
			if (result is Array)
				((Array)result).SetValue(ConvertRawValueToType(items[i], type.GetElementType()), i);
			else if (result is IList)
				((IList)result).Add(ConvertRawValueToType(items[i], type.GetGenericArguments()[0]));
			else // must be primitive, with first item actually being this node's value
				result = ConvertRawValueToType(items[i], type);
		foreach (string propName in properties.Keys)
		{
			VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
			propInfo.SetValue(result, ConvertRawValueToType(properties[propName], propInfo.propType));
		}
		return result;
	}
}

static class VDFLoader
{
	static VDFLoader() { VDFExtensions.Init(); }
	public static VDFLoadNode ToVDFLoadNode(string vdfFile, int firstTextCharPos = 0)
	{
		var objNode = new VDFLoadNode();

		int depth = 0;
		int poppedOutChildDataCount = 0;
		string livePropName = null;
		VDFLoadNode livePropValueNode = null;
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
				if (token.type == TokenType.Metadata_BaseValue)
					objNode.metadata = token.text;
				else if (token.type == TokenType.Data_PropName)
				{
					livePropName = token.text;
					livePropValueNode = new VDFLoadNode();
				}
				else if (token.type == TokenType.StartDataBracket)
					livePropValueNode = ToVDFLoadNode(vdfFile, parser.nextCharPos);
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
						List<int> poppedOutChildDataTextPositions = FindPoppedOutChildDataTextPositions(vdfFile, FindIndentDepthOfLineContainingCharPos(vdfFile, firstTextCharPos), FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, poppedOutChildDataCount);
						foreach (int pos in poppedOutChildDataTextPositions)
							livePropValueNode.items.Add(ToVDFLoadNode(vdfFile, pos));
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