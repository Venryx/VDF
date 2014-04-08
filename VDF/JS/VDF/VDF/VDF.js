/*var VDF = new function ()
{
this.typeExporters_inline = {};
this.typeImporters_inline = {};
this.typeVDFTypeOverrides = {};
var propVDFPropOverrides = {};
public static string Serialize(object obj) { return VDFSaver.ToVDFNode(obj).ToString(); }
public static T Deserialize<T>(string vdf) { return VDFLoader.ToVDFNode(vdf).ToObject<T>(); }
};*/
var VDF = {};
VDF["Test"] = function () {
    alert('test1');
};
//# sourceMappingURL=VDF.js.map
