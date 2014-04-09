interface Object { GetTypeName(): string; SetTypeInfo(x: any); }
module VDF_SetUp
{
	function LoadJSFile(path: string)
	{
		var script = document.createElement('script');
		script.setAttribute("src", path);
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	LoadJSFile("../VDF/VDFExtensions.js");
	LoadJSFile("../VDF/VDFTypeInfo.js");
	LoadJSFile("../VDF/VDFNode.js");
	LoadJSFile("../VDF/VDFSaver.js");
	LoadJSFile("../VDF/VDFLoader.js");
	LoadJSFile("../VDF/VDFTokenParser.js");

	// the below let's you add type-info easily (e.g. "obj.SetTypeInfo(new VDFTypeInfo());"), and without that type-info being enumerated as a field/property
	Object.defineProperty(Object.prototype, "SetTypeInfo", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function (x)
		{
			if (this["typeInfo"])
				delete this["typeInfo"];
			if (!this["typeInfo"]) // if item doesn't exist yet
				Object.defineProperty(this, "typeInfo",
				{
					enumerable: false,
					value: x
				});
		}
	});
	Object.defineProperty(Object.prototype, "GetTypeName", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function()
		{
			var results = this["constructor"].toString().match(/function (.{1,})\(/);
			return (results && results.length > 1) ? results[1] : "";
		}
	});
}

class VDF
{
	static typeExporters_inline = {};
	static typeImporters_inline = {};

	// for use with VDFSaveOptions
	static AnyMember: string = "#AnyMember";
	static AllMembers: Array<string> = ["#AnyMember"];

	static RegisterTypeExporter_Inline(type: string, exporter: Function) { VDF.typeExporters_inline[type] = exporter; }
	static RegisterTypeImporter_Inline<T>(type: string, importer: Function) { VDF.typeImporters_inline[type] = importer; }

	static GetVNameOfType(type: string, saveOptions: VDFSaveOptions): string
	{
		if (type == "Boolean")
			return "bool";
		if (type == "Number") // for now just mark all numbers as floats; note; numbers cannot be derived from, so we'll actually never need to mark the number's type, except when part of an array, or when 'saveTypesForAllObjects' is set to true
			return "float";
		if (type == "String")
			return "string";
		return type;
	}

	static Serialize(obj: any, saveOptions?: VDFSaveOptions): string
	{
		return VDFSaver.ToVDFNode(obj, saveOptions).ToString();
	}
	/*static Deserialize<T>(vdf: string, loadOptions?: VDFLoadOptions): string
	{
		return VDFLoader.ToVDFNode(vdf, loadOptions).ToObject<T>(options);
	}*/
}