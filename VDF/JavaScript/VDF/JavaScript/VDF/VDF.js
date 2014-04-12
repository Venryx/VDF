var VDF_SetUp;
(function (VDF_SetUp) {
    function LoadJSFile(path) {
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

var EnumValue = (function () {
    function EnumValue(enumTypeName, intValue) {
        this.realVTypeName = enumTypeName;

        //this.intValue = intValue;
        this.stringValue = eval(enumTypeName + "[" + intValue + "]");
    }
    EnumValue.prototype.toString = function () {
        return this.stringValue;
    };

    EnumValue.IsEnum = function (objName) {
        return eval("window['" + objName + "'] && " + objName + "['_IsEnum'] === 0");
    };
    EnumValue.GetEnumStringForIntValue = function (enumTypeName, intValue) {
        return new EnumValue(enumTypeName, intValue).toString();
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
