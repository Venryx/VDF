// init
// ==========

interface Object
{
	_AddProperty(name: string, value): void;
}
// the below lets you easily add non-enumerable properties
Object.defineProperty(Object.prototype, "_AddProperty",
{
	enumerable: false,
	value: function(name, value)
	{
		Object.defineProperty(this, name,
		{
			enumerable: false,
			value: value
		});
	}
});

interface String
{
	Contains(str: string): boolean;
	StartsWith(str: string): boolean;
	EndsWith(str: string): boolean;
	TrimStart(chars: Array<string>): string;
}
String.prototype._AddProperty("Contains", function(str) { return this.indexOf(str) != -1; });
String.prototype._AddProperty("StartsWith", function(str) { return this.indexOf(str) == 0; });
String.prototype._AddProperty("EndsWith", function(str)
{
	var expectedPos = this.length - str.length;
	return this.indexOf(str, expectedPos) == expectedPos;
});
String.prototype._AddProperty("TrimStart", function(chars: Array<string>)
{
	var result = "";
	for (var i = 0; i < this.length; i++)
		if (!chars.Contains(this[i]))
			result += this[i];
	return result;
});
interface Array<T>
{
	Contains(str: T): boolean;
}
Array.prototype._AddProperty("Contains", function(item) { return this.indexOf(item) != -1; });

// classes
// ==========

class VDF
{
	// for use with VDFSaveOptions
	static AnyMember: string = "#AnyMember";
	static AllMembers: Array<string> = ["#AnyMember"];

	// for use with VDFType
	static PropRegex_Any = ""; //"^.+$";

	// for use with VDFSerialize/VDFDeserialize methods
	static NoActionTaken; //= new VDFNode(); // workaround: initialization moved to VDFNode class file

	// v-name examples: "List(string)", "System.Collections.Generic.List(string)", "Dictionary(string string)"
	static GetGenericArgumentsOfType(typeName: string): string[]
	{
		var genericArgumentTypes = new Array<string>(); //<string[]>[];
		var depth = 0;
		var lastStartBracketPos = -1;
		if (typeName != null)
			for (var i = 0; i < typeName.length; i++)
			{
				var ch = typeName[i];
				if (ch == ')')
					depth--;
				if ((depth == 0 && ch == ')') || (depth == 1 && ch == ' '))
					genericArgumentTypes.push(typeName.substring(lastStartBracketPos + 1, i)); // get generic-parameter type-str
				if ((depth == 0 && ch == '(') || (depth == 1 && ch == ' '))
					lastStartBracketPos = i;
				if (ch == '(')
					depth++;
			}
		return genericArgumentTypes;
	}

	static GetIsTypePrimitive(typeName: string): boolean // (technically strings are not primitives in C#, but we consider them such)
		{ return ["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "bool", "char", "string"].Contains(typeName); }
	static GetIsTypeAnonymous(typeName: string): boolean { return typeName != null && typeName == "object"; }
	static GetTypeNameOfObject(obj)
	{
		var rawType = typeof obj;
		if (rawType == "object") // if an object (i.e. a thing with real properties that could indicate a more specific type)
		{
			if (obj.realTypeName)
				return obj.realTypeName;
			var nativeTypeName = obj.constructor.name;
			/*if (nativeTypeName == "Boolean")
				return "bool";
			if (nativeTypeName == "Number")
				return obj.toString().Contains(".") ? "double" : "int";
			if (nativeTypeName == "String")
				return "string";*/
			if (nativeTypeName == "Object") // if anonymous-object
				return "object";
			return nativeTypeName;
		}
		if (rawType == "boolean")
			return "bool";
		if (rawType == "number")
			return obj.toString().Contains(".") ? "double" : "int";
		if (rawType == "string")
			return "string";
		//return rawType; // string
		//return null;
		//return "object"; // consider objects with raw-types of undefined, function, etc. to just be anonymous-objects
		return "object"; // consider everything else to be an anonymous-object
	}

	static Serialize(obj: any, options: VDFSaveOptions): string;
	static Serialize(obj: any, declaredTypeName?: string, saveOptions?: VDFSaveOptions): string;
	static Serialize(obj: any, declaredTypeName_orOptions?: any, options_orNothing?: any): string
	{
		if (declaredTypeName_orOptions instanceof VDFSaveOptions)
			return VDF.Serialize(obj, null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;
		var options: VDFSaveOptions = options_orNothing;
		
		return VDFSaver.ToVDFNode(obj, declaredTypeName, options).ToVDF(options);
	}
	static Deserialize(vdf: string, options: VDFLoadOptions): any;
	static Deserialize(vdf: string, declaredTypeName?: string, options?: VDFLoadOptions): any;
	static Deserialize(vdf: string, declaredTypeName_orOptions?: any, options_orNothing?: any): any
	{
		if (declaredTypeName_orOptions instanceof VDFLoadOptions)
			return VDF.Deserialize(vdf, null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;
		var options: VDFLoadOptions = options_orNothing;
		return VDFLoader.ToVDFNode(vdf, declaredTypeName, options).ToObject(declaredTypeName, options);
	}
	static DeserializeInto(vdf: string, obj: any, options?: VDFLoadOptions): void { VDFLoader.ToVDFNode(vdf, VDF.GetTypeNameOfObject(obj), options).IntoObject(obj, options); }
}

// helper classes
// ==================

/*class VDFUtils
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
}*/
class StringBuilder
{
	public data: Array<string> = [];
	public Length: number = 0;
	constructor(startData?: string)
	{
		if (startData)
		{
			this.data.push(startData);
			this.Length += startData.length;
		}
	}
	Append(str) { this.data.push(str); this.Length += str.length; return this; } // adds string str to the StringBuilder
	Insert(index, str) { this.data.splice(index, 0, str); this.Length += str.length; return this; } // inserts string 'str' at 'index'
	Remove(index, count) // starting at 'index', removes specified number of elements (if not specified, count defaults to 1)
	{
		var removedItems = this.data.splice(index, count || 1);
		for (var i = 0; i < removedItems.length; i++)
			this.Length -= removedItems[i].length;
		return this;
	}
	Clear() { this.Remove(0, this.data.length); }
	ToString(joinerString?) { return this.data.join(joinerString || ""); } // builds the string
}

// tags
// ----------

function PropDeclarationWrapper(type, propName, propType, tags)
{
	var s = this;
	s.type = type;
	s.propName = propName;
	s.propType = propType;
	s.tags = tags;
};
PropDeclarationWrapper.prototype._AddSetter_Inline = function set(value)
{
	var s = this;
	var typeInfo = VDFTypeInfo.Get(s.type.name);

	var propTag: any = {};
	for (var i in s.tags)
		if (s.tags[i] instanceof VDFProp)
			propTag = s.tags[i];
	typeInfo.props[this.propName] = new VDFPropInfo(s.propName, s.propType, s.tags, propTag);
};
function Prop(type, propName, propType, ...tags) { return new PropDeclarationWrapper(type instanceof Function ? type : type.constructor, propName, propType, tags); };

function MethodDeclarationWrapper(tags) { this.tags = tags; };
MethodDeclarationWrapper.prototype._AddSetter_Inline = function set(method) { method.methodInfo = new VDFMethodInfo(this.tags); };
function Method(...tags) { return new MethodDeclarationWrapper(tags); };

function TypeDeclarationWrapper(tags) { this.tags = tags; };
TypeDeclarationWrapper.prototype._AddSetter_Inline = function set(type)
{
	var s = this;
	type = type instanceof Function ? type : type.constructor;
	var typeInfo = VDFTypeInfo.Get(type.name);

	var typeTag: any = {};
	for (var i in s.tags)
		if (s.tags[i] instanceof VDFType)
			typeTag = s.tags[i];
	typeInfo.tags = s.tags;
	typeInfo.typeTag.AddDataOf(typeTag);
};
function Type(...tags) { return new TypeDeclarationWrapper(tags); };

// VDF-usable data wrappers
// ==========

//class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
// for anonymous objects (JS anonymous-objects are all just instances of Object, so we don't lose anything by attaching type-info to the shared constructor)
//var object = Object;
//object["typeInfo"] = new VDFTypeInfo(null, true);
class object {} // just an alias for Object, to be consistent with C# version

class EnumValue
{
	realTypeName: string; // prop-name is special; used to identify 'true' or 'represented' type of object
	//intValue: number;
	stringValue: string;
	constructor(enumTypeName: string, intValue: number)
	{
		this.realTypeName = enumTypeName;
		//this.intValue = intValue;
		this.stringValue = EnumValue.GetEnumStringForIntValue(enumTypeName, intValue);
	}
	toString() { return this.stringValue; }

	static IsEnum(typeName: string): boolean { return window[typeName] && window[typeName]["_IsEnum"] === 0; }
	//static IsEnum(typeName: string): boolean { return window[typeName] && /}\)\((\w+) \|\| \(\w+ = {}\)\);/.test(window[typeName].toString()); }
	static GetEnumIntForStringValue(enumTypeName: string, stringValue: string) { return eval(enumTypeName + "[\"" + stringValue + "\"]"); }
	static GetEnumStringForIntValue(enumTypeName: string, intValue: number) { return eval(enumTypeName + "[" + intValue + "]"); }
}

window["List"] = function List(itemType: string, ...items): void // actual constructor
{
	var self = Object.create(Array.prototype);
	self = (Array.apply(self, items) || self);
	self["__proto__"] = List.prototype; // makes "(new List()) instanceof List" be true
	self.constructor = List; // makes "(new List()).constructor == List" be true
	self.realTypeName = "List(" + itemType + ")";
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
	self.Indexes = function()
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
		for (var i in this.Indexes())
			if (matchFunc.call(this[i], this[i]))
				return true;
		return false;
	};
	self.All = function(matchFunc)
	{
		for (var i in this.Indexes())
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
			for (var i in this.Indexes())
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
	new <T>(itemType?: string, ...items: T[]): List<T>;
	prototype: List<any>;
}
interface List<T> extends Array<T> // class/instance declaration stuff
{
	// new properties
	realTypeName: string;
	itemType: string;
	Count: number;

	// new methods
	Indexes(): any;
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
	realTypeName: string;
	keyType: string;
	valueType: string;
	private keys: K[];
	private values: V[];
	constructor(keyType?: string, valueType?: string, keyValuePairsObj?)
	{
		//VDFUtils.SetUpHiddenFields(this, true, "realTypeName", "keyType", "valueType", "keys", "values");
		this.realTypeName = "Dictionary(" + keyType + " " + valueType + ")";
		this.keyType = keyType;
		this.valueType = valueType;
		this.keys = [];
		this.values = [];

		if (keyValuePairsObj)
			for (var key in keyValuePairsObj)
				this.Set(key, keyValuePairsObj[key]);
	}

	// properties
	get Keys()
	{
		var result = {};
		for (var i = 0; i < this.keys.length; i++)
			result[<any>this.keys[i]] = null;
		return result;
	}
	get Count() { return this.keys.length; }

	// methods
	ContainsKey(key: K) { return this.keys.indexOf(key) != -1; }
	Get(key: K) { return this.values[this.keys.indexOf(key)]; }
	Set(key: K, value: V)
	{
		if (this.keys.indexOf(key) == -1)
			this.keys.push(key);
		this.values[this.keys.indexOf(key)] = value;
		(<any>this)[key] = value; // make value accessible directly on Dictionary object
	}
	Add(key: K, value: V)
	{
		if (this.keys.indexOf(key) != -1)
			throw new Error("Dictionary already contains key '" + key + "'.");
		this.Set(key, value);
	}
	Remove(key: K)
	{
		var itemIndex = this.keys.indexOf(key);
		this.keys.splice(itemIndex, 1);
		this.values.splice(itemIndex, 1);
		delete (<any>this)[key];
	}
}
//VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);