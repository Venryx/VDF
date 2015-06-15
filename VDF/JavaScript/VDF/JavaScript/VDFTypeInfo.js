var VDFType = (function () {
    function VDFType(propIncludeRegexL1, popOutL1) {
        this.propIncludeRegexL1 = propIncludeRegexL1;
        this.popOutL1 = popOutL1;
    }
    VDFType.prototype.AddDataOf = function (typeTag) {
        if (typeTag.propIncludeRegexL1 != null)
            this.propIncludeRegexL1 = typeTag.propIncludeRegexL1;
        if (typeTag.popOutL1 != null)
            this.popOutL1 = typeTag.popOutL1;
    };
    return VDFType;
})();
var VDFTypeInfo = (function () {
    function VDFTypeInfo() {
        this.props = {};
    }
    VDFTypeInfo.Get = function (type_orTypeName) {
        //var type = type_orTypeName instanceof Function ? type_orTypeName : window[type_orTypeName];
        var typeName = type_orTypeName instanceof Function ? type_orTypeName.name : type_orTypeName;

        var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
        if (VDF.GetIsTypeAnonymous(typeNameBase)) {
            var result = new VDFTypeInfo();
            result.typeTag = new VDFType(VDF.PropRegex_Any);
            return result;
        }

        var typeBase = window[typeNameBase];
        if (typeBase && typeBase.typeInfo == null) {
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

            typeBase.typeInfo = result;
        }

        return typeBase && typeBase.typeInfo;
    };

    VDFTypeInfo.prototype.GetProp = function (propName) {
        if (!(propName in this.props))
            this.props[propName] = new VDFPropInfo(propName, null, [], null);
        return this.props[propName];
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
    function VDFPropInfo(propName, propTypeName, tags, propTag) {
        this.name = propName;
        this.typeName = propTypeName;
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

var VDFPreSerializeProp = (function () {
    function VDFPreSerializeProp() {
    }
    return VDFPreSerializeProp;
})();

var VDFPreSerialize = (function () {
    function VDFPreSerialize() {
    }
    return VDFPreSerialize;
})();
var VDFSerialize = (function () {
    function VDFSerialize() {
    }
    return VDFSerialize;
})();
var VDFPostSerialize = (function () {
    function VDFPostSerialize() {
    }
    return VDFPostSerialize;
})();
var VDFPreDeserialize = (function () {
    function VDFPreDeserialize() {
    }
    return VDFPreDeserialize;
})();
var VDFDeserialize = (function () {
    function VDFDeserialize(fromParent) {
        if (typeof fromParent === "undefined") { fromParent = false; }
        this.fromParent = fromParent;
    }
    return VDFDeserialize;
})();
var VDFPostDeserialize = (function () {
    function VDFPostDeserialize() {
    }
    return VDFPostDeserialize;
})();
/*class VDFMethodInfo
{
tags: any[];
constructor(tags: any[]) { this.tags = tags; }
}*/
//# sourceMappingURL=VDFTypeInfo.js.map
