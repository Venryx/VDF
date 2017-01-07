System.register(["./VDF"], function (exports_1, context_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var __moduleName = context_1 && context_1.id;
    var VDF_1, VDFNodePathNode, VDFNodePath, VDFUtils, StringBuilder, object, EnumValue, List, Dictionary, a;
    return {
        setters: [
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            }
        ],
        execute: function () {
            // classes
            // ==========
            VDFNodePathNode = (function () {
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
            exports_1("VDFNodePathNode", VDFNodePathNode);
            VDFNodePath = (function () {
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
            exports_1("VDFNodePath", VDFNodePath);
            // helper classes
            // ==================
            VDFUtils = (function () {
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
            StringBuilder = (function () {
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
            exports_1("StringBuilder", StringBuilder);
            // VDF-usable data wrappers
            // ==========
            //class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
            // for anonymous objects (JS anonymous-objects are all just instances of Object, so we don't lose anything by attaching type-info to the shared constructor)
            //var object = Object;
            //object["typeInfo"] = new VDFTypeInfo(null, true);
            object = (function () {
                function object() {
                }
                return object;
            }()); // just an alias for Object, to be consistent with C# version
            exports_1("object", object);
            EnumValue = (function () {
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
            exports_1("EnumValue", EnumValue);
            List = (function (_super) {
                __extends(List, _super);
                function List() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var _this = 
                    //super(...items);
                    _super.call(this) || this;
                    _this.__proto__ = List.prototype;
                    if (typeof args[0] == "string")
                        var itemType = args[0], items = args.slice(1);
                    else
                        var itemTypeGetterFunc = args[0], items = args.slice(1);
                    _this.AddRange(items);
                    if (itemType)
                        _this.itemType = itemType;
                    else if (itemTypeGetterFunc)
                        _this.itemType = VDF_1.VDF.ConvertObjectTypeNameToVDFTypeName(itemTypeGetterFunc().name);
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
                    if (matchFunc == null)
                        return this.length > 0;
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
            exports_1("List", List);
            window["List"] = List;
            Dictionary = (function () {
                function Dictionary() {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i] = arguments[_i];
                    }
                    var keyTypeOrGetterFunc = args[0], valueTypeOrGetterFunc = args[1], keyValuePairsObj = args[2];
                    var keyType = keyTypeOrGetterFunc instanceof Function
                        ? VDF_1.VDF.ConvertObjectTypeNameToVDFTypeName(keyTypeOrGetterFunc().name) : keyTypeOrGetterFunc;
                    var valueType = valueTypeOrGetterFunc instanceof Function
                        ? VDF_1.VDF.ConvertObjectTypeNameToVDFTypeName(valueTypeOrGetterFunc().name) : valueTypeOrGetterFunc;
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
            exports_1("Dictionary", Dictionary);
            window["Dictionary"] = Dictionary;
            //VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);
            a = null;
        }
    };
});
//# sourceMappingURL=VDFExtras.js.map