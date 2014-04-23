using System;
using System.Collections;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;

public static class VDF
{
	public static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	public static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static Dictionary<Type, VDFType> typeVDFTypeOverrides = new Dictionary<Type, VDFType>();
	public static Dictionary<MemberInfo, VDFProp> propVDFPropOverrides = new Dictionary<MemberInfo, VDFProp>();

	// for use with VDFSaveOptions
	public static MemberInfo AnyMember = typeof(VDF).GetMember("AnyMember")[0];
	public static List<MemberInfo> AllMembers = new List<MemberInfo> {AnyMember};

	static Dictionary<Type, string> builtInTypeAliasesByType;
	
	static VDF()
	{
		builtInTypeAliasesByType = new Dictionary<Type, string>
		{
			{typeof(Byte), "byte"}, {typeof(SByte), "sbyte"}, {typeof(Int16), "short"}, {typeof(UInt16), "ushort"},
			{typeof(Int32), "int"}, {typeof(UInt32), "uint"}, {typeof(Int64), "long"}, {typeof(UInt64), "ulong"},
			{typeof(Single), "float"}, {typeof(Double), "double"}, {typeof(Decimal), "decimal"},
			{typeof(Boolean), "bool"}, {typeof(Char), "char"}, {typeof(String), "string"}, {typeof(Object), "object"},
			{typeof(List<>), "List"}, {typeof(Dictionary<,>), "Dictionary"}
		};

		// initialize exporters/importers for some common types
		RegisterTypeExporter_Inline<Color>(color => color.Name);
		RegisterTypeImporter_Inline<Color>(str => Color.FromName(str));
		RegisterTypeExporter_Inline<Guid>(id => id.ToString());
		RegisterTypeImporter_Inline<Guid>(str => new Guid(str));
	}
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj => exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str => importer(str); }
	public static void RegisterTypeVDFTypeOverride(Type type, VDFType vdfType) { typeVDFTypeOverrides[type] = vdfType; }
	public static void RegisterPropVDFPropOverride(MemberInfo prop, VDFProp vdfProp) { propVDFPropOverrides[prop] = vdfProp; }

	// v-name examples: "List[string]", "System.Collections.Generic.List[string]"
	static int GetGenericParamsCountOfVName(string vName)
	{
		if (!vName.Contains("["))
			return 0;
		int result = 1;
		int depth = 0;
		foreach (char ch in vName)
			if (ch == '[' || ch == ']')
				depth += ch == '[' ? 1 : -1;
			else if (depth == 1 && ch == ',')
				result++;
		return result;
	}
	static Type GetTypeByVNameRoot(string vNameRoot, int genericsParams, VDFLoadOptions loadOptions)
	{
		if (loadOptions.typeAliasesByType.Values.Contains(vNameRoot))
			return loadOptions.typeAliasesByType.FirstOrDefault(pair => pair.Value == vNameRoot).Key;
		if (builtInTypeAliasesByType.Values.Contains(vNameRoot))
			return builtInTypeAliasesByType.FirstOrDefault(pair => pair.Value == vNameRoot).Key;

		var result = Type.GetType(vNameRoot + (genericsParams > 0 ? "`" + genericsParams : ""));
		if (result != null)
			return result;
		var namespaceAlias = vNameRoot.Contains(".") ? vNameRoot.Substring(0, vNameRoot.LastIndexOf(".")) : null;
		if (namespaceAlias != null) // if alias value when saving was not an empty string
		{
			foreach (KeyValuePair<string, string> pair in loadOptions.namespaceAliasesByName)
				if (pair.Value == namespaceAlias)
					return Type.GetType(pair.Key + "." + vNameRoot + (genericsParams > 0 ? "`" + genericsParams : ""));
		}
		else
			foreach (KeyValuePair<string, string> pair in loadOptions.namespaceAliasesByName)
				if (pair.Value == null && Type.GetType(pair.Key + "." + vNameRoot + (genericsParams > 0 ? "`" + genericsParams : "")) != null)
					return Type.GetType(pair.Key + "." + vNameRoot + (genericsParams > 0 ? "`" + genericsParams : ""));
		return null;
	}
	public static Type GetTypeByVName(string vTypeName, VDFLoadOptions loadOptions)
	{
		if (vTypeName == "null")
			return null;
		if (loadOptions.typeAliasesByType.Values.Contains(vTypeName))
			return loadOptions.typeAliasesByType.FirstOrDefault(pair=>pair.Value == vTypeName).Key;
		if (builtInTypeAliasesByType.Values.Contains(vTypeName))
			return builtInTypeAliasesByType.FirstOrDefault(pair=>pair.Value == vTypeName).Key;

		var rootName = vTypeName.Contains("[") ? vTypeName.Substring(0, vTypeName.IndexOf("[")) : vTypeName;
		if (loadOptions.typeAliasesByType.Values.Contains(rootName)) // if value is actually an alias, replace it with the root-name
			rootName = loadOptions.typeAliasesByType.FirstOrDefault(pair=>pair.Value == rootName).Key.FullName.Split(new[]{'`'})[0];
		var rootType = GetTypeByVNameRoot(rootName, GetGenericParamsCountOfVName(vTypeName), loadOptions);
		if (rootType.IsGenericType)
		{
			var genericArgumentTypes = new List<Type>();
			int depth = 0;
			int lastStartBracketPos = -1;
			for (int i = 0; i < vTypeName.Length; i++)
			{
				char ch = vTypeName[i];
				if (ch == ']')
					depth--;
				if ((depth == 0 && ch == ']') || (depth == 1 && ch == ','))
					genericArgumentTypes.Add(GetTypeByVName(vTypeName.Substring(lastStartBracketPos + 1, i - (lastStartBracketPos + 1)), loadOptions)); // get generic-parameter type, by sending its parsed real-name back into this method
				if ((depth == 0 && ch == '[') || (depth == 1 && ch == ','))
					lastStartBracketPos = i;
				if (ch == '[')
					depth++;
			}
			return rootType.MakeGenericType(genericArgumentTypes.ToArray());
		}
		return rootType;
	}

	public static string GetVNameOfType(Type type, VDFSaveOptions saveOptions)
	{
		if (type == null)
			return "null";
		if (saveOptions.typeAliasesByType.ContainsKey(type))
			return saveOptions.typeAliasesByType[type];
		if (builtInTypeAliasesByType.ContainsKey(type))
			return builtInTypeAliasesByType[type];
		if (type.Name.StartsWith("<>")) // if anonymous type, return null, as the name would not be usable (note; this may not actually be true; should test it sometime)
			return null;

		if (type.IsGenericType)
		{
			var rootType = Type.GetType(type.FullName.Substring(0, type.FullName.IndexOf("[")));
			if (saveOptions.typeAliasesByType.ContainsKey(rootType))
				return saveOptions.typeAliasesByType[rootType] + "[" + String.Join(",", type.GetGenericArguments().Select(type2=>GetVNameOfType(type2, saveOptions)).ToArray()) + "]";

			var rootTypeName = rootType.FullName.Substring(0, rootType.FullName.IndexOf("`"));
			rootTypeName = rootTypeName.Contains("+") ? rootTypeName.Substring(rootTypeName.IndexOf("+") + 1) : rootTypeName; // remove assembly name, if specified in string (may want to ensure this doesn't break anything)
			if (typeof(IList).IsAssignableFrom(rootType)) // if type 'List' or a derivative, collapse its v-type-name to 'List', since that is how we handle it
				rootTypeName = "List";
			else if (typeof (Dictionary<,>).IsAssignableFrom(rootType)) // if type 'Dictionary' or a derivative, collapse its v-type-name to 'Dictionary', since that is how we handle it
				rootTypeName = "Dictionary";

			string result = rootTypeName + "[" + String.Join(",", type.GetGenericArguments().Select(type2 => GetVNameOfType(type2, saveOptions)).ToArray()) + "]";
			foreach (KeyValuePair<string, string> pair in saveOptions.namespaceAliasesByName) // loop through aliased-namespaces, and if our result starts with one's name, replace that namespace's name with its alias
				if (result.StartsWith(pair.Key + ".") && !result.Substring(pair.Key.Length + 1).Split(new[] {'['})[0].Contains("."))
					result = (pair.Value != null ? pair.Value + "." : "") + result.Substring(pair.Key.Length + 1);
			return result;
		}
		else
		{
			string result = type.FullName;
			result = result.Contains("+") ? result.Substring(result.IndexOf("+") + 1) : result; // remove assembly name, if specified in string (may want to ensure this doesn't break anything)
			foreach (KeyValuePair<string, string> pair in saveOptions.namespaceAliasesByName) // loop through aliased-namespaces, and if our result starts with one's name, replace that namespace's name with its alias
				if (result.StartsWith(pair.Key + ".") && !result.Substring(pair.Key.Length + 1).Split(new[] {'['})[0].Contains("."))
					result = (pair.Value != null ? pair.Value + "." : "") + result.Substring(pair.Key.Length + 1);
			return result;
		}
	}

	public static string Serialize<T>(object obj, VDFSaveOptions saveOptions = null) { return Serialize(obj, typeof(T), saveOptions); }
	public static string Serialize(object obj, VDFSaveOptions saveOptions, Type declaredType = null) { return Serialize(obj, declaredType, saveOptions); }
	public static string Serialize(object obj, Type declaredType = null, VDFSaveOptions saveOptions = null) { return VDFSaver.ToVDFNode(obj, declaredType, saveOptions).ToVDF(); }
	public static T Deserialize<T>(string vdf, VDFLoadOptions loadOptions = null) { return (T)Deserialize(vdf, typeof(T), loadOptions);}
	public static object Deserialize(string vdf, VDFLoadOptions loadOptions, Type declaredType = null) { return Deserialize(vdf, declaredType, loadOptions); }
	public static object Deserialize(string vdf, Type declaredType = null, VDFLoadOptions loadOptions = null) { return VDFLoader.ToVDFNode(vdf, declaredType, loadOptions).ToObject(declaredType, loadOptions); }
}