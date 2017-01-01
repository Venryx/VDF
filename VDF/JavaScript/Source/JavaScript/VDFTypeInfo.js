"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VDF_1 = require("./VDF");
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
}());
exports.VDFType = VDFType;
var VDFTypeInfo = (function () {
    function VDFTypeInfo() {
        this.props = {};
    }
    VDFTypeInfo.Get = function (type_orTypeName) {
        //var type = type_orTypeName instanceof Function ? type_orTypeName : window[type_orTypeName];
        var typeName = type_orTypeName instanceof Function ? type_orTypeName.name : type_orTypeName;
        var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
        if (VDF_1.VDF.GetIsTypeAnonymous(typeNameBase)) {
            var result = new VDFTypeInfo();
            result.typeTag = new VDFType(VDF_1.VDF.PropRegex_Any);
            return result;
        }
        var typeBase = type_orTypeName instanceof Function ? type_orTypeName : window[typeNameBase];
        /*if (typeBase == null)
            throw new Error("Could not find constructor for type: " + typeNameBase);*/
        if (typeBase && !typeBase.hasOwnProperty("typeInfo")) {
            var result = new VDFTypeInfo();
            result.typeTag = new VDFType();
            var currentType = typeBase;
            while (currentType != null) {
                var currentTypeInfo = currentType.typeInfo;
                // load type-tag from base-types
                var typeTag2 = (currentTypeInfo || {}).typeTag;
                for (var key in typeTag2)
                    if (result.typeTag[key] == null)
                        result.typeTag[key] = typeTag2[key];
                // load prop-info from base-types
                if (currentTypeInfo)
                    for (var propName in currentTypeInfo.props)
                        result.props[propName] = currentTypeInfo.props[propName];
                currentType = currentType.prototype && currentType.prototype.__proto__ && currentType.prototype.__proto__.constructor;
            }
            typeBase.typeInfo = result;
        }
        return typeBase && typeBase.typeInfo;
    };
    VDFTypeInfo.prototype.GetProp = function (propName) {
        if (!(propName in this.props))
            this.props[propName] = new VDFPropInfo(propName, null, []);
        return this.props[propName];
    };
    return VDFTypeInfo;
}());
exports.VDFTypeInfo = VDFTypeInfo;
var VDFProp = (function () {
    function VDFProp(includeL2, popOutL2) {
        if (includeL2 === void 0) { includeL2 = true; }
        this.includeL2 = includeL2;
        this.popOutL2 = popOutL2;
    }
    return VDFProp;
}());
exports.VDFProp = VDFProp;
var P = (function (_super) {
    __extends(P, _super);
    function P(includeL2, popOutL2) {
        if (includeL2 === void 0) { includeL2 = true; }
        return _super.call(this, includeL2, popOutL2) || this;
    }
    return P;
}(VDFProp));
exports.P = P;
var DefaultValue = (function () {
    function DefaultValue(defaultValue) {
        if (defaultValue === void 0) { defaultValue = exports.D.DefaultDefault; }
        this.defaultValue = defaultValue;
    }
    return DefaultValue;
}());
exports.DefaultValue = DefaultValue;
exports.D = function D(defaultValue) {
    return (function (target, name) {
        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
        propInfo.AddTags(new DefaultValue(defaultValue));
    });
};
exports.D.DefaultDefault = {};
exports.D.NullOrEmpty = {};
exports.D.Empty = {};
var VDFPropInfo = (function () {
    function VDFPropInfo(propName, propTypeName, tags) {
        this.name = propName;
        this.typeName = propTypeName;
        this.tags = new VDF_1.List("object", tags);
        this.propTag = this.tags.First(function (a) { return a instanceof VDFProp; });
        this.defaultValueTag = this.tags.First(function (a) { return a instanceof DefaultValue; });
    }
    VDFPropInfo.prototype.AddTags = function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        this.tags.AddRange(tags);
        this.propTag = this.tags.First(function (a) { return a instanceof VDFProp; });
        this.defaultValueTag = this.tags.First(function (a) { return a instanceof DefaultValue; });
    };
    VDFPropInfo.prototype.ShouldValueBeSaved = function (val) {
        //if (this.defaultValueTag == null || this.defaultValueTag.defaultValue == D.NoDefault)
        if (this.defaultValueTag == null)
            return true;
        if (this.defaultValueTag.defaultValue == exports.D.DefaultDefault) {
            if (val == null)
                return false;
            if (val === false || val === 0)
                return true;
        }
        if (this.defaultValueTag.defaultValue == exports.D.NullOrEmpty && val === null)
            return false;
        if (this.defaultValueTag.defaultValue == exports.D.NullOrEmpty || this.defaultValueTag.defaultValue == exports.D.Empty) {
            var typeName = VDF_1.VDF.GetTypeNameOfObject(val);
            if (typeName && typeName.StartsWith("List(") && val.length == 0)
                return false;
            if (typeName == "string" && !val.length)
                return false;
        }
        if (val === this.defaultValueTag.defaultValue)
            return false;
        return true;
    };
    return VDFPropInfo;
}());
exports.VDFPropInfo = VDFPropInfo;
var VDFSerializeProp = (function () {
    function VDFSerializeProp() {
    }
    return VDFSerializeProp;
}());
exports.VDFSerializeProp = VDFSerializeProp;
function _VDFSerializeProp() {
    return function (target, name) { return target[name].AddTags(new VDFSerializeProp()); };
}
exports._VDFSerializeProp = _VDFSerializeProp;
;
var VDFDeserializeProp = (function () {
    function VDFDeserializeProp() {
    }
    return VDFDeserializeProp;
}());
exports.VDFDeserializeProp = VDFDeserializeProp;
function _VDFDeserializeProp() {
    return function (target, name) { return target[name].AddTags(new VDFDeserializeProp()); };
}
exports._VDFDeserializeProp = _VDFDeserializeProp;
;
var VDFPreSerialize = (function () {
    function VDFPreSerialize() {
    }
    return VDFPreSerialize;
}());
exports.VDFPreSerialize = VDFPreSerialize;
function _VDFPreSerialize() {
    return function (target, name) { return target[name].AddTags(new VDFPreSerialize()); };
}
exports._VDFPreSerialize = _VDFPreSerialize;
;
var VDFSerialize = (function () {
    function VDFSerialize() {
    }
    return VDFSerialize;
}());
exports.VDFSerialize = VDFSerialize;
function _VDFSerialize() {
    return function (target, name) { return target[name].AddTags(new VDFSerialize()); };
}
exports._VDFSerialize = _VDFSerialize;
;
var VDFPostSerialize = (function () {
    function VDFPostSerialize() {
    }
    return VDFPostSerialize;
}());
exports.VDFPostSerialize = VDFPostSerialize;
function _VDFPostSerialize() {
    return function (target, name) { return target[name].AddTags(new VDFPostSerialize()); };
}
exports._VDFPostSerialize = _VDFPostSerialize;
;
var VDFPreDeserialize = (function () {
    function VDFPreDeserialize() {
    }
    return VDFPreDeserialize;
}());
exports.VDFPreDeserialize = VDFPreDeserialize;
function _VDFPreDeserialize() {
    return function (target, name) { return target[name].AddTags(new VDFPreDeserialize()); };
}
exports._VDFPreDeserialize = _VDFPreDeserialize;
;
var VDFDeserialize = (function () {
    function VDFDeserialize(fromParent) {
        if (fromParent === void 0) { fromParent = false; }
        this.fromParent = fromParent;
    }
    return VDFDeserialize;
}());
exports.VDFDeserialize = VDFDeserialize;
function _VDFDeserialize(fromParent) {
    if (fromParent === void 0) { fromParent = false; }
    return function (target, name) { return target[name].AddTags(new VDFDeserialize(fromParent)); };
}
exports._VDFDeserialize = _VDFDeserialize;
;
var VDFPostDeserialize = (function () {
    function VDFPostDeserialize() {
    }
    return VDFPostDeserialize;
}());
exports.VDFPostDeserialize = VDFPostDeserialize;
function _VDFPostDeserialize() {
    return function (target, name) { return target[name].AddTags(new VDFPostDeserialize()); };
}
exports._VDFPostDeserialize = _VDFPostDeserialize;
;
/*export class VDFMethodInfo {
    tags: any[];
    constructor(tags: any[]) { this.tags = tags; }
}*/ 
//# sourceMappingURL=VDFTypeInfo.js.map