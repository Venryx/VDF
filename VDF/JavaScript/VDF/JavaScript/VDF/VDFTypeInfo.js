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
    function VDFPropInfo(propType, includeL2, popOutItemsToOwnLines, writeEmptyValue) {
        if (typeof writeEmptyValue === "undefined") { writeEmptyValue = true; }
        this.propVTypeName = propType;
        this.includeL2 = includeL2;
        this.popOutItemsToOwnLines = popOutItemsToOwnLines;
        this.writeEmptyValue = writeEmptyValue;
    }
    VDFPropInfo.prototype.IsXValueEmpty = function (x) {
        if (VDF.GetVTypeNameOfObject(x).startsWith("List[") && x.length == 0)
            return true;
        if (x === false || x === 0)
            return true;
        if (x == null)
            return true;
        return false;
    };
    return VDFPropInfo;
})();
//# sourceMappingURL=VDFTypeInfo.js.map
