using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;

public class VDFException : Exception
{
	string message;
	Exception innerException;
	public VDFException(string message, Exception innerException = null)
	{
		this.message = message;
		this.innerException = innerException;
	}
	public override string ToString()
	{
		if (innerException != null)
			return innerException + (innerException.ToString().EndsWith("\n==================") ? "" : "\n==================") + "\nRethrownAs) " + message + "\n" + base.StackTrace + "\n==================";
		return message + "\n" + base.StackTrace + "\n==================";
	}
	public override string Message { get { return ToString(); } }
	public override string StackTrace { get { return innerException != null ? innerException.StackTrace : base.StackTrace; } }
}
public static class VDF
{
	// for use with VDFSaveOptions
	public static MemberInfo AnyMember = typeof(VDF).GetMember("AnyMember")[0];
	public static List<MemberInfo> AllMembers = new List<MemberInfo> {AnyMember};

	// for use with VDFType
	public const string PropRegex_Any = ""; //"^.+$";

	// for use with VDFSerialize/VDFDeserialize methods
	public static VDFNode NoActionTaken = new VDFNode();
	public static VDFNode CancelSerialize = new VDFNode();

	static Dictionary<Type, string> builtInTypeAliasesByType;
	static Dictionary<string, Type> builtInTypeAliasesByTypeName;
	
	static VDF()
	{
		builtInTypeAliasesByType = new Dictionary<Type, string>
		{
			{typeof(byte), "byte"}, {typeof(sbyte), "sbyte"}, {typeof(short), "short"}, {typeof(ushort), "ushort"},
			{typeof(int), "int"}, {typeof(uint), "uint"}, {typeof(long), "long"}, {typeof(ulong), "ulong"},
			{typeof(float), "float"}, {typeof(double), "double"}, {typeof(decimal), "decimal"},
			{typeof(bool), "bool"}, {typeof(char), "char"}, {typeof(string), "string"}, {typeof(object), "object"},
			{typeof(List<>), "List"}, {typeof(Dictionary<,>), "Dictionary"}
		};
		builtInTypeAliasesByTypeName = builtInTypeAliasesByType.ToDictionary(a=>a.Value, a=>a.Key);

		// initialize exporters/importers for some common types
		VDFTypeInfo.AddSerializeMethod<Color>((self, parent, prop, options)=>new VDFNode(self.Name));
		VDFTypeInfo.AddDeserializeMethod_FromParent<Color>((node, parent, prop, options)=>Color.FromName((string)node.primitiveValue));
		VDFTypeInfo.AddSerializeMethod<Guid>((self, parent, prop, options)=>new VDFNode(self.ToString()));
		VDFTypeInfo.AddDeserializeMethod_FromParent<Guid>((node, parent, prop, options)=>new Guid((string)node.primitiveValue));
	}

	// v-name examples: "List(string)", "System.Collections.Generic.List(string)", "Dictionary(string string)"
	static int GetGenericParamsCountOfTypeName(string typeName)
	{
		if (!typeName.Contains("("))
			return 0;
		int result = 1;
		int depth = 0;
		foreach (char ch in typeName)
			if (ch == '(' || ch == ')')
				depth += ch == '(' ? 1 : -1;
			else if (depth == 1 && ch == ' ')
				result++;
		return result;
	}
	static Type GetTypeByNameRoot(string nameRoot, int genericsParams, VDFLoadOptions options)
	{
		if (options.typeAliasesByType.Values.Contains(nameRoot))
			return options.typeAliasesByType.FirstOrDefault(pair=>pair.Value == nameRoot).Key;
		//if (builtInTypeAliasesByType.Values.Contains(nameRoot))
		//	return builtInTypeAliasesByType.FirstOrDefault(pair=>pair.Value == nameRoot).Key;
		if (builtInTypeAliasesByTypeName.ContainsKey(nameRoot))
			return builtInTypeAliasesByTypeName[nameRoot];

		var result = Type.GetType(nameRoot + (genericsParams > 0 ? "`" + genericsParams : ""));
		if (result != null)
			return result;
		var namespaceAlias = nameRoot.Contains(".") ? nameRoot.Substring(0, nameRoot.LastIndexOf(".")) : null;
		if (namespaceAlias != null) // if alias value when saving was not an empty string
		{
			foreach (KeyValuePair<string, string> pair in options.namespaceAliasesByName)
				if (pair.Value == namespaceAlias)
					return Type.GetType(pair.Key + "." + nameRoot + (genericsParams > 0 ? "`" + genericsParams : ""));
		}
		else
			foreach (KeyValuePair<string, string> pair in options.namespaceAliasesByName)
				if (pair.Value == null && Type.GetType(pair.Key + "." + nameRoot + (genericsParams > 0 ? "`" + genericsParams : "")) != null)
					return Type.GetType(pair.Key + "." + nameRoot + (genericsParams > 0 ? "`" + genericsParams : ""));
		return null;
	}
	public static Type GetTypeByName(string typeName, VDFLoadOptions options = null)
	{
		options = options ?? new VDFLoadOptions();
		if (options.typeAliasesByType.Values.Contains(typeName))
			return options.typeAliasesByType.FirstOrDefault(pair=>pair.Value == typeName).Key;
		//if (builtInTypeAliasesByType.Values.Contains(typeName))
		//	return builtInTypeAliasesByType.FirstOrDefault(pair=>pair.Value == typeName).Key;
		if (builtInTypeAliasesByTypeName.ContainsKey(typeName))
			return builtInTypeAliasesByTypeName[typeName];

		var rootName = typeName.Contains("(") ? typeName.Substring(0, typeName.IndexOf("(")) : typeName;
		if (options.typeAliasesByType.Values.Contains(rootName)) // if value is actually an alias, replace it with the root-name
			rootName = options.typeAliasesByType.FirstOrDefault(pair=>pair.Value == rootName).Key.FullName.Split(new[] {'`'})[0];
		var rootType = GetTypeByNameRoot(rootName, GetGenericParamsCountOfTypeName(typeName), options);
		if (rootType == null)
			throw new VDFException("Could not find type \"" + rootName + "\".");
		if (rootType.IsGenericType)
		{
			var genericArgumentTypes = new List<Type>();
			int depth = 0;
			int lastStartBracketPos = -1;
			for (var i = 0; i < typeName.Length; i++)
			{
				char ch = typeName[i];
				if (ch == ')')
					depth--;
				if ((depth == 0 && ch == ')') || (depth == 1 && ch == ' '))
					genericArgumentTypes.Add(GetTypeByName(typeName.Substring(lastStartBracketPos + 1, i - (lastStartBracketPos + 1)), options)); // get generic-parameter type, by sending its parsed real-name back into this method
				if ((depth == 0 && ch == '(') || (depth == 1 && ch == ' '))
					lastStartBracketPos = i;
				if (ch == '(')
					depth++;
			}
			return rootType.MakeGenericType(genericArgumentTypes.ToArray());
		}
		return rootType;
	}

	public static bool GetIsTypePrimitive(Type type) { return type.IsPrimitive || type == typeof(string); } // (technically strings are not primitives in C#, but we consider them such)
	public static bool GetIsTypeAnonymous(Type type) { return type != null && type.Name.StartsWith("<>"); }
	public static string GetNameOfType(Type type, VDFSaveOptions options)
	{
		if (options.typeAliasesByType.ContainsKey(type))
			return options.typeAliasesByType[type];
		if (builtInTypeAliasesByType.ContainsKey(type))
			return builtInTypeAliasesByType[type];

		if (type.IsGenericType)
		{
			var rootType = type.GetGenericTypeDefinition();
			if (options.typeAliasesByType.ContainsKey(rootType))
				return options.typeAliasesByType[rootType] + "(" + String.Join(" ", type.GetGenericArguments().Select(type2=>GetNameOfType(type2, options)).ToArray()) + ")";

			var rootTypeName = rootType.FullName.Substring(0, rootType.FullName.IndexOf("`"));
			rootTypeName = rootTypeName.Contains("+") ? rootTypeName.Substring(rootTypeName.IndexOf("+") + 1) : rootTypeName; // remove assembly name, if specified in string (may want to ensure this doesn't break anything)
			if (typeof(IList).IsAssignableFrom(rootType)) // if type 'List' or a derivative, collapse its v-type-name to 'List', since that is how we handle it
				rootTypeName = "List";
			else if (typeof(Dictionary<,>).IsAssignableFrom(rootType)) // if type 'Dictionary' or a derivative, collapse its v-type-name to 'Dictionary', since that is how we handle it
				rootTypeName = "Dictionary";

			string result = rootTypeName + "(" + String.Join(" ", type.GetGenericArguments().Select(type2=>GetNameOfType(type2, options)).ToArray()) + ")";
			foreach (KeyValuePair<string, string> pair in options.namespaceAliasesByName) // loop through aliased-namespaces, and if our result starts with one's name, replace that namespace's name with its alias
				if (result.StartsWith(pair.Key + ".") && !result.Substring(pair.Key.Length + 1).Split(new[] {'('})[0].Contains("."))
					result = (pair.Value != null ? pair.Value + "." : "") + result.Substring(pair.Key.Length + 1);
			return result;
		}
		else
		{
			string result = type.FullName;
			result = result.Contains("+") ? result.Substring(result.IndexOf("+") + 1) : result; // remove assembly name, if specified in string (may want to ensure this doesn't break anything)
			foreach (KeyValuePair<string, string> pair in options.namespaceAliasesByName) // loop through aliased-namespaces, and if our result starts with one's name, replace that namespace's name with its alias
				if (result.StartsWith(pair.Key + ".") && !result.Substring(pair.Key.Length + 1).Split(new[] {'('})[0].Contains("."))
					result = (pair.Value != null ? pair.Value + "." : "") + result.Substring(pair.Key.Length + 1);
			return result;
		}
	}
	public static List<Type> GetGenericArgumentsOfType(Type type) // if array, actually returns the element-type (which is equivalent)
	{
		if (typeof(IList).IsAssignableFrom(type))
			return new List<Type> {type.HasElementType ? type.GetElementType() : type.GetGenericArguments().FirstOrDefault()};
		return type != null ? type.GetGenericArguments().ToList() : null;
	}

	public static string Serialize<T>(object obj, VDFSaveOptions options = null) { return Serialize(obj, typeof(T), options); }
	public static string Serialize(object obj, VDFSaveOptions options) { return Serialize(obj, null, options); }
	public static string Serialize(object obj, Type declaredType = null, VDFSaveOptions options = null) { return VDFSaver.ToVDFNode(obj, declaredType, options).ToVDF(options); }
	public static T Deserialize<T>(string vdf, VDFLoadOptions options = null) { return (T)Deserialize(vdf, typeof(T), options);}
	public static object Deserialize(string vdf, VDFLoadOptions options) { return Deserialize(vdf, null, options); }
	public static object Deserialize(string vdf, Type declaredType = null, VDFLoadOptions options = null) { return VDFLoader.ToVDFNode(vdf, declaredType, options).ToObject(declaredType, options); }
	public static void DeserializeInto(string vdf, object obj, VDFLoadOptions options = null) { VDFLoader.ToVDFNode(vdf, obj.GetType(), options).IntoObject(obj, options); }
}