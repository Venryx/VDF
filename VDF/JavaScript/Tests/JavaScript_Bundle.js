var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define("Source/TypeScript/VDFTypeInfo", ["require", "exports", "Source/TypeScript/VDF", "Source/TypeScript/VDFExtras"], function (require, exports, VDF_1, VDFExtras_1) {
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
    exports.TypeInfo = TypeInfo;
    ;
    var VDFProp = (function () {
        function VDFProp(includeL2, popOutL2) {
            if (includeL2 === void 0) { includeL2 = true; }
            this.includeL2 = includeL2;
            this.popOutL2 = popOutL2;
        }
        return VDFProp;
    }());
    exports.VDFProp = VDFProp;
    var VDFPropInfo = (function () {
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
    function T(typeOrTypeName) {
        return function (target, name) {
            //target.prototype[name].AddTags(new VDFPostDeserialize());
            //Prop(target, name, typeOrTypeName);
            //target.p(name, typeOrTypeName);
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.typeName = typeOrTypeName instanceof Function ? typeOrTypeName.name : typeOrTypeName;
        };
    }
    exports.T = T;
    ;
    function P(includeL2, popOutL2) {
        if (includeL2 === void 0) { includeL2 = true; }
        return function (target, name) {
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.AddTags(new VDFProp(includeL2, popOutL2));
        };
    }
    exports.P = P;
    ;
    var DefaultValue = (function () {
        function DefaultValue(defaultValue) {
            if (defaultValue === void 0) { defaultValue = exports.D.DefaultDefault; }
            this.defaultValue = defaultValue;
        }
        return DefaultValue;
    }());
    exports.DefaultValue = DefaultValue;
    exports.D = function D(defaultValue) {
        return function (target, name) {
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.AddTags(new DefaultValue(defaultValue));
        };
    };
    exports.D.DefaultDefault = {};
    exports.D.NullOrEmpty = {};
    exports.D.Empty = {};
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
});
/*export class VDFMethodInfo {
    tags: any[];
    constructor(tags: any[]) { this.tags = tags; }
}*/ 
define("Source/TypeScript/VDFExtras", ["require", "exports"], function (require, exports) {
    // classes
    // ==========
    var VDFNodePathNode = (function () {
        function VDFNodePathNode(obj, prop, list_index, map_keyIndex, map_key) {
            if (obj === void 0) { obj = null; }
            if (prop === void 0) { prop = null; }
            if (list_index === void 0) { list_index = null; }
            if (map_keyIndex === void 0) { map_keyIndex = null; }
            if (map_key === void 0) { map_key = null; }
            this.list_index = null;
            this.map_keyIndex = null;
            this.obj = obj;
            this.prop = prop;
            this.list_index = list_index;
            this.map_keyIndex = map_keyIndex;
            this.map_key = map_key;
        }
        //Clone(): VDFNodePathNode { return new VDFNodePathNode(this.obj, this.prop, this.list_index, this.map_keyIndex, this.map_key); }
        // for debugging
        VDFNodePathNode.prototype.toString = function () {
            if (this.list_index != null)
                return "i:" + this.list_index;
            if (this.map_keyIndex != null)
                return "ki:" + this.map_keyIndex;
            if (this.map_key != null)
                return "k:" + this.map_key;
            if (this.prop != null)
                //return "p:" + this.prop.name;
                return this.prop.name;
            return "";
        };
        return VDFNodePathNode;
    }());
    exports.VDFNodePathNode = VDFNodePathNode;
    var VDFNodePath = (function () {
        function VDFNodePath(nodes_orRootNode) {
            this.nodes = nodes_orRootNode instanceof Array ? nodes_orRootNode : [nodes_orRootNode];
        }
        Object.defineProperty(VDFNodePath.prototype, "rootNode", {
            get: function () { return this.nodes[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VDFNodePath.prototype, "parentNode", {
            get: function () { return this.nodes.length >= 2 ? this.nodes[this.nodes.length - 2] : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VDFNodePath.prototype, "currentNode", {
            get: function () { return this.nodes[this.nodes.length - 1]; },
            enumerable: true,
            configurable: true
        });
        VDFNodePath.prototype.ExtendAsListItem = function (index, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, null, index));
            return new VDFNodePath(newNodes);
        };
        VDFNodePath.prototype.ExtendAsMapKey = function (keyIndex, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, null, null, keyIndex));
            return new VDFNodePath(newNodes);
        };
        VDFNodePath.prototype.ExtendAsMapItem = function (key, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, null, null, null, key));
            return new VDFNodePath(newNodes);
        };
        VDFNodePath.prototype.ExtendAsChild = function (prop, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, prop));
            return new VDFNodePath(newNodes);
        };
        // for debugging
        VDFNodePath.prototype.toString = function () {
            var result = "";
            var index = 0;
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                result += (index++ == 0 ? "" : "/") + node;
            }
            return result;
        };
        return VDFNodePath;
    }());
    exports.VDFNodePath = VDFNodePath;
    // helper classes
    // ==================
    var VDFUtils = (function () {
        function VDFUtils() {
        }
        /*static SetUpHiddenFields(obj, addSetters?: boolean, ...fieldNames) 	{
            if (addSetters && !obj._hiddenFieldStore)
                Object.defineProperty(obj, "_hiddenFieldStore", {enumerable: false, value: {}});
            for (var i in fieldNames)
                (()=>{
                    var propName = fieldNames[i];
                    var origValue = obj[propName];
                    if (addSetters)
                        Object.defineProperty(obj, propName, 					{
                            enumerable: false,
                            get: ()=>obj["_hiddenFieldStore"][propName],
                            set: value=>obj["_hiddenFieldStore"][propName] = value
                        });
                    else
                        Object.defineProperty(obj, propName, 					{
                            enumerable: false,
                            value: origValue //get: ()=>obj["_hiddenFieldStore"][propName]
                        });
                    obj[propName] = origValue; // for 'hiding' a prop that was set beforehand
                })();
        }*/
        VDFUtils.MakePropertiesHidden = function (obj, alsoMakeFunctionsHidden, addSetters) {
            for (var propName in obj) {
                var propDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
                if (propDescriptor) {
                    propDescriptor.enumerable = false;
                    Object.defineProperty(obj, propName, propDescriptor);
                }
            }
        };
        return VDFUtils;
    }());
    var StringBuilder = (function () {
        function StringBuilder(startData) {
            this.parts = [];
            this.length = 0;
            if (startData)
                this.Append(startData);
        }
        StringBuilder.prototype.Append = function (str) { this.parts.push(str); this.length += str.length; return this; }; // adds string str to the StringBuilder
        StringBuilder.prototype.Insert = function (index, str) { this.parts.splice(index, 0, str); this.length += str.length; return this; }; // inserts string 'str' at 'index'
        StringBuilder.prototype.Remove = function (index, count) {
            var removedItems = this.parts.splice(index, count != null ? count : 1);
            for (var i = 0; i < removedItems.length; i++)
                this.length -= removedItems[i].length;
            return this;
        };
        StringBuilder.prototype.Clear = function () {
            //this.splice(0, this.length);
            this.parts.length = 0;
            this.length = 0;
        };
        StringBuilder.prototype.ToString = function (joinerString) { return this.parts.join(joinerString || ""); }; // builds the string
        return StringBuilder;
    }());
    exports.StringBuilder = StringBuilder;
    // VDF-usable data wrappers
    // ==========
    //class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
    // for anonymous objects (JS anonymous-objects are all just instances of Object, so we don't lose anything by attaching type-info to the shared constructor)
    //var object = Object;
    //object["typeInfo"] = new VDFTypeInfo(null, true);
    var object = (function () {
        function object() {
        }
        return object;
    }()); // just an alias for Object, to be consistent with C# version
    exports.object = object;
    var EnumValue = (function () {
        function EnumValue(enumTypeName, intValue) {
            this.realTypeName = enumTypeName;
            //this.intValue = intValue;
            this.stringValue = EnumValue.GetEnumStringForIntValue(enumTypeName, intValue);
        }
        EnumValue.prototype.toString = function () { return this.stringValue; };
        EnumValue.IsEnum = function (typeName) { return window[typeName] && window[typeName]["_IsEnum"] === 0; };
        //static IsEnum(typeName: string): boolean { return window[typeName] && /}\)\((\w+) \|\| \(\w+ = {}\)\);/.test(window[typeName].toString()); }
        EnumValue.GetEnumIntForStringValue = function (enumTypeName, stringValue) { return eval(enumTypeName + "[\"" + stringValue + "\"]"); };
        EnumValue.GetEnumStringForIntValue = function (enumTypeName, intValue) { return eval(enumTypeName + "[" + intValue + "]"); };
        return EnumValue;
    }());
    exports.EnumValue = EnumValue;
    var List = (function (_super) {
        __extends(List, _super);
        function List(itemType) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var _this = 
            //super(...items);
            _super.call(this) || this;
            _this.__proto__ = List.prototype;
            _this.AddRange(items);
            _this.itemType = itemType;
            return _this;
        }
        Object.defineProperty(List.prototype, "Count", {
            get: function () { return this.length; },
            enumerable: true,
            configurable: true
        });
        /*s.Indexes = function () {
            var result = {};
            for (var i = 0; i < this.length; i++)
                result[i] = this[i];
            return result;
        }*/
        List.prototype.Add = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return this.push.apply(this, items);
        };
        List.prototype.AddRange = function (items) {
            /*for (var i = 0; i < items.length; i++)
                this.push(items[i]);*/
            this.push.apply(this, items);
        };
        List.prototype.Insert = function (index, item) { return this.splice(index, 0, item); };
        List.prototype.InsertRange = function (index, items) { return this.splice.apply(this, [index, 0].concat(items)); };
        List.prototype.Remove = function (item) { return this.RemoveAt(this.indexOf(item)) != null; };
        List.prototype.RemoveAt = function (index) { return this.splice(index, 1)[0]; };
        List.prototype.RemoveRange = function (index, count) { return this.splice(index, count); };
        List.prototype.Any = function (matchFunc) {
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                if (matchFunc.call(item, item))
                    return true;
            }
            return false;
        };
        List.prototype.All = function (matchFunc) {
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!matchFunc.call(item, item))
                    return false;
            }
            return true;
        };
        List.prototype.Select = function (selectFunc, itemType) {
            var result = new List(itemType || "object");
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                result.Add(selectFunc.call(item, item));
            }
            return result;
        };
        List.prototype.First = function (matchFunc) {
            var result = this.FirstOrDefault(matchFunc);
            if (result == null)
                throw new Error("Matching item not found.");
            return result;
        };
        List.prototype.FirstOrDefault = function (matchFunc) {
            if (matchFunc) {
                for (var _i = 0, _a = this; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (matchFunc.call(item, item))
                        return item;
                }
                return null;
            }
            else
                return this[0];
        };
        List.prototype.Last = function (matchFunc) {
            var result = this.LastOrDefault(matchFunc);
            if (result == null)
                throw new Error("Matching item not found.");
            return result;
        };
        List.prototype.LastOrDefault = function (matchFunc) {
            if (matchFunc) {
                for (var i = this.length - 1; i >= 0; i--)
                    if (matchFunc.call(this[i], this[i]))
                        return this[i];
                return null;
            }
            else
                return this[this.length - 1];
        };
        List.prototype.GetRange = function (index, count) {
            var result = new List(this.itemType);
            for (var i = index; i < index + count; i++)
                result.Add(this[i]);
            return result;
        };
        List.prototype.Contains = function (item) { return this.indexOf(item) != -1; };
        return List;
    }(Array));
    exports.List = List;
    window["List"] = List;
    var Dictionary = (function () {
        function Dictionary(keyType, valueType, keyValuePairsObj) {
            //VDFUtils.SetUpHiddenFields(this, true, "realTypeName", "keyType", "valueType", "keys", "values");
            this.realTypeName = "Dictionary(" + keyType + " " + valueType + ")";
            this.keyType = keyType;
            this.valueType = valueType;
            this.keys = [];
            this.values = [];
            if (keyValuePairsObj)
                for (var key in keyValuePairsObj)
                    this.Set(key, keyValuePairsObj[key]);
        }
        Object.defineProperty(Dictionary.prototype, "Keys", {
            // properties
            get: function () {
                var result = {};
                for (var i = 0; i < this.keys.length; i++)
                    result[this.keys[i]] = null;
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "Pairs", {
            get: function () {
                var result = [];
                for (var i = 0; i < this.keys.length; i++)
                    result.push({ index: i, key: this.keys[i], value: this.values[i] });
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "Count", {
            get: function () { return this.keys.length; },
            enumerable: true,
            configurable: true
        });
        // methods
        Dictionary.prototype.ContainsKey = function (key) { return this.keys.indexOf(key) != -1; };
        Dictionary.prototype.Get = function (key) { return this.values[this.keys.indexOf(key)]; };
        Dictionary.prototype.Set = function (key, value) {
            if (this.keys.indexOf(key) == -1)
                this.keys.push(key);
            this.values[this.keys.indexOf(key)] = value;
            if (typeof key == "string")
                this[key] = value; // make value accessible directly on Dictionary object
        };
        Dictionary.prototype.Add = function (key, value) {
            if (this.keys.indexOf(key) != -1)
                throw new Error("Dictionary already contains key '" + key + "'.");
            this.Set(key, value);
        };
        Dictionary.prototype.Remove = function (key) {
            var itemIndex = this.keys.indexOf(key);
            if (itemIndex == -1)
                return;
            this.keys.splice(itemIndex, 1);
            this.values.splice(itemIndex, 1);
            delete this[key];
        };
        return Dictionary;
    }());
    exports.Dictionary = Dictionary;
    window["Dictionary"] = Dictionary;
});
//VDFUtils.MakePropertiesHidden(Dictionary.prototype, true); 
define("Source/TypeScript/VDFTokenParser", ["require", "exports", "Source/TypeScript/VDFExtras", "Source/TypeScript/VDFLoader"], function (require, exports, VDFExtras_2, VDFLoader_1) {
    var VDFTokenType;
    (function (VDFTokenType) {
        //WiderMetadataEndMarker,
        //MetadataBaseValue,
        //LiteralStartMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
        //LiteralEndMarker
        //DataPropName,
        //DataStartMarker,
        //PoppedOutDataStartMarker,
        //PoppedOutDataEndMarker,
        //ItemSeparator,
        //DataBaseValue,
        //DataEndMarker,
        //Indent,
        // helper tokens for token-parser (or reader)
        VDFTokenType[VDFTokenType["LiteralStartMarker"] = 0] = "LiteralStartMarker";
        VDFTokenType[VDFTokenType["LiteralEndMarker"] = 1] = "LiteralEndMarker";
        VDFTokenType[VDFTokenType["StringStartMarker"] = 2] = "StringStartMarker";
        VDFTokenType[VDFTokenType["StringEndMarker"] = 3] = "StringEndMarker";
        VDFTokenType[VDFTokenType["InLineComment"] = 4] = "InLineComment";
        VDFTokenType[VDFTokenType["SpaceOrCommaSpan"] = 5] = "SpaceOrCommaSpan";
        VDFTokenType[VDFTokenType["None"] = 6] = "None";
        VDFTokenType[VDFTokenType["Tab"] = 7] = "Tab";
        VDFTokenType[VDFTokenType["LineBreak"] = 8] = "LineBreak";
        VDFTokenType[VDFTokenType["Metadata"] = 9] = "Metadata";
        VDFTokenType[VDFTokenType["MetadataEndMarker"] = 10] = "MetadataEndMarker";
        VDFTokenType[VDFTokenType["Key"] = 11] = "Key";
        VDFTokenType[VDFTokenType["KeyValueSeparator"] = 12] = "KeyValueSeparator";
        VDFTokenType[VDFTokenType["PoppedOutChildGroupMarker"] = 13] = "PoppedOutChildGroupMarker";
        VDFTokenType[VDFTokenType["Null"] = 14] = "Null";
        VDFTokenType[VDFTokenType["Boolean"] = 15] = "Boolean";
        VDFTokenType[VDFTokenType["Number"] = 16] = "Number";
        VDFTokenType[VDFTokenType["String"] = 17] = "String";
        VDFTokenType[VDFTokenType["ListStartMarker"] = 18] = "ListStartMarker";
        VDFTokenType[VDFTokenType["ListEndMarker"] = 19] = "ListEndMarker";
        VDFTokenType[VDFTokenType["MapStartMarker"] = 20] = "MapStartMarker";
        VDFTokenType[VDFTokenType["MapEndMarker"] = 21] = "MapEndMarker";
    })(VDFTokenType = exports.VDFTokenType || (exports.VDFTokenType = {}));
    var VDFToken = (function () {
        function VDFToken(type, position, index, text) {
            this.type = type;
            this.position = position;
            this.index = index;
            this.text = text;
        }
        return VDFToken;
    }());
    exports.VDFToken = VDFToken;
    var VDFTokenParser = (function () {
        function VDFTokenParser() {
        }
        VDFTokenParser.ParseTokens = function (text, options, parseAllTokens, postProcessTokens) {
            if (parseAllTokens === void 0) { parseAllTokens = false; }
            if (postProcessTokens === void 0) { postProcessTokens = true; }
            text = (text || "").replace(/\r\n/g, "\n"); // maybe temp
            options = options || new VDFLoader_1.VDFLoadOptions();
            var result = new VDFExtras_2.List("VDFToken");
            var currentTokenFirstCharPos = 0;
            var currentTokenTextBuilder = new VDFExtras_2.StringBuilder();
            var currentTokenType = VDFTokenType.None;
            var activeLiteralStartChars = null;
            var activeStringStartChar = null;
            var lastScopeIncreaseChar = null;
            var addNextCharToTokenText = true;
            var specialEnderChar = '№';
            text += specialEnderChar; // add special ender-char, so don't need to use Nullable for nextChar var
            var ch;
            var nextChar = text[0];
            for (var i = 0; i < text.length - 1; i++) {
                ch = nextChar;
                nextChar = text[i + 1];
                if (addNextCharToTokenText)
                    currentTokenTextBuilder.Append(ch);
                addNextCharToTokenText = true;
                if (activeLiteralStartChars != null) {
                    // if first char of literal-end-marker
                    if (ch == '>' && i + activeLiteralStartChars.length <= text.length && text.substr(i, activeLiteralStartChars.length) == activeLiteralStartChars.replace(/</g, ">")) {
                        if (parseAllTokens)
                            result.Add(new VDFToken(VDFTokenType.LiteralEndMarker, i, result.Count, activeLiteralStartChars.replace(/</g, ">"))); // (if this end-marker token is within a string, it'll come before the string token)
                        currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                        currentTokenFirstCharPos += activeLiteralStartChars.length; // don't count this inserted token text as part of main-token text
                        i += activeLiteralStartChars.length - 2; // have next char processed be the last char of literal-end-marker
                        addNextCharToTokenText = false; // but don't have it be added to the main-token text
                        if (text[i + 1 - activeLiteralStartChars.length] == '#')
                            currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                        activeLiteralStartChars = null;
                        nextChar = i < text.length - 1 ? text[i + 1] : specialEnderChar; // update after i-modification, since used for next loop's 'ch' value
                        continue;
                    }
                }
                else {
                    if (ch == '<' && nextChar == '<') {
                        activeLiteralStartChars = "";
                        while (i + activeLiteralStartChars.length < text.length && text[i + activeLiteralStartChars.length] == '<')
                            activeLiteralStartChars += "<";
                        if (parseAllTokens)
                            result.Add(new VDFToken(VDFTokenType.LiteralStartMarker, i, result.Count, activeLiteralStartChars));
                        currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                        currentTokenFirstCharPos += activeLiteralStartChars.length; // don't count this inserted token text as part of main-token text
                        i += activeLiteralStartChars.length - 1; // have next char processed be the one right after literal-start-marker
                        if (text[i + 1] == '#') {
                            currentTokenFirstCharPos++;
                            i++;
                        }
                        nextChar = i < text.length - 1 ? text[i + 1] : specialEnderChar; // update after i-modification, since used for next loop's 'ch' value
                        continue;
                    }
                    // else
                    {
                        if (activeStringStartChar == null) {
                            if (ch == '\'' || ch == '"') {
                                activeStringStartChar = ch;
                                if (parseAllTokens)
                                    result.Add(new VDFToken(VDFTokenType.StringStartMarker, i, result.Count, activeStringStartChar));
                                currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                                currentTokenFirstCharPos++; // don't count this inserted token text as part of main-token text
                                // special case; if string-start-marker for an empty string
                                if (ch == nextChar)
                                    result.Add(new VDFToken(VDFTokenType.String, currentTokenFirstCharPos, result.Count, ""));
                                continue;
                            }
                        }
                        else if (activeStringStartChar == ch) {
                            if (parseAllTokens)
                                result.Add(new VDFToken(VDFTokenType.StringEndMarker, i, result.Count, ch));
                            currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                            currentTokenFirstCharPos++; // don't count this inserted token text as part of main-token text
                            activeStringStartChar = null;
                            continue;
                        }
                    }
                }
                // if not in literal
                if (activeLiteralStartChars == null)
                    // if in a string
                    if (activeStringStartChar != null) {
                        // if last-char of string
                        if (activeStringStartChar == nextChar)
                            currentTokenType = VDFTokenType.String;
                    }
                    else {
                        var firstTokenChar = currentTokenTextBuilder.length == 1;
                        if (nextChar == '>')
                            currentTokenType = VDFTokenType.Metadata;
                        else if (nextChar == ':')
                            currentTokenType = VDFTokenType.Key;
                        else {
                            // at this point, all the options are mutually-exclusive (concerning the 'ch' value), so use a switch statement)
                            switch (ch) {
                                case '#':
                                    if (nextChar == '#' && firstTokenChar) {
                                        currentTokenTextBuilder = new VDFExtras_2.StringBuilder(text.substr(i, (text.indexOf("\n", i + 1) != -1 ? text.indexOf("\n", i + 1) : text.length) - i));
                                        currentTokenType = VDFTokenType.InLineComment;
                                        i += currentTokenTextBuilder.length - 1; // have next char processed by the one right after comment (i.e. the line-break char)
                                        nextChar = i < text.length - 1 ? text[i + 1] : specialEnderChar; // update after i-modification, since used for next loop's 'ch' value
                                    }
                                    break;
                                case ' ':
                                case ',':
                                    if ((ch == ' ' || (options.allowCommaSeparators && ch == ','))
                                        && (nextChar != ' ' && (!options.allowCommaSeparators || nextChar != ','))
                                        && currentTokenTextBuilder.ToString().TrimStart(options.allowCommaSeparators ? [' ', ','] : [' ']).length == 0)
                                        currentTokenType = VDFTokenType.SpaceOrCommaSpan;
                                    break;
                                case '\t':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.Tab;
                                    break;
                                case '\n':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.LineBreak;
                                    break;
                                case '>':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.MetadataEndMarker;
                                    break;
                                case ':':
                                    //else if (nextNonSpaceChar == ':' && ch != ' ')
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.KeyValueSeparator;
                                    break;
                                case '^':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.PoppedOutChildGroupMarker;
                                    break;
                                case 'l':
                                    if (currentTokenTextBuilder.length == 4 && currentTokenTextBuilder.ToString() == "null" && (nextChar == null || !VDFTokenParser.charsAToZ.Contains(nextChar)))
                                        currentTokenType = VDFTokenType.Null;
                                    break;
                                case 'e':
                                    if ((currentTokenTextBuilder.length == 5 && currentTokenTextBuilder.ToString() == "false")
                                        || (currentTokenTextBuilder.length == 4 && currentTokenTextBuilder.ToString() == "true")) {
                                        currentTokenType = VDFTokenType.Boolean;
                                        break;
                                    }
                                /*else
                                    goto case '0';
                                break;*/
                                case '0':
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                case '.':
                                case '-':
                                case '+': /*case 'e':*/
                                case 'E':
                                case 'y':
                                    if ((VDFTokenParser.chars0To9DotAndNegative.Contains(currentTokenTextBuilder.parts[0]) && currentTokenTextBuilder.parts[0].toLowerCase() != "e" // if first-char is valid as start of number
                                        && !VDFTokenParser.chars0To9DotAndNegative.Contains(nextChar) && nextChar != 'I' // and next-char is not valid as part of number
                                        && (lastScopeIncreaseChar == "[" || result.Count == 0 || result.Last().type == VDFTokenType.Metadata || result.Last().type == VDFTokenType.KeyValueSeparator))
                                        || ((currentTokenTextBuilder.length == 8 && currentTokenTextBuilder.ToString() == "Infinity") || (currentTokenTextBuilder.length == 9 && currentTokenTextBuilder.ToString() == "-Infinity")))
                                        currentTokenType = VDFTokenType.Number;
                                    break;
                                case '[':
                                    if (firstTokenChar) {
                                        currentTokenType = VDFTokenType.ListStartMarker;
                                        lastScopeIncreaseChar = ch;
                                    }
                                    break;
                                case ']':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.ListEndMarker;
                                    break;
                                case '{':
                                    if (firstTokenChar) {
                                        currentTokenType = VDFTokenType.MapStartMarker;
                                        lastScopeIncreaseChar = ch;
                                    }
                                    break;
                                case '}':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.MapEndMarker;
                                    break;
                            }
                        }
                    }
                if (currentTokenType != VDFTokenType.None) {
                    if (parseAllTokens || (currentTokenType != VDFTokenType.InLineComment && currentTokenType != VDFTokenType.SpaceOrCommaSpan && currentTokenType != VDFTokenType.MetadataEndMarker))
                        result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count, currentTokenTextBuilder.ToString()));
                    currentTokenFirstCharPos = i + 1;
                    currentTokenTextBuilder.Clear();
                    currentTokenType = VDFTokenType.None;
                }
            }
            if (postProcessTokens)
                result = VDFTokenParser.PostProcessTokens(result, options);
            return result;
        };
        /*static FindNextNonXCharPosition(text: string, startPos: number, x: string) {
            for (var i = startPos; i < text.length; i++)
                if (text[i] != x)
                    return i;
            return -1;
        }*/
        /*static UnpadString(paddedString: string) {
            var result = paddedString;
            if (result.StartsWith("#"))
                result = result.substr(1); // chop off first char, as it was just added by the serializer for separation
            if (result.EndsWith("#"))
                result = result.substr(0, result.length - 1);
            return result;
        }*/
        /*static PostProcessTokens(tokens: List<VDFToken>, options: VDFLoadOptions): List<VDFToken> {
            // pass 1: update strings-before-key-value-separator-tokens to be considered keys, if that's enabled (one reason being, for JSON compatibility)
            // ----------
            
            if (options.allowStringKeys)
                for (var i = <any>0; i < tokens.Count; i++)
                    if (tokens[i].type == VDFTokenType.String && i + 1 < tokens.Count && tokens[i + 1].type == VDFTokenType.KeyValueSeparator)
                        tokens[i].type = VDFTokenType.Key;
    
            // pass 2: re-wrap popped-out-children with parent brackets/braces
            // ----------
    
            tokens.Add(new VDFToken(VDFTokenType.None, -1, -1, "")); // maybe temp: add depth-0-ender helper token
    
            var line_tabsReached = 0;
            var tabDepth_popOutBlockEndWrapTokens = new Dictionary<number, List<VDFToken>>("int", "List(VDFToken)");
            for (var i = <any>0; i < tokens.Count; i++) {
                var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
                var token = tokens[i];
                if (token.type == VDFTokenType.Tab)
                    line_tabsReached++;
                else if (token.type == VDFTokenType.LineBreak)
                    line_tabsReached = 0;
                else if (token.type == VDFTokenType.PoppedOutChildGroupMarker) {
                    if (lastToken.type == VDFTokenType.ListStartMarker || lastToken.type == VDFTokenType.MapStartMarker) { //lastToken.type != VDFTokenType.Tab)
                        var enderTokenIndex = i + 1;
                        while (enderTokenIndex < tokens.Count - 1 && tokens[enderTokenIndex].type != VDFTokenType.LineBreak && (tokens[enderTokenIndex].type != VDFTokenType.PoppedOutChildGroupMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.ListStartMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.MapStartMarker))
                            enderTokenIndex++;
                        // the wrap-group consists of the on-same-line text after the popped-out-child-marker (eg the "]}" in "{children:[^]}")
                        var wrapGroupTabDepth = tokens[enderTokenIndex].type == VDFTokenType.PoppedOutChildGroupMarker ? line_tabsReached - 1 : line_tabsReached;
                        tabDepth_popOutBlockEndWrapTokens.Set(wrapGroupTabDepth, tokens.GetRange(i + 1, enderTokenIndex - (i + 1)));
                        tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth)[0].index = i + 1; // update index
                        i = enderTokenIndex - 1; // have next token processed be the ender-token (^^[...] or line-break)
                    }
                    else if (lastToken.type == VDFTokenType.Tab) {
                        var wrapGroupTabDepth = lastToken.type == VDFTokenType.Tab ? line_tabsReached - 1 : line_tabsReached;
                        tokens.InsertRange(i, tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth));
                        tokens.RemoveRange(tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth)[0].index, tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth).Count); // index was updated when set put together
    
                        i -= tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth).Count + 1; // have next token processed be the first pop-out-block-end-wrap-token
                        tabDepth_popOutBlockEndWrapTokens.Remove(wrapGroupTabDepth);
                    }
                }
                else if (lastToken != null && (lastToken.type == VDFTokenType.LineBreak || lastToken.type == VDFTokenType.Tab || token.type == VDFTokenType.None)) {
                    if (token.type == VDFTokenType.None) // if depth-0-ender helper token
                        line_tabsReached = 0;
    
                    // if we have no popped-out content that we now need to wrap
                    if (tabDepth_popOutBlockEndWrapTokens.Count == 0) continue;
    
                    var maxTabDepth = -1;
                    for (var key in tabDepth_popOutBlockEndWrapTokens.Keys)
                        if (parseInt(key) > maxTabDepth)
                            maxTabDepth = parseInt(key);
                    for (var tabDepth = maxTabDepth; tabDepth >= line_tabsReached; tabDepth--) {
                        if (!tabDepth_popOutBlockEndWrapTokens.ContainsKey(tabDepth)) continue;
                        tokens.InsertRange(i, tabDepth_popOutBlockEndWrapTokens.Get(tabDepth));
                        tokens.RemoveRange(tabDepth_popOutBlockEndWrapTokens.Get(tabDepth)[0].index, tabDepth_popOutBlockEndWrapTokens.Get(tabDepth).Count); // index was updated when set put together
    
                        // old; maybe temp; fix for that tokens were not post-processed correctly for multiply-nested popped-out maps/lists
                        //VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
    
                        tabDepth_popOutBlockEndWrapTokens.Remove(tabDepth);
                    }
                }
            }
    
            tokens.RemoveAt(tokens.Count - 1); // maybe temp: remove depth-0-ender helper token
    
            // pass 3: remove all now-useless tokens
            // ----------
            
            var result = new List<VDFToken>(); //"VDFToken");
            for (let i in tokens.Indexes()) {
                let token = tokens[i];
                if (!(token.type == VDFTokenType.Tab || token.type == VDFTokenType.LineBreak || token.type == VDFTokenType.MetadataEndMarker || token.type == VDFTokenType.KeyValueSeparator || token.type == VDFTokenType.PoppedOutChildGroupMarker))
                    result.Add(token);
            }
    
            // pass 4: fix token position-and-index properties
            // ----------
    
            VDFTokenParser.RefreshTokenPositionAndIndexProperties(result); //tokens);
    
            //Console.Write(String.Join(" ", tokens.Select(a=>a.text).ToArray())); // temp; for testing
    
            return result;
        }*/
        VDFTokenParser.PostProcessTokens = function (origTokens, options) {
            var result = new VDFExtras_2.List(); //"VDFToken");
            // 1: update strings-before-key-value-separator-tokens to be considered keys, if that's enabled (one reason being, for JSON compatibility)
            // 2: re-wrap popped-out-children with parent brackets/braces
            var groupDepth_tokenSetsToProcessAfterGroupEnds = new VDFExtras_2.Dictionary("int", "List(VDFToken)");
            var tokenSetsToProcess = [];
            // maybe temp: add depth-0-ender helper token
            tokenSetsToProcess.push(new TokenSet(new VDFExtras_2.List("VDFToken", new VDFToken(VDFTokenType.None, -1, -1, ""))));
            tokenSetsToProcess.push(new TokenSet(origTokens));
            while (tokenSetsToProcess.length > 0) {
                var tokenSet = tokenSetsToProcess[tokenSetsToProcess.length - 1];
                var tokens = tokenSet.tokens;
                var i = tokenSet.currentTokenIndex;
                var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
                var token = tokens[i];
                //var addThisToken = true;
                var addThisToken = !(token.type == VDFTokenType.Tab || token.type == VDFTokenType.LineBreak
                    || token.type == VDFTokenType.MetadataEndMarker || token.type == VDFTokenType.KeyValueSeparator
                    || token.type == VDFTokenType.PoppedOutChildGroupMarker
                    || token.type == VDFTokenType.None);
                if (token.type == VDFTokenType.String && i + 1 < tokens.Count && tokens[i + 1].type == VDFTokenType.KeyValueSeparator && options.allowStringKeys) {
                    token.type = VDFTokenType.Key;
                }
                //var line_tabsReached_old = line_tabsReached;
                if (token.type == VDFTokenType.Tab) {
                    tokenSet.line_tabsReached++;
                }
                else if (token.type == VDFTokenType.LineBreak) {
                    tokenSet.line_tabsReached = 0;
                }
                if (token.type == VDFTokenType.None ||
                    ((lastToken && (lastToken.type == VDFTokenType.LineBreak || lastToken.type == VDFTokenType.Tab))
                        && token.type != VDFTokenType.LineBreak && token.type != VDFTokenType.Tab)) {
                    // if there's popped-out content, check for any end-stuff that we need to now add (because the popped-out block ended)
                    if (groupDepth_tokenSetsToProcessAfterGroupEnds.Count > 0) {
                        var tabDepthEnded = token.type == VDFTokenType.PoppedOutChildGroupMarker ? tokenSet.line_tabsReached : tokenSet.line_tabsReached + 1;
                        var deepestTokenSetToProcessAfterGroupEnd_depth = groupDepth_tokenSetsToProcessAfterGroupEnds
                            .keys[groupDepth_tokenSetsToProcessAfterGroupEnds.keys.length - 1];
                        if (deepestTokenSetToProcessAfterGroupEnd_depth >= tabDepthEnded) {
                            var deepestTokenSetToProcessAfterGroupEnd = groupDepth_tokenSetsToProcessAfterGroupEnds.Get(deepestTokenSetToProcessAfterGroupEnd_depth);
                            tokenSetsToProcess.push(deepestTokenSetToProcessAfterGroupEnd);
                            groupDepth_tokenSetsToProcessAfterGroupEnds.Remove(deepestTokenSetToProcessAfterGroupEnd_depth);
                            if (token.type == VDFTokenType.PoppedOutChildGroupMarker)
                                tokenSet.currentTokenIndex++;
                            // we just added a collection-to-process, so go process that immediately (we'll get back to our collection later)
                            continue;
                        }
                    }
                }
                if (token.type == VDFTokenType.PoppedOutChildGroupMarker) {
                    addThisToken = false;
                    if (lastToken.type == VDFTokenType.ListStartMarker || lastToken.type == VDFTokenType.MapStartMarker) {
                        var enderTokenIndex = i + 1;
                        while (enderTokenIndex < tokens.Count && tokens[enderTokenIndex].type != VDFTokenType.LineBreak && (tokens[enderTokenIndex].type != VDFTokenType.PoppedOutChildGroupMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.ListStartMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.MapStartMarker))
                            enderTokenIndex++;
                        // the wrap-group consists of the on-same-line text after the popped-out-child-marker (eg the "]}" in "{children:[^]}")
                        var wrapGroupTabDepth = tokenSet.line_tabsReached + 1;
                        var wrapGroupTokens = tokens.GetRange(i + 1, enderTokenIndex - (i + 1));
                        groupDepth_tokenSetsToProcessAfterGroupEnds.Add(wrapGroupTabDepth, new TokenSet(wrapGroupTokens, tokenSet.line_tabsReached));
                        groupDepth_tokenSetsToProcessAfterGroupEnds.Get(wrapGroupTabDepth).tokens[0].index = i + 1; // update index
                        // skip processing the wrap-group-tokens (at this point)
                        i += wrapGroupTokens.Count;
                    }
                }
                if (addThisToken)
                    result.Add(token);
                // if last token in this collection, remove collection (end its processing)
                if (i == tokens.Count - 1)
                    tokenSetsToProcess.pop();
                tokenSet.currentTokenIndex = i + 1;
            }
            // fix token position-and-index properties
            VDFTokenParser.RefreshTokenPositionAndIndexProperties(result); //tokens);
            // for testing
            // ==========
            /*Log(origTokens.Select(a=>a.text).join(" "));
            Log("==========");
            Log(result.Select(a=>a.text).join(" "));*/
            /*Assert(groupDepth_tokenSetsToProcessAfterGroupEnds.Count == 0, "A token-set-to-process-after-group-end was never processed!");
            Assert(result.Where(a=>a.type == VDFTokenType.MapStartMarker).length == result.Where(a=>a.type == VDFTokenType.MapEndMarker).length,
                `Map start-marker count ${result.Where(a=>a.type == VDFTokenType.MapStartMarker).length} and `
                    + `end-marker count ${result.Where(a=>a.type == VDFTokenType.MapEndMarker).length} must be equal.`);
            Assert(result.Where(a=>a.type == VDFTokenType.ListStartMarker).length == result.Where(a=>a.type == VDFTokenType.ListEndMarker).length,
                `List start-marker count ${result.Where(a=>a.type == VDFTokenType.ListStartMarker).length} and `
                    + `end- marker count ${result.Where(a=>a.type == VDFTokenType.ListEndMarker).length } must be equal.`);*/
            return result;
        };
        VDFTokenParser.RefreshTokenPositionAndIndexProperties = function (tokens) {
            var textProcessedLength = 0;
            for (var i = 0; i < tokens.Count; i++) {
                var token = tokens[i];
                token.position = textProcessedLength;
                token.index = i;
                textProcessedLength += token.text.length;
            }
        };
        return VDFTokenParser;
    }());
    VDFTokenParser.charsAToZ = VDFExtras_2.List.apply(null, ["string"].concat("abcdefghijklmnopqrstuvwxyz".match(/./g)));
    VDFTokenParser.chars0To9DotAndNegative = VDFExtras_2.List.apply(null, ["string"].concat("0123456789\.\-\+eE".match(/./g)));
    exports.VDFTokenParser = VDFTokenParser;
    var TokenSet = (function () {
        function TokenSet(tokens, line_tabsReached) {
            if (line_tabsReached === void 0) { line_tabsReached = 0; }
            this.currentTokenIndex = 0;
            this.line_tabsReached = 0;
            this.tokens = tokens;
            this.line_tabsReached = line_tabsReached;
        }
        return TokenSet;
    }());
    exports.TokenSet = TokenSet;
});
define("Source/TypeScript/VDFLoader", ["require", "exports", "Source/TypeScript/VDFNode", "Source/TypeScript/VDFTokenParser", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDFExtras", "Source/TypeScript/VDF"], function (require, exports, VDFNode_1, VDFTokenParser_1, VDFTypeInfo_1, VDFExtras_3, VDF_2) {
    var VDFLoadOptions = (function () {
        function VDFLoadOptions(initializerObj, messages, allowStringKeys, allowCommaSeparators, loadUnknownTypesAsBasicTypes) {
            if (allowStringKeys === void 0) { allowStringKeys = true; }
            if (allowCommaSeparators === void 0) { allowCommaSeparators = false; }
            if (loadUnknownTypesAsBasicTypes === void 0) { loadUnknownTypesAsBasicTypes = false; }
            this.objPostDeserializeFuncs_early = new VDFExtras_3.Dictionary("object", "List(Function)");
            this.objPostDeserializeFuncs = new VDFExtras_3.Dictionary("object", "List(Function)");
            this.messages = messages || [];
            this.allowStringKeys = allowStringKeys;
            this.allowCommaSeparators = allowCommaSeparators;
            this.loadUnknownTypesAsBasicTypes = loadUnknownTypesAsBasicTypes;
            if (initializerObj)
                for (var key in initializerObj)
                    this[key] = initializerObj[key];
        }
        VDFLoadOptions.prototype.AddObjPostDeserializeFunc = function (obj, func, early) {
            if (early === void 0) { early = false; }
            if (early) {
                if (!this.objPostDeserializeFuncs_early.ContainsKey(obj))
                    this.objPostDeserializeFuncs_early.Add(obj, new VDFExtras_3.List("Function"));
                this.objPostDeserializeFuncs_early.Get(obj).Add(func);
            }
            else {
                if (!this.objPostDeserializeFuncs.ContainsKey(obj))
                    this.objPostDeserializeFuncs.Add(obj, new VDFExtras_3.List("Function"));
                this.objPostDeserializeFuncs.Get(obj).Add(func);
            }
        };
        VDFLoadOptions.prototype.ForJSON = function () {
            this.allowStringKeys = true;
            this.allowCommaSeparators = true;
            return this;
        };
        return VDFLoadOptions;
    }());
    exports.VDFLoadOptions = VDFLoadOptions;
    var VDFLoader = (function () {
        function VDFLoader() {
        }
        VDFLoader.ToVDFNode = function (tokens_orText, declaredTypeName_orOptions, options, firstTokenIndex, enderTokenIndex) {
            if (firstTokenIndex === void 0) { firstTokenIndex = 0; }
            if (enderTokenIndex === void 0) { enderTokenIndex = -1; }
            if (declaredTypeName_orOptions instanceof VDFLoadOptions)
                return VDFLoader.ToVDFNode(tokens_orText, null, declaredTypeName_orOptions);
            if (typeof tokens_orText == "string")
                return VDFLoader.ToVDFNode(VDFTokenParser_1.VDFTokenParser.ParseTokens(tokens_orText, options), declaredTypeName_orOptions, options);
            var tokens = tokens_orText;
            var declaredTypeName = declaredTypeName_orOptions;
            options = options || new VDFLoadOptions();
            enderTokenIndex = enderTokenIndex != -1 ? enderTokenIndex : tokens.Count;
            // figure out obj-type
            // ==========
            var depth = 0;
            var tokensAtDepth0 = new VDFExtras_3.List("VDFToken");
            var tokensAtDepth1 = new VDFExtras_3.List("VDFToken");
            var i;
            for (var i = firstTokenIndex; i < enderTokenIndex; i++) {
                var token = tokens[i];
                if (token.type == VDFTokenParser_1.VDFTokenType.ListEndMarker || token.type == VDFTokenParser_1.VDFTokenType.MapEndMarker)
                    depth--;
                if (depth == 0)
                    tokensAtDepth0.Add(token);
                if (depth == 1)
                    tokensAtDepth1.Add(token);
                if (token.type == VDFTokenParser_1.VDFTokenType.ListStartMarker || token.type == VDFTokenParser_1.VDFTokenType.MapStartMarker)
                    depth++;
            }
            var fromVDFTypeName = "object";
            var firstNonMetadataToken = tokensAtDepth0.First(function (a) { return a.type != VDFTokenParser_1.VDFTokenType.Metadata; });
            if (tokensAtDepth0[0].type == VDFTokenParser_1.VDFTokenType.Metadata)
                fromVDFTypeName = tokensAtDepth0[0].text;
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Boolean)
                fromVDFTypeName = "bool";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Number)
                fromVDFTypeName = firstNonMetadataToken.text == "Infinity" || firstNonMetadataToken.text == "-Infinity" || firstNonMetadataToken.text.Contains(".") || firstNonMetadataToken.text.Contains("e") ? "double" : "int";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.String)
                fromVDFTypeName = "string";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.ListStartMarker)
                fromVDFTypeName = "List(object)";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.MapStartMarker)
                fromVDFTypeName = "Dictionary(object object)"; //"object";
            var typeName = declaredTypeName;
            if (fromVDFTypeName != null && fromVDFTypeName.length > 0) {
                // porting-note: this is only a limited implementation of CS functionality of making sure from-vdf-type is more specific than declared-type
                if (typeName == null || ["object", "IList", "IDictionary"].Contains(typeName))
                    typeName = fromVDFTypeName;
            }
            // for keys, force load as string, since we're not at the use-importer stage
            if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Key)
                typeName = "string";
            var typeGenericArgs = VDF_2.VDF.GetGenericArgumentsOfType(typeName);
            var typeInfo = VDFTypeInfo_1.VDFTypeInfo.Get(typeName);
            // create the object's VDFNode, and load in the data
            // ==========
            var node = new VDFNode_1.VDFNode();
            node.metadata = tokensAtDepth0[0].type == VDFTokenParser_1.VDFTokenType.Metadata ? fromVDFTypeName : null;
            // if primitive, parse value
            if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Null)
                node.primitiveValue = null;
            else if (typeName == "bool")
                node.primitiveValue = firstNonMetadataToken.text == "true" ? true : false;
            else if (typeName == "int")
                node.primitiveValue = parseInt(firstNonMetadataToken.text);
            else if (typeName == "float" || typeName == "double" || firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Number)
                node.primitiveValue = parseFloat(firstNonMetadataToken.text);
            else if (typeName == "string" || firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.String)
                node.primitiveValue = firstNonMetadataToken.text;
            else if (typeName.StartsWith("List(")) {
                node.isList = true;
                for (var i = 0; i < tokensAtDepth1.Count; i++) {
                    var token = tokensAtDepth1[i];
                    if (token.type != VDFTokenParser_1.VDFTokenType.ListEndMarker && token.type != VDFTokenParser_1.VDFTokenType.MapEndMarker) {
                        var itemFirstToken = tokens[token.index];
                        var itemEnderToken = tokensAtDepth1.FirstOrDefault(function (a) { return a.index > itemFirstToken.index + (itemFirstToken.type == VDFTokenParser_1.VDFTokenType.Metadata ? 1 : 0) && token.type != VDFTokenParser_1.VDFTokenType.ListEndMarker && token.type != VDFTokenParser_1.VDFTokenType.MapEndMarker; });
                        //node.AddListChild(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), typeGenericArgs[0], options));
                        node.AddListChild(VDFLoader.ToVDFNode(tokens, typeGenericArgs[0], options, itemFirstToken.index, itemEnderToken != null ? itemEnderToken.index : enderTokenIndex));
                        if (itemFirstToken.type == VDFTokenParser_1.VDFTokenType.Metadata)
                            i++;
                    }
                }
            }
            else {
                node.isMap = true;
                for (var i = 0; i < tokensAtDepth1.Count; i++) {
                    var token = tokensAtDepth1[i];
                    if (token.type == VDFTokenParser_1.VDFTokenType.Key) {
                        var propNameFirstToken = i >= 1 && tokensAtDepth1[i - 1].type == VDFTokenParser_1.VDFTokenType.Metadata ? tokensAtDepth1[i - 1] : tokensAtDepth1[i];
                        var propNameEnderToken = tokensAtDepth1[i + 1];
                        var propNameType = propNameFirstToken.type == VDFTokenParser_1.VDFTokenType.Metadata ? "object" : "string";
                        if (typeName.StartsWith("Dictionary(") && typeGenericArgs[0] != "object")
                            propNameType = typeGenericArgs[0];
                        var propNameNode = VDFLoader.ToVDFNode(tokens, propNameType, options, propNameFirstToken.index, propNameEnderToken.index);
                        var propValueType;
                        //if (typeName.StartsWith("Dictionary(")) //typeof(IDictionary).IsAssignableFrom(objType))
                        if (typeGenericArgs.length >= 2)
                            propValueType = typeGenericArgs[1];
                        else
                            //propValueTypeName = typeInfo && typeInfo.props[propName] ? typeInfo.props[propName].typeName : null;
                            propValueType = typeof propNameNode.primitiveValue == "string" && typeInfo && typeInfo.props[propNameNode.primitiveValue] ? typeInfo.props[propNameNode.primitiveValue].typeName : null;
                        var propValueFirstToken = tokensAtDepth1[i + 1];
                        var propValueEnderToken = tokensAtDepth1.FirstOrDefault(function (a) { return a.index > propValueFirstToken.index && a.type == VDFTokenParser_1.VDFTokenType.Key; });
                        //var propValueNode = VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueFirstToken, propValueEnderToken), propValueTypeName, options);
                        var propValueNode = VDFLoader.ToVDFNode(tokens, propValueType, options, propValueFirstToken.index, propValueEnderToken != null ? propValueEnderToken.index : enderTokenIndex);
                        node.SetMapChild(propNameNode, propValueNode);
                    }
                }
            }
            return node;
        };
        return VDFLoader;
    }());
    exports.VDFLoader = VDFLoader;
});
define("Source/TypeScript/VDFNode", ["require", "exports", "Source/TypeScript/VDFExtras", "Source/TypeScript/VDF", "Source/TypeScript/VDFSaver", "Source/TypeScript/VDFLoader", "Source/TypeScript/VDFTypeInfo"], function (require, exports, VDFExtras_4, VDF_3, VDFSaver_1, VDFLoader_2, VDFTypeInfo_2) {
    var VDFNode = (function () {
        function VDFNode(primitiveValue, metadata) {
            this.listChildren = new VDFExtras_4.List("VDFNode");
            this.mapChildren = new VDFExtras_4.Dictionary("VDFNode", "VDFNode"); // this also holds Dictionaries' keys/values
            this.primitiveValue = primitiveValue;
            this.metadata = metadata;
        }
        VDFNode.prototype.SetListChild = function (index, value) {
            this.listChildren[index] = value;
            this[index] = value;
        };
        /*InsertListChild(index: number, value: any) {
            var oldItems = this.listChildren;
            for (var i = 0; i < oldItems.length; i++) // we need to first remove old values, so the slate is clean for manual re-adding/re-ordering
                delete this[i];
            for (var i = 0; i < oldItems.length + 1; i++) // now add them all back in, in the correct order
                this.AddListChild(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
        }*/
        VDFNode.prototype.AddListChild = function (value) { this.SetListChild(this.listChildren.length, value); };
        VDFNode.prototype.SetMapChild = function (key, value) {
            this.mapChildren.Set(key, value);
            if (typeof key.primitiveValue == "string")
                this[key] = value;
        };
        VDFNode.prototype.toString = function () { return this.primitiveValue ? this.primitiveValue.toString() : ""; }; // helpful for debugging
        // saving
        // ==================
        VDFNode.PadString = function (unpaddedString) {
            var result = unpaddedString;
            if (result.StartsWith("<") || result.StartsWith("#"))
                result = "#" + result;
            if (result.EndsWith(">") || result.EndsWith("#"))
                result += "#";
            return result;
        };
        VDFNode.prototype.ToVDF = function (options, tabDepth) {
            if (options === void 0) { options = null; }
            if (tabDepth === void 0) { tabDepth = 0; }
            return this.ToVDF_InlinePart(options, tabDepth) + this.ToVDF_PoppedOutPart(options, tabDepth);
        };
        VDFNode.prototype.ToVDF_InlinePart = function (options, tabDepth, isKey) {
            if (options === void 0) { options = null; }
            if (tabDepth === void 0) { tabDepth = 0; }
            if (isKey === void 0) { isKey = false; }
            options = options || new VDFSaver_1.VDFSaveOptions();
            var builder = new VDFExtras_4.StringBuilder();
            var metadata = this.metadata_override != null ? this.metadata_override : this.metadata;
            if (options.useMetadata && metadata != null && metadata != "")
                builder.Append(metadata + ">");
            if (this.primitiveValue == null) {
                if (!this.isMap && this.mapChildren.Count == 0 && !this.isList && this.listChildren.Count == 0)
                    builder.Append("null");
            }
            else if (typeof this.primitiveValue == "boolean")
                builder.Append(this.primitiveValue.toString().toLowerCase());
            else if (typeof this.primitiveValue == "string") {
                var unpaddedString = this.primitiveValue;
                // (the parser doesn't actually need '<<' and '>>' wrapped for single-line strings, but we do so for consistency)
                var needsEscaping = VDFNode.charsThatNeedEscaping_ifAnywhere_regex.test(unpaddedString);
                if (isKey)
                    needsEscaping = needsEscaping || VDFNode.charsThatNeedEscaping_ifNonQuoted_regex.test(unpaddedString);
                if (needsEscaping) {
                    var literalStartMarkerString = "<<";
                    var literalEndMarkerString = ">>";
                    while (unpaddedString.Contains(literalStartMarkerString) || unpaddedString.Contains(literalEndMarkerString)) {
                        literalStartMarkerString += "<";
                        literalEndMarkerString += ">";
                    }
                    builder.Append((isKey ? "" : "\"") + literalStartMarkerString + VDFNode.PadString(unpaddedString) + literalEndMarkerString + (isKey ? "" : "\""));
                }
                else
                    builder.Append((isKey ? "" : "\"") + unpaddedString + (isKey ? "" : "\""));
            }
            else if (VDF_3.VDF.GetIsTypePrimitive(VDF_3.VDF.GetTypeNameOfObject(this.primitiveValue)))
                builder.Append(options.useNumberTrimming && this.primitiveValue.toString().StartsWith("0.") ? this.primitiveValue.toString().substr(1) : this.primitiveValue);
            else
                builder.Append("\"" + this.primitiveValue + "\"");
            if (options.useChildPopOut && this.childPopOut) {
                if (this.isMap || this.mapChildren.Count > 0)
                    builder.Append(this.mapChildren.Count > 0 ? "{^}" : "{}");
                if (this.isList || this.listChildren.Count > 0)
                    builder.Append(this.listChildren.Count > 0 ? "[^]" : "[]");
            }
            else {
                if (this.isMap || this.mapChildren.Count > 0) {
                    builder.Append("{");
                    for (var i = 0, pair = null, pairs = this.mapChildren.Pairs; i < pairs.length && (pair = pairs[i]); i++) {
                        var keyStr = pair.key.ToVDF_InlinePart(options, tabDepth, true);
                        var valueStr = pair.value.ToVDF_InlinePart(options, tabDepth);
                        builder.Append((i == 0 ? "" : (options.useCommaSeparators ? "," : " ")) + (options.useStringKeys ? "\"" : "") + keyStr + (options.useStringKeys ? "\"" : "") + ":" + valueStr);
                    }
                    builder.Append("}");
                }
                if (this.isList || this.listChildren.Count > 0) {
                    builder.Append("[");
                    for (var i = 0; i < this.listChildren.Count; i++)
                        builder.Append((i == 0 ? "" : (options.useCommaSeparators ? "," : " ")) + this.listChildren[i].ToVDF_InlinePart(options, tabDepth));
                    builder.Append("]");
                }
            }
            return builder.ToString();
        };
        VDFNode.prototype.ToVDF_PoppedOutPart = function (options, tabDepth) {
            if (options === void 0) { options = null; }
            if (tabDepth === void 0) { tabDepth = 0; }
            options = options || new VDFSaver_1.VDFSaveOptions();
            var builder = new VDFExtras_4.StringBuilder();
            // include popped-out-content of direct children (i.e. a single directly-under group)
            if (options.useChildPopOut && this.childPopOut) {
                var childTabStr = "";
                for (var i = 0; i < tabDepth + 1; i++)
                    childTabStr += "\t";
                if (this.isMap || this.mapChildren.Count > 0)
                    for (var i = 0, pair = null, pairs = this.mapChildren.Pairs; i < pairs.length && (pair = pairs[i]); i++) {
                        var keyStr = pair.key.ToVDF_InlinePart(options, tabDepth, true);
                        var valueStr = pair.value.ToVDF_InlinePart(options, tabDepth + 1);
                        builder.Append("\n" + childTabStr + (options.useStringKeys ? "\"" : "") + keyStr + (options.useStringKeys ? "\"" : "") + ":" + valueStr);
                        var poppedOutChildText = pair.value.ToVDF_PoppedOutPart(options, tabDepth + 1);
                        if (poppedOutChildText.length > 0)
                            builder.Append(poppedOutChildText);
                    }
                if (this.isList || this.listChildren.Count > 0)
                    for (var _i = 0, _a = this.listChildren; _i < _a.length; _i++) {
                        var item = _a[_i];
                        builder.Append("\n" + childTabStr + item.ToVDF_InlinePart(options, tabDepth + 1));
                        var poppedOutChildText = item.ToVDF_PoppedOutPart(options, tabDepth + 1);
                        if (poppedOutChildText.length > 0)
                            builder.Append(poppedOutChildText);
                    }
            }
            else {
                var poppedOutChildTexts = new VDFExtras_4.List("string");
                var poppedOutChildText = void 0;
                if (this.isMap || this.mapChildren.Count > 0)
                    for (var i = 0, pair = null, pairs = this.mapChildren.Pairs; i < pairs.length && (pair = pairs[i]); i++)
                        if ((poppedOutChildText = pair.value.ToVDF_PoppedOutPart(options, tabDepth)).length)
                            poppedOutChildTexts.Add(poppedOutChildText);
                if (this.isList || this.listChildren.Count > 0) {
                    for (var _b = 0, _c = this.listChildren; _b < _c.length; _b++) {
                        var item = _c[_b];
                        if ((poppedOutChildText = item.ToVDF_PoppedOutPart(options, tabDepth)).length)
                            poppedOutChildTexts.Add(poppedOutChildText);
                    }
                }
                for (var i = 0; i < poppedOutChildTexts.Count; i++) {
                    poppedOutChildText = poppedOutChildTexts[i];
                    var insertPoint = 0;
                    while (poppedOutChildText[insertPoint] == '\n' || poppedOutChildText[insertPoint] == '\t')
                        insertPoint++;
                    builder.Append((insertPoint > 0 ? poppedOutChildText.substr(0, insertPoint) : "") + (i == 0 ? "" : "^") + poppedOutChildText.substr(insertPoint));
                }
            }
            return builder.ToString();
        };
        // loading
        // ==================
        VDFNode.CreateNewInstanceOfType = function (typeName) {
            var typeNameRoot = VDF_3.VDF.GetTypeNameRoot(typeName);
            var genericParameters = VDF_3.VDF.GetGenericArgumentsOfType(typeName);
            /*if (typeNameRoot == "List")
                return new List(genericParameters[0]);
            if (typeNameRoot == "Dictionary")
                return new Dictionary(genericParameters[0], genericParameters[1]);*/
            if (typeName.Contains("("))
                //return window[typeNameRoot].apply(null, genericParameters);
                return new (Function.prototype.bind.apply(window[typeNameRoot], [null].concat(genericParameters)));
            if (!(window[typeNameRoot] instanceof Function))
                throw new Error("Could not find type \"" + typeName + "\".");
            return new window[typeNameRoot]; // maybe todo: add code that resets props to their nulled-out/zeroed-out values (or just don't use any constructors, and just remember to set the __proto__ property afterward)
        };
        VDFNode.GetCompatibleTypeNameForNode = function (node) { return node.mapChildren.Count ? "object" : (node.listChildren.length ? "List(object)" : "string"); };
        VDFNode.prototype.ToObject = function (declaredTypeName_orOptions, options, path) {
            if (options === void 0) { options = new VDFLoader_2.VDFLoadOptions(); }
            if (declaredTypeName_orOptions instanceof VDFLoader_2.VDFLoadOptions)
                return this.ToObject(null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            path = path || new VDFExtras_4.VDFNodePath(new VDFExtras_4.VDFNodePathNode());
            var fromVDFTypeName = "object";
            var metadata = this.metadata_override != null ? this.metadata_override : this.metadata;
            if (metadata != null && (window[VDF_3.VDF.GetTypeNameRoot(metadata)] instanceof Function || !options.loadUnknownTypesAsBasicTypes))
                fromVDFTypeName = metadata;
            else if (typeof this.primitiveValue == "boolean")
                fromVDFTypeName = "bool";
            else if (typeof this.primitiveValue == "number")
                fromVDFTypeName = this.primitiveValue.toString().Contains(".") ? "double" : "int";
            else if (typeof this.primitiveValue == "string")
                fromVDFTypeName = "string";
            else if (this.primitiveValue == null)
                if (this.isList || this.listChildren.Count > 0)
                    fromVDFTypeName = "List(object)"; //"array";
                else if (this.isMap || this.mapChildren.Count > 0)
                    fromVDFTypeName = "Dictionary(object object)"; //"object-anonymous"; //"object";
            var finalTypeName;
            if (window[VDF_3.VDF.GetTypeNameRoot(declaredTypeName)] instanceof Function || !options.loadUnknownTypesAsBasicTypes)
                finalTypeName = declaredTypeName;
            // if there is no declared type, or the from-metadata type is more specific than the declared type
            // (for last condition/way: also assume from-vdf-type is derived, if declared-type name is one of these extra (not actually implemented in JS) types)
            //if (finalTypeName == null || (<Function><object>window[VDF.GetTypeNameRoot(fromVDFTypeName)] || (()=>{})).IsDerivedFrom(<Function><object>window[VDF.GetTypeNameRoot(finalTypeName)] || (()=>{})) || ["object", "IList", "IDictionary"].Contains(finalTypeName))
            if (finalTypeName == null || VDF_3.VDF.IsTypeXDerivedFromY(fromVDFTypeName, finalTypeName) || ["object", "IList", "IDictionary"].Contains(finalTypeName))
                finalTypeName = fromVDFTypeName;
            var result;
            var deserializedByCustomMethod = false;
            var classProps = VDF_3.VDF.GetClassProps(window[finalTypeName]);
            for (var propName in classProps)
                if (classProps[propName] instanceof Function && classProps[propName].tags && classProps[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFDeserialize && a.fromParent; })) {
                    var deserializeResult = classProps[propName](this, path, options);
                    if (deserializeResult !== undefined) {
                        result = deserializeResult;
                        deserializedByCustomMethod = true;
                        break;
                    }
                }
            if (!deserializedByCustomMethod)
                if (finalTypeName == "object") { } //result = null;
                else if (VDFExtras_4.EnumValue.IsEnum(finalTypeName))
                    result = VDFExtras_4.EnumValue.GetEnumIntForStringValue(finalTypeName, this.primitiveValue);
                else if (VDF_3.VDF.GetIsTypePrimitive(finalTypeName)) {
                    result = this.primitiveValue;
                    if (finalTypeName == "int")
                        result = parseInt(this.primitiveValue);
                    else if (finalTypeName == "float" || finalTypeName == "double")
                        result = parseFloat(this.primitiveValue);
                }
                else if (this.primitiveValue != null || this.isList || this.isMap) {
                    result = VDFNode.CreateNewInstanceOfType(finalTypeName);
                    path.currentNode.obj = result;
                    this.IntoObject(result, options, path);
                }
            path.currentNode.obj = result; // in case post-deserialize method was attached as extra-method to the object, that makes use of the (basically useless) path.currentNode.obj property
            return result;
        };
        VDFNode.prototype.IntoObject = function (obj, options, path) {
            if (options === void 0) { options = null; }
            options = options || new VDFLoader_2.VDFLoadOptions();
            path = path || new VDFExtras_4.VDFNodePath(new VDFExtras_4.VDFNodePathNode(obj));
            var typeName = VDF_3.VDF.GetTypeNameOfObject(obj);
            var typeGenericArgs = VDF_3.VDF.GetGenericArgumentsOfType(typeName);
            var typeInfo = VDFTypeInfo_2.VDFTypeInfo.Get(typeName);
            for (var propName in VDF_3.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFPreDeserialize; }))
                    obj[propName](this, path, options);
            var deserializedByCustomMethod2 = false;
            for (var propName in VDF_3.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFDeserialize && !a.fromParent; })) {
                    var deserializeResult = obj[propName](this, path, options);
                    if (deserializeResult !== undefined) {
                        deserializedByCustomMethod2 = true;
                        break;
                    }
                }
            if (!deserializedByCustomMethod2) {
                for (var i = 0; i < this.listChildren.Count; i++) {
                    //obj.Add(this.listChildren[i].ToObject(typeGenericArgs[0], options, path.ExtendAsListItem(i, this.listChildren[i])));
                    var item = this.listChildren[i].ToObject(typeGenericArgs[0], options, path.ExtendAsListItem(i, this.listChildren[i]));
                    if (obj.Count == i)
                        obj.Add(item);
                }
                for (var _i = 0, _a = this.mapChildren.Pairs; _i < _a.length; _i++) {
                    var pair = _a[_i];
                    try {
                        if (obj instanceof VDFExtras_4.Dictionary) {
                            /*let key = VDF.Deserialize("\"" + keyString + "\"", typeGenericArgs[0], options);
                            //obj.Add(key, this.mapChildren[keyString].ToObject(typeGenericArgs[1], options, path.ExtendAsMapItem(key, null)));*/
                            var key = pair.key.ToObject(typeGenericArgs[0], options, path.ExtendAsMapKey(pair.index, null));
                            var value = pair.value.ToObject(typeGenericArgs[1], options, path.ExtendAsMapItem(key, null));
                            obj.Set(key, value); // "obj" prop to be filled in at end of ToObject method // maybe temp; allow child to have already attached itself (by way of the VDF event methods)
                        }
                        else {
                            //obj[keyString] = this.mapChildren[keyString].ToObject(typeInfo.props[keyString] && typeInfo.props[keyString].typeName, options, path.ExtendAsChild(typeInfo.props[keyString] || { name: keyString }, null));
                            var propName = pair.key.primitiveValue;
                            /*if (typeInfo.props[propName]) // maybe temp; just ignore props that are missing
                            {*/
                            var childPath = path.ExtendAsChild(typeInfo.props[propName] || { name: propName }, null);
                            var value = void 0;
                            for (var propName2 in VDF_3.VDF.GetObjectProps(obj))
                                if (obj[propName2] instanceof Function && obj[propName2].tags && obj[propName2].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFDeserializeProp; })) {
                                    var deserializeResult = obj[propName2](pair.value, childPath, options);
                                    if (deserializeResult !== undefined) {
                                        value = deserializeResult;
                                        break;
                                    }
                                }
                            if (value === undefined)
                                value = pair.value.ToObject(typeInfo.props[propName] && typeInfo.props[propName].typeName, options, childPath);
                            obj[propName] = value;
                        }
                    }
                    catch (ex) {
                        ex.message += "\n==================\nRethrownAs) " + ("Error loading map-child with key '" + (typeof pair.key.primitiveValue == "string" ? "'" + pair.key.primitiveValue + "'" : "of type " + pair.key) + "'.") + "\n";
                        throw ex;
                    } /**/
                    finally { }
                }
            }
            if (options.objPostDeserializeFuncs_early.ContainsKey(obj))
                for (var i in options.objPostDeserializeFuncs_early.Get(obj))
                    options.objPostDeserializeFuncs_early.Get(obj)[i]();
            for (var propName in VDF_3.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFPostDeserialize; }))
                    obj[propName](this, path, options);
            if (options.objPostDeserializeFuncs.ContainsKey(obj))
                for (var i in options.objPostDeserializeFuncs.Get(obj))
                    options.objPostDeserializeFuncs.Get(obj)[i]();
        };
        return VDFNode;
    }());
    VDFNode.charsThatNeedEscaping_ifAnywhere_regex = /"|'|\n|\t|<<|>>/; // (well, anywhere in string)
    VDFNode.charsThatNeedEscaping_ifNonQuoted_regex = /^([\t^# ,0-9.\-+]|null|true|false)|{|}|\[|\]|:/;
    exports.VDFNode = VDFNode;
    //VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);
    setTimeout(function () {
        VDF_3.VDF.CancelSerialize = new VDFNode();
    }, 0);
});
define("Source/TypeScript/VDFSaver", ["require", "exports", "Source/TypeScript/VDFExtras", "Source/TypeScript/VDF", "Source/TypeScript/VDFNode", "Source/TypeScript/VDFTypeInfo"], function (require, exports, VDFExtras_5, VDF_4, VDFNode_2, VDFTypeInfo_3) {
    var VDFTypeMarking;
    (function (VDFTypeMarking) {
        VDFTypeMarking[VDFTypeMarking["None"] = 0] = "None";
        VDFTypeMarking[VDFTypeMarking["Internal"] = 1] = "Internal";
        VDFTypeMarking[VDFTypeMarking["External"] = 2] = "External";
        VDFTypeMarking[VDFTypeMarking["ExternalNoCollapse"] = 3] = "ExternalNoCollapse"; // maybe temp
    })(VDFTypeMarking = exports.VDFTypeMarking || (exports.VDFTypeMarking = {}));
    var VDFSaveOptions = (function () {
        function VDFSaveOptions(initializerObj, messages, typeMarking, useMetadata, useChildPopOut, useStringKeys, useNumberTrimming, useCommaSeparators) {
            if (typeMarking === void 0) { typeMarking = VDFTypeMarking.Internal; }
            if (useMetadata === void 0) { useMetadata = true; }
            if (useChildPopOut === void 0) { useChildPopOut = true; }
            if (useStringKeys === void 0) { useStringKeys = false; }
            if (useNumberTrimming === void 0) { useNumberTrimming = true; }
            if (useCommaSeparators === void 0) { useCommaSeparators = false; }
            this.messages = messages || [];
            this.typeMarking = typeMarking;
            this.useMetadata = useMetadata;
            this.useChildPopOut = useChildPopOut;
            this.useStringKeys = useStringKeys;
            this.useNumberTrimming = useNumberTrimming;
            this.useCommaSeparators = useCommaSeparators;
            if (initializerObj)
                for (var key in initializerObj)
                    this[key] = initializerObj[key];
        }
        VDFSaveOptions.prototype.ForJSON = function () {
            this.useMetadata = false;
            this.useChildPopOut = false;
            this.useStringKeys = true;
            this.useNumberTrimming = false;
            this.useCommaSeparators = true;
            return this;
        };
        return VDFSaveOptions;
    }());
    exports.VDFSaveOptions = VDFSaveOptions;
    var VDFSaver = (function () {
        function VDFSaver() {
        }
        VDFSaver.ToVDFNode = function (obj, declaredTypeName_orOptions, options, path, declaredTypeInParentVDF) {
            if (options === void 0) { options = new VDFSaveOptions(); }
            if (declaredTypeName_orOptions instanceof VDFSaveOptions)
                return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            path = path || new VDFExtras_5.VDFNodePath(new VDFExtras_5.VDFNodePathNode(obj));
            var typeName = obj != null ? (VDFExtras_5.EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF_4.VDF.GetTypeNameOfObject(obj)) : null; // at bottom, enums an integer; but consider it of a distinct type
            var typeGenericArgs = VDF_4.VDF.GetGenericArgumentsOfType(typeName);
            var typeInfo = typeName ? VDFTypeInfo_3.VDFTypeInfo.Get(typeName) : new VDFTypeInfo_3.VDFTypeInfo();
            for (var propName_1 in VDF_4.VDF.GetObjectProps(obj))
                if (obj[propName_1] instanceof Function && obj[propName_1].tags && obj[propName_1].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFPreSerialize; })) {
                    if (obj[propName_1](path, options) == VDF_4.VDF.CancelSerialize)
                        return VDF_4.VDF.CancelSerialize;
                }
            var result;
            var serializedByCustomMethod = false;
            for (var propName_2 in VDF_4.VDF.GetObjectProps(obj))
                if (obj[propName_2] instanceof Function && obj[propName_2].tags && obj[propName_2].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFSerialize; })) {
                    var serializeResult = obj[propName_2](path, options);
                    if (serializeResult !== undefined) {
                        result = serializeResult;
                        serializedByCustomMethod = true;
                        break;
                    }
                }
            if (!serializedByCustomMethod) {
                result = new VDFNode_2.VDFNode();
                if (obj == null) { } //result.primitiveValue = null;
                else if (VDF_4.VDF.GetIsTypePrimitive(typeName))
                    result.primitiveValue = obj;
                else if (VDFExtras_5.EnumValue.IsEnum(typeName))
                    result.primitiveValue = new VDFExtras_5.EnumValue(typeName, obj).toString();
                else if (typeName && typeName.StartsWith("List(")) {
                    result.isList = true;
                    var objAsList = obj;
                    for (var i = 0; i < objAsList.length; i++) {
                        var itemNode = VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, path.ExtendAsListItem(i, objAsList[i]), true);
                        if (itemNode == VDF_4.VDF.CancelSerialize)
                            continue;
                        result.AddListChild(itemNode);
                    }
                }
                else if (typeName && typeName.StartsWith("Dictionary(")) {
                    result.isMap = true;
                    var objAsDictionary = obj;
                    for (var i = 0, pair = null, pairs = objAsDictionary.Pairs; i < pairs.length && (pair = pairs[i]); i++) {
                        var keyNode = VDFSaver.ToVDFNode(pair.key, typeGenericArgs[0], options, path.ExtendAsMapKey(i, pair.key), true); // stringify-attempt-1: use exporter
                        if (typeof keyNode.primitiveValue != "string")
                            //throw new Error("A map key object must either be a string or have an exporter that converts it into a string.");
                            keyNode = new VDFNode_2.VDFNode(pair.key.toString());
                        var valueNode = VDFSaver.ToVDFNode(pair.value, typeGenericArgs[1], options, path.ExtendAsMapItem(pair.key, pair.value), true);
                        if (valueNode == VDF_4.VDF.CancelSerialize)
                            continue;
                        result.SetMapChild(keyNode, valueNode);
                    }
                }
                else {
                    result.isMap = true;
                    // special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
                    for (var propName_3 in typeInfo.props) {
                        if (!(propName_3 in obj))
                            obj[propName_3] = null;
                    }
                    for (var propName_4 in obj)
                        try {
                            var propInfo = typeInfo.props[propName_4]; // || new VDFPropInfo("object"); // if prop-info not specified, consider its declared-type to be 'object'
                            /*let include = typeInfo.typeTag != null && typeInfo.typeTag.propIncludeRegexL1 != null ? new RegExp(typeInfo.typeTag.propIncludeRegexL1).test(propName) : false;
                            include = propInfo && propInfo.propTag && propInfo.propTag.includeL2 != null ? propInfo.propTag.includeL2 : include;*/
                            var include = propInfo && propInfo.propTag && propInfo.propTag.includeL2 != null ? propInfo.propTag.includeL2 : (typeInfo.typeTag != null && typeInfo.typeTag.propIncludeRegexL1 != null && new RegExp(typeInfo.typeTag.propIncludeRegexL1).test(propName_4));
                            if (!include)
                                continue;
                            var propValue = obj[propName_4];
                            if (propInfo && !propInfo.ShouldValueBeSaved(propValue))
                                continue;
                            var propNameNode = new VDFNode_2.VDFNode(propName_4);
                            var propValueNode = void 0;
                            var childPath = path.ExtendAsChild(propInfo, propValue);
                            for (var propName2 in VDF_4.VDF.GetObjectProps(obj))
                                if (obj[propName2] instanceof Function && obj[propName2].tags && obj[propName2].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFSerializeProp; })) {
                                    var serializeResult = obj[propName2](childPath, options);
                                    if (serializeResult !== undefined) {
                                        propValueNode = serializeResult;
                                        break;
                                    }
                                }
                            if (propValueNode === undefined)
                                propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.typeName : null, options, childPath);
                            if (propValueNode == VDF_4.VDF.CancelSerialize)
                                continue;
                            propValueNode.childPopOut = options.useChildPopOut && (propInfo && propInfo.propTag && propInfo.propTag.popOutL2 != null ? propInfo.propTag.popOutL2 : propValueNode.childPopOut);
                            result.SetMapChild(propNameNode, propValueNode);
                        }
                        catch (ex) {
                            ex.message += "\n==================\nRethrownAs) " + ("Error saving property '" + propName_4 + "'.") + "\n";
                            throw ex;
                        } /**/
                        finally { }
                }
            }
            if (declaredTypeName == null)
                if (result.isList || result.listChildren.Count > 0)
                    declaredTypeName = "List(object)";
                else if (result.isMap || result.mapChildren.Count > 0)
                    declaredTypeName = "Dictionary(object object)";
                else
                    declaredTypeName = "object";
            if (options.useMetadata && typeName != null && !VDF_4.VDF.GetIsTypeAnonymous(typeName) && ((options.typeMarking == VDFTypeMarking.Internal && !VDF_4.VDF.GetIsTypePrimitive(typeName) && typeName != declaredTypeName)
                || (options.typeMarking == VDFTypeMarking.External && !VDF_4.VDF.GetIsTypePrimitive(typeName) && (typeName != declaredTypeName || !declaredTypeInParentVDF))
                || options.typeMarking == VDFTypeMarking.ExternalNoCollapse))
                result.metadata = typeName;
            if (result.metadata_override != null)
                result.metadata = result.metadata_override;
            if (options.useChildPopOut && typeInfo && typeInfo.typeTag && typeInfo.typeTag.popOutL1)
                result.childPopOut = true;
            for (var propName in VDF_4.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFPostSerialize; }))
                    obj[propName](result, path, options);
            return result;
        };
        return VDFSaver;
    }());
    exports.VDFSaver = VDFSaver;
});
define("Source/TypeScript/VDF", ["require", "exports", "Source/TypeScript/VDFSaver", "Source/TypeScript/VDFLoader", "Source/TypeScript/VDFExtras"], function (require, exports, VDFSaver_2, VDFLoader_3, VDFExtras_6) {
    // vdf globals
    // ==========
    var g = window;
    function Log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (g.Log)
            return g.Log.apply(g, args);
        return console.log.apply(console, args);
    }
    exports.Log = Log;
    function Assert(condition, message) {
        if (condition)
            return;
        console.assert(false, message || "");
        debugger;
    }
    exports.Assert = Assert;
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
            var result = this instanceof VDFExtras_6.List ? new VDFExtras_6.List(this.itemType) : [];
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                if (matchFunc.call(item, item))
                    result[this instanceof VDFExtras_6.List ? "Add" : "push"](item);
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
            this.tags = new VDFExtras_6.List("object");
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
    var VDF = (function () {
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
            if (declaredTypeName_orOptions instanceof VDFSaver_2.VDFSaveOptions)
                return VDF.Serialize(obj, null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            var options = options_orNothing;
            return VDFSaver_2.VDFSaver.ToVDFNode(obj, declaredTypeName, options).ToVDF(options);
        };
        VDF.Deserialize = function (vdf, declaredTypeName_orOptions, options_orNothing) {
            if (declaredTypeName_orOptions instanceof VDFLoader_3.VDFLoadOptions)
                return VDF.Deserialize(vdf, null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            var options = options_orNothing;
            return VDFLoader_3.VDFLoader.ToVDFNode(vdf, declaredTypeName, options).ToObject(declaredTypeName, options);
        };
        VDF.DeserializeInto = function (vdf, obj, options) { VDFLoader_3.VDFLoader.ToVDFNode(vdf, VDF.GetTypeNameOfObject(obj), options).IntoObject(obj, options); };
        return VDF;
    }());
    // for use with VDFSaveOptions
    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];
    // for use with VDFType
    VDF.PropRegex_Any = ""; //"^.+$";
    exports.VDF = VDF;
});
// general init // note: this runs globally, so no need to duplicate in the Loading.ts file
// ==========
define("Tests/TypeScript/GeneralInit", ["require", "exports"], function (require, exports) {
    Object.prototype._AddFunction_Inline = function Should() {
        var _this = this;
        return {
            Be: function (value, message) {
                equal(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
            },
            BeExactly: function (value, message) {
                strictEqual(_this instanceof Number ? parseFloat(_this) : (_this instanceof String ? _this.toString() : _this), value, message);
            },
            BeEquivalentTo: function (otherCollection, message) {
                _this.length.Should().Be(otherCollection.length, "Our length " + _this.length + " does not match other length " + otherCollection.length + ".");
                for (var i = 0; i < _this.length; i++) {
                    var item = _this[i];
                    var itemInOther = otherCollection[i];
                    item.Should().Be(itemInOther, message);
                }
            }
        };
    };
    String.prototype._AddFunction_Inline = function Fix() { return this.toString(); }; // filler function for C# method to allow for copying, with fewer manual changes
    //interface Object { AddTest(testFunc: Function): void; }
    //Object.prototype._AddGetterSetter(null, function AddTest/*Inline*/(testFunc) { saving[testFunc.name] = testFunc; });
    //saving.AddTest = function testName() { ok(null == null); };
    var test_old = test;
    // saving init
    // ==========
    var saving = {};
    function Saving_RunTests() {
        for (var name in saving)
            test_old(name, saving[name]);
    }
    exports.Saving_RunTests = Saving_RunTests;
    // the normal "test" function actually runs test
    // here we replace it with a function that merely "registers the test to be run later on" (when the Saving button is pressed)
    window["test"] = function (name, func) { saving[name] = func; };
    window["test_custom"] = function (name, func) { saving[name] = func; };
    //export function Test(name, func) { saving[name] = func; }
    // loading init
    // ==========
    var loading = {};
    function Loading_RunTests() {
        for (var name in loading)
            test_old(name, loading[name]);
    }
    exports.Loading_RunTests = Loading_RunTests;
    // the normal "test" function actually runs test
    // here we replace it with a function that merely "registers the test to be run later on" (when the Loading button is pressed)
    window["test"] = function (name, func) { loading[name] = func; };
    // others
    // ==========
    //function ExportInternalClassesTo(hostObj, funcWithInternalClasses, evalFunc) {
    function ExportInternalClassesTo(hostObj, evalFunc) {
        var funcWithInternalClasses = arguments.callee.caller;
        var names = V.GetMatches(funcWithInternalClasses.toString(), /        var (\w+) = \(function \(\) {/g, 1);
        for (var i = 0; i < names.length; i++)
            try {
                hostObj[names[i]] = evalFunc(names[i]);
            }
            catch (e) { }
        var enumNames = V.GetMatches(funcWithInternalClasses.toString(), /        }\)\((\w+) \|\| \(\w+ = {}\)\);/g, 1);
        for (var i = 0; i < enumNames.length; i++)
            try {
                hostObj[enumNames[i]] = evalFunc(enumNames[i]);
            }
            catch (e) { }
    }
    exports.ExportInternalClassesTo = ExportInternalClassesTo;
});
define("Tests/TypeScript/Loading/ToObject", ["require", "exports", "Source/TypeScript/VDFLoader", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDF", "Source/TypeScript/VDFExtras", "Tests/TypeScript/GeneralInit"], function (require, exports, VDFLoader_4, VDFTypeInfo_4, VDF_5, VDFExtras_7, GeneralInit_1) {
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Loading_ToObject;
        (function (Loading_ToObject) {
            // to object
            // ==========
            test("D0_Null", function () {
                ok(VDF_5.VDF.Deserialize("null") == null);
                //VDF.Deserialize("null").Should().Be(null);
            });
            //test("D0_Nothing() { VDF.Deserialize("").Should().Be(null); });
            //test("D0_Nothing_TypeSpecified() { VDF.Deserialize("string>").Should().Be(null); });
            test("D0_EmptyString", function () { VDF_5.VDF.Deserialize("''").Should().Be(""); });
            test("D0_Bool", function () { VDF_5.VDF.Deserialize("true", "bool").Should().Be(true); });
            test("D0_Double", function () { VDF_5.VDF.Deserialize("1.5").Should().Be(1.5); });
            //test("D0_Float", ()=> { VDF.Deserialize<float>("1.5").Should().Be(1.5f); });
            var D1_DeserializePropMethod_Class = (function () {
                function D1_DeserializePropMethod_Class() {
                    this.prop1 = 0;
                }
                D1_DeserializePropMethod_Class.prototype.DeserializeProp = function (node, propPath, options) { return 1; };
                return D1_DeserializePropMethod_Class;
            }());
            __decorate([
                VDFTypeInfo_4._VDFDeserializeProp()
            ], D1_DeserializePropMethod_Class.prototype, "DeserializeProp", null);
            __decorate([
                VDFTypeInfo_4.P()
            ], D1_DeserializePropMethod_Class.prototype, "prop1", void 0);
            test("D1_DeserializePropMethod", function () {
                var a = VDF_5.VDF.Deserialize("{prop1:0}", "D1_DeserializePropMethod_Class");
                a.prop1.Should().Be(1);
            });
            var TypeWithPreDeserializeMethod = (function () {
                function TypeWithPreDeserializeMethod() {
                    this.flag = false;
                }
                TypeWithPreDeserializeMethod.prototype.PreDeserialize = function () { this.flag = true; };
                return TypeWithPreDeserializeMethod;
            }());
            __decorate([
                VDFTypeInfo_4.T("bool"), VDFTypeInfo_4.P()
            ], TypeWithPreDeserializeMethod.prototype, "flag", void 0);
            __decorate([
                VDFTypeInfo_4._VDFPreDeserialize()
            ], TypeWithPreDeserializeMethod.prototype, "PreDeserialize", null);
            test("D1_PreDeserializeMethod", function () {
                var a = VDF_5.VDF.Deserialize("{}", "TypeWithPreDeserializeMethod");
                a.flag.Should().Be(true);
            });
            var TypeWithPostDeserializeMethod = (function () {
                function TypeWithPostDeserializeMethod() {
                    this.flag = false;
                }
                TypeWithPostDeserializeMethod.prototype.PostDeserialize = function () { this.flag = true; };
                return TypeWithPostDeserializeMethod;
            }());
            __decorate([
                VDFTypeInfo_4.T("bool"), VDFTypeInfo_4.P()
            ], TypeWithPostDeserializeMethod.prototype, "flag", void 0);
            __decorate([
                VDFTypeInfo_4._VDFPostDeserialize()
            ], TypeWithPostDeserializeMethod.prototype, "PostDeserialize", null);
            test("D1_PostDeserializeMethod", function () {
                var a = VDF_5.VDF.Deserialize("{}", "TypeWithPostDeserializeMethod");
                a.flag.Should().Be(true);
            });
            var ObjectWithPostDeserializeMethodRequiringCustomMessage_Class = (function () {
                function ObjectWithPostDeserializeMethodRequiringCustomMessage_Class() {
                    this.flag = false;
                }
                ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype.PostDeserialize = function (node, path, options) {
                    if (options.messages[0] == "RequiredMessage")
                        this.flag = true;
                };
                return ObjectWithPostDeserializeMethodRequiringCustomMessage_Class;
            }());
            __decorate([
                VDFTypeInfo_4.T("bool"), VDFTypeInfo_4.P()
            ], ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype, "flag", void 0);
            __decorate([
                VDFTypeInfo_4._VDFPostDeserialize()
            ], ObjectWithPostDeserializeMethodRequiringCustomMessage_Class.prototype, "PostDeserialize", null);
            test("D0_ObjectWithPostDeserializeMethodRequiringCustomMessage", function () { VDF_5.VDF.Deserialize("{}", "ObjectWithPostDeserializeMethodRequiringCustomMessage_Class", new VDFLoader_4.VDFLoadOptions(null, ["WrongMessage"])).flag.Should().Be(false); });
            /*class ObjectWithPostDeserializeConstructor_Class {
                static typeInfo = new VDFTypeInfo({
                    flag: new PInfo("bool")
                });
                flag = false;
                ObjectWithPostDeserializeConstructor_Class() { flag = true; }
            }
            test("D1_ObjectWithPostDeserializeConstructor", ()=> { VDF.Deserialize<ObjectWithPostDeserializeConstructor_Class>("{}").flag.Should().Be(true); });*/
            var ObjectWithPostDeserializeOptionsFunc_Class_Parent = (function () {
                function ObjectWithPostDeserializeOptionsFunc_Class_Parent() {
                    this.child = null;
                }
                return ObjectWithPostDeserializeOptionsFunc_Class_Parent;
            }());
            __decorate([
                VDFTypeInfo_4.T("ObjectWithPostDeserializeOptionsFunc_Class_Child")
            ], ObjectWithPostDeserializeOptionsFunc_Class_Parent.prototype, "child", void 0);
            var ObjectWithPostDeserializeOptionsFunc_Class_Child = (function () {
                function ObjectWithPostDeserializeOptionsFunc_Class_Child() {
                }
                ObjectWithPostDeserializeOptionsFunc_Class_Child.Deserialize = function (node, path, options) {
                    options.AddObjPostDeserializeFunc(path.rootNode.obj, function () { return ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = true; });
                    return null;
                };
                return ObjectWithPostDeserializeOptionsFunc_Class_Child;
            }());
            ObjectWithPostDeserializeOptionsFunc_Class_Child.flag = false;
            __decorate([
                VDFTypeInfo_4._VDFDeserialize(true)
            ], ObjectWithPostDeserializeOptionsFunc_Class_Child, "Deserialize", null);
            test("D1_ObjectWithPostDeserializeOptionsFunc", function () {
                var options = new VDFLoader_4.VDFLoadOptions();
                ok(VDF_5.VDF.Deserialize("{child:{}}", "ObjectWithPostDeserializeOptionsFunc_Class_Parent", options).child == null);
                ObjectWithPostDeserializeOptionsFunc_Class_Child.flag.Should().Be(true);
            });
            var TypeInstantiatedManuallyThenFilled = (function () {
                function TypeInstantiatedManuallyThenFilled() {
                    this.flag = false;
                }
                return TypeInstantiatedManuallyThenFilled;
            }());
            __decorate([
                VDFTypeInfo_4.T("bool"), VDFTypeInfo_4.P()
            ], TypeInstantiatedManuallyThenFilled.prototype, "flag", void 0);
            test("D1_InstantiateTypeManuallyThenFill", function () {
                var a = new TypeInstantiatedManuallyThenFilled();
                VDF_5.VDF.DeserializeInto("{flag:true}", a);
                a.flag.Should().Be(true);
            });
            var D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = (function () {
                function D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1() {
                    this._helper = this;
                    this.messages = new VDFExtras_7.Dictionary("string", "string", {
                        title1: "message1",
                        title2: "message2"
                    });
                    this.otherProperty = false;
                }
                return D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1;
            }());
            __decorate([
                VDFTypeInfo_4.T("Dictionary(string string)"), VDFTypeInfo_4.P()
            ], D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.prototype, "messages", void 0);
            __decorate([
                VDFTypeInfo_4.T("bool"), VDFTypeInfo_4.P()
            ], D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1.prototype, "otherProperty", void 0);
            D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1 = __decorate([
                VDFTypeInfo_4.TypeInfo(null, true)
            ], D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1);
            test("D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool", function () {
                var a = VDF_5.VDF.Deserialize("{^}\n\
	messages:{^}\n\
		title1:'message1'\n\
		title2:'message2'\n\
	otherProperty:true", "D1_Object_PoppedOutDictionaryPoppedOutThenPoppedOutBool_Class1");
                a.messages.Count.Should().Be(2);
                a.messages["title1"].Should().Be("message1");
                a.messages["title2"].Should().Be("message2");
                a.otherProperty.Should().Be(true);
            });
            // export all classes/enums to global scope
            GeneralInit_1.ExportInternalClassesTo(window, function (str) { return eval(str); });
        })(Loading_ToObject || (Loading_ToObject = {}));
    })(VDFTests || (VDFTests = {}));
});
define("Tests/TypeScript/Loading/ToVDFNode", ["require", "exports", "Source/TypeScript/VDFLoader", "Source/TypeScript/VDF", "Source/TypeScript/VDFTokenParser", "Source/TypeScript/VDFExtras", "Tests/TypeScript/GeneralInit"], function (require, exports, VDFLoader_5, VDF_6, VDFTokenParser_2, VDFExtras_8, GeneralInit_2) {
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Loading_ToVDFNode;
        (function (Loading_ToVDFNode) {
            // to VDFNode
            // ==========
            test("D0_Comment", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("## comment\n\
'Root string.'");
                a.primitiveValue.Should().Be("Root string.");
            });
            test("D0_Comment2", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("'Root string ends here.'## comment");
                a.primitiveValue.Should().Be("Root string ends here.");
            });
            test("D0_Int", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("1");
                a.primitiveValue.Should().Be(1);
            });
            test("D0_IntNegative", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("-1");
                a.primitiveValue.Should().Be(-1);
            });
            test("D0_PowerNotation", function () {
                VDFLoader_5.VDFLoader.ToVDFNode("1e3").primitiveValue.Should().Be(1000); //1 * Math.Pow(10, 3));
                VDFLoader_5.VDFLoader.ToVDFNode("1e-3").primitiveValue.Should().Be(.001); //1 * Math.Pow(10, -3));
                VDFLoader_5.VDFLoader.ToVDFNode("-1e3").primitiveValue.Should().Be(-1000); //-(1 * Math.Pow(10, 3)));
                VDFLoader_5.VDFLoader.ToVDFNode("-1e-3").primitiveValue.Should().Be(-.001); //-(1 * Math.Pow(10, -3)));
            });
            test("D0_Infinity", function () {
                VDFLoader_5.VDFLoader.ToVDFNode("Infinity").primitiveValue.Should().Be(Infinity);
                VDFLoader_5.VDFLoader.ToVDFNode("-Infinity").primitiveValue.Should().Be(-Infinity);
            });
            test("D0_String", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("'Root string.'");
                a.primitiveValue.Should().Be("Root string.");
            });
            test("D0_StringWithSaveThenLoad", function () {
                var vdf = VDF_6.VDF.Serialize("Root string.");
                vdf.Should().Be("\"Root string.\"");
                var a = VDFLoader_5.VDFLoader.ToVDFNode(vdf);
                a.primitiveValue.Should().Be("Root string.");
            });
            test("D0_StringAsNull", function () {
                var a = VDF_6.VDF.Deserialize("null", "string");
                ok(a == null);
            });
            test("D0_BaseValue_Literal", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("'<<\tBase-value string that {needs escaping}.>>'");
                a.primitiveValue.Should().Be("\tBase-value string that {needs escaping}.");
            });
            test("D0_Metadata_Type", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("string>'Root string.'");
                a.metadata.Should().Be("string");
            });
            test("D0_List", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("['Root string 1.' 'Root string 2.']", "List(object)");
                a[0].primitiveValue.Should().Be("Root string 1.");
                a[1].primitiveValue.Should().Be("Root string 2.");
            });
            /*test("D0_List_ExplicitStartAndEndMarkers", ()=> {
                var a: VDFNode = VDFLoader.ToVDFNode<List<object>>("{Root string 1.}|{Root string 2.}");
                a[0].primitiveValue.Should().Be("Root string 1.");
                a[1].primitiveValue.Should().Be("Root string 2.");
            });*/
            test("D0_List_Objects", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("[{name:'Dan' age:50} {name:'Bob' age:60}]", "List(object)");
                a[0]["name"].primitiveValue.Should().Be("Dan");
                a[0]["age"].primitiveValue.Should().Be(50);
                a[1]["name"].primitiveValue.Should().Be("Bob");
                a[1]["age"].primitiveValue.Should().Be(60);
            });
            test("D0_List_Literals", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("['first' '<<second\n\
which is on two lines>>' '<<third\n\
which is on\n\
three lines>>']", "List(string)");
                a[0].primitiveValue.Should().Be("first");
                a[1].primitiveValue.Should().Be("second\n\
which is on two lines".Fix());
                a[2].primitiveValue.Should().Be("third\n\
which is on\n\
three lines".Fix());
            });
            /*test("D0_EmptyList", ()=> // for now at least, it's against the rules to have items without a char of their own
            {
                var a: VDFNode = VDFLoader.ToVDFNode("|", "List(object)");
                //a.mapChildren.Count.Should().Be(0);
                a[0].primitiveValue.Should().Be(null);
                a[1].primitiveValue.Should().Be(null);
            });*/
            test("D0_EmptyList", function () { VDF_6.VDF.Deserialize("[]").Count.Should().Be(0); });
            test("D0_ListMetadata", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("List(int)>[1 2]");
                a.metadata.Should().Be("List(int)");
                ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
                ok(a[1].metadata == null); //a[1].metadata.Should().Be(null);
            });
            test("D0_ListMetadata2", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("List(object)>[string>\"1\" string>\"2\"]");
                a.metadata.Should().Be("List(object)");
                a[0].metadata.Should().Be("string");
                a[1].metadata.Should().Be("string");
            });
            test("D0_EmptyMap", function () { VDF_6.VDF.Deserialize("{}").Count.Should().Be(0); });
            test("D0_Map_ChildMetadata", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("Dictionary(object object)>{a:string>\"1\" b:string>\"2\"}");
                a.metadata.Should().Be("Dictionary(object object)");
                a["a"].metadata.Should().Be("string");
                a["b"].metadata.Should().Be("string");
            });
            test("D0_MultilineString", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("'<<This is a\n\
multiline string\n\
of three lines in total.>>'");
                a.primitiveValue.Should().Be("This is a\n\
multiline string\n\
of three lines in total.".Fix());
            });
            test("D1_Map_Children", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{key1:'Simple string.' key2:'false' key3:{name:'Dan' age:50}}");
                a["key1"].primitiveValue.Should().Be("Simple string.");
                a["key2"].primitiveValue.Should().Be("false");
                a["key3"]["age"].primitiveValue.Should().Be(50);
            });
            test("D1_Map_ChildrenThatAreRetrievedByKey", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{key 1:'value 1' key 2:'value 2'}");
                a["key 1"].primitiveValue.Should().Be("value 1");
                a["key 2"].primitiveValue.Should().Be("value 2");
            });
            test("D1_List_StringThatKeepsStringTypeFromVDFEvenWithObjectTypeFromCode", function () {
                var a = VDF_6.VDF.Deserialize("['SimpleString']", "List(object)");
                a[0].Should().Be("SimpleString");
            });
            test("D1_BaseValuesWithImplicitCasting", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{bool:false int:5 double:.5 string:'Prop value string.'}");
                a["bool"].primitiveValue.Should().Be(false);
                a["int"].primitiveValue.Should().Be(5);
                a["double"].primitiveValue.Should().Be(.5);
                a["string"].primitiveValue.Should().Be("Prop value string.");
                // uses implicit casting
                /*Assert.True(a["bool"] == false);
                Assert.True(a["int"] == 5);
                Assert.True(a["double"] == .5);
                Assert.True(a["string"] == "Prop value string.");*/
            });
            test("D1_BaseValuesWithMarkedTypes", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{bool:bool>false int:int>5 double:double>.5 string:string>'Prop value string.'}");
                a["bool"].primitiveValue.Should().Be(false);
                a["int"].primitiveValue.Should().Be(5);
                a["double"].primitiveValue.Should().Be(.5);
                a["string"].primitiveValue.Should().Be("Prop value string.");
            });
            test("D1_Literal", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{string:'<<<Prop value string that <<needs escaping>>.>>>'}");
                a["string"].primitiveValue.Should().Be("Prop value string that <<needs escaping>>.");
            });
            test("D1_TroublesomeLiteral1", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{string:'<<<#<<Prop value string that <<needs escaping>>.>>#>>>'}");
                a["string"].primitiveValue.Should().Be("<<Prop value string that <<needs escaping>>.>>");
            });
            test("D1_TroublesomeLiteral2", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{string:'<<<##Prop value string that <<needs escaping>>.##>>>'}");
                a["string"].primitiveValue.Should().Be("#Prop value string that <<needs escaping>>.#");
            });
            test("D1_VDFWithVDFWithVDF", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{level1:'<<<{level2:'<<{level3:'Base string.'}>>'}>>>'}");
                a["level1"].primitiveValue.Should().Be("{level2:'<<{level3:'Base string.'}>>'}");
                VDFLoader_5.VDFLoader.ToVDFNode(a["level1"].primitiveValue)["level2"].primitiveValue.Should().Be("{level3:'Base string.'}");
                VDFLoader_5.VDFLoader.ToVDFNode(VDFLoader_5.VDFLoader.ToVDFNode(a["level1"].primitiveValue)["level2"].primitiveValue)["level3"].primitiveValue.Should().Be("Base string.");
            });
            test("D1_ArraysInArrays", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("[['1A' '1B'] ['2A' '2B'] '3A']");
                a[0][0].primitiveValue.Should().Be("1A");
                a[0][1].primitiveValue.Should().Be("1B");
                a[1][0].primitiveValue.Should().Be("2A");
                a[1][1].primitiveValue.Should().Be("2B");
                a[2].primitiveValue.Should().Be("3A");
            });
            test("D1_ArraysInArrays_SecondsNullAndEmpty", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("[['1A' null] ['2A' '']]");
                a[0][0].primitiveValue.Should().Be("1A");
                ok(a[0][1].primitiveValue == null); //a[0][1].primitiveValue.Should().Be(null);
                a[1][0].primitiveValue.Should().Be("2A");
                a[1][1].primitiveValue.Should().Be("");
            });
            test("D1_StringAndArraysInArrays", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("['text' ['2A' null]]");
                a[0].primitiveValue.Should().Be("text");
                a[1][0].primitiveValue.Should().Be("2A");
                ok(a[1][1].primitiveValue == null); //a[1][1].primitiveValue.Should().Be(null);
            });
            test("D1_Dictionary", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{key1:'value1' key2:'value2' 'key3':'value3' \"key4\":\"value4\"}");
                a["key1"].primitiveValue.Should().Be("value1");
                a["key2"].primitiveValue.Should().Be("value2");
                a["key3"].primitiveValue.Should().Be("value3");
                a["key4"].primitiveValue.Should().Be("value4");
            });
            test("D1_Map_KeyWithHash", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{#:'value1'}");
                a["#"].primitiveValue.Should().Be("value1");
            });
            test("D1_Map_MixedTypeKeysWithMetadata", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{int>1:'value1' int>\"2\":'value2' 'key3':'value3' \"key4\":\"value4\"}");
                var pairs = a.mapChildren.Pairs;
                a["1"].primitiveValue.Should().Be("value1");
                a["2"].primitiveValue.Should().Be("value2");
                a["key3"].primitiveValue.Should().Be("value3");
                a["key4"].primitiveValue.Should().Be("value4");
                var b = a.ToObject();
                ok(b instanceof VDFExtras_8.Dictionary && b.keyType == "object" && b.valueType == "object");
                var bMap = b;
                bMap.Get(1).Should().Be("value1");
                bMap.Get(2).Should().Be("value2");
                bMap.Get("key3").Should().Be("value3");
                bMap.Get("key4").Should().Be("value4");
            });
            test("D1_Dictionary_Complex", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{uiPrefs:{toolOptions:'<<{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}>>' liveTool:'Select'}}");
                a["uiPrefs"]["toolOptions"].primitiveValue.Should().Be("{Select:{} TerrainShape:{showPreview:true continuousMode:true strength:.3 size:7} TerrainTexture:{textureName:null size:7}}");
                a["uiPrefs"]["liveTool"].primitiveValue.Should().Be("Select");
            });
            test("D1_Dictionary_TypesInferredFromGenerics", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{vertexColors:Dictionary(string Color)>{9,4,2.5:'Black' 1,8,9.5435:'Gray' 25,15,5:'White'}}");
                a["vertexColors"]["9,4,2.5"].primitiveValue.Should().Be("Black");
                a["vertexColors"]["1,8,9.5435"].primitiveValue.Should().Be("Gray");
                a["vertexColors"]["25,15,5"].primitiveValue.Should().Be("White");
            });
            test("D1_ArrayPoppedOut_NoItems", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{names:[^]}");
                a["names"].listChildren.Count.Should().Be(0);
                a["names"].mapChildren.Count.Should().Be(0);
            });
            test("D1_ArrayPoppedOut", function () {
                var vdf = "{names:[^]}\n\t'Dan'\n\t'Bob'";
                var tokens = VDFTokenParser_2.VDFTokenParser.ParseTokens(vdf);
                var tokenTypes = tokens.Select(function (b) { return VDFTokenParser_2.VDFTokenType[b.type]; });
                tokenTypes.Should().BeEquivalentTo(new VDFExtras_8.List("VDFTokenType", VDFTokenParser_2.VDFTokenType.MapStartMarker, VDFTokenParser_2.VDFTokenType.Key, VDFTokenParser_2.VDFTokenType.ListStartMarker, VDFTokenParser_2.VDFTokenType.String, VDFTokenParser_2.VDFTokenType.String, VDFTokenParser_2.VDFTokenType.ListEndMarker, VDFTokenParser_2.VDFTokenType.MapEndMarker).Select(function (a) { return VDFTokenParser_2.VDFTokenType[a]; }));
                var a = VDFLoader_5.VDFLoader.ToVDFNode(vdf);
                a["names"][0].primitiveValue.Should().Be("Dan");
                a["names"][1].primitiveValue.Should().Be("Bob");
            });
            test("D1_ArraysPoppedOut", function () {
                var vdf = "{names:[^] ages:[^]}\n\t'Dan'\n\t'Bob'\n\t^10\n\t20";
                var tokens = VDFTokenParser_2.VDFTokenParser.ParseTokens(vdf);
                var tokenTypes = tokens.Select(function (b) { return VDFTokenParser_2.VDFTokenType[b.type]; });
                tokenTypes.Should().BeEquivalentTo(new VDFExtras_8.List("VDFTokenType", VDFTokenParser_2.VDFTokenType.MapStartMarker, VDFTokenParser_2.VDFTokenType.Key, VDFTokenParser_2.VDFTokenType.ListStartMarker, VDFTokenParser_2.VDFTokenType.String, VDFTokenParser_2.VDFTokenType.String, VDFTokenParser_2.VDFTokenType.ListEndMarker, VDFTokenParser_2.VDFTokenType.Key, VDFTokenParser_2.VDFTokenType.ListStartMarker, VDFTokenParser_2.VDFTokenType.Number, VDFTokenParser_2.VDFTokenType.Number, VDFTokenParser_2.VDFTokenType.ListEndMarker, VDFTokenParser_2.VDFTokenType.MapEndMarker).Select(function (a) { return VDFTokenParser_2.VDFTokenType[a]; }));
                var a = VDFLoader_5.VDFLoader.ToVDFNode(vdf);
                a["names"][0].primitiveValue.Should().Be("Dan");
                a["names"][1].primitiveValue.Should().Be("Bob");
                a["ages"][0].primitiveValue.Should().Be(10);
                a["ages"][1].primitiveValue.Should().Be(20);
            });
            test("D1_InferredDictionaryPoppedOut", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{messages:{^} otherProperty:false}\n\
	title1:'message1'\n\
	title2:'message2'");
                a["messages"].mapChildren.Count.Should().Be(2);
                a["messages"]["title1"].primitiveValue.Should().Be("message1");
                a["messages"]["title2"].primitiveValue.Should().Be("message2");
                a["otherProperty"].primitiveValue.Should().Be(false);
            });
            test("D1_Map_PoppedOutMap", function () {
                /*
                Written as:
                
                {messages:{^} otherProperty:false}
                    title1:"message1"
                    title2:"message2"
                
                Parsed as:
                
                {messages:{
                    title1:"message1"
                    title2:"message2"
                } otherProperty:false}
                 */
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{messages:{^} otherProperty:false}\n\
	title1:'message1'\n\
	title2:'message2'");
                a["messages"].mapChildren.Count.Should().Be(2);
                a["messages"]["title1"].primitiveValue.Should().Be("message1");
                a["messages"]["title2"].primitiveValue.Should().Be("message2");
                a["otherProperty"].primitiveValue.Should().Be(false);
            });
            test("D1_Object_MultilineStringThenProperty", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{text:'<<This is a\n\
multiline string\n\
of three lines in total.>>' bool:true}");
                a["text"].primitiveValue.Should().Be("This is a\n\
multiline string\n\
of three lines in total.".Fix());
                a["bool"].primitiveValue.Should().Be(true);
            });
            test("D1_Object_PoppedOutStringsThenMultilineString", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{childTexts:[^] text:'<<This is a\n\
multiline string\n\
of three lines in total.>>'}\n\
	'text1'\n\
	'text2'");
                a["childTexts"][0].primitiveValue.Should().Be("text1");
                a["childTexts"][1].primitiveValue.Should().Be("text2");
                a["text"].primitiveValue.Should().Be("This is a\n\
multiline string\n\
of three lines in total.".Fix());
            });
            test("D2_List_Lists_PoppedOutObjects", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("[[^] [^] [^]]\n\
	{name:'Road'}\n\
	^{name:'RoadAndPath'}\n\
	^{name:'SimpleHill'}"); //, new VDFLoadOptions({inferStringTypeForUnknownTypes: true}));
                a.listChildren.Count.Should().Be(3);
            });
            test("D2_List_PoppedOutObjects_MultilineString", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("[^]\n\
	{id:1 multilineText:'<<line1\n\
	line2\n\
	line3>>'}\n\
	{id:2 multilineText:'<<line1\n\
	line2>>'}");
                a.listChildren.Count.Should().Be(2);
            });
            test("D2_Object_PoppedOutObject_PoppedOutObject", function () {
                var a = VDFLoader_5.VDFLoader.ToVDFNode("{name:'L0' children:[^]}\n\
	{name:'L1' children:[^]}\n\
		{name:'L2'}");
                a["children"].listChildren.Count.Should().Be(1);
                a["children"].listChildren[0]["children"].listChildren.Count.Should().Be(1);
            });
            test("D5_TokenTextPreservation", function () {
                var vdf1 = "{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^] tasksScriptText:'<<Shoot at Enemy Vehicle\n\
	Gun1 aim at EnemyVehicle_NonBroken\n\
	Gun1 fire>>'}\n\
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}\n\
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}".replace(/\r\n/g, "\n");
                var tokens = VDFTokenParser_2.VDFTokenParser.ParseTokens(vdf1, null, true, false);
                // shift each within-string literal-end-marker token to after its containing-string's token
                for (var i = 0; i < tokens.Count; i++) {
                    if (tokens[i].type == VDFTokenParser_2.VDFTokenType.LiteralEndMarker && tokens[i + 1].type == VDFTokenParser_2.VDFTokenType.String) {
                        var oldFirst = tokens[i];
                        tokens[i] = tokens[i + 1];
                        tokens[i + 1] = oldFirst;
                        i++;
                    }
                }
                var vdf2 = "";
                for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
                    var token = tokens_1[_i];
                    vdf2 += token.text;
                }
                vdf1.Should().Be(vdf2);
            });
            test("D5_DeepNestedPoppedOutData", function () {
                var vdf = "{name:'Main' worlds:Dictionary(string object)>{Test1:{vObjectRoot:{name:'VObjectRoot' children:[^]}} Test2:{vObjectRoot:{name:'VObjectRoot' children:[^]}}}}\n\
	{id:System.Guid>'025f28a5-a14b-446d-b324-2d274a476a63' name:'#Types' children:[]}\n\
	^{id:System.Guid>'08e84f18-aecf-4b80-9c3f-ae0697d9033a' name:'#Types' children:[]}";
                var livePackNode = VDFLoader_5.VDFLoader.ToVDFNode(vdf);
                livePackNode["worlds"]["Test1"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("025f28a5-a14b-446d-b324-2d274a476a63");
                livePackNode["worlds"]["Test2"]["vObjectRoot"]["children"][0]["id"].primitiveValue.Should().Be("08e84f18-aecf-4b80-9c3f-ae0697d9033a");
            });
            // export all classes/enums to global scope
            GeneralInit_2.ExportInternalClassesTo(window, function (str) { return eval(str); });
        })(Loading_ToVDFNode || (Loading_ToVDFNode = {}));
    })(VDFTests || (VDFTests = {}));
});
define("Tests/TypeScript/Loading/L_General", ["require", "exports", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDF", "Source/TypeScript/VDFLoader", "Tests/TypeScript/GeneralInit", "Tests/TypeScript/GeneralInit", "Tests/TypeScript/Loading/ToObject", "Tests/TypeScript/Loading/ToVDFNode", "./Loading/SpeedTests"], function (require, exports, VDFTypeInfo_5, VDF_7, VDFLoader_6, GeneralInit_3, GeneralInit_4) {
    exports.Loading_RunTests = GeneralInit_4.Loading_RunTests;
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Loading_General;
        (function (Loading_General) {
            // deserialize-related methods
            // ==========
            var D1_MapWithEmbeddedDeserializeMethod_Prop_Class = (function () {
                function D1_MapWithEmbeddedDeserializeMethod_Prop_Class() {
                    this.boolProp = false;
                }
                D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype.Deserialize = function (node) { this.boolProp = node["boolProp"].primitiveValue; };
                return D1_MapWithEmbeddedDeserializeMethod_Prop_Class;
            }());
            __decorate([
                VDFTypeInfo_5.P()
            ], D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype, "boolProp", void 0);
            __decorate([
                VDFTypeInfo_5._VDFDeserialize()
            ], D1_MapWithEmbeddedDeserializeMethod_Prop_Class.prototype, "Deserialize", null);
            test("D1_MapWithEmbeddedDeserializeMethod_Prop", function () { VDF_7.VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethod_Prop_Class").boolProp.Should().Be(true); });
            var D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class = (function () {
                function D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class() {
                    this.boolProp = false;
                }
                D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype.Deserialize = function (node) { return; };
                return D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class;
            }());
            __decorate([
                VDFTypeInfo_5.P()
            ], D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype, "boolProp", void 0);
            __decorate([
                VDFTypeInfo_5._VDFDeserialize()
            ], D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class.prototype, "Deserialize", null);
            test("D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop", function () { VDF_7.VDF.Deserialize("{boolProp:true}", "D1_MapWithEmbeddedDeserializeMethodThatTakesNoAction_Prop_Class").boolProp.Should().Be(true); });
            var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent = (function () {
                function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent() {
                    this.child = null;
                }
                return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent;
            }());
            __decorate([
                VDFTypeInfo_5.T("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child"), VDFTypeInfo_5.P()
            ], D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent.prototype, "child", void 0);
            var D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child = (function () {
                function D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child() {
                }
                D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child.Deserialize = function (node, path, options) { return null; };
                return D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child;
            }());
            __decorate([
                VDFTypeInfo_5._VDFDeserialize(true)
            ], D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Child, "Deserialize", null);
            test("D1_MapWithEmbeddedDeserializeFromParentMethod_Prop", function () { ok(VDF_7.VDF.Deserialize("{child:{}}", "D1_MapWithEmbeddedDeserializeFromParentMethod_Prop_Class_Parent").child == null); });
            var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent = (function () {
                function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent() {
                    this.child = null;
                }
                return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent;
            }());
            __decorate([
                VDFTypeInfo_5.T("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child"), VDFTypeInfo_5.P()
            ], D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent.prototype, "child", void 0);
            var D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child = (function () {
                function D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child() {
                    this.boolProp = false;
                }
                D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child.Deserialize = function (node, path, options) { return; };
                return D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child;
            }());
            __decorate([
                VDFTypeInfo_5.T("bool"), VDFTypeInfo_5.P()
            ], D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child.prototype, "boolProp", void 0);
            __decorate([
                VDFTypeInfo_5._VDFDeserialize(true)
            ], D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Child, "Deserialize", null);
            test("D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop", function () { VDF_7.VDF.Deserialize("{child:{boolProp: true}}", "D1_MapWithEmbeddedDeserializeFromParentMethodThatTakesNoAction_Prop_Class_Parent").child.boolProp.Should().Be(true); });
            var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent = (function () {
                function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent() {
                    this.withoutTag = null;
                    this.withTag = null; // doesn't actually have tag; just pretend it does
                }
                return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent;
            }());
            __decorate([
                VDFTypeInfo_5.T("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child"), VDFTypeInfo_5.P()
            ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent.prototype, "withoutTag", void 0);
            __decorate([
                VDFTypeInfo_5.T("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child"), VDFTypeInfo_5.P()
            ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent.prototype, "withTag", void 0);
            var D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child = (function () {
                function D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child() {
                    this.methodCalled = false;
                }
                D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype.Deserialize = function (node, path, options) {
                    ok(path.parentNode.obj instanceof D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent);
                    if (path.currentNode.prop.name == "withTag")
                        this.methodCalled = true;
                };
                return D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child;
            }());
            __decorate([
                VDFTypeInfo_5.T("bool"), VDFTypeInfo_5.P()
            ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype, "methodCalled", void 0);
            __decorate([
                VDFTypeInfo_5._VDFDeserialize()
            ], D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Child.prototype, "Deserialize", null);
            test("D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag", function () {
                var a = VDF_7.VDF.Deserialize("{withoutTag:{} withTag:{}}", "D1_Map_PropReferencedByInClassDeserializeMethodThatIsOnlyCalledForParentPropWithTag_Class_Parent");
                a.withoutTag.methodCalled.Should().Be(false);
                a.withTag.methodCalled.Should().Be(true);
            });
            // for JSON compatibility
            // ==========
            test("D1_Map_IntsWithStringKeys", function () {
                var a = VDFLoader_6.VDFLoader.ToVDFNode("{\"key1\":0 \"key2\":1}", new VDFLoader_6.VDFLoadOptions({ allowStringKeys: true }));
                a.mapChildren.Count.Should().Be(2);
                a["key1"].primitiveValue.Should().Be(0);
            });
            test("D1_List_IntsWithCommaSeparators", function () {
                var a = VDFLoader_6.VDFLoader.ToVDFNode("[0,1]", new VDFLoader_6.VDFLoadOptions({ allowCommaSeparators: true }));
                a.listChildren.Count.Should().Be(2);
                a[0].primitiveValue.Should().Be(0);
            });
            test("D3_List_NumbersWithScientificNotation", function () {
                var a = VDFLoader_6.VDFLoader.ToVDFNode("[-7.45058e-09,0.1,-1.49012e-08]", new VDFLoader_6.VDFLoadOptions().ForJSON());
                a[0].primitiveValue.Should().Be(-7.45058e-09);
            });
            // unique to JavaScript version
            // ==========
            var PretendGenericType = (function () {
                function PretendGenericType() {
                }
                return PretendGenericType;
            }());
            test("Depth0_ObjectWithMetadataHavingGenericType", function () { return ok(VDF_7.VDF.Deserialize("PretendGenericType(object)>{}") instanceof PretendGenericType); });
            test("Depth1_UnknownTypeWithFixOn_String", function () {
                var a = VDF_7.VDF.Deserialize("UnknownType>{string:'Prop value string.'}", new VDFLoader_6.VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
                a["string"].Should().Be("Prop value string.");
            });
            test("Depth1_UnknownTypeWithFixOff_String", function () {
                try {
                    VDF_7.VDF.Deserialize("UnknownType>{string:'Prop value string.'}");
                }
                catch (ex) {
                    ok(ex.message == "Could not find type \"UnknownType\".");
                }
            });
            test("Depth1_Object_UnknownTypeWithFixOn", function () {
                var a = VDF_7.VDF.Deserialize("{string:UnkownBaseType>'Prop value string.'}", new VDFLoader_6.VDFLoadOptions({ loadUnknownTypesAsBasicTypes: true }));
                a["string"].Should().Be("Prop value string.");
            });
            test("AsObject", function () {
                var a = VDF_7.VDF.Deserialize("{bool:bool>false double:double>3.5}", "object");
                a.bool.Should().Be(false);
                a.double.Should().Be(3.5);
            });
            var AsObjectOfType_Class = (function () {
                function AsObjectOfType_Class() {
                }
                return AsObjectOfType_Class;
            }());
            test("AsObjectOfType", function () {
                var a = VDF_7.VDF.Deserialize("AsObjectOfType_Class>{}", "AsObjectOfType_Class");
                ok(a instanceof AsObjectOfType_Class);
            });
            // quick tests
            // ==========
            test("QuickTest1", function () {
                var a = VDF_7.VDF.Deserialize('{^}\n\
	structures:[^]\n\
		{typeVObject:string>"VObject>Flag" id:0}\n\
		{typeVObject:string>"VObject>Flag" id:1}', "object");
                a.structures[0].typeVObject.Should().Be("VObject>Flag");
                a.structures[1].id.Should().Be(1);
            });
            // export all classes/enums to global scope
            GeneralInit_3.ExportInternalClassesTo(window, function (str) { return eval(str); });
        })(Loading_General || (Loading_General = {}));
    })(VDFTests || (VDFTests = {}));
});
define("Tests/TypeScript/Loading/SpeedTests", ["require", "exports", "Source/TypeScript/VDFLoader", "Tests/TypeScript/GeneralInit"], function (require, exports, VDFLoader_7, GeneralInit_5) {
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Loading_SpeedTests;
        (function (Loading_SpeedTests) {
            // run tests once ahead of time, so VDF-type-data is pre-loaded for profiled tests
            /*loading["D3_SpeedTester"]();
            loading["D5_SpeedTester2"]();*/
            test("D3_SpeedTester", function () {
                var vdf = "{id:'595880cd-13cd-4578-9ef1-bd3175ac72bb' visible:true parts:[^]}\n\
	{id:'ba991aaf-447a-4a03-ade8-f4a11b4ea966' typeName:'Wood' name:'Body' pivotPoint_unit:'-0.1875,0.4375,-0.6875' anchorNormal:'0,1,0' scale:'0.5,0.25,1.5' controller:true}\n\
	{id:'743f64f2-8ece-4dd3-bdf5-bbb6378ffce5' typeName:'Wood' name:'FrontBar' pivotPoint_unit:'-0.4375,0.5625,0.8125' anchorNormal:'0,0,1' scale:'1,0.25,0.25' controller:false}\n\
	{id:'52854b70-c200-478f-bcd2-c69a03cd808f' typeName:'Wheel' name:'FrontLeftWheel' pivotPoint_unit:'-0.5,0.5,0.875' anchorNormal:'-1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'971e394c-b440-4fee-99fd-dceff732cd1e' typeName:'Wheel' name:'BackRightWheel' pivotPoint_unit:'0.5,0.5,-0.875' anchorNormal:'1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'77d30d72-9845-4b22-8e95-5ba6e29963b9' typeName:'Wheel' name:'FrontRightWheel' pivotPoint_unit:'0.5,0.5,0.875' anchorNormal:'1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'21ca2a80-6860-4de3-9894-b896ec77ef9e' typeName:'Wheel' name:'BackLeftWheel' pivotPoint_unit:'-0.5,0.5,-0.875' anchorNormal:'-1,0,0' scale:'1,1,1' controller:false}\n\
	{id:'eea2623a-86d3-4368-b4e0-576956b3ef1d' typeName:'Wood' name:'BackBar' pivotPoint_unit:'-0.4375,0.4375,-0.8125' anchorNormal:'0,0,-1' scale:'1,0.25,0.25' controller:false}\n\
	{id:'f1edc5a1-d544-4993-bdad-11167704a1e1' typeName:'MachineGun' name:'Gun1' pivotPoint_unit:'0,0.625,0.875' anchorNormal:'0,1,0' scale:'0.5,0.5,0.5' controller:false}\n\
	{id:'e97f8ee1-320c-4aef-9343-3317accb015b' typeName:'Crate' name:'Crate' pivotPoint_unit:'0,0.625,0' anchorNormal:'0,1,0' scale:'0.5,0.5,0.5' controller:false}";
                VDFLoader_7.VDFLoader.ToVDFNode(vdf);
                ok(true);
            });
            test("D5_SpeedTester2", function () {
                var vdf = "\n{^}\n\tplants:[^]\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"9 406 0.5\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"9 412 0.5\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"9 416 0.5\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"9 486 0.5\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"9 490 0.5\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"9 495 0.5\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"10 398 1\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"10 402 1\"\n\t\t\ttype:\"Broadleaf_2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"10 409 1\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"12 405 2\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"12 407 2\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"12 409 2\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"14 413 3\"\n\t\t\ttype:\"Broadleaf_1\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"13 401 2.5\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"13 403 2.5\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"14 405 3\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"14 407 3\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"14 409 3\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"16 402 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"17 406 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"16 409 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"22 250 3.99980926513672\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"21 253 3.99976348876953\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"21 255 3.99992370605469\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"23 253 3.99986267089844\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"23 255 3.99992370605469\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"25 245 3.99985504150391\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"25 247 3.9998779296875\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"26 250 3.99990844726563\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"25 253 3.99990844726563\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"25 255 3.99996948242188\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"25 257 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"25 259 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"27 245 3.99989318847656\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"28 254 3.99996948242188\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"27 257 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"28 260 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"28 247 3.99993133544922\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"29 241 3.99992370605469\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"29 243 3.99992370605469\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"29 245 3.99991607666016\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"30 250 3.99996185302734\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"29 257 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"29 263 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"30 247 3.99994659423828\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"31 241 3.99993896484375\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"31 243 3.99996185302734\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"31 245 3.99996185302734\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"32 254 3.99998474121094\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"31 257 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"31 259 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 263 4\"\n\t\t\ttype:\"Broadleaf_1\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 41 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 43 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 45 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"34 48 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 51 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 53 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"34 56 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 237 3.99996185302734\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"34 240 3.99990081787109\"\n\t\t\ttype:\"Broadleaf_2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 243 3.99997711181641\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"34 246 3.99998474121094\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 249 3.99998474121094\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 251 3.99997711181641\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 257 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"33 260 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"34 268 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"34 259 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 41 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"36 44 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 51 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 53 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 237 3.99996185302734\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 243 3.99998474121094\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 249 3.99999237060547\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"36 252 3.99998474121094\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"35 255 3.99999237060547\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"36 258 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 37 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 39 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 41 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 47 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 49 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 51 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 53 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"38 56 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 59 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 61 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 63 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 237 3.99703979492188\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 239 3.99697113037109\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 241 3.99952697753906\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"38 244 3.999267578125\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"38 248 3.99997711181641\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 261 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"37 263 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"38 266 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"38 270 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"40 38 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 41 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 43 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 45 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 47 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"40 50 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 54 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"40 60 4\"\n\t\t\ttype:\"Broadleaf_2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 63 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 237 3.99703979492188\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 239 3.99111938476563\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 241 3.99368286132813\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 251 3.99996948242188\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 253 3.99998474121094\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 255 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 257 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 259 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 261 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"39 263 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 34 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 42 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 45 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 47 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 54 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 57 3.86945343017578\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 63 3.92586517333984\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 66 3.85173034667969\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 70 4.72548675537109\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 73 4.41551971435547\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 76 4.83103942871094\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 80 4.77939605712891\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 83 4.07389068603516\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 233 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 235 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 237 3.99819183349609\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 239 3.99227142333984\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 241 3.99039459228516\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 243 3.99558258056641\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 245 3.9984130859375\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 247 3.99912261962891\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 250 3.99836730957031\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 254 3.99998474121094\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 259 4\"\n\t\t\ttype:\"Broadleaf_1\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 263 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 265 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"41 267 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"42 270 4\"\n\t\t\ttype:\"Broadleaf_2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 37 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 39 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 45 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 48 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 51 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 57 3.86945343017578\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 60 3.47781372070313\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 73 5.14100646972656\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 84 4.29557037353516\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 234 4\"\n\t\t\ttype:\"Broadleaf_2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 237 3.99819183349609\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 240 3.99275970458984\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 244 3.99708557128906\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 247 3.99815368652344\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"43 263 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"44 266 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 37 4.20879364013672\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 39 4.20879364013672\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 41 4.20937347412109\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 43 4.20937347412109\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 51 4.00287628173828\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 53 4.02330017089844\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 55 4.02330017089844\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 57 4.03544616699219\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"46 64 4.71137851017669\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 67 5.50337982177734\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 69 5.83818817138672\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 71 5.84939575195313\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 75 6.74217224121094\"\n\t\t\ttype:\"Broadleaf_1\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 79 5.97611236572266\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 87 4.40133666992188\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 89 4.49819946289063\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 91 4.5694580078125\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 238 3.99510192871094\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"46 248 3.99839019775391\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 251 3.99759674072266\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 253 3.99757385253906\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 255 3.99919128417969\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 263 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"45 269 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"46 272 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"46 45 4.32740020751953\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"46 81 6.16506958007813\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 38 4.79120635986328\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 41 4.62696838378906\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 43 4.62812805175781\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 47 4.35408020019531\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 49 4.23892974853516\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 51 4.00862884521484\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 53 4.029052734375\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 56 4.09320068359375\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 59 4.10633850097656\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 61 4.22352532202559\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 67 6.14738464355469\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 70 6.89182281494141\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 83 6.20314788818359\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 85 5.54216003417969\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 87 4.85179901123047\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 89 4.94866180419922\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 91 5.22205352783203\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 234 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 238 3.99383544921875\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 242 3.99224853515625\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 251 3.99861907958984\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 254 3.99941253662109\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 257 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 259 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 262 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"47 265 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 268 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 45 4.74615478515625\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 79 7.13672461469146\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 81 7.1247786078701\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"48 245 3.99730682373047\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 41 5.18635559082031\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 43 5.18751525878906\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 49 5.37989044189453\"\n\t\t\ttype:\"Broadleaf_1\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 54 4.07085418701172\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 59 4.14813995361328\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 61 4.69170288500582\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 64 6.03464508056641\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 67 6.44294738769531\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 83 7.69938266204127\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 85 7.34394238179097\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 87 6.817580429812\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 89 5.46152876954768\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 91 5.73491668701172\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 248 3.99862670898438\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 251 3.99854278564453\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 257 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 259 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 265 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"49 271 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 45 5.45948791503906\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 53 4.347900390625\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 79 8.63121075076069\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 81 8.83076811475225\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"50 245 3.99758148193359\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 41 5.50032043457031\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 43 5.88870239257813\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"53 57 4.19117736816406\"\n\t\t\ttype:\"Broadleaf_1\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 62 5.19688668210223\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 67 6.39008331298828\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 70 7.31072152554988\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 73 7.81732625308945\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 76 9.64667510986328\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 84 10.9526667606263\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 87 9.21038396212089\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 90 8.40490492338341\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 237 3.99828338623047\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 239 3.99484252929688\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 242 3.99565124511719\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 251 3.99802398681641\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 253 3.99859619140625\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 255 3.99970245361328\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 257 4\"\n\t\t\ttype:\"Bush2\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 259 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 261 4\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"51 263 4\"\n\t\t\ttype:\"BerryBush16\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t\thasProduce:{^}\n\t\t\t\thealth:0\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 266 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 270 4\"\n\t\t\ttype:\"Palm\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 45 6.16066741943359\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n\t\t{^}\n\t\t\ttransform:{^}\n\t\t\t\tposition:\"52 53 4.94283294677734\"\n\t\t\ttype:\"Banana Tree\"\n\t\t\townerRegion:\"@/regions/i:1\"\n".trim();
                //for (var i = 0; i < 100; i++)
                VDFLoader_7.VDFLoader.ToVDFNode(vdf);
                ok(true);
            });
            // export all classes/enums to global scope
            GeneralInit_5.ExportInternalClassesTo(window, function (str) { return eval(str); });
        })(Loading_SpeedTests || (Loading_SpeedTests = {}));
    })(VDFTests || (VDFTests = {}));
});
// Object: base
// ==================
if (Object._AddItem == null) {
    // the below lets you do stuff like this: Array.prototype._AddFunction(function AddX(value) { this.push(value); }); [].AddX("newItem");
    // note; these functions should by default add non-enumerable properties/items
    Object.defineProperty(Object.prototype, "_AddItem", {
        enumerable: false,
        value: function (name, value, forceAdd) {
            if (forceAdd === void 0) { forceAdd = true; }
            if (this[name] && forceAdd)
                delete this[name];
            if (!this[name]) {
                Object.defineProperty(this, name, {
                    enumerable: false,
                    value: value
                });
            }
        }
    });
    Object.prototype._AddItem("_AddFunction", function (func, forceAdd) {
        if (forceAdd === void 0) { forceAdd = true; }
        this._AddItem(func.name || func.toString().match(/^function\s*([^\s(]+)/)[1], func, forceAdd);
    });
    // the below lets you do stuff like this: Array.prototype._AddGetterSetter("AddX", null, function(value) { this.push(value); }); [].AddX = "newItem";
    Object.prototype._AddFunction(function _AddGetterSetter(getter, setter, forceAdd) {
        if (forceAdd === void 0) { forceAdd = true; }
        var name = (getter || setter).name || (getter || setter).toString().match(/^function\s*([^\s(]+)/)[1];
        if (this[name] && forceAdd)
            delete this[name];
        if (!this[name]) {
            if (getter && setter)
                Object.defineProperty(this, name, { enumerable: false, get: getter, set: setter });
            else if (getter)
                Object.defineProperty(this, name, { enumerable: false, get: getter });
            else
                Object.defineProperty(this, name, { enumerable: false, set: setter });
        }
    });
    // the below lets you do stuff like this: Array.prototype._AddFunction_Inline = function AddX(value) { this.push(value); }; [].AddX = "newItem";
    Object.prototype._AddGetterSetter(null, function _AddFunction_Inline(func) { this._AddFunction(func, true); });
    Object.prototype._AddGetterSetter(null, function _AddGetter_Inline(func) { this._AddGetterSetter(func, null); });
    Object.prototype._AddGetterSetter(null, function _AddSetter_Inline(func) { this._AddGetterSetter(null, func); });
}
var V = new function () {
    var self = this;
    /*self.AddClosureFunctionsToX = function(newHolder, nameMatchStartStr = "")
    {
        var names = arguments.callee.caller.toString().match(new RegExp("function\\s+(" + nameMatchStartStr + "[\\w\\d]+)\\s*\\(", "g"));
        for (var i = 0; i < names.length; i++)
            try { newHolder[names[i]] = eval(names[i]); } catch(e) {}
    }
    AddClosureFunctionsToX(self);*/
    self.CloneObject = function (obj) { return $.extend({}, obj); }; //deep: JSON.parse(JSON.stringify(obj));
    self.CloneArray = function (array) { return Array.prototype.slice.call(array, 0); }; //array.slice(0); //deep: JSON.parse(JSON.stringify(array));
    self.Map = function (list, mapFunc) {
        var result = [];
        for (var i = 0; i < list.length; i++)
            result[i] = mapFunc(list[i]);
        return result;
    };
    self.GetMatches = function (str, regex, groupIndex) {
        groupIndex = groupIndex || 1; // default to the first capturing group
        var matches = [];
        var match;
        while (match = regex.exec(str))
            matches.push(match[groupIndex]);
        return matches;
    };
    //self.Multiline = function (functionWithInCommentMultiline) { return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, ''); };
    // example:
    // alert(V.Multiline(function()
    //{/*
    // Text that...
    // spans multiple...
    // lines.
    //*/}));
    //self.Multiline = function(functionWithInCommentMultiline) { return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*/, '').replace(/\*\/(.|\n)*/, ''); };
    self.Multiline = function (functionWithInCommentMultiline) {
        var text = functionWithInCommentMultiline.toString().replace(/\r/g, "");
        var firstCharPos = text.indexOf("\n", text.indexOf("/*"));
        return text.substring(firstCharPos + 1, text.lastIndexOf("\n"));
    };
    self.ExtendWith = function (value) { $.extend(this, value); };
    self.timerStart = 0;
    self.StartTimer = function () { self.timerStart = new Date().getTime(); };
    self.StopTimerAndMarkTime = function () { console.log("Took (in ms): " + (new Date().getTime() - self.timerStart)); };
};
var VDebug = (function () {
    function VDebug() {
    }
    VDebug.StartTimer = function () { VDebug.timerStart = new Date().getTime(); };
    VDebug.StopTimerAndMarkTime = function (name) { console.log("Time (in ms)" + (name ? " - " + name : "") + ": " + (new Date().getTime() - VDebug.timerStart)); };
    VDebug.StartSection = function () { VDebug.timerStart = new Date().getTime(); };
    VDebug.EndSection = function (name, waitTimeBeforeResults) {
        if (waitTimeBeforeResults === void 0) { waitTimeBeforeResults = 1000; }
        VDebug.sectionTotals[name] = (VDebug.sectionTotals[name] || 0) + (new Date().getTime() - VDebug.timerStart);
        var oldVal = VDebug.sectionTotals[name];
        clearTimeout(VDebug.waitTimerIDs[name]);
        VDebug.waitTimerIDs[name] = setTimeout(function () {
            if (VDebug.sectionTotals[name] == oldVal)
                console.log("Time (in ms)" + (name ? " - " + name : "") + ": " + oldVal);
        }, waitTimeBeforeResults);
    };
    return VDebug;
}());
VDebug.timerStart = 0;
VDebug.sectionTotals = {};
VDebug.waitTimerIDs = {};
define("Tests/TypeScript/Saving/FromObject", ["require", "exports", "Source/TypeScript/VDF", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDFSaver", "Source/TypeScript/VDFNode", "Source/TypeScript/VDFExtras", "Tests/TypeScript/GeneralInit"], function (require, exports, VDF_8, VDFTypeInfo_6, VDFSaver_3, VDFNode_3, VDFExtras_9, GeneralInit_6) {
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Saving_FromObject;
        (function (Saving_FromObject) {
            // from object
            // ==========
            test("D0_Null", function () { VDF_8.VDF.Serialize(null).Should().Be("null"); });
            test("D0_EmptyString", function () { VDF_8.VDF.Serialize("").Should().Be("\"\""); });
            var D1_IgnoreDefaultValues_Class = (function () {
                function D1_IgnoreDefaultValues_Class() {
                    this.bool1 = null;
                    this.bool2 = true;
                    this.bool3 = true;
                    this.string1 = null;
                    this.string2 = "value1";
                    this.string3 = "value1";
                }
                return D1_IgnoreDefaultValues_Class;
            }());
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P(), VDFTypeInfo_6.D()
            ], D1_IgnoreDefaultValues_Class.prototype, "bool1", void 0);
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P(), VDFTypeInfo_6.D(true)
            ], D1_IgnoreDefaultValues_Class.prototype, "bool2", void 0);
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], D1_IgnoreDefaultValues_Class.prototype, "bool3", void 0);
            __decorate([
                VDFTypeInfo_6.T("string"), VDFTypeInfo_6.D()
            ], D1_IgnoreDefaultValues_Class.prototype, "string1", void 0);
            __decorate([
                VDFTypeInfo_6.T("string"), VDFTypeInfo_6.D("value1")
            ], D1_IgnoreDefaultValues_Class.prototype, "string2", void 0);
            __decorate([
                VDFTypeInfo_6.T("string")
            ], D1_IgnoreDefaultValues_Class.prototype, "string3", void 0);
            D1_IgnoreDefaultValues_Class = __decorate([
                VDFTypeInfo_6.TypeInfo("^(?!_)")
            ], D1_IgnoreDefaultValues_Class);
            test("D1_IgnoreDefaultValues", function () {
                VDF_8.VDF.Serialize(new D1_IgnoreDefaultValues_Class(), "D1_IgnoreDefaultValues_Class").Should().Be("{bool3:true string3:\"value1\"}");
            });
            var D1_NullValues_Class = (function () {
                function D1_NullValues_Class() {
                    this.obj = null;
                    this.strings = null;
                    this.strings2 = new VDFExtras_9.List("string");
                }
                return D1_NullValues_Class;
            }());
            __decorate([
                VDFTypeInfo_6.T("object"), VDFTypeInfo_6.P()
            ], D1_NullValues_Class.prototype, "obj", void 0);
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P()
            ], D1_NullValues_Class.prototype, "strings", void 0);
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P()
            ], D1_NullValues_Class.prototype, "strings2", void 0);
            test("D1_NullValues", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new D1_NullValues_Class());
                ok(a["obj"].metadata == null); //a["obj"].metadata.Should().Be(null);
                ok(a["obj"].primitiveValue == null); //a["obj"].primitiveValue.Should().Be(null);
                ok(a["strings"].metadata == null); //a["strings"].metadata.Should().Be(null);
                ok(a["strings"].primitiveValue == null); //a["strings"].primitiveValue.Should().Be(null);
                //ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // unmarked type
                ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
                ok(a["strings2"].primitiveValue == null); //a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
                a["strings2"].listChildren.Count.Should().Be(0);
                a.ToVDF().Should().Be("D1_NullValues_Class>{obj:null strings:null strings2:[]}");
            });
            var TypeWithDefaultStringProp = (function () {
                function TypeWithDefaultStringProp() {
                    this.defaultString = null;
                }
                return TypeWithDefaultStringProp;
            }());
            __decorate([
                VDFTypeInfo_6.T("string"), VDFTypeInfo_6.P(true), VDFTypeInfo_6.D()
            ], TypeWithDefaultStringProp.prototype, "defaultString", void 0);
            test("D1_IgnoreEmptyString", function () { VDF_8.VDF.Serialize(new TypeWithDefaultStringProp(), "TypeWithDefaultStringProp").Should().Be("{}"); });
            var TypeWithNullProps = (function () {
                function TypeWithNullProps() {
                    this.obj = null;
                    this.strings = null;
                    this.strings2 = new VDFExtras_9.List("string");
                }
                return TypeWithNullProps;
            }());
            __decorate([
                VDFTypeInfo_6.T("object"), VDFTypeInfo_6.P()
            ], TypeWithNullProps.prototype, "obj", void 0);
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P()
            ], TypeWithNullProps.prototype, "strings", void 0);
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P()
            ], TypeWithNullProps.prototype, "strings2", void 0);
            test("D1_NullValues", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithNullProps());
                ok(a["obj"].metadata == null); //a["obj"].metadata.Should().Be(null);
                ok(a["obj"].primitiveValue == null); //a["obj"].primitiveValue.Should().Be(null);
                ok(a["strings"].metadata == null); //a["strings"].metadata.Should().Be(null);
                ok(a["strings"].primitiveValue == null); //a["strings"].primitiveValue.Should().Be(null);
                //ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // unmarked type
                ok(a["strings2"].metadata == null); //a["strings2"].metadata.Should().Be(null); // old: auto-marked as list (needed, to specify sort of type, as required)
                ok(a["strings2"].primitiveValue == null); //a["strings2"].primitiveValue.Should().Be(null); // it's a List, so it shouldn't have a base-value
                a["strings2"].listChildren.Count.Should().Be(0);
                a.ToVDF().Should().Be("TypeWithNullProps>{obj:null strings:null strings2:[]}");
            });
            var TypeWithList_PopOutItemData = (function () {
                function TypeWithList_PopOutItemData() {
                    this.list = new VDFExtras_9.List("string", "A", "B");
                }
                return TypeWithList_PopOutItemData;
            }());
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P(true, true)
            ], TypeWithList_PopOutItemData.prototype, "list", void 0);
            test("D1_ListItems_PoppedOutChildren", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithList_PopOutItemData(), "TypeWithList_PopOutItemData");
                a.ToVDF().Should().Be("{list:[^]}\n\
	\"A\"\n\
	\"B\"".replace(/\r/g, ""));
            });
            test("D1_ListItems_Null", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new VDFExtras_9.List("string", null));
                ok(a[0].metadata == null); //a[0].metadata.Should().Be(null);
                ok(a[0].primitiveValue == null); //a[0].primitiveValue.Should().Be(null);
                a.ToVDF().Should().Be("List(string)>[null]");
            });
            test("D1_SingleListItemWithAssemblyKnownTypeShouldStillSpecifySortOfType", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new VDFExtras_9.List("string", "hi"), "List(string)");
                a.ToVDF().Should().Be("[\"hi\"]");
            });
            test("D1_StringAndArraysInArray", function () { VDF_8.VDF.Serialize(new VDFExtras_9.List("object", "text", new VDFExtras_9.List("string", "a", "b"))).Should().Be("[\"text\" List(string)>[\"a\" \"b\"]]"); });
            test("D1_DictionaryValues_Null", function () {
                var dictionary = new VDFExtras_9.Dictionary("string", "string");
                dictionary.Add("key1", null);
                var a = VDFSaver_3.VDFSaver.ToVDFNode(dictionary);
                ok(a["key1"].metadata == null); //a["key1"].metadata.Should().Be(null);
                ok(a["key1"].primitiveValue == null); //a["key1"].primitiveValue.Should().Be(null);
                a.ToVDF().Should().Be("Dictionary(string string)>{key1:null}");
            });
            test("D1_AnonymousTypeProperties_MarkNoTypes", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a["Bool"].primitiveValue.Should().Be(false);
                a["Int"].primitiveValue.Should().Be(5);
                a["Double"].primitiveValue.Should().Be(.5);
                a["String"].primitiveValue.Should().Be("Prop value string.");
                a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
            });
            test("D1_AnonymousTypeProperties_MarkAllTypes", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode({ Bool: false, Int: 5, Double: .5, String: "Prop value string." }, new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.External }));
                a.ToVDF().Should().Be("{Bool:false Int:5 Double:.5 String:\"Prop value string.\"}");
            });
            var D1_PreSerialize_Class = (function () {
                function D1_PreSerialize_Class() {
                    this.preSerializeWasCalled = false;
                }
                D1_PreSerialize_Class.prototype.PreSerialize = function () { this.preSerializeWasCalled = true; };
                return D1_PreSerialize_Class;
            }());
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], D1_PreSerialize_Class.prototype, "preSerializeWasCalled", void 0);
            __decorate([
                VDFTypeInfo_6._VDFPreSerialize()
            ], D1_PreSerialize_Class.prototype, "PreSerialize", null);
            test("D1_PreSerialize", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new D1_PreSerialize_Class(), "D1_PreSerialize_Class");
                a["preSerializeWasCalled"].primitiveValue.Should().Be(true);
                a.ToVDF().Should().Be("{preSerializeWasCalled:true}");
            });
            var D1_SerializePropMethod_Class = (function () {
                function D1_SerializePropMethod_Class() {
                    this.prop1 = 0;
                }
                D1_SerializePropMethod_Class.prototype.SerializeProp = function (propPath, options) { return new VDFNode_3.VDFNode(1); };
                return D1_SerializePropMethod_Class;
            }());
            __decorate([
                VDFTypeInfo_6._VDFSerializeProp()
            ], D1_SerializePropMethod_Class.prototype, "SerializeProp", null);
            __decorate([
                VDFTypeInfo_6.P()
            ], D1_SerializePropMethod_Class.prototype, "prop1", void 0);
            test("D1_SerializePropMethod", function () {
                var a = VDF_8.VDF.Serialize(new D1_SerializePropMethod_Class(), "D1_SerializePropMethod_Class");
                a.Should().Be("{prop1:1}");
            });
            var TypeWithPostSerializeCleanupMethod = (function () {
                function TypeWithPostSerializeCleanupMethod() {
                    this.postSerializeWasCalled = false;
                }
                TypeWithPostSerializeCleanupMethod.prototype.PostSerialize = function () { this.postSerializeWasCalled = true; };
                return TypeWithPostSerializeCleanupMethod;
            }());
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], TypeWithPostSerializeCleanupMethod.prototype, "postSerializeWasCalled", void 0);
            __decorate([
                VDFTypeInfo_6._VDFPostSerialize()
            ], TypeWithPostSerializeCleanupMethod.prototype, "PostSerialize", null);
            test("D1_PostSerializeCleanup", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithPostSerializeCleanupMethod(), "TypeWithPostSerializeCleanupMethod");
                a["postSerializeWasCalled"].primitiveValue.Should().Be(false); // should be false for VDFNode, since serialization happened before method-call
                a.ToVDF().Should().Be("{postSerializeWasCalled:false}");
            });
            var TypeWithMixOfProps = (function () {
                function TypeWithMixOfProps() {
                    this.Bool = true;
                    this.Int = 5;
                    this.Double = .5;
                    this.String = "Prop value string.";
                    this.list = new VDFExtras_9.List("string", "2A", "2B");
                    this.nestedList = new VDFExtras_9.List("List(string)", new VDFExtras_9.List("string", "1A"));
                }
                return TypeWithMixOfProps;
            }());
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], TypeWithMixOfProps.prototype, "Bool", void 0);
            __decorate([
                VDFTypeInfo_6.T("int"), VDFTypeInfo_6.P()
            ], TypeWithMixOfProps.prototype, "Int", void 0);
            __decorate([
                VDFTypeInfo_6.T("double"), VDFTypeInfo_6.P()
            ], TypeWithMixOfProps.prototype, "Double", void 0);
            __decorate([
                VDFTypeInfo_6.T("string"), VDFTypeInfo_6.P()
            ], TypeWithMixOfProps.prototype, "String", void 0);
            __decorate([
                VDFTypeInfo_6.T("List(string"), VDFTypeInfo_6.P()
            ], TypeWithMixOfProps.prototype, "list", void 0);
            __decorate([
                VDFTypeInfo_6.T("List(List(string))"), VDFTypeInfo_6.P()
            ], TypeWithMixOfProps.prototype, "nestedList", void 0);
            test("D1_TypeProperties_MarkForNone", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a["Bool"].primitiveValue.Should().Be(true);
                a["Int"].primitiveValue.Should().Be(5);
                a["Double"].primitiveValue.Should().Be(.5);
                a["String"].primitiveValue.Should().Be("Prop value string.");
                a["list"][0].primitiveValue.Should().Be("2A");
                a["list"][1].primitiveValue.Should().Be("2B");
                a["nestedList"][0][0].primitiveValue.Should().Be("1A");
                a.ToVDF().Should().Be("{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
            });
            test("D1_TypeProperties_MarkForInternal", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.Internal }));
                a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:[\"2A\" \"2B\"] nestedList:[[\"1A\"]]}");
            });
            test("D1_TypeProperties_MarkForExternal", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.External }));
                a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:true Int:5 Double:.5 String:\"Prop value string.\" list:List(string)>[\"2A\" \"2B\"] nestedList:List(List(string))>[[\"1A\"]]}");
            });
            test("D1_TypeProperties_MarkForExternalNoCollapse", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new TypeWithMixOfProps(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.ExternalNoCollapse }));
                a.ToVDF().Should().Be("TypeWithMixOfProps>{Bool:bool>true Int:int>5 Double:double>.5 String:string>\"Prop value string.\" list:List(string)>[string>\"2A\" string>\"2B\"] nestedList:List(List(string))>[List(string)>[string>\"1A\"]]}");
            });
            var D1_Object_DictionaryPoppedOutThenBool_Class1 = (function () {
                function D1_Object_DictionaryPoppedOutThenBool_Class1() {
                    this.messages = new VDFExtras_9.Dictionary("string", "string", { title1: "message1", title2: "message2" });
                    this.otherProperty = true;
                }
                return D1_Object_DictionaryPoppedOutThenBool_Class1;
            }());
            __decorate([
                VDFTypeInfo_6.T("Dictionary(string string)"), VDFTypeInfo_6.P(true, true)
            ], D1_Object_DictionaryPoppedOutThenBool_Class1.prototype, "messages", void 0);
            __decorate([
                VDFTypeInfo_6.T("Dictionary(string string)"), VDFTypeInfo_6.P()
            ], D1_Object_DictionaryPoppedOutThenBool_Class1.prototype, "otherProperty", void 0);
            test("D1_DictionaryPoppedOutThenBool", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new D1_Object_DictionaryPoppedOutThenBool_Class1(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a.ToVDF().Should().Be("{messages:{^} otherProperty:true}\n\
	title1:\"message1\"\n\
	title2:\"message2\"".replace(/\r/g, ""));
            });
            var D1_Map_PoppedOutDictionary_PoppedOutPairs_Class = (function () {
                function D1_Map_PoppedOutDictionary_PoppedOutPairs_Class() {
                    this.messages = new VDFExtras_9.Dictionary("string", "string", {
                        title1: "message1",
                        title2: "message2"
                    });
                    this.otherProperty = true;
                }
                return D1_Map_PoppedOutDictionary_PoppedOutPairs_Class;
            }());
            __decorate([
                VDFTypeInfo_6.T("Dictionary(string string)"), VDFTypeInfo_6.P(true, true)
            ], D1_Map_PoppedOutDictionary_PoppedOutPairs_Class.prototype, "messages", void 0);
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], D1_Map_PoppedOutDictionary_PoppedOutPairs_Class.prototype, "otherProperty", void 0);
            D1_Map_PoppedOutDictionary_PoppedOutPairs_Class = __decorate([
                VDFTypeInfo_6.TypeInfo(null, true)
            ], D1_Map_PoppedOutDictionary_PoppedOutPairs_Class);
            test("D1_Map_PoppedOutDictionary_PoppedOutPairs", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new D1_Map_PoppedOutDictionary_PoppedOutPairs_Class(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a.ToVDF().Should().Be("{^}\n\
	messages:{^}\n\
		title1:\"message1\"\n\
		title2:\"message2\"\n\
	otherProperty:true".replace(/\r/g, ""));
            });
            var T1_Depth1 = (function () {
                function T1_Depth1() {
                    this.level2 = new T1_Depth2();
                }
                return T1_Depth1;
            }());
            __decorate([
                VDFTypeInfo_6.T("T1_Depth2"), VDFTypeInfo_6.P()
            ], T1_Depth1.prototype, "level2", void 0);
            var T1_Depth2 = (function () {
                function T1_Depth2() {
                    this.messages = new VDFExtras_9.List("string", "DeepString1_Line1\n\tDeepString1_Line2", "DeepString2");
                    this.otherProperty = true;
                }
                return T1_Depth2;
            }());
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P(true, true)
            ], T1_Depth2.prototype, "messages", void 0);
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], T1_Depth2.prototype, "otherProperty", void 0);
            test("D2_Map_ListThenBool_PoppedOutStringsWithOneMultiline", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new T1_Depth1(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a.ToVDF().Should().Be("{level2:{messages:[^] otherProperty:true}}\n\
	\"<<DeepString1_Line1\n\
	DeepString1_Line2>>\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
            });
            var Level1 = (function () {
                function Level1() {
                    this.level2 = new Level2();
                }
                return Level1;
            }());
            __decorate([
                VDFTypeInfo_6.T("Level2"), VDFTypeInfo_6.P()
            ], Level1.prototype, "level2", void 0);
            var Level2 = (function () {
                function Level2() {
                    this.level3_first = new Level3();
                    this.level3_second = new Level3();
                }
                return Level2;
            }());
            __decorate([
                VDFTypeInfo_6.T("Level3"), VDFTypeInfo_6.P()
            ], Level2.prototype, "level3_first", void 0);
            __decorate([
                VDFTypeInfo_6.T("Level3"), VDFTypeInfo_6.P()
            ], Level2.prototype, "level3_second", void 0);
            var Level3 = (function () {
                function Level3() {
                    this.messages = new VDFExtras_9.List("string", "DeepString1", "DeepString2");
                }
                return Level3;
            }());
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P(true, true)
            ], Level3.prototype, "messages", void 0);
            test("D3_Map_Map_Maps_Lists_PoppedOutStrings", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new Level1(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[^]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"\n\
	^\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
            });
            test("D3_Map_Map_Maps_ListsWithOneEmpty_PoppedOutStrings", function () {
                var obj = new Level1();
                obj.level2.level3_second.messages = new VDFExtras_9.List("string");
                var a = VDFSaver_3.VDFSaver.ToVDFNode(obj, new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a.ToVDF().Should().Be("{level2:{level3_first:{messages:[^]} level3_second:{messages:[]}}}\n\
	\"DeepString1\"\n\
	\"DeepString2\"".replace(/\r/g, ""));
            });
            var T4_Depth1 = (function () {
                function T4_Depth1() {
                    this.level2 = new T4_Depth2();
                }
                return T4_Depth1;
            }());
            __decorate([
                VDFTypeInfo_6.T("T4_Depth2"), VDFTypeInfo_6.P()
            ], T4_Depth1.prototype, "level2", void 0);
            var T4_Depth2 = (function () {
                function T4_Depth2() {
                    this.level3_first = new T4_Depth3();
                    this.level3_second = new T4_Depth3();
                }
                return T4_Depth2;
            }());
            __decorate([
                VDFTypeInfo_6.T("T4_Depth3"), VDFTypeInfo_6.P()
            ], T4_Depth2.prototype, "level3_first", void 0);
            __decorate([
                VDFTypeInfo_6.T("T4_Depth3"), VDFTypeInfo_6.P()
            ], T4_Depth2.prototype, "level3_second", void 0);
            var T4_Depth3 = (function () {
                function T4_Depth3() {
                    this.level4s = new VDFExtras_9.List("T4_Depth4", new T4_Depth4(), new T4_Depth4());
                }
                return T4_Depth3;
            }());
            __decorate([
                VDFTypeInfo_6.T("List(T4_Depth4)"), VDFTypeInfo_6.P(true, true)
            ], T4_Depth3.prototype, "level4s", void 0);
            var T4_Depth4 = (function () {
                function T4_Depth4() {
                    this.messages = new VDFExtras_9.List("string", "text1", "text2");
                    this.otherProperty = false;
                }
                return T4_Depth4;
            }());
            __decorate([
                VDFTypeInfo_6.T("List(string)"), VDFTypeInfo_6.P(true, true)
            ], T4_Depth4.prototype, "messages", void 0);
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], T4_Depth4.prototype, "otherProperty", void 0);
            test("D4_Map_Map_Maps_Lists_PoppedOutMaps_ListsThenBools_PoppedOutStrings", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new T4_Depth1(), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.None }));
                a.ToVDF().Should().Be("{level2:{level3_first:{level4s:[^]} level3_second:{level4s:[^]}}}\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	^{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"\n\
	{messages:[^] otherProperty:false}\n\
		\"text1\"\n\
		\"text2\"".replace(/\r/g, ""));
            });
            var T5_Depth2 = (function () {
                function T5_Depth2() {
                    this.firstProperty = false;
                    this.otherProperty = false;
                }
                return T5_Depth2;
            }());
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], T5_Depth2.prototype, "firstProperty", void 0);
            __decorate([
                VDFTypeInfo_6.T("bool"), VDFTypeInfo_6.P()
            ], T5_Depth2.prototype, "otherProperty", void 0);
            T5_Depth2 = __decorate([
                VDFTypeInfo_6.TypeInfo(null, true)
            ], T5_Depth2);
            test("D4_List_Map_PoppedOutBools", function () {
                var a = VDFSaver_3.VDFSaver.ToVDFNode(new VDFExtras_9.List("T5_Depth2", new T5_Depth2()), new VDFSaver_3.VDFSaveOptions({ typeMarking: VDFSaver_3.VDFTypeMarking.External }));
                a.ToVDF().Should().Be("List(T5_Depth2)>[{^}]\n\
	firstProperty:false\n\
	otherProperty:false".replace(/\r/g, ""));
            });
            // export all classes/enums to global scope
            GeneralInit_6.ExportInternalClassesTo(window, function (str) { return eval(str); });
            /*var names = V.GetMatches(arguments.callee.toString(), /        var (\w+) = \(function \(\) {/g, 1);
            debugger;*/
        })(Saving_FromObject || (Saving_FromObject = {}));
    })(VDFTests || (VDFTests = {}));
});
define("Tests/TypeScript/Saving/FromVDFNode", ["require", "exports", "Source/TypeScript/VDFNode", "Source/TypeScript/VDFSaver", "Source/TypeScript/VDF", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDFExtras", "Tests/TypeScript/GeneralInit"], function (require, exports, VDFNode_4, VDFSaver_4, VDF_9, VDFTypeInfo_7, VDFExtras_10, GeneralInit_7) {
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Saving_FromVDFNode;
        (function (Saving_FromVDFNode) {
            // from VDFNode
            // ==========
            test("D0_BaseValue", function () {
                var a = new VDFNode_4.VDFNode();
                a.primitiveValue = "Root string.";
                a.ToVDF().Should().Be("\"Root string.\"");
            });
            test("D0_Infinity", function () {
                new VDFNode_4.VDFNode(Infinity).ToVDF().Should().Be("Infinity");
                new VDFNode_4.VDFNode(-Infinity).ToVDF().Should().Be("-Infinity");
            });
            test("D0_MetadataType", function () {
                var a = new VDFNode_4.VDFNode();
                a.metadata = "string";
                a.primitiveValue = "Root string.";
                a.ToVDF().Should().Be("string>\"Root string.\"");
            });
            test("D0_MetadataTypeCollapsed", function () {
                var a = VDFSaver_4.VDFSaver.ToVDFNode(new VDFExtras_10.List("string"), new VDFSaver_4.VDFSaveOptions({ typeMarking: VDFSaver_4.VDFTypeMarking.External }));
                a.ToVDF().Should().Be("List(string)>[]");
                a = VDFSaver_4.VDFSaver.ToVDFNode(new VDFExtras_10.List("List(string)", new VDFExtras_10.List("string", "1A", "1B", "1C")), new VDFSaver_4.VDFSaveOptions({ typeMarking: VDFSaver_4.VDFTypeMarking.External }));
                a.ToVDF().Should().Be("List(List(string))>[[\"1A\" \"1B\" \"1C\"]]"); // old: only lists with basic/not-having-own-generic-params generic-params, are able to be collapsed
            });
            test("D0_MetadataTypeNoCollapse", function () {
                var a = VDFSaver_4.VDFSaver.ToVDFNode(new VDFExtras_10.List("string"), new VDFSaver_4.VDFSaveOptions({ typeMarking: VDFSaver_4.VDFTypeMarking.ExternalNoCollapse }));
                a.ToVDF().Should().Be("List(string)>[]");
                a = VDFSaver_4.VDFSaver.ToVDFNode(new VDFExtras_10.List("List(string)", new VDFExtras_10.List("string", "1A", "1B", "1C")), new VDFSaver_4.VDFSaveOptions({ typeMarking: VDFSaver_4.VDFTypeMarking.ExternalNoCollapse }));
                a.ToVDF().Should().Be("List(List(string))>[List(string)>[string>\"1A\" string>\"1B\" string>\"1C\"]]");
            });
            var Enum1;
            (function (Enum1) {
                Enum1[Enum1["_IsEnum"] = 0] = "_IsEnum";
                Enum1[Enum1["A"] = 1] = "A";
                Enum1[Enum1["B"] = 2] = "B";
                Enum1[Enum1["C"] = 3] = "C";
            })(Enum1 || (Enum1 = {}));
            //enum Enum1 { A, B, C }
            test("D0_EnumDefault", function () {
                var a = VDFSaver_4.VDFSaver.ToVDFNode(Enum1.A, "Enum1");
                a.ToVDF().Should().Be("\"A\"");
            });
            test("D0_EnumDefault_IncludeType", function () {
                var a = VDFSaver_4.VDFSaver.ToVDFNode(Enum1.A, "Enum1", new VDFSaver_4.VDFSaveOptions({ typeMarking: VDFSaver_4.VDFTypeMarking.External }));
                a.ToVDF().Should().Be("Enum1>\"A\"");
            });
            test("D0_EscapedString", function () {
                var options = new VDFSaver_4.VDFSaveOptions(null, null, VDFSaver_4.VDFTypeMarking.None);
                // escape line-breaks
                var a = VDFSaver_4.VDFSaver.ToVDFNode("this\nneeds escaping", options);
                a.ToVDF().Should().Be("\"<<this\nneeds escaping>>\"");
                // escape single-quotes
                a = VDFSaver_4.VDFSaver.ToVDFNode("this 'needs' escaping", options);
                a.ToVDF().Should().Be("\"<<this 'needs' escaping>>\"");
                // escape double-quotes
                a = VDFSaver_4.VDFSaver.ToVDFNode("this \"needs\" escaping", options);
                a.ToVDF().Should().Be("\"<<this \"needs\" escaping>>\"");
                // escape double angle-brackets
                a = VDFSaver_4.VDFSaver.ToVDFNode("this<<needs escaping", options);
                a.ToVDF().Should().Be("\"<<<this<<needs escaping>>>\"");
                a = VDFSaver_4.VDFSaver.ToVDFNode("this>>needs escaping", options);
                a.ToVDF().Should().Be("\"<<<this>>needs escaping>>>\"");
            });
            test("D0_EscapedStringIfNonQuoted", function () {
                var options = new VDFSaver_4.VDFSaveOptions(null, null, VDFSaver_4.VDFTypeMarking.None);
                VDF_9.VDF.Serialize(new VDFExtras_10.Dictionary("string", "string", { "{": "val1" }), options).Should().Be("{<<{>>:\"val1\"}");
                VDF_9.VDF.Serialize(new VDFExtras_10.Dictionary("string", "string", { "^": "val1" }), options).Should().Be("{<<^>>:\"val1\"}");
                VDF_9.VDF.Serialize(new VDFExtras_10.Dictionary("string", "string", { "3": "val1" }), options).Should().Be("{<<3>>:\"val1\"}");
            });
            test("D0_EmptyArray", function () { VDF_9.VDF.Serialize([]).Should().Be("[]"); });
            test("D1_ListInferredFromHavingItem_String", function () {
                var a = new VDFNode_4.VDFNode();
                a.SetListChild(0, new VDFNode_4.VDFNode("String item."));
                a.ToVDF().Should().Be("[\"String item.\"]");
            });
            test("D1_Object_Primitives", function () {
                var a = new VDFNode_4.VDFNode();
                a.SetMapChild(new VDFNode_4.VDFNode("bool"), new VDFNode_4.VDFNode(false));
                a.SetMapChild(new VDFNode_4.VDFNode("int"), new VDFNode_4.VDFNode(5));
                a.SetMapChild(new VDFNode_4.VDFNode("double"), new VDFNode_4.VDFNode(.5));
                a.SetMapChild(new VDFNode_4.VDFNode("string"), new VDFNode_4.VDFNode("Prop value string."));
                a.ToVDF().Should().Be("{bool:false int:5 double:.5 string:\"Prop value string.\"}");
            });
            test("D1_List_EscapedStrings", function () {
                var a = new VDFNode_4.VDFNode();
                a.SetListChild(0, new VDFNode_4.VDFNode("This is a list item \"that needs escaping\"."));
                a.SetListChild(1, new VDFNode_4.VDFNode("Here's another."));
                a.SetListChild(2, new VDFNode_4.VDFNode("And <<another>>."));
                a.SetListChild(3, new VDFNode_4.VDFNode("This one does not need escaping."));
                a.ToVDF().Should().Be("[\"<<This is a list item \"that needs escaping\".>>\" \"<<Here's another.>>\" \"<<<And <<another>>.>>>\" \"This one does not need escaping.\"]");
            });
            test("D1_List_EscapedStrings2", function () {
                var a = new VDFNode_4.VDFNode();
                a.SetListChild(0, new VDFNode_4.VDFNode("ok {}"));
                a.SetListChild(1, new VDFNode_4.VDFNode("ok []"));
                a.SetListChild(2, new VDFNode_4.VDFNode("ok :"));
                a.ToVDF().Should().Be("[\"ok {}\" \"ok []\" \"ok :\"]");
            });
            test("D1_Map_EscapedStrings", function () {
                var a = new VDFNode_4.VDFNode();
                a.SetMapChild(new VDFNode_4.VDFNode("escape {}"), new VDFNode_4.VDFNode());
                a.SetMapChild(new VDFNode_4.VDFNode("escape []"), new VDFNode_4.VDFNode());
                a.SetMapChild(new VDFNode_4.VDFNode("escape :"), new VDFNode_4.VDFNode());
                a.SetMapChild(new VDFNode_4.VDFNode("escape \""), new VDFNode_4.VDFNode());
                a.SetMapChild(new VDFNode_4.VDFNode("escape '"), new VDFNode_4.VDFNode());
                a.ToVDF().Should().Be("{<<escape {}>>:null <<escape []>>:null <<escape :>>:null <<escape \">>:null <<escape '>>:null}");
            });
            var TypeTest = (function () {
                function TypeTest() {
                }
                TypeTest.prototype.Serialize = function () {
                    var result = new VDFNode_4.VDFNode("Object");
                    result.metadata_override = "Type";
                    return result;
                };
                return TypeTest;
            }());
            __decorate([
                VDFTypeInfo_7._VDFSerialize()
            ], TypeTest.prototype, "Serialize", null);
            test("D1_MetadataShowingNodeToBeOfTypeType", function () {
                //VDFTypeInfo.AddSerializeMethod<Type>(a=>new VDFNode(a.Name, "Type"));
                //VDFTypeInfo.AddDeserializeMethod_FromParent<Type>(node=>Type.GetType(node.primitiveValue.ToString()));
                //var type_object = {Serialize: function() { return new VDFNode("System.Object", "Type"); }.AddTags(new VDFSerialize())}
                var type_object = new TypeTest();
                var map = new VDFExtras_10.Dictionary("object", "object");
                map.Add(type_object, "hi there");
                VDF_9.VDF.Serialize(map).Should().Be("{Type>Object:\"hi there\"}");
            });
            // export all classes/enums to global scope
            GeneralInit_7.ExportInternalClassesTo(window, function (str) { return eval(str); });
        })(Saving_FromVDFNode || (Saving_FromVDFNode = {}));
    })(VDFTests || (VDFTests = {}));
});
define("Tests/TypeScript/Saving/SpeedTests", ["require", "exports", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDFSaver", "Source/TypeScript/VDFExtras", "Tests/TypeScript/GeneralInit"], function (require, exports, VDFTypeInfo_8, VDFSaver_5, VDFExtras_11, GeneralInit_8) {
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Saving_SpeedTests;
        (function (Saving_SpeedTests) {
            var SpeedTest1_Class = (function () {
                function SpeedTest1_Class() {
                    this.Bool = true;
                    this.Int = 5;
                    this.Double = .5;
                    this.String = "Prop value string.";
                    this.list = new VDFExtras_11.List("string", "2A", "2B");
                    this.nestedList = new VDFExtras_11.List("List(string)", new VDFExtras_11.List("string", "1A"));
                }
                return SpeedTest1_Class;
            }());
            __decorate([
                VDFTypeInfo_8.T("bool"), VDFTypeInfo_8.P()
            ], SpeedTest1_Class.prototype, "Bool", void 0);
            __decorate([
                VDFTypeInfo_8.T("int"), VDFTypeInfo_8.P()
            ], SpeedTest1_Class.prototype, "Int", void 0);
            __decorate([
                VDFTypeInfo_8.T("double"), VDFTypeInfo_8.P()
            ], SpeedTest1_Class.prototype, "Double", void 0);
            __decorate([
                VDFTypeInfo_8.T("string"), VDFTypeInfo_8.P()
            ], SpeedTest1_Class.prototype, "String", void 0);
            __decorate([
                VDFTypeInfo_8.T("List(string)"), VDFTypeInfo_8.P()
            ], SpeedTest1_Class.prototype, "list", void 0);
            __decorate([
                VDFTypeInfo_8.T("List(List(string))"), VDFTypeInfo_8.P()
            ], SpeedTest1_Class.prototype, "nestedList", void 0);
            test("SpeedTest1", function () {
                var a = VDFSaver_5.VDFSaver.ToVDFNode(new SpeedTest1_Class(), new VDFSaver_5.VDFSaveOptions({ typeMarking: VDFSaver_5.VDFTypeMarking.None }));
                a["Bool"].primitiveValue.Should().Be(true);
                a["Int"].primitiveValue.Should().Be(5);
                a["Double"].primitiveValue.Should().Be(.5);
                a["String"].primitiveValue.Should().Be("Prop value string.");
                a["list"][0].primitiveValue.Should().Be("2A");
                a["list"][1].primitiveValue.Should().Be("2B");
                a["nestedList"][0][0].primitiveValue.Should().Be("1A");
                //for (var i = 0; i < 10000; i++)
                var vdf = a.ToVDF();
            });
            // export all classes/enums to global scope
            GeneralInit_8.ExportInternalClassesTo(window, function (str) { return eval(str); });
        })(Saving_SpeedTests || (Saving_SpeedTests = {}));
    })(VDFTests || (VDFTests = {}));
});
define("Tests/TypeScript/Saving/S_General", ["require", "exports", "Source/TypeScript/VDFTypeInfo", "Source/TypeScript/VDFNode", "Source/TypeScript/VDFSaver", "Source/TypeScript/VDFExtras", "Source/TypeScript/VDF", "Tests/TypeScript/GeneralInit", "Tests/TypeScript/GeneralInit", "Tests/TypeScript/Saving/FromObject", "Tests/TypeScript/Saving/FromVDFNode", "Tests/TypeScript/Saving/SpeedTests"], function (require, exports, VDFTypeInfo_9, VDFNode_5, VDFSaver_6, VDFExtras_12, VDF_10, GeneralInit_9, GeneralInit_10) {
    exports.Saving_RunTests = GeneralInit_10.Saving_RunTests;
    // tests
    // ==========
    var VDFTests;
    (function (VDFTests) {
        var Saving_General;
        (function (Saving_General) {
            // general
            // ==========
            test("NodePathToStringReturnsX", function () {
                var path = new VDFExtras_12.VDFNodePath(new VDFExtras_12.List("VDFNodePathNode"));
                path.nodes.push(new VDFExtras_12.VDFNodePathNode(null, new VDFTypeInfo_9.VDFPropInfo("prop1", null, [])));
                path.nodes.push(new VDFExtras_12.VDFNodePathNode(null, null, 1));
                path.nodes.push(new VDFExtras_12.VDFNodePathNode(null, null, null, 2));
                path.nodes.push(new VDFExtras_12.VDFNodePathNode(null, null, null, null, "key1"));
                path.toString().Should().Be("prop1/i:1/ki:2/k:key1");
            });
            // prop-inclusion by regex
            // ==========
            var D1_Map_PropWithNameMatchingIncludeRegex_Class = (function () {
                function D1_Map_PropWithNameMatchingIncludeRegex_Class() {
                    this._notMatching = true;
                    this.matching = true;
                }
                return D1_Map_PropWithNameMatchingIncludeRegex_Class;
            }());
            __decorate([
                VDFTypeInfo_9.T("bool")
            ], D1_Map_PropWithNameMatchingIncludeRegex_Class.prototype, "_notMatching", void 0);
            __decorate([
                VDFTypeInfo_9.T("bool")
            ], D1_Map_PropWithNameMatchingIncludeRegex_Class.prototype, "matching", void 0);
            D1_Map_PropWithNameMatchingIncludeRegex_Class = __decorate([
                VDFTypeInfo_9.TypeInfo("^[^_]")
            ], D1_Map_PropWithNameMatchingIncludeRegex_Class);
            test("D1_Map_PropWithNameMatchingIncludeRegex", function () {
                VDF_10.VDF.Serialize(new D1_Map_PropWithNameMatchingIncludeRegex_Class(), "D1_Map_PropWithNameMatchingIncludeRegex_Class").Should().Be("{matching:true}");
            });
            var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base = (function () {
                function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base() {
                }
                return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base;
            }());
            D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base = __decorate([
                VDFTypeInfo_9.TypeInfo("^[^_]")
            ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base);
            var D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived = (function () {
                function D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived() {
                    this._notMatching = true;
                    this.matching = true;
                }
                return D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived;
            }());
            __decorate([
                VDFTypeInfo_9.T("bool")
            ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype, "_notMatching", void 0);
            __decorate([
                VDFTypeInfo_9.T("bool")
            ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype, "matching", void 0);
            D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived = __decorate([
                VDFTypeInfo_9.TypeInfo()
            ], D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived);
            D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived.prototype["__proto__"] = D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base.prototype;
            test("D1_Map_PropWithNameMatchingBaseClassIncludeRegex", function () {
                VDF_10.VDF.Serialize(new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived(), "D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Derived").Should().Be("{matching:true}");
            });
            // serialize-related methods
            // ==========
            var D1_MapWithEmbeddedSerializeMethod_Prop_Class = (function () {
                function D1_MapWithEmbeddedSerializeMethod_Prop_Class() {
                    this.notIncluded = true;
                    this.included = true;
                }
                D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype.Serialize = function () {
                    var result = new VDFNode_5.VDFNode();
                    result.SetMapChild(new VDFNode_5.VDFNode("included"), new VDFNode_5.VDFNode(this.included));
                    return result;
                };
                return D1_MapWithEmbeddedSerializeMethod_Prop_Class;
            }());
            __decorate([
                VDFTypeInfo_9.T("bool")
            ], D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype, "notIncluded", void 0);
            __decorate([
                VDFTypeInfo_9.T("bool")
            ], D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype, "included", void 0);
            __decorate([
                VDFTypeInfo_9._VDFSerialize()
            ], D1_MapWithEmbeddedSerializeMethod_Prop_Class.prototype, "Serialize", null);
            //AddAttributes().type = D1_MapWithEmbeddedSerializeMethod_Prop_Class;
            test("D1_MapWithEmbeddedSerializeMethod_Prop", function () {
                VDF_10.VDF.Serialize(new D1_MapWithEmbeddedSerializeMethod_Prop_Class(), "D1_MapWithEmbeddedSerializeMethod_Prop_Class").Should().Be("{included:true}");
            });
            var D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class = (function () {
                function D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class() {
                    this.boolProp = true;
                }
                D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype.Serialize = function () { return; };
                return D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class;
            }());
            __decorate([
                VDFTypeInfo_9.T("bool"), VDFTypeInfo_9.P()
            ], D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype, "boolProp", void 0);
            __decorate([
                VDFTypeInfo_9._VDFSerialize()
            ], D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class.prototype, "Serialize", null);
            test("D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop", function () {
                VDF_10.VDF.Serialize(new D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class(), "D1_MapWithEmbeddedSerializeMethodThatTakesNoAction_Prop_Class").Should().Be("{boolProp:true}");
            });
            var D1_Map_MapThatCancelsItsSerialize_Class_Parent = (function () {
                function D1_Map_MapThatCancelsItsSerialize_Class_Parent() {
                    this.child = new D1_Map_MapThatCancelsItsSerialize_Class_Child();
                }
                return D1_Map_MapThatCancelsItsSerialize_Class_Parent;
            }());
            __decorate([
                VDFTypeInfo_9.T("D1_Map_MapThatCancelsItsSerialize_Class_Child"), VDFTypeInfo_9.P()
            ], D1_Map_MapThatCancelsItsSerialize_Class_Parent.prototype, "child", void 0);
            var D1_Map_MapThatCancelsItsSerialize_Class_Child = (function () {
                function D1_Map_MapThatCancelsItsSerialize_Class_Child() {
                }
                D1_Map_MapThatCancelsItsSerialize_Class_Child.prototype.Serialize = function () { return VDF_10.VDF.CancelSerialize; };
                return D1_Map_MapThatCancelsItsSerialize_Class_Child;
            }());
            __decorate([
                VDFTypeInfo_9._VDFSerialize()
            ], D1_Map_MapThatCancelsItsSerialize_Class_Child.prototype, "Serialize", null);
            test("D1_Map_MapThatCancelsItsSerialize", function () {
                VDF_10.VDF.Serialize(new D1_Map_MapThatCancelsItsSerialize_Class_Parent(), "D1_Map_MapThatCancelsItsSerialize_Class_Parent").Should().Be("{}");
            });
            // for JSON compatibility
            // ==========
            var D0_MapWithMetadataDisabled_Class = (function () {
                function D0_MapWithMetadataDisabled_Class() {
                }
                return D0_MapWithMetadataDisabled_Class;
            }());
            test("D0_MapWithMetadataDisabled", function () {
                var a = VDFSaver_6.VDFSaver.ToVDFNode(new D0_MapWithMetadataDisabled_Class(), new VDFSaver_6.VDFSaveOptions({ useMetadata: false }));
                ok(a.metadata == null); //a.metadata.Should().Be(null);
            });
            var D0_Map_List_BoolsWithPopOutDisabled_Class = (function () {
                function D0_Map_List_BoolsWithPopOutDisabled_Class() {
                    this.ints = new VDFExtras_12.List("int", 0, 1);
                }
                return D0_Map_List_BoolsWithPopOutDisabled_Class;
            }());
            __decorate([
                VDFTypeInfo_9.T("List(int)"), VDFTypeInfo_9.P()
            ], D0_Map_List_BoolsWithPopOutDisabled_Class.prototype, "ints", void 0);
            test("D0_Map_List_BoolsWithPopOutDisabled", function () {
                var a = VDFSaver_6.VDFSaver.ToVDFNode(new D0_Map_List_BoolsWithPopOutDisabled_Class(), "D0_Map_List_BoolsWithPopOutDisabled_Class", new VDFSaver_6.VDFSaveOptions({ useChildPopOut: false }));
                a.ToVDF().Should().Be("{ints:[0 1]}");
            });
            test("D1_Map_IntsWithStringKeys", function () {
                var a = VDFSaver_6.VDFSaver.ToVDFNode(new VDFExtras_12.Dictionary("object", "object", {
                    key1: 0,
                    key2: 1
                }), new VDFSaver_6.VDFSaveOptions({ useStringKeys: true }));
                a.ToVDF(new VDFSaver_6.VDFSaveOptions({ useStringKeys: true })).Should().Be("{\"key1\":0 \"key2\":1}");
            });
            test("D1_Map_DoublesWithNumberTrimmingDisabled", function () {
                var a = VDFSaver_6.VDFSaver.ToVDFNode(new VDFExtras_12.List("object", .1, 1.1), new VDFSaver_6.VDFSaveOptions({ useNumberTrimming: false }));
                a.ToVDF(new VDFSaver_6.VDFSaveOptions({ useNumberTrimming: false })).Should().Be("[0.1 1.1]");
            });
            test("D1_List_IntsWithCommaSeparators", function () {
                var a = VDFSaver_6.VDFSaver.ToVDFNode(new VDFExtras_12.List("object", 0, 1), new VDFSaver_6.VDFSaveOptions({ useCommaSeparators: true }));
                a.listChildren.Count.Should().Be(2);
                a.ToVDF(new VDFSaver_6.VDFSaveOptions({ useCommaSeparators: true })).Should().Be("[0,1]");
            });
            // export all classes/enums to global scope
            GeneralInit_9.ExportInternalClassesTo(window, function (str) { return eval(str); });
            // make sure we create one instance, so that the type-info attachment code can run
            (new D1_Map_PropWithNameMatchingBaseClassIncludeRegex_Class_Base()).toString();
        })(Saving_General || (Saving_General = {}));
    })(VDFTests || (VDFTests = {}));
});
//# sourceMappingURL=JavaScript_Bundle.js.map