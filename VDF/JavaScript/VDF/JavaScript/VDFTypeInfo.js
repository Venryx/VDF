var VDFType = (function () {
    function VDFType(propIncludeRegexL1, childPopOutL1) {
        this.propIncludeRegexL1 = propIncludeRegexL1;
        this.childPopOutL1 = childPopOutL1;
    }
    VDFType.prototype.AddDataOf = function (typeTag) {
        if (typeTag.propIncludeRegexL1 != null)
            this.propIncludeRegexL1 = typeTag.propIncludeRegexL1;
        if (typeTag.childPopOutL1 != null)
            this.childPopOutL1 = typeTag.childPopOutL1;
    };
    return VDFType;
})();
var VDFTypeInfo = (function () {
    function VDFTypeInfo() {
        this.props = {};
    }
    VDFTypeInfo.Get = function (typeName) {
        var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
        if (VDF.GetIsTypeAnonymous(typeNameBase)) {
            var result = new VDFTypeInfo();
            result.typeTag = new VDFType(VDF.PropRegex_Any);
            return result;
        }

        if (window[typeNameBase] && window[typeNameBase].typeInfo == null) {
            var result = new VDFTypeInfo();
            result.typeTag = new VDFType();

            /*var typeTag = new VDFType();
            var currentTypeName = typeNameBase;
            while (window[currentTypeName]) //true)
            {
            if (window[currentTypeName].typeInfo.typeTag)
            for (var key in window[currentTypeName].typeInfo.typeTag)
            if (typeTag[key] == null)
            typeTag[key] = window[currentTypeName].typeInfo.typeTag[key];
            
            if (window[currentTypeName].prototype && window[currentTypeName].prototype.__proto__) // if has base-type
            currentTypeName = window[currentTypeName].prototype.__proto__.constructor.name; // set current-type-name to base-type's name
            else
            break;
            }
            result.typeTag = typeTag;*/
            var currentType = typeNameBase;
            while (currentType != null) {
                var typeTag2 = (window[currentType].typeInfo || {}).typeTag;
                for (var key in typeTag2)
                    if (result.typeTag[key] == null)
                        result.typeTag[key] = typeTag2[key];
                currentType = window[currentType].prototype && window[currentType].prototype.__proto__ && window[currentType].prototype.__proto__.constructor.name;
            }

            window[typeNameBase].typeInfo = result;
        }

        return window[typeNameBase] && window[typeNameBase].typeInfo;
    };
    return VDFTypeInfo;
})();

var VDFProp = (function () {
    function VDFProp(includeL2, writeDefaultValue, popOutL2) {
        if (typeof includeL2 === "undefined") { includeL2 = true; }
        if (typeof writeDefaultValue === "undefined") { writeDefaultValue = true; }
        this.includeL2 = includeL2;
        this.writeDefaultValue = writeDefaultValue;
        this.popOutL2 = popOutL2;
    }
    return VDFProp;
})();
var VDFPropInfo = (function () {
    function VDFPropInfo(propName, propType, tags, propTag) {
        this.propName = propName;
        this.propTypeName = propType;
        this.tags = tags;
        this.propTag = propTag;
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

var VDFMethodInfo = (function () {
    function VDFMethodInfo(tags) {
        this.tags = tags;
    }
    return VDFMethodInfo;
})();
//# sourceMappingURL=VDFTypeInfo.js.map
