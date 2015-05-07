// init
// ==========

// the below lets you easily add non-enumerable properties
Object.defineProperty(Object.prototype, "_AddProperty", {
    enumerable: false,
    value: function (name, value) {
        Object.defineProperty(this, name, {
            enumerable: false,
            value: value
        });
    }
});

String.prototype._AddProperty("Contains", function (str) {
    return this.indexOf(str) != -1;
});
String.prototype._AddProperty("StartsWith", function (str) {
    return this.indexOf(str) == 0;
});
String.prototype._AddProperty("EndsWith", function (str) {
    var expectedPos = this.length - str.length;
    return this.indexOf(str, expectedPos) == expectedPos;
});
String.prototype._AddProperty("TrimStart", function (chars) {
    var result = "";
    for (var i = 0; i < this.length; i++)
        if (!chars.Contains(this[i]))
            result += this[i];
    return result;
});

Array.prototype._AddProperty("Contains", function (item) {
    return this.indexOf(item) != -1;
});

// classes
// ==========
var VDFNodePathNode = (function () {
    function VDFNodePathNode(obj, prop, list_index, map_key) {
        if (typeof obj === "undefined") { obj = null; }
        if (typeof prop === "undefined") { prop = null; }
        if (typeof list_index === "undefined") { list_index = -1; }
        if (typeof map_key === "undefined") { map_key = null; }
        this.list_index = -1;
        this.obj = obj;
        this.prop = prop;
        this.list_index = list_index;
        this.map_key = map_key;
    }
    VDFNodePathNode.prototype.Clone = function () {
        return new VDFNodePathNode(this.obj, this.prop, this.list_index, this.map_key);
    };
    return VDFNodePathNode;
})();
var VDFNodePath = (function () {
    function VDFNodePath(nodes_orRootNode) {
        if (nodes_orRootNode instanceof Array)
            this.nodes = nodes_orRootNode;
        else
            this.nodes = new List("VDFNodePathNode", nodes_orRootNode);
    }
    Object.defineProperty(VDFNodePath.prototype, "rootNode", {
        get: function () {
            return this.nodes.First();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNodePath.prototype, "parentNode", {
        get: function () {
            return this.nodes.length >= 2 ? this.nodes[this.nodes.length - 2] : null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(VDFNodePath.prototype, "currentNode", {
        get: function () {
            return this.nodes.Last();
        },
        enumerable: true,
        configurable: true
    });

    VDFNodePath.prototype.ExtendAsListChild = function (index, obj) {
        var newNodes = this.nodes.Select(function (a) {
            return a.Clone();
        }, "VDFNodePathNode");
        newNodes.Add(new VDFNodePathNode(obj, null, index));
        return new VDFNodePath(newNodes);
    };
    VDFNodePath.prototype.ExtendAsMapChild = function (key, obj) {
        var newNodes = this.nodes.Select(function (a) {
            return a.Clone();
        }, "VDFNodePathNode");
        newNodes.Add(new VDFNodePathNode(obj, null, -1, key));
        return new VDFNodePath(newNodes);
    };
    VDFNodePath.prototype.ExtendAsChild = function (prop, obj) {
        var newNodes = this.nodes.Select(function (a) {
            return a.Clone();
        }, "VDFNodePathNode");
        newNodes.Add(new VDFNodePathNode(obj, prop));
        return new VDFNodePath(newNodes);
    };
    return VDFNodePath;
})();

var VDF = (function () {
    function VDF() {
    }
    // v-name examples: "List(string)", "System.Collections.Generic.List(string)", "Dictionary(string string)"
    VDF.GetGenericArgumentsOfType = function (typeName) {
        var genericArgumentTypes = new Array();
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
    };

    VDF.GetIsTypePrimitive = function (typeName) {
        return ["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "bool", "char", "string"].Contains(typeName);
    };
    VDF.GetIsTypeAnonymous = function (typeName) {
        return typeName != null && typeName == "object";
    };
    VDF.GetTypeNameOfObject = function (obj) {
        var rawType = typeof obj;
        if (rawType == "object") {
            if (obj.realTypeName)
                return obj.realTypeName;
            var nativeTypeName = obj.constructor.name != "" ? obj.constructor.name : null;

            /*if (nativeTypeName == "Boolean")
            return "bool";
            if (nativeTypeName == "Number")
            return obj.toString().Contains(".") ? "double" : "int";
            if (nativeTypeName == "String")
            return "string";*/
            if (nativeTypeName == "Object")
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
        return "object";
    };
    VDF.GetTypeNameRoot = function (typeName) {
        return typeName != null && typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
    };

    VDF.Serialize = function (obj, declaredTypeName_orOptions, options_orNothing) {
        if (declaredTypeName_orOptions instanceof VDFSaveOptions)
            return VDF.Serialize(obj, null, declaredTypeName_orOptions);

        var declaredTypeName = declaredTypeName_orOptions;
        var options = options_orNothing;

        return VDFSaver.ToVDFNode(obj, declaredTypeName, options).ToVDF(options);
    };

    VDF.Deserialize = function (vdf, declaredTypeName_orOptions, options_orNothing) {
        if (declaredTypeName_orOptions instanceof VDFLoadOptions)
            return VDF.Deserialize(vdf, null, declaredTypeName_orOptions);

        var declaredTypeName = declaredTypeName_orOptions;
        var options = options_orNothing;
        return VDFLoader.ToVDFNode(vdf, declaredTypeName, options).ToObject(declaredTypeName, options);
    };
    VDF.DeserializeInto = function (vdf, obj, options) {
        VDFLoader.ToVDFNode(vdf, VDF.GetTypeNameOfObject(obj), options).IntoObject(obj, options);
    };
    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];

    VDF.PropRegex_Any = "";
    return VDF;
})();

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
var StringBuilder = (function () {
    function StringBuilder(startData) {
        this.data = [];
        this.Length = 0;
        if (startData) {
            this.data.push(startData);
            this.Length += startData.length;
        }
    }
    StringBuilder.prototype.Append = function (str) {
        this.data.push(str);
        this.Length += str.length;
        return this;
    };
    StringBuilder.prototype.Insert = function (index, str) {
        this.data.splice(index, 0, str);
        this.Length += str.length;
        return this;
    };
    StringBuilder.prototype.Remove = function (index, count) {
        var removedItems = this.data.splice(index, count || 1);
        for (var i = 0; i < removedItems.length; i++)
            this.Length -= removedItems[i].length;
        return this;
    };
    StringBuilder.prototype.Clear = function () {
        this.Remove(0, this.data.length);
    };
    StringBuilder.prototype.ToString = function (joinerString) {
        return this.data.join(joinerString || "");
    };
    return StringBuilder;
})();

// tags
// ----------
function PropDeclarationWrapper(typeOrObj, propName, propType_orFirstTag, tags) {
    if (propType_orFirstTag != null && typeof propType_orFirstTag != "string")
        return Prop.apply(this, [typeOrObj, propName, null, propType_orFirstTag].concat(tags));
    var propType = propType_orFirstTag;

    var s = this;
    s.type = typeOrObj instanceof Function ? typeOrObj : typeOrObj.constructor;
    s.propName = propName;
    s.propType = propType;
    s.tags = tags;
}
;
PropDeclarationWrapper.prototype._AddSetter_Inline = function set(value) {
    var s = this;
    var typeInfo = VDFTypeInfo.Get(s.type.name);

    var propTag = {};
    for (var i in s.tags)
        if (s.tags[i] instanceof VDFProp)
            propTag = s.tags[i];
    typeInfo.props[this.propName] = new VDFPropInfo(s.propName, s.propType, s.tags, propTag);
};
function Prop(typeOrObj, propName, propType_orFirstTag) {
    var tags = [];
    for (var _i = 0; _i < (arguments.length - 3); _i++) {
        tags[_i] = arguments[_i + 3];
    }
    return new PropDeclarationWrapper(typeOrObj, propName, propType_orFirstTag, tags);
}
;

function MethodDeclarationWrapper(tags) {
    this.tags = tags;
}
;
MethodDeclarationWrapper.prototype._AddSetter_Inline = function set(method) {
    method.methodInfo = new VDFMethodInfo(this.tags);
};
function Method() {
    var tags = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        tags[_i] = arguments[_i + 0];
    }
    return new MethodDeclarationWrapper(tags);
}
;

function TypeDeclarationWrapper(tags) {
    this.tags = tags;
}
;
TypeDeclarationWrapper.prototype._AddSetter_Inline = function set(type) {
    var s = this;
    type = type instanceof Function ? type : type.constructor;
    var typeInfo = VDFTypeInfo.Get(type.name);

    var typeTag = {};
    for (var i in s.tags)
        if (s.tags[i] instanceof VDFType)
            typeTag = s.tags[i];
    typeInfo.tags = s.tags;
    typeInfo.typeTag.AddDataOf(typeTag);
};
function Type() {
    var tags = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        tags[_i] = arguments[_i + 0];
    }
    return new TypeDeclarationWrapper(tags);
}
;

// VDF-usable data wrappers
// ==========
//class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
// for anonymous objects (JS anonymous-objects are all just instances of Object, so we don't lose anything by attaching type-info to the shared constructor)
//var object = Object;
//object["typeInfo"] = new VDFTypeInfo(null, true);
var object = (function () {
    function object() {
    }
    return object;
})();

var EnumValue = (function () {
    function EnumValue(enumTypeName, intValue) {
        this.realTypeName = enumTypeName;

        //this.intValue = intValue;
        this.stringValue = EnumValue.GetEnumStringForIntValue(enumTypeName, intValue);
    }
    EnumValue.prototype.toString = function () {
        return this.stringValue;
    };

    EnumValue.IsEnum = function (typeName) {
        return window[typeName] && window[typeName]["_IsEnum"] === 0;
    };

    //static IsEnum(typeName: string): boolean { return window[typeName] && /}\)\((\w+) \|\| \(\w+ = {}\)\);/.test(window[typeName].toString()); }
    EnumValue.GetEnumIntForStringValue = function (enumTypeName, stringValue) {
        return eval(enumTypeName + "[\"" + stringValue + "\"]");
    };
    EnumValue.GetEnumStringForIntValue = function (enumTypeName, intValue) {
        return eval(enumTypeName + "[" + intValue + "]");
    };
    return EnumValue;
})();

window["List"] = function List(itemType) {
    var items = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        items[_i] = arguments[_i + 1];
    }
    var self = Object.create(Array.prototype);
    self = (Array.apply(self, items) || self);
    self["__proto__"] = List.prototype; // makes "(new List()) instanceof List" be true
    self.constructor = List; // makes "(new List()).constructor == List" be true
    self.realTypeName = "List(" + itemType + ")";
    self.itemType = itemType;
    return self;
};
(function () {
    var self = List.prototype;
    self["__proto__"] = Array.prototype; // makes "(new List()) instanceof Array" be true

    // new properties
    Object.defineProperty(self, "Count", { enumerable: false, get: function () {
            return this.length;
        } });

    // new methods
    self.Indexes = function () {
        var result = {};
        for (var i = 0; i < this.length; i++)
            result[i] = this[i];
        return result;
    };
    self.Add = function () {
        var items = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            items[_i] = arguments[_i + 0];
        }
        return this.push.apply(this, items);
    };
    self.AddRange = function (items) {
        for (var i = 0; i < items.length; i++)
            this.push(items[i]);
    };
    self.Insert = function (index, item) {
        return this.splice(index, 0, item);
    };
    self.InsertRange = function (index, items) {
        return this.splice.apply(this, [index, 0].concat(items));
    };
    self.Remove = function (item) {
        this.RemoveAt(this.indexOf(item));
    };
    self.RemoveAt = function (index) {
        this.splice(index, 1);
    };
    self.RemoveRange = function (index, count) {
        return this.splice(index, count);
    };
    self.Any = function (matchFunc) {
        for (var i in this.Indexes())
            if (matchFunc.call(this[i], this[i]))
                return true;
        return false;
    };
    self.All = function (matchFunc) {
        for (var i in this.Indexes())
            if (!matchFunc.call(this[i], this[i]))
                return false;
        return true;
    };
    self.Select = function (selectFunc, itemType) {
        var result = new List(itemType || "object");
        for (var i in this.Indexes())
            result.Add(selectFunc.call(this[i], this[i]));
        return result;
    };
    self.First = function (matchFunc) {
        var result = this.FirstOrDefault(matchFunc);
        if (result == null)
            throw new Error("Matching item not found.");
        return result;
    };
    self.FirstOrDefault = function (matchFunc) {
        if (matchFunc) {
            for (var i in this.Indexes())
                if (matchFunc.call(this[i], this[i]))
                    return this[i];
            return null;
        } else
            return this[0];
    };
    self.Last = function (matchFunc) {
        var result = this.LastOrDefault(matchFunc);
        if (result == null)
            throw new Error("Matching item not found.");
        return result;
    };
    self.LastOrDefault = function (matchFunc) {
        if (matchFunc) {
            for (var i = this.length - 1; i >= 0; i--)
                if (matchFunc.call(this[i], this[i]))
                    return this[i];
            return null;
        } else
            return this[this.length - 1];
    };
    self.GetRange = function (index, count) {
        var result = new List(this.itemType);
        for (var i = index; i < index + count; i++)
            result.Add(this[i]);
        return result;
    };
    self.Contains = function (item) {
        return this.indexOf(item) != -1;
    };
})();

var Dictionary = (function () {
    function Dictionary(keyType, valueType, keyValuePairsObj) {
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
    Object.defineProperty(Dictionary.prototype, "Keys", {
        // properties
        get: function () {
            var result = {};
            for (var i = 0; i < this.keys.length; i++)
                result[this.keys[i]] = null;
            return result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "Count", {
        get: function () {
            return this.keys.length;
        },
        enumerable: true,
        configurable: true
    });

    // methods
    Dictionary.prototype.ContainsKey = function (key) {
        return this.keys.indexOf(key) != -1;
    };
    Dictionary.prototype.Get = function (key) {
        return this.values[this.keys.indexOf(key)];
    };
    Dictionary.prototype.Set = function (key, value) {
        if (this.keys.indexOf(key) == -1)
            this.keys.push(key);
        this.values[this.keys.indexOf(key)] = value;
        this[key] = value; // make value accessible directly on Dictionary object
    };
    Dictionary.prototype.Add = function (key, value) {
        if (this.keys.indexOf(key) != -1)
            throw new Error("Dictionary already contains key '" + key + "'.");
        this.Set(key, value);
    };
    Dictionary.prototype.Remove = function (key) {
        var itemIndex = this.keys.indexOf(key);
        this.keys.splice(itemIndex, 1);
        this.values.splice(itemIndex, 1);
        delete this[key];
    };
    return Dictionary;
})();
//VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);
//# sourceMappingURL=VDF.js.map
