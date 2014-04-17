interface Object { GetTypeName(): string; GetType(): string; }
module VDF_SetUp
{
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
		var a = VDFSaver.ToVDFNode(obj, saveOptions);
		return VDFSaver.ToVDFNode(obj, saveOptions).ToString();
	}
	static Deserialize<T>(vdf: string, realVTypeName: string, loadOptions?: VDFLoadOptions): string
	{
		return VDFLoader.ToVDFNode(vdf, loadOptions).ToObject(realVTypeName, loadOptions);
	}
}

class StringBuilder
{
	public data: Array<string> = [];
	public counter: number = 0;
	constructor(startData?: string)
	{
		if (startData)
			this.data.push(startData);
	}
	Append(str) { this.data[this.counter++] = str; return this; } // adds string str to the StringBuilder
	Remove(i, j) { this.data.splice(i, j || 1); return this; } // removes j elements starting at i, or 1 if j is omitted
	Insert(i, str) { this.data.splice(i, 0, str); return this; } // inserts string str at i
	ToString(joinerString?) { return this.data.join(joinerString || ""); } // builds the string
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

class List<T>
{
	private innerArray: any[];
	itemType: string;
	length: any; // prop with a getter (added below)
	constructor(itemType: string, ...items: T[])
	{
		this.innerArray = [];
		this.pushAll(items);
		this.AddItem("realVTypeName", "List[" + itemType + "]");
		this.itemType = itemType;
	}

	modifyInnerListWithCall(func, args: any[])
	{
		for (var i = 0; i < this.innerArray.length; i++)
			delete this[i];
		func.apply(this.innerArray, args);
		for (var i = 0; i < this.innerArray.length; i++) // copy all inner-array items as our own
			this[i] = this.innerArray[i];
	}
	push(...args) { this.modifyInnerListWithCall(Array.prototype.push, args); }
	pushAll(...args) { this.modifyInnerListWithCall(Array.prototype.pushAll, args); }
	pop(...args) { this.modifyInnerListWithCall(Array.prototype.pop, args); }
	insert(...args) { this.modifyInnerListWithCall(Array.prototype.insert, args); }
	remove(...args) { this.modifyInnerListWithCall(Array.prototype.remove, args); }
	splice(...args) { this.modifyInnerListWithCall(Array.prototype.splice, args); }
}
List.prototype.AddGetter_Inline = function length()
{
	//return this.innerArray.length; // we can't just check internal array's length, since user may have 'added' items by calling "list[0] = value;"
	var highestIndex = -1;
	for (var propName in this)
		if (parseInt(propName) == propName && parseInt(propName) > highestIndex) // if integer key
			highestIndex = parseInt(propName);
	return highestIndex + 1;
};

class Dictionary<K, V>
{
	keyType: string;
	valueType: string;
	keys: any[] = [];
	values: any[] = [];
	constructor(keyType?: string, valueType?: string, ...keyValuePairs: Array<Array<any>>)
	{
		this.AddItem("realVTypeName", "Dictionary[" + keyType + "," + valueType + "]");
		this.keyType = keyType;
		this.valueType = valueType;

		if (keyValuePairs)
			for (var i = 0; i < keyValuePairs.length; i++)
				this.set(keyValuePairs[i][0], keyValuePairs[i][1]);
	}

	get(key: K) { return this.values[this.keys.indexOf(key)]; }
	set(key: K, value: V)
	{
		if (!this.keys.contains(key))
			this.keys.push(key);
		this.values[this.keys.indexOf(key)] = value;
	}
}