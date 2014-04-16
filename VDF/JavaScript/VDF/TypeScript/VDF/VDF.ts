interface Object { GetTypeName(): string; GetType(): string; }
module VDF_SetUp
{
	function LoadJSFile(path: string)
	{
		var script = document.createElement('script');
		script.setAttribute("src", path);
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	LoadJSFile("../VDF/VDFTypeInfo.js");
	LoadJSFile("../VDF/VDFNode.js");
	LoadJSFile("../VDF/VDFSaver.js");
	LoadJSFile("../VDF/VDFLoader.js");
	LoadJSFile("../VDF/VDFTokenParser.js");
	
	Object.defineProperty(Object.prototype, "GetTypeName", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function () {
			var results = this["constructor"].toString().match(/function (.{1,})\(/);
			return (results && results.length > 1) ? results[1] : "";
		}
	});
	Object.defineProperty(Object.prototype, "GetType", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function()
		{
			var results = this["constructor"].toString().match(/function (.{1,})\(/);
			return window[(results && results.length > 1) ? results[1] : ""];
		}
	});

	if (window["OnVDFReady"])
		window["OnVDFReady"]();
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

	static GetVTypeNameOfObject(obj: any): string
	{
		if (obj["realVTypeName"])
			return obj["realVTypeName"];
		var type = obj.GetTypeName();
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
	static Deserialize<T>(vdf: string, realVTypeName: string, loadOptions?: VDFLoadOptions): string
	{
		return VDFLoader.ToVDFNode(vdf, loadOptions).ToObject(realVTypeName, loadOptions);
	}
}

class EnumValue
{
	realVTypeName: string; // prop-name is special; used to identify 'true' or 'represented' type of object
	//intValue: number;
	stringValue: string;
	constructor(enumTypeName: string, intValue: number)
	{
		this.realVTypeName = enumTypeName;
		//this.intValue = intValue;
		this.stringValue = EnumValue.GetEnumStringForIntValue(enumTypeName, intValue);
	}
	toString() { return this.stringValue; }

	static IsEnum(typeName: string): boolean { return eval("window['" + typeName + "'] && " + typeName + "['_IsEnum'] === 0"); }
	static GetEnumIntForStringValue(enumTypeName: string, stringValue: string) { return eval(enumTypeName + "[\"" + stringValue + "\"]"); }
	static GetEnumStringForIntValue(enumTypeName: string, intValue: number) { return eval(enumTypeName + "[" + intValue + "]"); }
}

interface List<T> extends Array<T>
{
	itemType: string;
}
function new_List<T>(itemType: string, ...items: T[]): List<T>
{
	var result: any = items || [];
	result.AddItem("realVTypeName", "List[" + itemType + "]");
	result.itemType = itemType;
	return result;
}

interface Dictionary<K, V> extends Map<K, V>
{
	keyType: string;
	valueType: string;
	keys: any[];
}
function new_Dictionary<K, V>(keyType?: string, valueType?: string, ...keyValuePairs: Array<Array<any>>): Dictionary<K, V>
{
	var result: any = new Map<K, V>();
	result.AddItem("realVTypeName", "Dictionary[" + keyType + "," + valueType + "]");
	result.keyType = keyType;
	result.valueType = valueType;

	result.keys = [];
	result.set = (key: K, value: V) =>
	{
		if (!result.keys.contains(key))
			result.keys.push(key);
		Map.prototype.set.call(result, key, value);
	};

	if (keyValuePairs)
		for (var i = 0; i < keyValuePairs.length; i++)
			result.set(keyValuePairs[i][0], keyValuePairs[i][1]);
	return result;
}