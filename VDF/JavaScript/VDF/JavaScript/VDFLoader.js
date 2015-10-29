var VDFLoadOptions = (function () {
    function VDFLoadOptions(initializerObj, messages, allowStringKeys, allowCommaSeparators, loadUnknownTypesAsBasicTypes) {
        if (allowStringKeys === void 0) { allowStringKeys = true; }
        if (allowCommaSeparators === void 0) { allowCommaSeparators = false; }
        if (loadUnknownTypesAsBasicTypes === void 0) { loadUnknownTypesAsBasicTypes = false; }
        this.postDeserializeFuncs = new List("Function");
        this.messages = messages || [];
        this.allowStringKeys = allowStringKeys;
        this.allowCommaSeparators = allowCommaSeparators;
        this.loadUnknownTypesAsBasicTypes = loadUnknownTypesAsBasicTypes;
        if (initializerObj)
            for (var key in initializerObj)
                this[key] = initializerObj[key];
    }
    VDFLoadOptions.prototype.AddPostDeserializeFunc = function (func) { this.postDeserializeFuncs.Add(func); };
    VDFLoadOptions.prototype.ForJSON = function () {
        this.allowStringKeys = true;
        this.allowCommaSeparators = true;
        return this;
    };
    return VDFLoadOptions;
})();
var VDFLoader = (function () {
    function VDFLoader() {
    }
    VDFLoader.ToVDFNode = function (tokens_orText, declaredTypeName_orOptions, options, firstTokenIndex, enderTokenIndex) {
        if (firstTokenIndex === void 0) { firstTokenIndex = 0; }
        if (enderTokenIndex === void 0) { enderTokenIndex = -1; }
        if (declaredTypeName_orOptions instanceof VDFLoadOptions)
            return VDFLoader.ToVDFNode(tokens_orText, null, declaredTypeName_orOptions);
        if (typeof tokens_orText == "string")
            return VDFLoader.ToVDFNode(VDFTokenParser.ParseTokens(tokens_orText, options), declaredTypeName_orOptions, options);
        var tokens = tokens_orText;
        var declaredTypeName = declaredTypeName_orOptions;
        options = options || new VDFLoadOptions();
        enderTokenIndex = enderTokenIndex != -1 ? enderTokenIndex : tokens.Count;
        // figure out obj-type
        // ==========
        var depth = 0;
        var tokensAtDepth0 = new List("VDFToken");
        var tokensAtDepth1 = new List("VDFToken");
        var i;
        //for (var i in tokens.Indexes())
        for (var i = firstTokenIndex; i < enderTokenIndex; i++) {
            var token = tokens[i];
            if (token.type == VDFTokenType.ListEndMarker || token.type == VDFTokenType.MapEndMarker)
                depth--;
            if (depth == 0)
                tokensAtDepth0.Add(token);
            if (depth == 1)
                tokensAtDepth1.Add(token);
            if (token.type == VDFTokenType.ListStartMarker || token.type == VDFTokenType.MapStartMarker)
                depth++;
        }
        var fromVDFTypeName = "object";
        var firstNonMetadataToken = tokensAtDepth0.First(function (a) { return a.type != VDFTokenType.Metadata; });
        if (tokensAtDepth0[0].type == VDFTokenType.Metadata)
            fromVDFTypeName = tokensAtDepth0[0].text;
        else if (firstNonMetadataToken.type == VDFTokenType.Boolean)
            fromVDFTypeName = "bool";
        else if (firstNonMetadataToken.type == VDFTokenType.Number)
            fromVDFTypeName = firstNonMetadataToken.text == "Infinity" || firstNonMetadataToken.text == "-Infinity" || firstNonMetadataToken.text.Contains(".") || firstNonMetadataToken.text.Contains("e") ? "double" : "int";
        else if (firstNonMetadataToken.type == VDFTokenType.String)
            fromVDFTypeName = "string";
        else if (firstNonMetadataToken.type == VDFTokenType.ListStartMarker)
            fromVDFTypeName = "List(object)";
        else if (firstNonMetadataToken.type == VDFTokenType.MapStartMarker)
            fromVDFTypeName = "Dictionary(object object)"; //"object";
        var typeName = declaredTypeName;
        if (fromVDFTypeName != null && fromVDFTypeName.length > 0) {
            // porting-note: this is only a limited implementation of CS functionality of making sure from-vdf-type is more specific than declared-type
            if (typeName == null || ["object", "IList", "IDictionary"].Contains(typeName))
                typeName = fromVDFTypeName;
        }
        var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
        var typeInfo = VDFTypeInfo.Get(typeName);
        // create the object's VDFNode, and load in the data
        // ==========
        var node = new VDFNode();
        node.metadata = tokensAtDepth0[0].type == VDFTokenType.Metadata ? fromVDFTypeName : null;
        // if primitive, parse value
        if (firstNonMetadataToken.type == VDFTokenType.Null)
            node.primitiveValue = null;
        else if (firstNonMetadataToken.type == VDFTokenType.Boolean)
            node.primitiveValue = firstNonMetadataToken.text == "true" ? true : false;
        else if (firstNonMetadataToken.type == VDFTokenType.Number)
            node.primitiveValue = parseFloat(firstNonMetadataToken.text);
        else if (firstNonMetadataToken.type == VDFTokenType.String)
            node.primitiveValue = firstNonMetadataToken.text;
        else if (typeName.StartsWith("List(")) {
            node.isList = true;
            for (var i = 0; i < tokensAtDepth1.Count; i++) {
                var token = tokensAtDepth1[i];
                if (token.type != VDFTokenType.ListEndMarker && token.type != VDFTokenType.MapEndMarker) {
                    var itemFirstToken = tokens[token.index];
                    var itemEnderToken = tokensAtDepth1.FirstOrDefault(function (a) { return a.index > itemFirstToken.index + (itemFirstToken.type == VDFTokenType.Metadata ? 1 : 0) && token.type != VDFTokenType.ListEndMarker && token.type != VDFTokenType.MapEndMarker; });
                    //node.AddListChild(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), typeGenericArgs[0], options));
                    node.AddListChild(VDFLoader.ToVDFNode(tokens, typeGenericArgs[0], options, itemFirstToken.index, itemEnderToken != null ? itemEnderToken.index : enderTokenIndex));
                    if (itemFirstToken.type == VDFTokenType.Metadata)
                        i++;
                }
            }
        }
        else {
            node.isMap = true;
            for (var i = 0; i < tokensAtDepth1.Count; i++) {
                var token = tokensAtDepth1[i];
                if (token.type == VDFTokenType.Key) {
                    var propName = token.text;
                    var propValueTypeName;
                    if (typeName.StartsWith("Dictionary("))
                        propValueTypeName = typeGenericArgs[1];
                    else
                        propValueTypeName = typeInfo && typeInfo.props[propName] ? typeInfo.props[propName].typeName : null;
                    var propValueFirstToken = tokensAtDepth1[i + 1];
                    var propValueEnderToken = tokensAtDepth1.FirstOrDefault(function (a) { return a.index > propValueFirstToken.index && a.type == VDFTokenType.Key; });
                    //node.SetMapChild(propName, VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueFirstToken, propValueEnderToken), propValueTypeName, options));
                    node.SetMapChild(propName, VDFLoader.ToVDFNode(tokens, propValueTypeName, options, propValueFirstToken.index, propValueEnderToken != null ? propValueEnderToken.index : enderTokenIndex));
                }
            }
        }
        return node;
    };
    return VDFLoader;
})();
//# sourceMappingURL=VDFLoader.js.map