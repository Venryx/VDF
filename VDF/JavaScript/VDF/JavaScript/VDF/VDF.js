var VDF_SetUp;
(function (VDF_SetUp) {
    Object.defineProperty(Object.prototype, "GetTypeName", {
        enumerable: false,
        value: function () {
            var results = this["constructor"].toString().match(/function (.{1,})\(/);
            return (results && results.length > 1) ? results[1] : "";
        }
    });
    Object.defineProperty(Object.prototype, "GetType", {
        enumerable: false,
        value: function () {
            var results = this["constructor"].toString().match(/function (.{1,})\(/);
            return window[(results && results.length > 1) ? results[1] : ""];
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

    VDF.GetVTypeNameOfObject = function (obj) {
        if (obj["realVTypeName"])
            return obj["realVTypeName"];
        var type = obj.GetTypeName();
        if (type == "Boolean")
            return "bool";
        if (type == "Number")
            return "float";
        if (type == "String")
            return "string";
        return type;
    };

    VDF.Serialize = function (obj, saveOptions) {
        var a = VDFSaver.ToVDFNode(obj, saveOptions);
        return VDFSaver.ToVDFNode(obj, saveOptions).ToString();
    };
    VDF.Deserialize = function (vdf, realVTypeName, loadOptions) {
        return VDFLoader.ToVDFNode(vdf, loadOptions).ToObject(realVTypeName, loadOptions);
    };
    VDF.typeExporters_inline = {};
    VDF.typeImporters_inline = {};

    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];
    return VDF;
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

var List = (function () {
    function List(itemType) {
        var items = [];
        for (var _i = 0; _i < (arguments.length - 1); _i++) {
            items[_i] = arguments[_i + 1];
        }
        this.innerArray = [];
        this.pushAll(items);
        this.AddItem("realVTypeName", "List[" + itemType + "]");
        this.itemType = itemType;
    }
    List.prototype.modifyInnerListWithCall = function (func, args) {
        for (var i = 0; i < this.innerArray.length; i++)
            delete this[i];
        func.apply(this.innerArray, args);
        for (var i = 0; i < this.innerArray.length; i++)
            this[i] = this.innerArray[i];
    };
    List.prototype.push = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        this.modifyInnerListWithCall(Array.prototype.push, args);
    };
    List.prototype.pushAll = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        this.modifyInnerListWithCall(Array.prototype.pushAll, args);
    };
    List.prototype.pop = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        this.modifyInnerListWithCall(Array.prototype.pop, args);
    };
    List.prototype.insert = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        this.modifyInnerListWithCall(Array.prototype.insert, args);
    };
    List.prototype.remove = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        this.modifyInnerListWithCall(Array.prototype.remove, args);
    };
    List.prototype.splice = function () {
        var args = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            args[_i] = arguments[_i + 0];
        }
        this.modifyInnerListWithCall(Array.prototype.splice, args);
    };
    return List;
})();
List.prototype.AddGetter_Inline = function length() {
    //return this.innerArray.length; // we can't just check internal array's length, since user may have 'added' items by calling "list[0] = value;"
    var highestIndex = -1;
    for (var propName in this)
        if (parseInt(propName) == propName && parseInt(propName) > highestIndex)
            highestIndex = parseInt(propName);
    return highestIndex + 1;
};

var Dictionary = (function () {
    function Dictionary(keyType, valueType) {
        var keyValuePairs = [];
        for (var _i = 0; _i < (arguments.length - 2); _i++) {
            keyValuePairs[_i] = arguments[_i + 2];
        }
        this.keys = [];
        this.values = [];
        this.AddItem("realVTypeName", "Dictionary[" + keyType + "," + valueType + "]");
        this.keyType = keyType;
        this.valueType = valueType;

        if (keyValuePairs)
            for (var i = 0; i < keyValuePairs.length; i++)
                this.set(keyValuePairs[i][0], keyValuePairs[i][1]);
    }
    Dictionary.prototype.get = function (key) {
        return this.values[this.keys.indexOf(key)];
    };
    Dictionary.prototype.set = function (key, value) {
        if (!this.keys.contains(key))
            this.keys.push(key);
        this.values[this.keys.indexOf(key)] = value;
    };
    return Dictionary;
})();
//# sourceMappingURL=VDF.js.map
