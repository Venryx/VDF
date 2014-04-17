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

var VDFTypeInfo = (function () {
    function VDFTypeInfo(props_includeL1, propInfoByPropName) {
        this.props_includeL1 = props_includeL1;
        this.propInfoByPropName = propInfoByPropName || {};
    }
    VDFTypeInfo.prototype.SetPropInfo = function (propName, propInfo) {
        this.propInfoByPropName[propName] = propInfo;
    };
    return VDFTypeInfo;
})();

var VDFPropInfo = (function () {
    function VDFPropInfo(propType, includeL2, popOutItemsToOwnLines, ignoreEmptyValue) {
        this.propVTypeName = propType;
        this.includeL2 = includeL2;
        this.popOutItemsToOwnLines = popOutItemsToOwnLines;
        this.ignoreEmptyValue = ignoreEmptyValue;
    }
    VDFPropInfo.prototype.IsXIgnorableValue = function (x) {
        if (this.ignoreEmptyValue && VDF.GetVTypeNameOfObject(x).startsWith("List[") && x.length == 0)
            return true;
        if (x === false || x === 0)
            return true;
        return x == null;
    };
    return VDFPropInfo;
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

function new_List(itemType) {
    var items = [];
    for (var _i = 0; _i < (arguments.length - 1); _i++) {
        items[_i] = arguments[_i + 1];
    }
    var result = items || [];
    result.AddItem("realVTypeName", "List[" + itemType + "]");
    result.itemType = itemType;
    return result;
}

function new_Dictionary(keyType, valueType) {
    var keyValuePairs = [];
    for (var _i = 0; _i < (arguments.length - 2); _i++) {
        keyValuePairs[_i] = arguments[_i + 2];
    }
    var result = new Map();
    result.AddItem("realVTypeName", "Dictionary[" + keyType + "," + valueType + "]");
    result.keyType = keyType;
    result.valueType = valueType;

    result.keys = [];
    result.set = function (key, value) {
        if (!result.keys.contains(key))
            result.keys.push(key);
        Map.prototype.set.call(result, key, value);
    };

    if (keyValuePairs)
        for (var i = 0; i < keyValuePairs.length; i++)
            result.set(keyValuePairs[i][0], keyValuePairs[i][1]);
    return result;
}
//# sourceMappingURL=VDF.js.map
