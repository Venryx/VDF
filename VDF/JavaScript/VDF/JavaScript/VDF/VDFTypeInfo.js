var VDFTypeInfo = (function () {
    function VDFTypeInfo(props_includeL1, propInfoByPropName) {
        this.props_includeL1 = props_includeL1;
        this.propInfoByPropName = propInfoByPropName || new_Dictionary();
    }
    VDFTypeInfo.prototype.SetPropInfo = function (propName, propInfo) {
        this.propInfoByPropName.set(propName, propInfo);
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
//# sourceMappingURL=VDFTypeInfo.js.map
