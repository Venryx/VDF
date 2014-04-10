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
	/*static Deserialize<T>(vdf: string, loadOptions?: VDFLoadOptions): string
	{
		return VDFLoader.ToVDFNode(vdf, loadOptions).ToObject<T>(options);
	}*/
}

class EnumValue
{
	realVTypeName: string;
	intValue: number;
	stringValue: string;
	constructor(realVTypeName: string, intValue: number)
	{
		this.realVTypeName = realVTypeName;
		this.intValue = intValue;
		this.stringValue = eval(realVTypeName + "[" + intValue + "]");
	}
	toString() { return this.stringValue; }
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
}
function new_Dictionary<K, V>(keyType: string, valueType: string, ...keyValuePairs: Array<Array<any>>): Dictionary<K, V>
{
	var result: any = new Map<K, V>();
	result.AddItem("realVTypeName", "Dictionary[" + keyType + "," + valueType + "]");
	result.keyType = keyType;
	result.valueType = valueType;
	if (keyValuePairs)
		for (var i = 0; i < keyValuePairs.length; i++)
			result.set(keyValuePairs[i][0], keyValuePairs[i][1]);
	return result;
}

/*class List<T>
{
	itemType: string;
	data: T[];
	get length() { return this.data.length; }
	constructor(itemType: string, ...args: T[])
	{
		this.itemType = itemType;
		this.data = args || [];
	}
	
	toString(): string { return this.data.toString(); }
	toLocaleString(): string { return this.data.toLocaleString(); }
	//concat<U extends T[]>(...items: U[]): T[]
	//concat(...items: T[]): T[]
	concat(...items): T[] { return this.data.concat.apply(this, items); }
	join(separator?: string): string { return this.data.join.apply(separator); }
	pop(): T { return this.data.pop(); }
	push(...items: T[]): number { return this.data.push.apply(this.data, items); } // note; for some reason had to use 'this.data' instead of 'this'
	reverse(): T[] { return this.data.reverse(); }
	shift(): T { return this.data.shift(); }
	slice(start?: number, end?: number): T[] { return this.data.slice(start, end); }
	sort(compareFn?: (a: T, b: T) => number): T[] { return this.data.sort(compareFn); }
	//splice(start: number): T[] { return this.data.splice(start); }
	//splice(start: number, deleteCount: number, ...items: T[]): T[]
	splice(...args): T[] { return this.data.splice.apply(this, args); }
	unshift(...items: T[]): number { return this.data.unshift.apply(this, items); }
	indexOf(searchElement: T, fromIndex?: number): number { return this.data.indexOf(searchElement, fromIndex); }
	lastIndexOf(searchElement: T, fromIndex?: number): number { return this.data.lastIndexOf(searchElement, fromIndex); }
	every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean { return this.data.every(callbackfn, thisArg); }
	some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean { return this.data.some(callbackfn, thisArg); }
	forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void { return this.data.forEach(callbackfn, thisArg); }
	map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] { return this.data.map<U>(callbackfn, thisArg); }
	filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] { return this.data.filter(callbackfn, thisArg); }
	//reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T
	//reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
	reduce(...args) { return this.data.reduce.apply(this, args); }
	//reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T
	//reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U
	reduceRight(...args) { return this.data.reduceRight.apply(this, args); }
	[n: number]: T;

	contains(obj: T): boolean { return this.data.contains(obj); }
	last(): T { return this.data.last(); }
	pushAll(array) { return this.data.pushAll(array); }
	indexes(): number[] { return this.data.indexes(); }
	strings(): string[] { return this.data.strings(); }
	remove(obj: T) { return this.data.remove(obj); }
	//filter(matchFunc): T[] { return this.data.filter(matchFunc); }
	clear() { return this.data.clear(); }
	first(matchFunc?): T { return this.data.first(matchFunc); }
	insert(index: number, obj: T) { return this.data.insert(index, obj); }
}
class Dictionary<K, V> implements Map<K, V>
{
	itemType: string;
	data: Map<K, V>;
	get size() { return this.data.size; }
	constructor(itemType: string, data: Map<K, V>)
	{
		this.itemType = itemType;
		this.data = data;
	}

	clear() { this.data.clear(); }
	delete(key: K): boolean { return this.data.delete(key); }
	forEach(callbackFunc: (value: V, index: K, dictionary: Dictionary<K, V>) => void, thisArg?: any): void
	{
		this.data.forEach((value: V, key: K, map: Map<K, V>) => callbackFunc(value, key, this));
	}
	get(key: K): V { return this.data.get(key); }
	has(key: K): boolean { return this.data.has(key); }
	set(key: K, value: V): Map<K, V> { return this.data.set(key, value); }
}*/