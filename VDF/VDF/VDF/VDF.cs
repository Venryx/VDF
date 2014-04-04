using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.CSharp;

static class VDF
{
	public static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	public static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static Dictionary<Type, VDFType> typeVDFTypeOverrides = new Dictionary<Type, VDFType>();
	public static Dictionary<MemberInfo, VDFProp> propVDFPropOverrides = new Dictionary<MemberInfo, VDFProp>();

	// for use with VDFSaveOptions
	public static MemberInfo AnyMember = typeof(VDF).GetMember("AnyMember")[0];
	public static List<MemberInfo> AllMembers = new List<MemberInfo> {AnyMember};

	static CSharpCodeProvider codeProvider;
	static Dictionary<string, Type> builtInTypesByAlias;
	static List<Type> accessibleTypes;

	static VDF() { Init(); }
	static void Init()
	{
		codeProvider = new CSharpCodeProvider();
		builtInTypesByAlias = new Dictionary<string, Type>
		{
			{"byte", typeof(Byte)}, {"sbyte", typeof(SByte)}, {"short", typeof(Int16)}, {"ushort", typeof(UInt16)},
			{"int", typeof(Int32)}, {"uint", typeof(UInt32)}, {"long", typeof(Int64)}, {"ulong", typeof(UInt64)},
			{"float", typeof(Single)}, {"double", typeof(Double)}, {"decimal", typeof(Decimal)},
			{"bool", typeof(Boolean)}, {"char", typeof(Char)}, {"string", typeof(String)}, {"object", typeof(Object)}
		};
		accessibleTypes = AppDomain.CurrentDomain.GetAssemblies().SelectMany(assembly=>assembly == Assembly.GetExecutingAssembly() ? assembly.GetTypes() : assembly.GetTypes().Where(type=>type.IsVisible)).ToList();
		VDFExtensions.Init();
	}
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj => exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str => importer(str); }
	public static void RegisterTypeVDFTypeOverride(Type type, VDFType vdfType) { typeVDFTypeOverrides[type] = vdfType; }
	public static void RegisterPropVDFPropOverride(MemberInfo prop, VDFProp vdfProp) { propVDFPropOverrides[prop] = vdfProp; }

	// basic-name examples: "List[string]", "System.Collections.Generic.List[string]"; simple-name examples: "List`1", "Dictionary`2"
	static string GetRootOfTypeName(string typeName) { return typeName.Split(new[] { '`', '<', '['})[0]; } // accepts full-names or basic-names
	static Type GetTypeByBasicNameRoot(string basicNameRoot) { return accessibleTypes.FirstOrDefault(type=>GetRootOfTypeName(type.FullName) == basicNameRoot || GetRootOfTypeName(type.Name) == basicNameRoot); } // second check is for if metadata-type is 'simple'
	static IEnumerable<Type> GetTypesWithSimpleName(string simpleName) { return accessibleTypes.Where(type=>type.Name == simpleName); }

	public static Type GetTypeByBasicName(string basicName)
	{
		var rootType = GetTypeByBasicNameRoot(GetRootOfTypeName(basicName));
		if (builtInTypesByAlias.ContainsKey(basicName))
			return builtInTypesByAlias[basicName];
		if (rootType.IsGenericType)
		{
			var genericArgumentTypes = new List<Type>();
			int depth = 0;
			int lastStartBracketPos = -1;
			for (int i = 0; i < basicName.Length; i++)
			{
				char ch = basicName[i];
				if (ch == ']')
					depth--;

				if ((depth == 0 && ch == ']') || (depth == 1 && ch == ','))
					genericArgumentTypes.Add(GetTypeByBasicName(basicName.Substring(lastStartBracketPos + 1, i - (lastStartBracketPos + 1)))); // get generic-parameter type, by sending its parsed real-name back into this method
				if ((depth == 0 && ch == '[') || (depth == 1 && ch == ','))
					lastStartBracketPos = i;

				if (ch == '[')
					depth++;
			}
			return rootType.MakeGenericType(genericArgumentTypes.ToArray());
		}
		return rootType;
	}
	public static string GetBasicNameOfType(Type type, VDFSaveOptions saveOptions)
	{
		var fullTypeName = codeProvider.GetTypeOutput(new CodeTypeReference(type)).Replace("<", "[").Replace(">", "]"); // this will actually return the short name (e.g. 'int') for primitive-types
		if (!fullTypeName.Contains(".") || saveOptions.alwaysUseFullTypeNames) // if class has no namespace, (or we're always supposed to keep the name in original/full form), we can return the name immediately
			return fullTypeName;

		IEnumerable<Type> typesWithSimpleName = GetTypesWithSimpleName(type.Name);
		if (typesWithSimpleName.Count() > 2) // if there are multiple types with the same simple name, we have to use the full name
			return fullTypeName;
		if (saveOptions.typeAliases.ContainsKey(type))
			return saveOptions.typeAliases[type];
		return new Regex("[^.\\[,]+?\\.").Replace(fullTypeName, ""); // remove the namespace-part of each type in the type string
	}

	public static string Serialize(object obj, VDFSaveOptions saveOptions = null) { return VDFSaver.ToVDFNode(obj, saveOptions).ToString(); }
	public static T Deserialize<T>(string vdf) { return VDFLoader.ToVDFNode(vdf).ToObject<T>(); }
}