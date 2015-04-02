var VDFTypeInfo = (function () {
    function VDFTypeInfo(props, propIncludeRegexL1, childPopOutL1) {
        this.props = props || {};
        this.propIncludeRegexL1 = propIncludeRegexL1;
        this.childPopOutL1 = childPopOutL1;
    }
    VDFTypeInfo.Get = function (typeName) {
        if (VDF.GetIsTypeAnonymous(typeName))
            return new VDFTypeInfo(null, VDF.PropRegex_Any);

        var result = new VDFTypeInfo(null, null, null);
        result.props = null;
        var currentTypeName = typeName;
        while (window[currentTypeName]) {
            if (window[currentTypeName].typeInfo)
                for (var key in window[currentTypeName].typeInfo)
                    if (result[key] == null)
                        result[key] = window[currentTypeName].typeInfo[key];

            if (window[currentTypeName].prototype && window[currentTypeName].prototype.__proto__)
                currentTypeName = window[currentTypeName].prototype.__proto__.constructor.name; // set current-type-name to base-type's name
            else
                break;
        }
        result.props = result.props || {};
        return result;
    };
    return VDFTypeInfo;
})();

var VDFPropInfo = (function () {
    function VDFPropInfo(propType, includeL2, popOutL2, writeDefaultValue) {
        if (typeof writeDefaultValue === "undefined") { writeDefaultValue = true; }
        this.propTypeName = propType;
        this.includeL2 = includeL2;
        this.popOutL2 = popOutL2;
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
