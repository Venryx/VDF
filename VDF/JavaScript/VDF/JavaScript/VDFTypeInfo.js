var VDFTypeInfo = (function () {
    function VDFTypeInfo(props_includeL1, popOutChildren, propInfoByPropName) {
        this.props_includeL1 = props_includeL1;
        this.popOutChildren = popOutChildren;
        this.propInfoByName = propInfoByPropName || {};
    }
    VDFTypeInfo.Get = function (vTypeName) {
        return (window[vTypeName] || {}).typeInfo || new VDFTypeInfo();
    };
    return VDFTypeInfo;
})();

var VDFPropInfo = (function () {
    function VDFPropInfo(propType, includeL2, popOutChildren, writeEmptyValue) {
        if (typeof includeL2 === "undefined") { includeL2 = true; }
        if (typeof writeEmptyValue === "undefined") { writeEmptyValue = true; }
        this.propVTypeName = propType;
        this.includeL2 = includeL2;
        this.popOutChildren = popOutChildren;
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
