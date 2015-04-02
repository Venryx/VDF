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
            var nativeTypeName = obj.constructor.name;

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

// attributes
// ----------
var AttributesWrapper = (function () {
    function AttributesWrapper(attributes) {
        this.attributes = attributes;
    }
    Object.defineProperty(AttributesWrapper.prototype, "type", {
        set: function (type) {
            type.attributes = this.attributes;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AttributesWrapper.prototype, "method", {
        set: function (method) {
            method.attributes = this.attributes;
        },
        enumerable: true,
        configurable: true
    });
    return AttributesWrapper;
})();
function AddAttributes() {
    var attributes = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        attributes[_i] = arguments[_i + 0];
    }
    return new AttributesWrapper(attributes);
}

// VDF-usable data wrappers
// ==================
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
    self.Remove = function (item) {
        this.RemoveAt(this.indexOf(item));
    };
    self.RemoveAt = function (index) {
        this.splice(index, 1);
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
