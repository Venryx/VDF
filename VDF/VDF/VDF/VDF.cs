using System;
using System.Collections.Generic;
using System.Reflection;

static class VDF
{
	public static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	public static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static Dictionary<Type, VDFType> typeVDFTypeOverrides = new Dictionary<Type, VDFType>();
	public static Dictionary<MemberInfo, VDFProp> propVDFPropOverrides = new Dictionary<MemberInfo, VDFProp>();
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj => exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str => importer(str); }
	public static void RegisterTypeVDFTypeOverride(Type type, VDFType vdfType) { typeVDFTypeOverrides[type] = vdfType; }
	public static void RegisterPropVDFPropOverride(MemberInfo prop, VDFProp vdfProp) { propVDFPropOverrides[prop] = vdfProp; }
	static VDF() { VDFExtensions.Init(); }

	public static string Serialize(object obj) { return VDFSaver.ToVDFNode(obj).ToString(); }
	public static T Deserialize<T>(string vdf) { return VDFLoader.ToVDFNode(vdf).ToObject<T>(); }
}