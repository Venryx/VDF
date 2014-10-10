interface Object { GetTypeName(): string; GetType(): string; }
module VDF_SetUp
{
	Object.defineProperty(Object.prototype, "GetTypeName", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function ()
		{
			//var results = this["constructor"].toString().match(/function (.{1,})\(/);
			//return (results && results.length > 1) ? results[1] : "";
			return this.constructor.name;
		}
	});
	Object.defineProperty(Object.prototype, "GetType", // 'silent' is implied, as functions added should, by default, not be 'enumerable'
	{
		enumerable: false,
		value: function()
		{
			//var results = this["constructor"].toString().match(/function (.{1,})\(/);
			//return window[(results && results.length > 1) ? results[1] : ""];
			return window[this.constructor.name];
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
	static GetVTypeNameOfObject(obj)
	{
		if (obj.constructor == (<any>{}).constructor || obj.constructor == object) // if true anonymous object, or if VDF-anonymous-object
			return null; // return null, as the name would not be usable (note; this may not actually be true; should test it sometime)
		var rawType = typeof obj;
		if (rawType == "object") // if an object (i.e. a thing with real properties that could indicate a more specific type)
		{
			if (obj.realVTypeName)
				return obj.realVTypeName;
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
	static Deserialize(vdf: string, declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any): any
	{
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;
		if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions)
			{declaredTypeName = declaredTypeName_orLoadOptions; loadOptions = loadOptions_orDeclaredTypeName;}
		else
			{ declaredTypeName = loadOptions_orDeclaredTypeName; loadOptions = declaredTypeName_orLoadOptions; }
		return VDFLoader.ToVDFNode(vdf, declaredTypeName, loadOptions).ToObject(declaredTypeName, loadOptions);
	}
	static DeserializeInto(vdf: string, obj: object, loadOptions?: VDFLoadOptions): void { VDFLoader.ToVDFNode(vdf, VDF.GetVTypeNameOfObject(obj), loadOptions).IntoObject(obj, loadOptions); }
}

// helper classes
// ==================

class VDFUtils
{
	static MakePropertiesNonEnumerable(obj, alsoMakeFunctionsNonEnumerable: boolean = false)
	{
		for (var propName in obj)
		{
			var propDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
			if (propDescriptor)
			{
				propDescriptor.enumerable = false;
				Object.defineProperty(obj, propName, propDescriptor);
			}
			else if (alsoMakeFunctionsNonEnumerable && obj[propName] instanceof Function)
				VDFUtils.SetUpStashFields(obj, propName);
		}
	}
	static SetUpStashFields(obj, ...fieldNames)
	{
		if (!obj._stashFieldStore)
			Object.defineProperty(obj, "_stashFieldStore", { enumerable: false, value: {} });
		for (var i in fieldNames)
		(()=>{
			var propName = fieldNames[i];
			var origValue = obj[propName];
			Object.defineProperty(obj, propName,
			{
				enumerable: false,
				get: function() { return obj["_stashFieldStore"][propName]; },
				set: function(value) { obj["_stashFieldStore"][propName] = value; }
			});
			obj[propName] = origValue; // for 'stashing' a prop that was set beforehand
		})();
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
	realVTypeName: string;
	itemType: string;
	constructor(itemType: string, ...items: T[])
	{
		VDFUtils.SetUpStashFields(this, "innerArray", "realVTypeName", "itemType");
		this.realVTypeName = "List[" + itemType + "]";
		this.innerArray = [];
		for (var i in items)
			this.push(items[i]);
		this.itemType = itemType;
	}
	
	// Array standard property replications
	get length()
	{
		//return this.innerArray.length; // we can't just check internal array's length, since user may have 'added' items by calling "list[0] = value;"
		var highestIndex = -1;
		for (var propName in this)
			if (parseInt(propName) == propName && parseInt(propName) > highestIndex) // if integer key
				highestIndex = parseInt(propName);
		return highestIndex + 1;
	}

	// Array standard method replications
	private modifyInnerListWithCall(func, args?: any[])
	{
		for (var i = 0; i < this.innerArray.length; i++)
			delete this[i];
		var result = func.apply(this.innerArray, args);
		for (var i = 0; i < this.innerArray.length; i++) // copy all inner-array items as our own
			this[i] = this.innerArray[i];
		return result;
	}
	pop(): T { return this.modifyInnerListWithCall(Array.prototype.pop); }
	push(...items): number { return this.modifyInnerListWithCall(Array.prototype.push, items); }
	reverse() :T[] { return this.modifyInnerListWithCall(Array.prototype.reverse); }
	shift(): T { return this.modifyInnerListWithCall(Array.prototype.shift); }
	sort(compareFn?: (a: T, b: T) => number): T[] { return this.modifyInnerListWithCall(Array.prototype.sort, [compareFn]); }
	splice(start: number, deleteCount?: number, ...items: T[]): T[] { return this.modifyInnerListWithCall(Array.prototype.splice, deleteCount != null ? (<Array<any>>[start, deleteCount]).concat(items) : [start]); }
	unshift(...items: T[]): number { return this.modifyInnerListWithCall(Array.prototype.unshift, items); }
	concat(...args) { return Array.prototype.concat.apply(this.innerArray, args); }
	join(...args) { return Array.prototype.join.apply(this.innerArray, args); }
	slice(...args) { return Array.prototype.slice.apply(this.innerArray, args); }
	toString(...args) { return Array.prototype.toString.apply(this.innerArray, args); }
	toLocaleString(...args) { return Array.prototype.toLocaleString.apply(this.innerArray, args); }
	indexOf(...args) { return Array.prototype.indexOf.apply(this.innerArray, args); }
	lastIndexOf(...args) { return Array.prototype.lastIndexOf.apply(this.innerArray, args); }
	forEach(...args) { return Array.prototype.forEach.apply(this.innerArray, args); }
	every(...args) { return Array.prototype.every.apply(this.innerArray, args); }
	some(...args) { return Array.prototype.some.apply(this.innerArray, args); }
	filter(...args) { return Array.prototype.filter.apply(this.innerArray, args); }
	map(...args) { return Array.prototype.map.apply(this.innerArray, args); }
	reduce(...args) { return Array.prototype.reduce.apply(this.innerArray, args); }
	reduceRight(...args) { return Array.prototype.reduceRight.apply(this.innerArray, args); }

	// new properties
	get Count() { return this.length; }

	// new methods
	indexes()
	{
		var result = {};
		for (var i = 0; i < this.length; i++)
			result[i] = this[i];
		return result;
	}
	Add(...items): number { return this.push.apply(this, items); }
	AddRange(items: Array<T>)
	{
		for (var i = 0; i < items.length; i++)
			this.push(items[i]);
	}
	Remove(item: T) { this.splice(this.indexOf(item), 1); }
	Any(matchFunc)
	{
		for (var i in this.indexes())
			if (matchFunc(this[i]))
				return true;
		return false;
	}
	All(matchFunc)
	{
		for (var i in this.indexes())
			if (!matchFunc(this[i]))
				return false;
		return true;
	}
	First(matchFunc?): T
	{
		var result = this.FirstOrDefault(matchFunc);
		if (result == null)
			throw new Error("Matching item not found.");
		return result;
	}
	FirstOrDefault(matchFunc?): T
	{
		if (matchFunc)
		{
			for (var i in this.indexes())
				if (matchFunc(this[i]))
					return this[i];
			return null;
		}
		else
			return this[0];
	}
	Last(matchFunc?): T
	{
		var result = this.LastOrDefault(matchFunc);
		if (result == null)
			throw new Error("Matching item not found.");
		return result;
	}
	LastOrDefault(matchFunc?): T
	{
		if (matchFunc)
		{
			for (var i = this.length - 1; i >= 0; i--)
				if (matchFunc(this[i]))
					return this[i];
			return null;
		}
		else
			return this[this.length - 1];
	}
	GetRange(index: number, count: number): List<T>
	{
		var result = new List<T>(this.itemType);
		for (var i = index; i < index + count; i++)
			result.Add(this[i]);
		return result;
	}
	Contains(item: T) { return this.indexOf(item) != -1; }
}
VDFUtils.MakePropertiesNonEnumerable(List.prototype, true);
class Dictionary<K, V>
{
	realVTypeName: string;
	keyType: string;
	valueType: string;
	keys: any[];
	values: any[];
	constructor(keyType?: string, valueType?: string, ...keyValuePairs: Array<Array<any>>)
	{
		VDFUtils.SetUpStashFields(this, "realVTypeName", "keyType", "valueType", "keys", "values");
		this.realVTypeName = "Dictionary[" + keyType + "," + valueType + "]";
		this.keyType = keyType;
		this.valueType = valueType;
		this.keys = [];
		this.values = [];

		if (keyValuePairs)
			for (var i = 0; i < keyValuePairs.length; i++)
				this.Set(keyValuePairs[i][0], keyValuePairs[i][1]);
	}

	// properties
	get Count() { return this.keys.length; }

	// methods
	Get(key: K) { return this.values[this.keys.indexOf(key)]; }
	Set(key: K, value: V)
	{
		if (this.keys.indexOf(key) == -1)
		{
			this.keys.push(key);
			(<any>this)[key] = value; // make value accessible directly on Dictionary object
		}
		this.values[this.keys.indexOf(key)] = value;
	}
}
VDFUtils.MakePropertiesNonEnumerable(Dictionary.prototype, true);