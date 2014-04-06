using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

static class VDF
{
	public static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	public static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static Dictionary<Type, VDFType> typeVDFTypeOverrides = new Dictionary<Type, VDFType>();
	public static Dictionary<MemberInfo, VDFProp> propVDFPropOverrides = new Dictionary<MemberInfo, VDFProp>();

	// for use with VDFSaveOptions
	public static MemberInfo AnyMember = typeof(VDF).GetMember("AnyMember")[0];
	public static List<MemberInfo> AllMembers = new List<MemberInfo> {AnyMember};

	static Dictionary<string, Type> builtInTypesByAlias;
	static Dictionary<Type, string> builtInTypeAliasesByType;
	
	static VDF()
	{
		builtInTypesByAlias = new Dictionary<string, Type>
		{
			{"byte", typeof(Byte)}, {"sbyte", typeof(SByte)}, {"short", typeof(Int16)}, {"ushort", typeof(UInt16)},
			{"int", typeof(Int32)}, {"uint", typeof(UInt32)}, {"long", typeof(Int64)}, {"ulong", typeof(UInt64)},
			{"float", typeof(Single)}, {"double", typeof(Double)}, {"decimal", typeof(Decimal)},
			{"bool", typeof(Boolean)}, {"char", typeof(Char)}, {"string", typeof(String)}, {"object", typeof(Object)}
		};
		builtInTypeAliasesByType = new Dictionary<Type, string>();
		foreach (KeyValuePair<string, Type> pair in builtInTypesByAlias)
			builtInTypeAliasesByType.Add(pair.Value, pair.Key);
		VDFExtensions.Init();
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
		var result = Type.GetType(vNameRoot);
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
	public static Type GetTypeByVName(string vName, VDFLoadOptions loadOptions)
	{
		if (loadOptions.typeAliasesByType.Values.Contains(vName))
			return loadOptions.typeAliasesByType.FirstOrDefault(pair=>pair.Value == vName).Key;
		if (builtInTypesByAlias.ContainsKey(vName))
			return builtInTypesByAlias[vName];

		var rootName = vName.Contains("[") ? vName.Substring(0, vName.IndexOf("[")) : vName;
		if (loadOptions.typeAliasesByType.Values.Contains(rootName)) // if value is actually an alias, replace it with the root-name
			rootName = loadOptions.typeAliasesByType.FirstOrDefault(pair=>pair.Value == rootName).Key.FullName.Split(new[]{'`'})[0];
		var rootType = GetTypeByVNameRoot(rootName, GetGenericParamsCountOfVName(vName), loadOptions);
		if (rootType.IsGenericType)
		{
			var genericArgumentTypes = new List<Type>();
			int depth = 0;
			int lastStartBracketPos = -1;
			for (int i = 0; i < vName.Length; i++)
			{
				char ch = vName[i];
				if (ch == ']')
					depth--;
				if ((depth == 0 && ch == ']') || (depth == 1 && ch == ','))
					genericArgumentTypes.Add(GetTypeByVName(vName.Substring(lastStartBracketPos + 1, i - (lastStartBracketPos + 1)), loadOptions)); // get generic-parameter type, by sending its parsed real-name back into this method
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
		if (saveOptions.typeAliasesByType.ContainsKey(type))
			return saveOptions.typeAliasesByType[type];
		if (builtInTypeAliasesByType.ContainsKey(type))
			return builtInTypeAliasesByType[type];

		var rootType = type.IsGenericType ? Type.GetType(type.FullName.Substring(0, type.FullName.IndexOf("["))) : type;
		if (type.IsGenericType && saveOptions.typeAliasesByType.ContainsKey(rootType))
			return saveOptions.typeAliasesByType[rootType] + "[" + String.Join(",", type.GetGenericArguments().Select(type2 => GetVNameOfType(type2, saveOptions))) + "]";

		string result = type.IsGenericType ? type.FullName.Substring(0, type.FullName.IndexOf("`")) + "[" + String.Join(",", type.GetGenericArguments().Select(type2=>GetVNameOfType(type2, saveOptions))) + "]" : type.FullName;
		foreach (KeyValuePair<string, string> pair in saveOptions.namespaceAliasesByName) // loop through aliased-namespaces, and if our result starts with one's name, replace that namespace's name with its alias
			if (result.StartsWith(pair.Key + ".") && !result.Substring(pair.Key.Length + 1).Split(new[] {'['})[0].Contains("."))
				result = (pair.Value != null ? pair.Value + "." : "") + result.Substring(pair.Key.Length + 1);
		return result;
	}

	public static string Serialize(object obj, VDFSaveOptions options = null) { return VDFSaver.ToVDFNode(obj, options).ToString(); }
	public static T Deserialize<T>(string vdf, VDFLoadOptions options = null) { return VDFLoader.ToVDFNode(vdf, options).ToObject<T>(options); }
}