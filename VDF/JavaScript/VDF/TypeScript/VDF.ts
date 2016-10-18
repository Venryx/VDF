// vdf globals
// ==========

var g = <any>window;
g.Log = g.Log || console.log;
g.Assert = g.Assert || ((condition, message)=> {
	if (condition) return;
	console.assert(false, message || "");
	debugger;
});

// init
// ==========

interface Object {
	_AddProperty(name: string, value): void;
}
// the below lets you easily add non-enumerable properties
Object.defineProperty(Object.prototype, "_AddProperty", {
	enumerable: false,
	value: function(name, value) {
		Object.defineProperty(this, name, {
			enumerable: false,
			value: value
		});
	}
});

interface String {
	Contains(str: string): boolean;
	StartsWith(str: string): boolean;
	EndsWith(str: string): boolean;
	TrimStart(chars: Array<string>): string;
}
String.prototype._AddProperty("Contains", function(str) { return this.indexOf(str) != -1; });
String.prototype._AddProperty("StartsWith", function(str) { return this.indexOf(str) == 0; });
String.prototype._AddProperty("EndsWith", function(str) {
	var expectedPos = this.length - str.length;
	return this.indexOf(str, expectedPos) == expectedPos;
});
String.prototype._AddProperty("TrimStart", function(chars: Array<string>) {
	var result = "";
	var doneTrimming = false;
	for (var i = 0; i < this.length; i++)
		if (!chars.Contains(this[i]) || doneTrimming)
		{
			result += this[i];
			doneTrimming = true;
		}
	return result;
});

interface Array<T> {
	Contains(str: T): boolean;
	Where(matchFunc: Function): T[];
	First(matchFunc: Function): T;
}
if (!Array.prototype["Contains"])
	Array.prototype._AddProperty("Contains", function(item) { return this.indexOf(item) != -1; });
if (!Array.prototype["Where"])
	Array.prototype._AddProperty("Where", function(matchFunc = (()=>true)) {
		var result = this instanceof List ? new List(this.itemType) : [];
		for (let item of this)
			if (matchFunc.call(item, item)) // call, having the item be "this", as well as the first argument
				result[this instanceof List ? "Add" : "push"](item);
		return result;
	});
if (!Array.prototype["First"])
	Array.prototype._AddProperty("First", function(matchFunc = (()=>true)) { return this.Where(matchFunc)[0]; });

interface Function {
	AddTags(...tags: any[]): string;
	//IsDerivedFrom(baseType: Function): boolean;
}
Function.prototype._AddProperty("AddTags", function(...tags) {
	if (this.tags == null)
		this.tags = new List("object");
	for (var i = 0; i < tags.length; i++)
		this.tags.push(tags[i]);
	return this;
});
/*Function.prototype._AddProperty("IsDerivedFrom", function(baseType) {
	if (baseType == null)
		return false;
	var currentDerived = this.prototype;
	while (currentDerived.__proto__)	{
		if (currentDerived == baseType.prototype)
			return true;
		currentDerived = currentDerived.__proto__;
	}
	return false;
});*/

// classes
// ==========

class VDFNodePathNode {
	obj: any;

	// if not root (i.e. a child/descendant)
	prop: VDFPropInfo; //string propName;
	list_index: Number = null;
	map_keyIndex: Number = null;
	map_key: any;

	constructor(obj = null, prop: VDFPropInfo = null, list_index: Number = null, map_keyIndex: Number = null, map_key = null) {
		this.obj = obj;
		this.prop = prop;
		this.list_index = list_index;
		this.map_keyIndex = map_keyIndex;
		this.map_key = map_key;
	}

	Clone(): VDFNodePathNode { return new VDFNodePathNode(this.obj, this.prop, this.list_index, this.map_keyIndex, this.map_key); }

	// for debugging
	toString() {
		if (this.list_index != null)
			return "i:" + this.list_index;
		if (this.map_keyIndex != null)
			return "ki:" + this.map_keyIndex;
		if (this.map_key != null)
			return "k:" + this.map_key;
		if (this.prop != null)
			//return "p:" + this.prop.name;
			return this.prop.name;
		return "";
	}
}
class VDFNodePath {
	nodes: List<VDFNodePathNode>;
	constructor(nodes: List<VDFNodePathNode>);
	constructor(rootNode: VDFNodePathNode);
	constructor(nodes_orRootNode) {
		if (nodes_orRootNode instanceof Array)
			this.nodes = List.apply(null, ["VDFNodePathNode"].concat(nodes_orRootNode));
		else
			this.nodes = new List<VDFNodePathNode>("VDFNodePathNode", nodes_orRootNode);
	}

	get rootNode() { return this.nodes.First(); }
	get parentNode() { return this.nodes.length >= 2 ? this.nodes[this.nodes.length - 2] : null; }
	get currentNode() { return this.nodes.Last(); }

	ExtendAsListItem(index: number, obj) {
		var newNodes = this.nodes.Select<VDFNodePathNode>(a=> a.Clone(), "VDFNodePathNode");
		newNodes.Add(new VDFNodePathNode(obj, null, index));
		return new VDFNodePath(newNodes);
	}
	ExtendAsMapKey(keyIndex, obj) {
		var newNodes = this.nodes.Select<VDFNodePathNode>(a=> a.Clone(), "VDFNodePathNode");
		newNodes.Add(new VDFNodePathNode(obj, null, null, keyIndex));
		return new VDFNodePath(newNodes);
	}
	ExtendAsMapItem(key, obj) {
		var newNodes = this.nodes.Select<VDFNodePathNode>(a=> a.Clone(), "VDFNodePathNode");
		newNodes.Add(new VDFNodePathNode(obj, null, null, null, key));
		return new VDFNodePath(newNodes);
	}
	ExtendAsChild(prop: VDFPropInfo, obj) {
		var newNodes = this.nodes.Select<VDFNodePathNode>(a=>a.Clone(), "VDFNodePathNode");
		newNodes.Add(new VDFNodePathNode(obj, prop));
		return new VDFNodePath(newNodes);
	}

	// for debugging
	toString() {
		var result = "";
		var index = 0;
		for (let node of this.nodes)
			result += (index++ == 0 ? "" : "/") + node;
		return result;
	}
}

class VDF {
	// for use with VDFSaveOptions
	static AnyMember: string = "#AnyMember";
	static AllMembers: Array<string> = ["#AnyMember"];

	// for use with VDFType
	static PropRegex_Any = ""; //"^.+$";

	// for use with VDFSerialize/VDFDeserialize methods
	//static Undefined; //= new VDFNode(); // JS doesn't need this; it just uses its native "undefined" pseudo-keyword
	static CancelSerialize; //= new VDFNode();

	// v-name examples: "List(string)", "System.Collections.Generic.List(string)", "Dictionary(string string)"
	static GetGenericArgumentsOfType(typeName: string): string[] {
		var genericArgumentTypes = new Array<string>(); //<string[]>[];
		var depth = 0;
		var lastStartBracketPos = -1;
		if (typeName != null)
			for (var i = 0; i < typeName.length; i++) {
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
	static IsTypeXDerivedFromY(xTypeName: string, yTypeName: string) {
		if (xTypeName == null || yTypeName == null || window[xTypeName] == null || window[yTypeName] == null)
			return false;
		var currentDerived = window[xTypeName].prototype;
		while (currentDerived.__proto__) {
			if (currentDerived == window[yTypeName].prototype)
				return true;
			currentDerived = currentDerived.__proto__;
		}
		return false;
	}

	static GetIsTypePrimitive(typeName: string): boolean // (technically strings are not primitives in C#, but we consider them such)
		{ return ["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "bool", "char", "string"].Contains(typeName); }
	static GetIsTypeAnonymous(typeName: string): boolean { return typeName != null && typeName == "object"; }
	static GetTypeNameOfObject(obj) {
		var rawType = typeof obj;
		if (rawType == "object") { // if an object (i.e. a thing with real properties that could indicate a more specific type)
			if (obj.realTypeName)
				return obj.realTypeName;
			if (obj.itemType)
				return "List(" + obj.itemType + ")";
			var nativeTypeName = obj.constructor.name_fake || obj.constructor.name || null;
			if (nativeTypeName == "Boolean")
				return "bool";
			if (nativeTypeName == "Number")
				return obj.toString().Contains(".") ? "double" : "int";
			if (nativeTypeName == "String")
				return "string";
			if (nativeTypeName == "Object") // if anonymous-object
				return "object";
			if (nativeTypeName == "Array")
				return "List(object)";
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
	static GetTypeNameRoot(typeName) { return typeName != null && typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName; }

	static GetClassProps(type, allowGetFromCache = false): any {
		if (type == null) return {};
		if (type.classPropsCache == null || !allowGetFromCache) {
			var result = {};
			var currentType = type;
			while (currentType && currentType != Object) {
				// get static props on constructor itself
				for (let propName of Object.getOwnPropertyNames(currentType)) {
					if (propName in result) continue;
					let propInfo = Object.getOwnPropertyDescriptor(currentType, propName);
					// don't include if prop is a getter or setter func (causes problems when enumerating)
					if (propInfo == null || (propInfo.get == null && propInfo.set == null))
						result[propName] = currentType[propName];
				}
				// get "real" props on the prototype-object
				for (let propName of Object.getOwnPropertyNames(currentType.prototype)) {
					if (propName in result) continue;
					let propInfo = Object.getOwnPropertyDescriptor(currentType.prototype, propName);
					// don't include if prop is a getter or setter func (causes problems when enumerating)
					if (propInfo == null || (propInfo.get == null && propInfo.set == null))
						result[propName] = currentType.prototype[propName];
				}
				currentType = Object.getPrototypeOf(currentType.prototype).constructor;
			}
			type.classPropsCache = result;
		}
        return type.classPropsCache;
	}
	static GetObjectProps(obj): any {
		if (obj == null) return {};
		var result = VDF.GetClassProps(obj.constructor);
        for (let propName in obj)
            result[propName] = null;
        return result;
	}

	static Serialize(obj: any, options: VDFSaveOptions): string;
	static Serialize(obj: any, declaredTypeName?: string, saveOptions?: VDFSaveOptions): string;
	static Serialize(obj: any, declaredTypeName_orOptions?: any, options_orNothing?: any): string {
		if (declaredTypeName_orOptions instanceof VDFSaveOptions)
			return VDF.Serialize(obj, null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;
		var options: VDFSaveOptions = options_orNothing;
		
		return VDFSaver.ToVDFNode(obj, declaredTypeName, options).ToVDF(options);
	}
	static Deserialize(vdf: string, options: VDFLoadOptions): any;
	static Deserialize(vdf: string, declaredTypeName?: string, options?: VDFLoadOptions): any;
	static Deserialize(vdf: string, declaredTypeName_orOptions?: any, options_orNothing?: any): any {
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

class VDFUtils
{
	/*static SetUpHiddenFields(obj, addSetters?: boolean, ...fieldNames) 	{
		if (addSetters && !obj._hiddenFieldStore)
			Object.defineProperty(obj, "_hiddenFieldStore", {enumerable: false, value: {}});
		for (var i in fieldNames)
			(()=>{
				var propName = fieldNames[i];
				var origValue = obj[propName];
				if (addSetters)
					Object.defineProperty(obj, propName, 					{
						enumerable: false,
						get: ()=>obj["_hiddenFieldStore"][propName],
						set: value=>obj["_hiddenFieldStore"][propName] = value
					});
				else
					Object.defineProperty(obj, propName, 					{
						enumerable: false,
						value: origValue //get: ()=>obj["_hiddenFieldStore"][propName]
					});
				obj[propName] = origValue; // for 'hiding' a prop that was set beforehand
			})();
	}*/
	static MakePropertiesHidden(obj, alsoMakeFunctionsHidden?: boolean, addSetters?: boolean) {
		for (var propName in obj) {
			var propDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
			if (propDescriptor) {
				propDescriptor.enumerable = false;
				Object.defineProperty(obj, propName, propDescriptor);
			}
			//else if (alsoMakeFunctionsHidden && obj[propName] instanceof Function)
			//	VDFUtils.SetUpHiddenFields(obj, addSetters, propName);
		}
	}
}
class StringBuilder implements Array<string> {
	public Length: number = 0;
	constructor(startData?: string) {
		if (startData)
			this.Append(startData);
	}
	Append(str) { this.push(str); this.Length += str.length; return this; } // adds string str to the StringBuilder
	Insert(index, str) { this.splice(index, 0, str); this.Length += str.length; return this; } // inserts string 'str' at 'index'
	Remove(index, count) { // starting at 'index', removes specified number of elements (if not specified, count defaults to 1)
		var removedItems = this.splice(index, count != null ? count : 1);
		for (var i = 0; i < removedItems.length; i++)
			this.Length -= removedItems[i].length;
		return this;
	}
	Clear() {
		//this.splice(0, this.length);
		this.length = 0;
		this.Length = 0;
	}
	ToString(joinerString?) { return this.join(joinerString || ""); } // builds the string

	// fakes
	length: number;
    toString(...args: any[]) { return null; }
    toLocaleString(...args: any[]) { return null; }
    push(...args: any[]) { return null; }
    pop(...args: any[]) { return null; }
    concat(...args: any[]) { return null; }
    join(...args: any[]) { return null; }
    reverse(...args: any[]) { return null; }
    shift(...args: any[]) { return null; }
    slice(...args: any[]) { return null; }
    sort(...args: any[]) { return null; }
    splice(...args: any[]) { return null; }
    unshift(...args: any[]) { return null; }
    indexOf(...args: any[]) { return null; }
    lastIndexOf(...args: any[]) { return null; }
    every(...args: any[]) { return null; }
    some(...args: any[]) { return null; }
    forEach(...args: any[]) { return null; }
    map<U>(...args: any[]) { return null; }
    filter(...args: any[]) { return null; }
    reduce(...args: any[]) { return null; }
    reduceRight(...args: any[]) { return null; }
	[n: number]: string;

	// fakes for extended members
	Contains(...args: any[]) { return null; }
	Where(...args: any[]) { return null; }
	First(...args: any[]) { return null; }
}
(() => {
	StringBuilder.prototype["__proto__"] = Array.prototype; // makes "(new StringBuilder()) instanceof Array" be true
	var reachedFakes = false;
	for (var name in StringBuilder.prototype) {
		if (name == "toString")
			reachedFakes = true;
		if (reachedFakes)
			StringBuilder.prototype[name] = Array.prototype[name];
	}
})();

// tags
// ----------

class PropDeclarationWrapper {
	set set(value) {}
}
// maybe make-so: this is renamed PropInfo
function Prop(typeOrObj, propName, propType_orFirstTag, ...tags) {
	if (propType_orFirstTag != null && typeof propType_orFirstTag != "string")
		return Prop.apply(this, [typeOrObj, propName, null, propType_orFirstTag].concat(tags));

	var type = typeOrObj instanceof Function ? typeOrObj : typeOrObj.constructor;
	var propType = propType_orFirstTag;

	var typeInfo = VDFTypeInfo.Get(type);
	if (typeInfo.props[propName] == null)
		typeInfo.props[propName] = new VDFPropInfo(propName, propType, tags);

	return new PropDeclarationWrapper();
};

/*function MethodDeclarationWrapper(tags) { this.tags = tags; };
MethodDeclarationWrapper.prototype._AddSetter_Inline = function set(method) { method.methodInfo = new VDFMethodInfo(this.tags); };
function Method(...tags) { return new MethodDeclarationWrapper(tags); };*/

function TypeDeclarationWrapper(tags) { this.tags = tags; };
TypeDeclarationWrapper.prototype._AddSetter_Inline = function set(type) {
	var s = this;
	type = type instanceof Function ? type : type.constructor;
	var typeInfo = VDFTypeInfo.Get(type.name_fake || type.name);

	var typeTag: any = {};
	for (var i in s.tags)
		if (s.tags[i] instanceof VDFType)
			typeTag = s.tags[i];
	typeInfo.tags = s.tags;
	typeInfo.typeTag.AddDataOf(typeTag);
};
function TypeInfo(...tags) { return new TypeDeclarationWrapper(tags); };

// VDF-usable data wrappers
// ==========

//class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
// for anonymous objects (JS anonymous-objects are all just instances of Object, so we don't lose anything by attaching type-info to the shared constructor)
//var object = Object;
//object["typeInfo"] = new VDFTypeInfo(null, true);
class object {} // just an alias for Object, to be consistent with C# version

class EnumValue {
	realTypeName: string; // prop-name is special; used to identify 'true' or 'represented' type of object
	//intValue: number;
	stringValue: string;
	constructor(enumTypeName: string, intValue: number) {
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

window["List"] = function List(itemType: string, ...items): void { // actual constructor
	var s = Object.create(Array.prototype);
	s = (Array.apply(s, items) || s);
	s["__proto__"] = List.prototype; // makes "(new List()) instanceof List" be true
	//self.constructor = List; // makes "(new List()).constructor == List" be true
	//Object.defineProperty(self, "constructor", {enumerable: false, value: List});
	//self.realTypeName = "List(" + itemType + ")";
	//Object.defineProperty(self, "realTypeName", {enumerable: false, value: "List(" + itemType + ")"});
	//self.itemType = itemType;
	Object.defineProperty(s, "itemType", {enumerable: false, value: itemType});
	return s;
};
(()=> { // actual properties and methods
	var s = List.prototype;
	s["__proto__"] = Array.prototype; // makes "(new List()) instanceof Array" be true

	// new properties
	Object.defineProperty(s, "Count", {enumerable: false, get: function() { return this.length; }});

	// new methods
	s.Indexes = function () {
		var result = {};
		for (var i = 0; i < this.length; i++)
			result[i] = this[i];
		return result;
	};
	s.Add = function (...items) { return this.push.apply(this, items); };
	s.AddRange = function (items) {
		for (var i = 0; i < items.length; i++)
			this.push(items[i]);
	};
	s.Insert = function(index, item) { return this.splice(index, 0, item); };
	s.InsertRange = function(index, items) { return this.splice.apply(this, [index, 0].concat(items)); };
	s.Remove = function(item) { this.RemoveAt(this.indexOf(item)); };
	s.RemoveAt = function(index) { this.splice(index, 1); };
	s.RemoveRange = function(index, count) { return this.splice(index, count); };
	s.Any = function(matchFunc) {
		for (var i in this.Indexes())
			if (matchFunc.call(this[i], this[i]))
				return true;
		return false;
	};
	s.All = function(matchFunc) {
		for (var i in this.Indexes())
			if (!matchFunc.call(this[i], this[i]))
				return false;
		return true;
	};
	s.Select = function(selectFunc, itemType) {
		var result = new List(itemType || "object");
		for (var i in this.Indexes())
			result.Add(selectFunc.call(this[i], this[i]));
		return result;
	};
	s.First = function(matchFunc) {
		var result = this.FirstOrDefault(matchFunc);
		if (result == null)
			throw new Error("Matching item not found.");
		return result;
	};
	s.FirstOrDefault = function(matchFunc) {
		if (matchFunc) {
			for (var i in this.Indexes())
				if (matchFunc.call(this[i], this[i]))
					return this[i];
			return null;
		}
		else
			return this[0];
	};
	s.Last = function(matchFunc) {
		var result = this.LastOrDefault(matchFunc);
		if (result == null)
			throw new Error("Matching item not found.");
		return result;
	};
	s.LastOrDefault = function(matchFunc) {
		if (matchFunc) {
			for (var i = this.length - 1; i >= 0; i--)
				if (matchFunc.call(this[i], this[i]))
					return this[i];
			return null;
		}
		else
			return this[this.length - 1];
	};
	s.GetRange = function(index, count) {
		var result = new List(this.itemType);
		for (var i = index; i < index + count; i++)
			result.Add(this[i]);
		return result;
	};
	s.Contains = function(item) { return this.indexOf(item) != -1; };
	VDFUtils.MakePropertiesHidden(s, true);
})();
declare var List: { // static/constructor declaration stuff
	new <T>(itemType?: string, ...items: T[]): List<T>;
	prototype: List<any>;
}
interface List<T> extends Array<T> { // class/instance declaration stuff
	// new properties
	//realTypeName: string;
	itemType: string;
	Count: number;

	// new methods
	Indexes(): any;
	Add(...items): number;
	AddRange(items: Array<T>): void;
	Insert(index, item): void;
	InsertRange(index: number, items: Array<T>): void;
	Remove(item: T): void;
	RemoveAt(index: number): void;
	RemoveRange(index: number, count: number): void;
	Any(matchFunc): boolean;
	All(matchFunc): boolean;
	Select<T>(selectFunc: Function, itemType?: string): List<T>;
	First(matchFunc?): T;
	FirstOrDefault(matchFunc?): T;
	Last(matchFunc?): T;
	LastOrDefault(matchFunc?): T;
	GetRange(index: number, count: number): List<T>;
	Contains(item: T): boolean;
}

class Dictionary<K, V> {
	realTypeName: string;
	keyType: string;
	valueType: string;
	keys: K[];
	values: V[];
	constructor(keyType?: string, valueType?: string, keyValuePairsObj?) {
		//VDFUtils.SetUpHiddenFields(this, true, "realTypeName", "keyType", "valueType", "keys", "values");
		this.realTypeName = "Dictionary(" + keyType + " " + valueType + ")";
		this.keyType = keyType;
		this.valueType = valueType;
		this.keys = [];
		this.values = [];

		if (keyValuePairsObj)
			for (var key in keyValuePairsObj)
				this.Set(<K><any>key, keyValuePairsObj[key]);
	}

	// properties
	get Keys() { // (note that this will return each key's toString() result (not the key itself, for non-string keys))
		var result = {};
		for (var i = 0; i < this.keys.length; i++)
			result[<any>this.keys[i]] = null;
		return result;
	}
	get Pairs() {
		var result = [];
		for (var i = 0; i < this.keys.length; i++)
			result.push({index: i, key: this.keys[i], value: this.values[i]});
		return result;
	}
	get Count() { return this.keys.length; }

	// methods
	ContainsKey(key: K) { return this.keys.indexOf(key) != -1; }
	Get(key: K) { return this.values[this.keys.indexOf(key)]; }
	Set(key: K, value: V) {
		if (this.keys.indexOf(key) == -1)
			this.keys.push(key);
		this.values[this.keys.indexOf(key)] = value;
		if (typeof key == "string")
			(<any>this)[<any>key] = value; // make value accessible directly on Dictionary object
	}
	Add(key: K, value: V) {
		if (this.keys.indexOf(key) != -1)
			throw new Error("Dictionary already contains key '" + key + "'.");
		this.Set(key, value);
	}
	Remove(key: K) {
		var itemIndex = this.keys.indexOf(key);
		if (itemIndex == -1) return;
		this.keys.splice(itemIndex, 1);
		this.values.splice(itemIndex, 1);
		delete (<any>this)[<any>key];
	}
}
//VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);