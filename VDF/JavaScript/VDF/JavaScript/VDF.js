var VDF_SetUp;
(function (VDF_SetUp) {
    Object.defineProperty(Object.prototype, "GetTypeName", {
        enumerable: false,
        value: function () {
            //var results = this["constructor"].toString().match(/function (.{1,})\(/);
            //return (results && results.length > 1) ? results[1] : "";
            return this.constructor.name;
        }
    });
    Object.defineProperty(Object.prototype, "GetType", {
        enumerable: false,
        value: function () {
            //var results = this["constructor"].toString().match(/function (.{1,})\(/);
            //return window[(results && results.length > 1) ? results[1] : ""];
            return window[this.constructor.name];
        }
    });

    if (window["OnVDFReady"])
        window["OnVDFReady"]();
})(VDF_SetUp || (VDF_SetUp = {}));
var VDF = (function () {
    function VDF() {
    }
    VDF.RegisterTypeExporter_Inline = function (type, exporter) {
        VDF.typeExporters_inline[type] = exporter;
    };
    VDF.RegisterTypeImporter_Inline = function (type, importer) {
        VDF.typeImporters_inline[type] = importer;
    };

    VDF.GetType = function (vTypeName) {
        return window[vTypeName];
    };
    VDF.GetVTypeNameOfObject = function (obj) {
        if (obj.constructor == {}.constructor || obj.constructor == object)
            return null;
        var rawType = typeof obj;
        if (rawType == "object") {
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
    };
    VDF.GetGenericParametersOfTypeName = function (typeName) {
        var genericArgumentTypes = new Array();
        var depth = 0;
        var lastStartBracketPos = -1;
        for (var i = 0; i < typeName.length; i++) {
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
    };

    VDF.Serialize = function (obj, declaredTypeName_orSaveOptions, saveOptions_orDeclaredTypeName) {
        var declaredTypeName;
        var saveOptions;
        if (typeof declaredTypeName_orSaveOptions == "string" || saveOptions_orDeclaredTypeName instanceof VDFSaveOptions) {
            declaredTypeName = declaredTypeName_orSaveOptions;
            saveOptions = saveOptions_orDeclaredTypeName;
        } else {
            declaredTypeName = saveOptions_orDeclaredTypeName;
            saveOptions = declaredTypeName_orSaveOptions;
        }
        return VDFSaver.ToVDFNode(obj, declaredTypeName, saveOptions).ToVDF();
    };

    VDF.Deserialize = function (vdf, declaredTypeName_orLoadOptions, loadOptions_orDeclaredTypeName) {
        var declaredTypeName;
        var loadOptions;
        if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions) {
            declaredTypeName = declaredTypeName_orLoadOptions;
            loadOptions = loadOptions_orDeclaredTypeName;
        } else {
            declaredTypeName = loadOptions_orDeclaredTypeName;
            loadOptions = declaredTypeName_orLoadOptions;
        }
        return VDFLoader.ToVDFNode(vdf, declaredTypeName, loadOptions).ToObject(declaredTypeName, loadOptions);
    };
    VDF.DeserializeInto = function (vdf, obj, loadOptions) {
        VDFLoader.ToVDFNode(vdf, VDF.GetVTypeNameOfObject(obj), loadOptions).IntoObject(obj, loadOptions);
    };
    VDF.typeExporters_inline = {};
    VDF.typeImporters_inline = {};

    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];
    return VDF;
})();

// helper classes
// ==================
var VDFUtils = (function () {
    function VDFUtils() {
    }
    VDFUtils.SetUpHiddenFields = function (obj, addSetters) {
        var fieldNames = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            fieldNames[_i] = arguments[_i + 2];
        }
        if (addSetters && !obj._hiddenFieldStore)
            Object.defineProperty(obj, "_hiddenFieldStore", { enumerable: false, value: {} });
        for (var i in fieldNames)
            (function () {
                var propName = fieldNames[i];
                var origValue = obj[propName];
                delete obj[propName];
                if (addSetters)
                    Object.defineProperty(obj, propName, {
                        enumerable: false,
                        get: function () {
                            return obj["_hiddenFieldStore"][propName];
                        },
                        set: function (value) {
                            return obj["_hiddenFieldStore"][propName] = value;
                        }
                    });
                else
                    Object.defineProperty(obj, propName, {
                        enumerable: false,
                        value: origValue
                    });
                obj[propName] = origValue; // for 'hiding' a prop that was set beforehand
            })();
    };
    VDFUtils.MakePropertiesHidden = function (obj, alsoMakeFunctionsHidden, addSetters) {
        for (var propName in obj) {
            var propDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
            if (propDescriptor) {
                propDescriptor.enumerable = false;
                Object.defineProperty(obj, propName, propDescriptor);
            } else if (alsoMakeFunctionsHidden && obj[propName] instanceof Function)
                VDFUtils.SetUpHiddenFields(obj, addSetters, propName);
        }
    };
    return VDFUtils;
})();
var StringBuilder = (function () {
    function StringBuilder(startData) {
        this.data = [];
        this.counter = 0;
        if (startData)
            this.data.push(startData);
    }
    StringBuilder.prototype.Append = function (str) {
        this.data[this.counter++] = str;
        return this;
    };
    StringBuilder.prototype.Remove = function (i, j) {
        this.data.splice(i, j || 1);
        return this;
    };
    StringBuilder.prototype.Insert = function (i, str) {
        this.data.splice(i, 0, str);
        return this;
    };
    StringBuilder.prototype.ToString = function (joinerString) {
        return this.data.join(joinerString || "");
    };
    return StringBuilder;
})();

// VDF-usable data wrappers
// ==================
var object = (function () {
    function object() {
    }
    return object;
})();
var EnumValue = (function () {
    function EnumValue(enumTypeName, intValue) {
        this.realVTypeName = enumTypeName;

        //this.intValue = intValue;
        this.stringValue = EnumValue.GetEnumStringForIntValue(enumTypeName, intValue);
    }
    EnumValue.prototype.toString = function () {
        return this.stringValue;
    };

    EnumValue.IsEnum = function (typeName) {
        return eval("window['" + typeName + "'] && " + typeName + "['_IsEnum'] === 0");
    };
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
    self.realVTypeName = "List[" + itemType + "]";
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
    self.indexes = function () {
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
    self.Remove = function (item) {
        this.splice(this.indexOf(item), 1);
    };
    self.Any = function (matchFunc) {
        for (var i in this.indexes())
            if (matchFunc.call(this[i], this[i]))
                return true;
        return false;
    };
    self.All = function (matchFunc) {
        for (var i in this.indexes())
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
            for (var i in this.indexes())
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
    function Dictionary(keyType, valueType) {
        var keyValuePairs = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            keyValuePairs[_i] = arguments[_i + 2];
        }
        this.realVTypeName = "Dictionary[" + keyType + "," + valueType + "]";
        this.keyType = keyType;
        this.valueType = valueType;
        this.keys = [];
        this.values = [];
        VDFUtils.MakePropertiesHidden(this, true);

        if (keyValuePairs)
            for (var i = 0; i < keyValuePairs.length; i++)
                this.Set(keyValuePairs[i][0], keyValuePairs[i][1]);
    }
    Object.defineProperty(Dictionary.prototype, "Count", {
        // properties
        get: function () {
            return this.keys.length;
        },
        enumerable: true,
        configurable: true
    });

    // methods
    Dictionary.prototype.Get = function (key) {
        return this.values[this.keys.indexOf(key)];
    };
    Dictionary.prototype.Set = function (key, value) {
        if (this.keys.indexOf(key) == -1) {
            this.keys.push(key);
            this[key] = value; // make value accessible directly on Dictionary object
        }
        this.values[this.keys.indexOf(key)] = value;
    };
    Dictionary.prototype.Add = function (key, value) {
        if (this.Get(key) != undefined)
            throw new Error("Dictionary already contains key '" + key + "'.");
        this.Set(key, value);
    };
    return Dictionary;
})();
VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);
//# sourceMappingURL=VDF.js.map
