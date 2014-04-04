using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
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

	static VDF() { VDFExtensions.Init(); }
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj => exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str => importer(str); }
	public static void RegisterTypeVDFTypeOverride(Type type, VDFType vdfType) { typeVDFTypeOverrides[type] = vdfType; }
	public static void RegisterPropVDFPropOverride(MemberInfo prop, VDFProp vdfProp) { propVDFPropOverrides[prop] = vdfProp; }

	// real name example: System.Collections.Generic.List<string>
	//static Type GetTypeByRealName(string realName) { return AppDomain.CurrentDomain.GetAssemblies().SelectMany(assembly=>assembly.GetTypes()).FirstOrDefault(type=>type.FullName.Split(new[] {'`'})[0] == realName); }
	//static Type GetTypeBySemiFullTypeName(string semiFullName) { return AppDomain.CurrentDomain.GetAssemblies().Select(assembly=>assembly.GetType(semiFullName)).FirstOrDefault(type=>type != null); }
	//static string GetRealNameOfType(Type type) { return type.GetGenericArguments().Length > 0 ? type.FullName.Split(new[] {'`'})[0] + "<" + String.Join(",", type.GetGenericArguments().Select(GetRealNameOfType)) + ">" : type.FullName; }
	//static Type GetTypeByRealName(string realName) { return AppDomain.CurrentDomain.GetAssemblies().SelectMany(assembly=>assembly.GetTypes()).FirstOrDefault(type=>GetRealNameOfType(type) == realName); }
	static string GetRealNameRootOfTypeName(string typeName) { return typeName.Split(new[] {'`', '<'})[0]; }
	static Type GetTypeByRealNameRoot(string realNameRoot) { return AppDomain.CurrentDomain.GetAssemblies().SelectMany(assembly=>assembly.GetTypes()).FirstOrDefault(type=>GetRealNameRootOfTypeName(type.FullName) == realNameRoot); }
	/*static string RealNameToSemiFullTypeName(string realName)
	{
		List<string> realNameSubs_fullNames = realName.Split(new[] {'<', '>'}, StringSplitOptions.RemoveEmptyEntries).Select(realNameSub=>GetTypeByRealNameRoot(realNameSub) != null ? GetTypeByRealNameRoot(realNameSub).FullName : realNameSub).ToList();
		var result = new StringBuilder();
		int nextRealNameSubIndex = 0;
		for (int i = 0; i < realName.Length; i++)
			if (i == 0 || realName[i - 1] == '<' || realName[i - 1] == ',') // first char of type-name
				result.Append(realNameSubs_fullNames[nextRealNameSubIndex++]); // note; because we used 'x++', increment happens 'after' this line runs
			else if (realName[i] == '<' || realName[i] == '>')
				result.Append(realName[i] == '<' ? "[" : "]");
		return result.ToString();
	}*/
	static Dictionary<string, Type> builtInTypesByAlias = new Dictionary<string, Type>
	{
		{"byte", typeof(Byte)},
		{"sbyte", typeof(SByte)},
		{"short", typeof(Int16)},
		{"ushort", typeof(UInt16)},
		{"int", typeof(Int32)},
		{"uint", typeof(UInt32)},
		{"long", typeof(Int64)},
		{"ulong", typeof(UInt64)},
		{"float", typeof(Single)},
		{"double", typeof(Double)},
		{"decimal", typeof(Decimal)},
		{"char", typeof(Char)},
		{"string", typeof(String)},
		{"bool", typeof(Boolean)},
		{"object", typeof(Object)}
	};
	public static Type GetTypeByRealName(string realName)
	{
		//var result = GetTypeBySemiFullTypeName(RealNameToSemiFullTypeName(realName));
		var rootType = GetTypeByRealNameRoot(GetRealNameRootOfTypeName(realName));
		if (builtInTypesByAlias.ContainsKey(realName))
		{
			/*var codeProvider = new CSharpCodeProvider(new Dictionary<string, string> { { "CompilerVersion", "v3.5" } });
			var compilerParams = new CompilerParameters { GenerateInMemory = true };
			compilerParams.ReferencedAssemblies.Add(Assembly.GetExecutingAssembly().Location);
			var results = codeProvider.CompileAssemblyFromSource(compilerParams, "using System; public class VTypeNameToType_Helper { public Type GetEmbeddedType() { return typeof(" + realName.Replace("[", "<").Replace("]", ">") + "); } }");
			var type = results.CompiledAssembly.GetType("VTypeNameToType_Helper");
			return (Type)type.GetMethod("GetEmbeddedType").Invoke(Activator.CreateInstance(type), new object[] { });*/
			return builtInTypesByAlias[realName];
		}
		if (rootType.IsGenericType)
		{
			var genericArgumentTypes = new List<Type>();
			int depth = 0;
			int lastStartBracketPos = -1;
			for (int i = 0; i < realName.Length; i++)
			{
				char ch = realName[i];
				if (ch == '>')
					depth--;
				if (depth == 0 && (ch == ',' || ch == '>'))
					genericArgumentTypes.Add(GetTypeByRealName(realName.Substring(lastStartBracketPos + 1, i - (lastStartBracketPos + 1)))); // get generic-parameter type, by sending its parsed real-name back into this method
				if (ch == '<')
				{
					lastStartBracketPos = i;
					depth++;
				}
			}
			return rootType.MakeGenericType(genericArgumentTypes.ToArray());
		}
		return rootType;
	}
	static CSharpCodeProvider codeProvider;
	public static string TypeToRealTypeName(Type type) { return (codeProvider ?? (codeProvider = new CSharpCodeProvider())).GetTypeOutput(new CodeTypeReference(type)).Replace("<", "[").Replace(">", "]"); }

	public static string Serialize(object obj, VDFSaveOptions saveOptions = null) { return VDFSaver.ToVDFNode(obj, saveOptions).ToString(); }
	public static T Deserialize<T>(string vdf) { return VDFLoader.ToVDFNode(vdf).ToObject<T>(); }
}