var VDF;
(function (VDF) {
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

    function Serialize(obj, saveOptions) {
        return VDFSaver.ToVDFNode(obj, saveOptions).ToString();
    }
    VDF.Serialize = Serialize;
})(VDF || (VDF = {}));
//# sourceMappingURL=VDF.js.map
