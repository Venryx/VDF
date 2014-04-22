var VDFTypeInfo = (function () {
    function VDFTypeInfo(props_includeL1, propInfoByPropName) {
        this.props_includeL1 = props_includeL1;
        this.propInfoByName = propInfoByPropName || {};
    }
    VDFTypeInfo.prototype.SetPropInfo = function (propName, propInfo) {
        this.propInfoByName[propName] = propInfo;
    };
    return VDFTypeInfo;
})();

var VDFPropInfo = (function () {
    function VDFPropInfo(propType, includeL2, popDataOutOfLine, writeEmptyValue) {
        if (typeof writeEmptyValue === "undefined") { writeEmptyValue = true; }
        this.propVTypeName = propType;
        this.includeL2 = includeL2;
        this.popDataOutOfLine = popDataOutOfLine;
        this.writeEmptyValue = writeEmptyValue;
    }
    VDFPropInfo.prototype.IsXValueEmpty = function (x) {
        if (x == null)
            return true;
        if (x === false || x === 0)
            return true;
        if (VDF.GetVTypeNameOfObject(x).startsWith("List[") && x.length == 0)
            return true;
        return false;
    };
    return VDFPropInfo;
})();
//# sourceMappingURL=VDFTypeInfo.js.map
