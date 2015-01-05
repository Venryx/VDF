var VDFTypeInfo = (function () {
    function VDFTypeInfo(propInfoByPropName, props_includeL1, popOutChildrenL1) {
        this.propInfoByName = propInfoByPropName || {};
        this.props_includeL1 = props_includeL1;
        this.popOutChildrenL1 = popOutChildrenL1;
    }
    VDFTypeInfo.Get = function (vTypeName) {
        return (window[vTypeName] || {}).typeInfo || new VDFTypeInfo();
    };
    return VDFTypeInfo;
})();

var VDFPropInfo = (function () {
    function VDFPropInfo(propType, includeL2, popOutChildrenL2, writeEmptyValue) {
        if (typeof includeL2 === "undefined") { includeL2 = true; }
        if (typeof popOutChildrenL2 === "undefined") { popOutChildrenL2 = false; }
        if (typeof writeEmptyValue === "undefined") { writeEmptyValue = true; }
        this.propVTypeName = propType;
        this.includeL2 = includeL2;
        this.popOutChildrenL2 = popOutChildrenL2;
        this.writeEmptyValue = writeEmptyValue;
    }
    VDFPropInfo.prototype.IsXValueEmpty = function (x) {
        if (x == null)
            return true;
        if (x === false || x === 0)
            return true;
        var vTypeName = VDF.GetVTypeNameOfObject(x);
        if (vTypeName && vTypeName.startsWith("List[") && x.length == 0)
            return true;
        if (vTypeName == "string" && !x.length)
            return true;
        return false;
    };
    return VDFPropInfo;
})();
//# sourceMappingURL=VDFTypeInfo.js.map
