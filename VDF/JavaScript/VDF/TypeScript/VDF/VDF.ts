interface Object { GetTypeName(): string; GetType(): string; }
module VDF_SetUp
{
	Object.defineProperty(Object.prototype, "GetTypeName", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function ()
		{
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

	static GetType(vTypeName: string) { return window[vTypeName]; }
	static GetTypeInfo(vTypeName: string) { return (window[vTypeName] || {}).typeInfo; }
	static GetVTypeNameOfObject(obj)
	{
		if (obj == null)
			return null;
		if (obj.constructor == (<any>{}).constructor || obj.constructor == object) // if true anonymous object, or if VDF-anonymous-object
			return null; // return null, as the name would not be usable (note; this may not actually be true; should test it sometime)
		var rawType = typeof obj;
		if (rawType == "object") // if an object (i.e. a thing with real properties that could indicate a more specific type)
		{
			if (obj["realVTypeName"])
				return obj["realVTypeName"];
			var type = obj.GetTypeName();
			if (type == "Boolean")
				return "bool";
			if (type == "Number")
				return obj.toString().contains(".") ? "float" : "int";
			if (type == "String")
				return "string";
			if (type == "Object")
				return "object";
			return type;
		}
		if (rawType == "boolean")
			return "bool";
		if (rawType == "number")
			return obj.toString().contains(".") ? "float" : "int";
		return rawType;
	}
	static GetGenericParametersOfTypeName(typeName: string): string[]
	{
		var genericArgumentTypes = new Array<string>();
		var depth = 0;
		var lastStartBracketPos = -1;
		for (var i = 0; i < typeName.length; i++)
		{
			var ch = typeName[i];
			if (ch == ']')
				depth--;
			if ((depth == 0 && ch == ']') || (depth == 1 && ch == ','))
				genericArgumentTypes.push(typeName.substring(lastStartBracketPos + 1, i)); // get generic-parameter type-str
			if ((depth == 0 && ch == '[') || (depth == 1 && ch == ','))
				lastStartBracketPos = i;
			if (ch == '[')
				depth++;
		}
		return genericArgumentTypes;
	}

	static Serialize(obj: any, saveOptions: VDFSaveOptions, declaredTypeName?: string): string;
	static Serialize(obj: any, declaredTypeName?: string, saveOptions?: VDFSaveOptions): string;
	static Serialize(obj: any, declaredTypeName_orSaveOptions?: any, saveOptions_orDeclaredTypeName?: any): string;
	static Serialize(obj: any, declaredTypeName_orSaveOptions?: any, saveOptions_orDeclaredTypeName?: any): string
	{
		var declaredTypeName: string;
		var saveOptions: VDFSaveOptions;
		if (typeof declaredTypeName_orSaveOptions == "string" || saveOptions_orDeclaredTypeName instanceof VDFSaveOptions)
			{declaredTypeName = declaredTypeName_orSaveOptions; saveOptions = saveOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = saveOptions_orDeclaredTypeName; saveOptions = declaredTypeName_orSaveOptions;}
		return VDFSaver.ToVDFNode(obj, declaredTypeName, saveOptions).ToVDF();
	}
	static Deserialize(vdf: string, loadOptions: VDFLoadOptions, declaredTypeName?: string): any;
	static Deserialize(vdf: string, declaredTypeName?: string, loadOptions?: VDFLoadOptions): any;
	static Deserialize(vdf: string, declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any): any;
	static Deserialize(vdf: string, declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any): any
	{
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;
		if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions)
			{declaredTypeName = declaredTypeName_orLoadOptions; loadOptions = loadOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = loadOptions_orDeclaredTypeName; loadOptions = declaredTypeName_orLoadOptions;}
		return VDFLoader.ToVDFNode(vdf, declaredTypeName, loadOptions).ToObject(declaredTypeName, loadOptions);
	}
}

// helper classes
// ==================

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

// VDF-usable data wrappers
// ==================

class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
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
	get length()
	{
		//return this.innerArray.length; // we can't just check internal array's length, since user may have 'added' items by calling "list[0] = value;"
		var highestIndex = -1;
		for (var propName in this)
			if (parseInt(propName) == propName && parseInt(propName) > highestIndex) // if integer key
				highestIndex = parseInt(propName);
		return highestIndex + 1;
	}
	constructor(itemType: string, ...items: T[])
	{
		Object.defineProperty(this, "realVTypeName", { enumerable: false, value: "List[" + itemType + "]" });
		this.innerArray = [];
		this.pushAll(items);
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
class Dictionary<K, V>
{
	keyType: string;
	valueType: string;
	keys: any[] = [];
	values: any[] = [];
	constructor(keyType?: string, valueType?: string, ...keyValuePairs: Array<Array<any>>)
	{
		Object.defineProperty(this, "realVTypeName", {enumerable: false, value: "Dictionary[" + keyType + "," + valueType + "]"});
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