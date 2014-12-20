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
	static SetUpHiddenFields(obj, addSetters?: boolean, ...fieldNames)
	{
		if (addSetters && !obj._hiddenFieldStore)
			Object.defineProperty(obj, "_hiddenFieldStore", {enumerable: false, value: {}});
		for (var i in fieldNames)
			(()=>{
				var propName = fieldNames[i];
				var origValue = obj[propName];
				if (addSetters)
					Object.defineProperty(obj, propName,
					{
						enumerable: false,
						get: ()=>obj["_hiddenFieldStore"][propName],
						set: value=>obj["_hiddenFieldStore"][propName] = value
					});
				else
					Object.defineProperty(obj, propName,
					{
						enumerable: false,
						value: origValue //get: ()=>obj["_hiddenFieldStore"][propName]
					});
				obj[propName] = origValue; // for 'hiding' a prop that was set beforehand
			})();
	}
	static MakePropertiesHidden(obj, alsoMakeFunctionsHidden?: boolean, addSetters?: boolean)
	{
		for (var propName in obj)
		{
			var propDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
			if (propDescriptor)
			{
				propDescriptor.enumerable = false;
				Object.defineProperty(obj, propName, propDescriptor);
			}
			else if (alsoMakeFunctionsHidden && obj[propName] instanceof Function)
				VDFUtils.SetUpHiddenFields(obj, addSetters, propName);
		}
	}
}
class StringBuilder
{
	public data: Array<string> = [];
	constructor(startData?: string)
	{
		if (startData)
			this.data.push(startData);
	}
	Append(str) { this.data.push(str); return this; } // adds string str to the StringBuilder
	Insert(index, str) { this.data.splice(index, 0, str); return this; } // inserts string 'str' at 'index'
	Remove(index, count) { this.data.splice(index, count || 1); return this; } // starting at 'index', removes specified number of elements (if not specified, count defaults to 1)
	Clear() { this.Remove(0, this.data.length); }
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

window["List"] = function List(itemType: string, ...items): void // actual constructor
{
	var self = Object.create(Array.prototype);
	self = (Array.apply(self, items) || self);
	self["__proto__"] = List.prototype; // makes "(new List()) instanceof List" be true
	self.constructor = List; // makes "(new List()).constructor == List" be true
	self.realVTypeName = "List[" + itemType + "]";
	self.itemType = itemType;
	return self;
};
(()=> // actual properties and methods
{
	var self = List.prototype;
	self["__proto__"] = Array.prototype; // makes "(new List()) instanceof Array" be true

	// new properties
	Object.defineProperty(self, "Count", { enumerable: false, get: function() { return this.length; } });

	// new methods
	self.indexes = function()
	{
		var result = {};
		for (var i = 0; i < this.length; i++)
			result[i] = this[i];
		return result;
	};
	self.Add = function(...items) { return this.push.apply(this, items); };
	self.AddRange = function(items)
	{
		for (var i = 0; i < items.length; i++)
			this.push(items[i]);
	};
	self.Insert = function(index, item) { return this.splice(index, 0, item); };
	self.Remove = function(item) { this.RemoveAt(this.indexOf(item)); };
	self.RemoveAt = function(index) { this.splice(index, 1); };
	self.Any = function(matchFunc)
	{
		for (var i in this.indexes())
			if (matchFunc.call(this[i], this[i]))
				return true;
		return false;
	};
	self.All = function(matchFunc)
	{
		for (var i in this.indexes())
			if (!matchFunc.call(this[i], this[i]))
				return false;
		return true;
	};
	self.First = function(matchFunc)
	{
		var result = this.FirstOrDefault(matchFunc);
		if (result == null)
			throw new Error("Matching item not found.");
		return result;
	};
	self.FirstOrDefault = function(matchFunc)
	{
		if (matchFunc)
		{
			for (var i in this.indexes())
				if (matchFunc.call(this[i], this[i]))
					return this[i];
			return null;
		}
		else
			return this[0];
	};
	self.Last = function(matchFunc)
	{
		var result = this.LastOrDefault(matchFunc);
		if (result == null)
			throw new Error("Matching item not found.");
		return result;
	};
	self.LastOrDefault = function(matchFunc)
	{
		if (matchFunc)
		{
			for (var i = this.length - 1; i >= 0; i--)
				if (matchFunc.call(this[i], this[i]))
					return this[i];
			return null;
		} else
			return this[this.length - 1];
	};
	self.GetRange = function(index, count)
	{
		var result = new List(this.itemType);
		for (var i = index; i < index + count; i++)
			result.Add(this[i]);
		return result;
	};
	self.Contains = function(item) { return this.indexOf(item) != -1; };
})();
declare var List: // static/constructor declaration stuff
{
	new <T>(itemType: string, ...items: T[]): List<T>;
	prototype: List<any>;
}
interface List<T> extends Array<T> // class/instance declaration stuff
{
	// new properties
	realVTypeName: string;
	itemType: string;
	Count: number;

	// new methods
	indexes(): any;
	Add(...items): number;
	AddRange(items: Array<T>): void;
	Insert(index, item): void;
	Remove(item: T): void;
	RemoveAt(index: number): void;
	Any(matchFunc): boolean;
	All(matchFunc): boolean;
	First(matchFunc?): T;
	FirstOrDefault(matchFunc?): T;
	Last(matchFunc?): T;
	LastOrDefault(matchFunc?): T;
	GetRange(index: number, count: number): List<T>;
	Contains(item: T): boolean;
}

class Dictionary<K, V>
{
	realVTypeName: string;
	keyType: string;
	valueType: string;
	keys: any[];
	values: any[];
	constructor(keyType?: string, valueType?: string, ...keyValuePairs: Array<Array<any>>)
	{
		VDFUtils.SetUpHiddenFields(this, true, "realVTypeName", "keyType", "valueType", "keys", "values");
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
	ContainsKey(key: K) { return this.keys.indexOf(key) != -1; }
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
	Add(key: K, value: V)
	{
		if (this.Get(key) != undefined)
			throw new Error("Dictionary already contains key '" + key + "'.");
		this.Set(key, value);
	}
}
VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);