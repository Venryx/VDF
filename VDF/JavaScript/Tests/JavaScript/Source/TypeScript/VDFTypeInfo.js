System.register(["./VDF", "./VDFExtras"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function TypeInfo(propIncludeRegexL1, popOutL1) {
        var typeTag = new VDFType(propIncludeRegexL1, popOutL1);
        return function (type) {
            var name = type.name_fake || type.name;
            // maybe temp; auto-hoist to global right here
            if (window[name] == null)
                window[name] = type;
            //var typeInfo = VDFTypeInfo.Get(name);
            var typeInfo = VDFTypeInfo.Get(type);
            typeInfo.tags = new VDFExtras_1.List(null, typeTag);
            typeInfo.typeTag.AddDataOf(typeTag);
        };
    }
    exports_1("TypeInfo", TypeInfo);
    function T(typeOrTypeName) {
        return function (target, name) {
            //target.prototype[name].AddTags(new VDFPostDeserialize());
            //Prop(target, name, typeOrTypeName);
            //target.p(name, typeOrTypeName);
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.typeName = typeOrTypeName instanceof Function ? typeOrTypeName.name : typeOrTypeName;
        };
    }
    exports_1("T", T);
    function P(includeL2, popOutL2) {
        if (includeL2 === void 0) { includeL2 = true; }
        return function (target, name) {
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.AddTags(new VDFProp(includeL2, popOutL2));
        };
    }
    exports_1("P", P);
    function _VDFSerializeProp() {
        return function (target, name) { return target[name].AddTags(new VDFSerializeProp()); };
    }
    exports_1("_VDFSerializeProp", _VDFSerializeProp);
    function _VDFDeserializeProp() {
        return function (target, name) { return target[name].AddTags(new VDFDeserializeProp()); };
    }
    exports_1("_VDFDeserializeProp", _VDFDeserializeProp);
    function _VDFPreSerialize() {
        return function (target, name) { return target[name].AddTags(new VDFPreSerialize()); };
    }
    exports_1("_VDFPreSerialize", _VDFPreSerialize);
    function _VDFSerialize() {
        return function (target, name) { return target[name].AddTags(new VDFSerialize()); };
    }
    exports_1("_VDFSerialize", _VDFSerialize);
    function _VDFPostSerialize() {
        return function (target, name) { return target[name].AddTags(new VDFPostSerialize()); };
    }
    exports_1("_VDFPostSerialize", _VDFPostSerialize);
    function _VDFPreDeserialize() {
        return function (target, name) { return target[name].AddTags(new VDFPreDeserialize()); };
    }
    exports_1("_VDFPreDeserialize", _VDFPreDeserialize);
    function _VDFDeserialize(fromParent) {
        if (fromParent === void 0) { fromParent = false; }
        return function (target, name) { return target[name].AddTags(new VDFDeserialize(fromParent)); };
    }
    exports_1("_VDFDeserialize", _VDFDeserialize);
    function _VDFPostDeserialize() {
        return function (target, name) { return target[name].AddTags(new VDFPostDeserialize()); };
    }
    exports_1("_VDFPostDeserialize", _VDFPostDeserialize);
    var VDF_1, VDFExtras_1, VDFType, VDFTypeInfo, VDFProp, VDFPropInfo, DefaultValue, D, VDFSerializeProp, VDFDeserializeProp, VDFPreSerialize, VDFSerialize, VDFPostSerialize, VDFPreDeserialize, VDFDeserialize, VDFPostDeserialize;
    return {
        setters: [
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            },
            function (VDFExtras_1_1) {
                VDFExtras_1 = VDFExtras_1_1;
            }
        ],
        execute: function () {
            VDFType = (function () {
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
            exports_1("VDFType", VDFType);
            VDFTypeInfo = (function () {
                function VDFTypeInfo() {
                    this.props = {};
                    //chainProps_cache = {}; // all props
                    this.tags = new VDFExtras_1.List();
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
                            // inherit props from base-types' type-tags
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
            exports_1("VDFTypeInfo", VDFTypeInfo);
            ;
            VDFProp = (function () {
                function VDFProp(includeL2, popOutL2) {
                    if (includeL2 === void 0) { includeL2 = true; }
                    this.includeL2 = includeL2;
                    this.popOutL2 = popOutL2;
                }
                return VDFProp;
            }());
            exports_1("VDFProp", VDFProp);
            VDFPropInfo = (function () {
                function VDFPropInfo(propName, propTypeName, tags) {
                    this.tags = new VDFExtras_1.List();
                    this.name = propName;
                    this.typeName = propTypeName;
                    this.tags = new VDFExtras_1.List();
                    this.propTag = this.tags.FirstOrDefault(function (a) { return a instanceof VDFProp; });
                    this.defaultValueTag = this.tags.FirstOrDefault(function (a) { return a instanceof DefaultValue; });
                }
                VDFPropInfo.prototype.AddTags = function () {
                    var tags = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        tags[_i] = arguments[_i];
                    }
                    this.tags.AddRange(tags);
                    this.propTag = this.tags.FirstOrDefault(function (a) { return a instanceof VDFProp; });
                    this.defaultValueTag = this.tags.FirstOrDefault(function (a) { return a instanceof DefaultValue; });
                };
                VDFPropInfo.prototype.ShouldValueBeSaved = function (val) {
                    //if (this.defaultValueTag == null || this.defaultValueTag.defaultValue == D.NoDefault)
                    if (this.defaultValueTag == null)
                        return true;
                    if (this.defaultValueTag.defaultValue == D.DefaultDefault) {
                        if (val == null)
                            return false;
                        if (val === false || val === 0)
                            return true;
                    }
                    if (this.defaultValueTag.defaultValue == D.NullOrEmpty && val === null)
                        return false;
                    if (this.defaultValueTag.defaultValue == D.NullOrEmpty || this.defaultValueTag.defaultValue == D.Empty) {
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
            exports_1("VDFPropInfo", VDFPropInfo);
            ;
            ;
            DefaultValue = (function () {
                function DefaultValue(defaultValue) {
                    if (defaultValue === void 0) { defaultValue = D.DefaultDefault; }
                    this.defaultValue = defaultValue;
                }
                return DefaultValue;
            }());
            exports_1("DefaultValue", DefaultValue);
            exports_1("D", D = function D(defaultValue) {
                return function (target, name) {
                    var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
                    propInfo.AddTags(new DefaultValue(defaultValue));
                };
            });
            D.DefaultDefault = {};
            D.NullOrEmpty = {};
            D.Empty = {};
            //export var D;
            /*export let D = ()=> {
                let D_ = function(...args) {
                    return (target, name)=> {
                        var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
                        propInfo.AddTags(new DefaultValue(...args));
                    };
                };
                // copy D.NullOrEmpty and such
                for (var key in g.D)
                    D_[key] = g.D[key];
                return D_;
            };*/
            VDFSerializeProp = (function () {
                function VDFSerializeProp() {
                }
                return VDFSerializeProp;
            }());
            exports_1("VDFSerializeProp", VDFSerializeProp);
            ;
            VDFDeserializeProp = (function () {
                function VDFDeserializeProp() {
                }
                return VDFDeserializeProp;
            }());
            exports_1("VDFDeserializeProp", VDFDeserializeProp);
            ;
            VDFPreSerialize = (function () {
                function VDFPreSerialize() {
                }
                return VDFPreSerialize;
            }());
            exports_1("VDFPreSerialize", VDFPreSerialize);
            ;
            VDFSerialize = (function () {
                function VDFSerialize() {
                }
                return VDFSerialize;
            }());
            exports_1("VDFSerialize", VDFSerialize);
            ;
            VDFPostSerialize = (function () {
                function VDFPostSerialize() {
                }
                return VDFPostSerialize;
            }());
            exports_1("VDFPostSerialize", VDFPostSerialize);
            ;
            VDFPreDeserialize = (function () {
                function VDFPreDeserialize() {
                }
                return VDFPreDeserialize;
            }());
            exports_1("VDFPreDeserialize", VDFPreDeserialize);
            ;
            VDFDeserialize = (function () {
                function VDFDeserialize(fromParent) {
                    if (fromParent === void 0) { fromParent = false; }
                    this.fromParent = fromParent;
                }
                return VDFDeserialize;
            }());
            exports_1("VDFDeserialize", VDFDeserialize);
            ;
            VDFPostDeserialize = (function () {
                function VDFPostDeserialize() {
                }
                return VDFPostDeserialize;
            }());
            exports_1("VDFPostDeserialize", VDFPostDeserialize);
            ;
            /*export class VDFMethodInfo {
                tags: any[];
                constructor(tags: any[]) { this.tags = tags; }
            }*/ }
    };
});
/*export class VDFMethodInfo {
    tags: any[];
    constructor(tags: any[]) { this.tags = tags; }
}*/ 
//# sourceMappingURL=VDFTypeInfo.js.map