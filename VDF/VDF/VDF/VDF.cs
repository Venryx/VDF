using System;
using System.Collections.Generic;

static class VDF
{
	public static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	public static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj => exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str => importer(str); }
	static VDF() { VDFExtensions.Init(); }

	public static string ToVDF(object obj) { return VDFSaver.ToVDFSaveNode(obj).ToString(); }
	public static T FromVDF<T>(string vdf) { return VDFLoader.ToVDFLoadNode(vdf).ToType<T>(); }
}