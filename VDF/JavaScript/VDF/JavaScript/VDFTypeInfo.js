var VDFTypeInfo = (function () {
    function VDFTypeInfo(propInfoByName, props_includeL1, popOutChildrenL1) {
        this.propInfoByName = propInfoByName || {};
        this.props_includeL1 = props_includeL1;
        this.popOutChildrenL1 = popOutChildrenL1;
    }
    VDFTypeInfo.Get = function (typeName) {
        if (VDF.GetIsTypeAnonymous(typeName))
            return new VDFTypeInfo(null, true);
        return (window[typeName] || {}).typeInfo || new VDFTypeInfo();
    };
    return VDFTypeInfo;
})();

var VDFPropInfo = (function () {
    function VDFPropInfo(propType, includeL2, popOutChildrenL2, writeDefaultValue) {
        if (typeof includeL2 === "undefined") { includeL2 = true; }
        if (typeof popOutChildrenL2 === "undefined") { popOutChildrenL2 = false; }
        if (typeof writeDefaultValue === "undefined") { writeDefaultValue = true; }
        this.propTypeName = propType;
        this.includeL2 = includeL2;
        this.popOutChildrenL2 = popOutChildrenL2;
        this.writeDefaultValue = writeDefaultValue;
    }
    VDFPropInfo.prototype.IsXValueTheDefault = function (x) {
        if (x == null)
            return true;
        if (x === false || x === 0)
            return true;

        /*var typeName = VDF.GetTypeNameOfObject(x);
        if (typeName && typeName.startsWith("List(") && x.length == 0) // if list, and empty
        return true;
        if (typeName == "string" && !x.length) // if string, and empty
        return true;*/
        return false;
    };
    return VDFPropInfo;
})();
//# sourceMappingURL=VDFTypeInfo.js.map
