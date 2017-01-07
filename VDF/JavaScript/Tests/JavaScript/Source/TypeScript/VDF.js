System.register(["./VDFSaver", "./VDFLoader", "./VDFExtras"], function (exports_1, context_1) {
    var __moduleName = context_1 && context_1.id;
    function Log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (g.Log)
            return g.Log.apply(g, args);
        return console.log.apply(console, args);
    }
    exports_1("Log", Log);
    function Assert(condition, message) {
        if (condition)
            return;
        console.assert(false, message || "");
        debugger;
    }
    exports_1("Assert", Assert);
    var VDFSaver_1, VDFLoader_1, VDFExtras_1, g, VDF;
    return {
        setters: [
            function (VDFSaver_1_1) {
                VDFSaver_1 = VDFSaver_1_1;
            },
            function (VDFLoader_1_1) {
                VDFLoader_1 = VDFLoader_1_1;
            },
            function (VDFExtras_1_1) {
                VDFExtras_1 = VDFExtras_1_1;
            }
        ],
        execute: function () {
            // vdf globals
            // ==========
            g = window;
            // the below lets you easily add non-enumerable properties
            Object.defineProperty(Object.prototype, "_AddProperty", {
                enumerable: false,
                value: function (name, value) {
                    Object.defineProperty(this, name, {
                        enumerable: false,
                        value: value
                    });
                }
            });
            String.prototype._AddProperty("Contains", function (str) { return this.indexOf(str) != -1; });
            String.prototype._AddProperty("StartsWith", function (str) { return this.indexOf(str) == 0; });
            String.prototype._AddProperty("EndsWith", function (str) {
                var expectedPos = this.length - str.length;
                return this.indexOf(str, expectedPos) == expectedPos;
            });
            String.prototype._AddProperty("TrimStart", function (chars) {
                var result = "";
                var doneTrimming = false;
                for (var i = 0; i < this.length; i++)
                    if (!chars.Contains(this[i]) || doneTrimming) {
                        result += this[i];
                        doneTrimming = true;
                    }
                return result;
            });
            if (!Array.prototype["Contains"])
                Array.prototype._AddProperty("Contains", function (item) { return this.indexOf(item) != -1; });
            if (!Array.prototype["Where"])
                Array.prototype._AddProperty("Where", function (matchFunc) {
                    if (matchFunc === void 0) { matchFunc = (function () { return true; }); }
                    var result = this instanceof VDFExtras_1.List ? new VDFExtras_1.List(this.itemType) : [];
                    for (var _i = 0, _a = this; _i < _a.length; _i++) {
                        var item = _a[_i];
                        if (matchFunc.call(item, item))
                            result.push(item);
                    }
                    return result;
                });
            if (!Array.prototype["First"])
                Array.prototype._AddProperty("First", function (matchFunc) {
                    if (matchFunc === void 0) { matchFunc = (function () { return true; }); }
                    return this.Where(matchFunc)[0];
                });
            Function.prototype._AddProperty("AddTags", function () {
                var tags = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    tags[_i] = arguments[_i];
                }
                if (this.tags == null)
                    this.tags = new VDFExtras_1.List("object");
                for (var i = 0; i < tags.length; i++)
                    this.tags.push(tags[i]);
                return this;
            });
            /*Function.prototype._AddProperty("IsDerivedFrom", function(baseType) {
                if (baseType == null)
                    return false;
                var currentDerived = this.prototype;
                while (currentDerived.__proto__)	{
                    if (currentDerived == baseType.prototype)
                        return true;
                    currentDerived = currentDerived.__proto__;
                }
                return false;
            });*/
            VDF = (function () {
                function VDF() {
                }
                // v-name examples: "List(string)", "System.Collections.Generic.List(string)", "Dictionary(string string)"
                VDF.GetGenericArgumentsOfType = function (typeName) {
                    var genericArgumentTypes = new Array(); //<string[]>[];
                    var depth = 0;
                    var lastStartBracketPos = -1;
                    if (typeName != null)
                        for (var i = 0; i < typeName.length; i++) {
                            var ch = typeName[i];
                            if (ch == ')')
                                depth--;
                            if ((depth == 0 && ch == ')') || (depth == 1 && ch == ' '))
                                genericArgumentTypes.push(typeName.substring(lastStartBracketPos + 1, i)); // get generic-parameter type-str
                            if ((depth == 0 && ch == '(') || (depth == 1 && ch == ' '))
                                lastStartBracketPos = i;
                            if (ch == '(')
                                depth++;
                        }
                    return genericArgumentTypes;
                };
                VDF.IsTypeXDerivedFromY = function (xTypeName, yTypeName) {
                    if (xTypeName == null || yTypeName == null || window[xTypeName] == null || window[yTypeName] == null)
                        return false;
                    var currentDerived = window[xTypeName].prototype;
                    while (currentDerived.__proto__) {
                        if (currentDerived == window[yTypeName].prototype)
                            return true;
                        currentDerived = currentDerived.__proto__;
                    }
                    return false;
                };
                // (technically strings are not primitives in C#, but we consider them such)
                VDF.GetIsTypePrimitive = function (typeName) {
                    return [
                        "byte", "sbyte", "short", "ushort",
                        "int", "uint", "long", "ulong", "float", "double", "decimal",
                        "bool", "char", "string"
                    ].Contains(typeName);
                };
                VDF.GetIsTypeAnonymous = function (typeName) {
                    return typeName != null && typeName == "object";
                };
                VDF.GetTypeNameOfObject = function (obj) {
                    var rawType = typeof obj;
                    if (rawType == "object") {
                        if (obj.realTypeName)
                            return obj.realTypeName;
                        if (obj.itemType)
                            return "List(" + obj.itemType + ")";
                        var nativeTypeName = obj.constructor.name_fake || obj.constructor.name || null;
                        if (nativeTypeName == "Boolean")
                            return "bool";
                        if (nativeTypeName == "Number")
                            return obj.toString().Contains(".") ? "double" : "int";
                        if (nativeTypeName == "String")
                            return "string";
                        if (nativeTypeName == "Object")
                            return "object";
                        if (nativeTypeName == "Array")
                            return "List(object)";
                        return nativeTypeName;
                    }
                    if (rawType == "boolean")
                        return "bool";
                    if (rawType == "number")
                        return obj.toString().Contains(".") ? "double" : "int";
                    if (rawType == "string")
                        return "string";
                    //return rawType; // string
                    //return null;
                    //return "object"; // consider objects with raw-types of undefined, function, etc. to just be anonymous-objects
                    return "object"; // consider everything else to be an anonymous-object
                };
                VDF.GetTypeNameRoot = function (typeName) { return typeName != null && typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName; };
                VDF.GetClassProps = function (type, allowGetFromCache) {
                    if (allowGetFromCache === void 0) { allowGetFromCache = true; }
                    if (type == null)
                        return {};
                    if (!type.hasOwnProperty("classPropsCache") || type.allowPropsCache === false || !allowGetFromCache) {
                        var result = {};
                        var currentType = type;
                        while (currentType && currentType != Object) {
                            // get static props on constructor itself
                            for (var _i = 0, _a = Object.getOwnPropertyNames(currentType); _i < _a.length; _i++) {
                                var propName = _a[_i];
                                if (propName in result)
                                    continue;
                                var propInfo = Object.getOwnPropertyDescriptor(currentType, propName);
                                // don't include if prop is a getter or setter func (causes problems when enumerating)
                                if (propInfo == null || (propInfo.get == null && propInfo.set == null))
                                    result[propName] = currentType[propName];
                            }
                            // get "real" props on the prototype-object
                            for (var _b = 0, _c = Object.getOwnPropertyNames(currentType.prototype); _b < _c.length; _b++) {
                                var propName = _c[_b];
                                if (propName in result)
                                    continue;
                                var propInfo = Object.getOwnPropertyDescriptor(currentType.prototype, propName);
                                // don't include if prop is a getter or setter func (causes problems when enumerating)
                                if (propInfo == null || (propInfo.get == null && propInfo.set == null))
                                    result[propName] = currentType.prototype[propName];
                            }
                            currentType = Object.getPrototypeOf(currentType.prototype).constructor;
                        }
                        type.classPropsCache = result;
                    }
                    return type.classPropsCache;
                };
                VDF.GetObjectProps = function (obj) {
                    if (obj == null)
                        return {};
                    var result = {};
                    for (var propName in VDF.GetClassProps(obj.constructor))
                        result[propName] = null;
                    for (var propName in obj)
                        result[propName] = null;
                    return result;
                };
                VDF.Serialize = function (obj, declaredTypeName_orOptions, options_orNothing) {
                    if (declaredTypeName_orOptions instanceof VDFSaver_1.VDFSaveOptions)
                        return VDF.Serialize(obj, null, declaredTypeName_orOptions);
                    var declaredTypeName = declaredTypeName_orOptions;
                    var options = options_orNothing;
                    return VDFSaver_1.VDFSaver.ToVDFNode(obj, declaredTypeName, options).ToVDF(options);
                };
                VDF.Deserialize = function (vdf, declaredTypeName_orOptions, options_orNothing) {
                    if (declaredTypeName_orOptions instanceof VDFLoader_1.VDFLoadOptions)
                        return VDF.Deserialize(vdf, null, declaredTypeName_orOptions);
                    var declaredTypeName = declaredTypeName_orOptions;
                    var options = options_orNothing;
                    return VDFLoader_1.VDFLoader.ToVDFNode(vdf, declaredTypeName, options).ToObject(declaredTypeName, options);
                };
                VDF.DeserializeInto = function (vdf, obj, options) { VDFLoader_1.VDFLoader.ToVDFNode(vdf, VDF.GetTypeNameOfObject(obj), options).IntoObject(obj, options); };
                return VDF;
            }());
            // for use with VDFSaveOptions
            VDF.AnyMember = "#AnyMember";
            VDF.AllMembers = ["#AnyMember"];
            // for use with VDFType
            VDF.PropRegex_Any = ""; //"^.+$";
            exports_1("VDF", VDF);
        }
    };
});
//# sourceMappingURL=VDF.js.map