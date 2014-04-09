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

    // the below let's you add type-info easily (e.g. "obj.SetTypeInfo(new VDFTypeInfo());"), and without that type-info being enumerated as a field/property
    Object.defineProperty(Object.prototype, "SetTypeInfo", {
        enumerable: false,
        value: function (x) {
            if (this["typeInfo"])
                delete this["typeInfo"];
            if (!this["typeInfo"])
                Object.defineProperty(this, "typeInfo", {
                    enumerable: false,
                    value: x
                });
        }
    });
    Object.defineProperty(Object.prototype, "GetTypeName", {
        enumerable: false,
        value: function () {
            var results = this["constructor"].toString().match(/function (.{1,})\(/);
            return (results && results.length > 1) ? results[1] : "";
        }
    });
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

    VDF.GetVNameOfType = function (type, saveOptions) {
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
    VDF.typeExporters_inline = {};
    VDF.typeImporters_inline = {};

    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];
    return VDF;
})();
//# sourceMappingURL=VDF.js.map
