System.register(["./VDFNode", "./VDFTokenParser", "./VDFTypeInfo", "./VDFExtras", "./VDF"], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var VDFNode_1, VDFTokenParser_1, VDFTypeInfo_1, VDFExtras_1, VDF_1, VDFLoadOptions, VDFLoader;
    return {
        setters: [
            function (VDFNode_1_1) {
                VDFNode_1 = VDFNode_1_1;
            },
            function (VDFTokenParser_1_1) {
                VDFTokenParser_1 = VDFTokenParser_1_1;
            },
            function (VDFTypeInfo_1_1) {
                VDFTypeInfo_1 = VDFTypeInfo_1_1;
            },
            function (VDFExtras_1_1) {
                VDFExtras_1 = VDFExtras_1_1;
            },
            function (VDF_1_1) {
                VDF_1 = VDF_1_1;
            }
        ],
        execute: function () {
            VDFLoadOptions = (function () {
                function VDFLoadOptions(initializerObj, messages, allowStringKeys, allowCommaSeparators, loadUnknownTypesAsBasicTypes) {
                    if (allowStringKeys === void 0) { allowStringKeys = true; }
                    if (allowCommaSeparators === void 0) { allowCommaSeparators = false; }
                    if (loadUnknownTypesAsBasicTypes === void 0) { loadUnknownTypesAsBasicTypes = false; }
                    this.objPostDeserializeFuncs_early = new VDFExtras_1.Dictionary("object", "List(Function)");
                    this.objPostDeserializeFuncs = new VDFExtras_1.Dictionary("object", "List(Function)");
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
                            this.objPostDeserializeFuncs_early.Add(obj, new VDFExtras_1.List("Function"));
                        this.objPostDeserializeFuncs_early.Get(obj).Add(func);
                    }
                    else {
                        if (!this.objPostDeserializeFuncs.ContainsKey(obj))
                            this.objPostDeserializeFuncs.Add(obj, new VDFExtras_1.List("Function"));
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
            exports_1("VDFLoadOptions", VDFLoadOptions);
            VDFLoader = (function () {
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
                    var tokensAtDepth0 = new VDFExtras_1.List("VDFToken");
                    var tokensAtDepth1 = new VDFExtras_1.List("VDFToken");
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
                    var typeGenericArgs = VDF_1.VDF.GetGenericArgumentsOfType(typeName);
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
            exports_1("VDFLoader", VDFLoader);
        }
    };
});
//# sourceMappingURL=VDFLoader.js.map