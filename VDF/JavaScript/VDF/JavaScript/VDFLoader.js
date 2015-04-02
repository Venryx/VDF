var VDFLoadOptions = (function () {
    function VDFLoadOptions(initializerObj, message, allowStringKeys, allowCommaSeparators, loadUnknownTypesAsBasicTypes) {
        if (typeof allowStringKeys === "undefined") { allowStringKeys = false; }
        if (typeof allowCommaSeparators === "undefined") { allowCommaSeparators = false; }
        if (typeof loadUnknownTypesAsBasicTypes === "undefined") { loadUnknownTypesAsBasicTypes = false; }
        this.message = message;
        this.allowStringKeys = allowStringKeys;
        this.allowCommaSeparators = allowCommaSeparators;
        this.loadUnknownTypesAsBasicTypes = loadUnknownTypesAsBasicTypes;

        if (initializerObj)
            for (var key in initializerObj)
                this[key] = initializerObj[key];
    }
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
    VDFLoader.ToVDFNode = function (tokens_orText, declaredTypeName_orOptions, options_orNothing) {
        if (declaredTypeName_orOptions instanceof VDFLoadOptions)
            return VDFLoader.ToVDFNode(tokens_orText, null, declaredTypeName_orOptions);
        if (typeof tokens_orText == "string")
            return VDFLoader.ToVDFNode(VDFTokenParser.ParseTokens(tokens_orText, options_orNothing), declaredTypeName_orOptions, options_orNothing);

        var tokens = tokens_orText;
        var declaredTypeName = declaredTypeName_orOptions;
        var options = options_orNothing || new VDFLoadOptions();

        // figure out obj-type
        // ==========
        var depth = 0;
        var tokensAtDepth0 = new List("VDFToken");
        var tokensAtDepth1 = new List("VDFToken");
        var i;
        for (var i in tokens.Indexes()) {
            var token = tokens[i];
            if (token.type == 19 /* ListEndMarker */ || token.type == 21 /* MapEndMarker */)
                depth--;
            if (depth == 0)
                tokensAtDepth0.Add(token);
            if (depth == 1)
                tokensAtDepth1.Add(token);
            if (token.type == 18 /* ListStartMarker */ || token.type == 20 /* MapStartMarker */)
                depth++;
        }

        var fromVDFTypeName = "object";
        var firstNonMetadataToken = tokensAtDepth0.First(function (a) {
            return a.type != 9 /* Metadata */;
        });
        if (tokensAtDepth0[0].type == 9 /* Metadata */)
            fromVDFTypeName = tokensAtDepth0[0].text;
        else if (firstNonMetadataToken.type == 15 /* Boolean */)
            fromVDFTypeName = "bool";
        else if (firstNonMetadataToken.type == 16 /* Number */)
            fromVDFTypeName = firstNonMetadataToken.text.Contains(".") ? "double" : "int";
        else if (firstNonMetadataToken.type == 17 /* String */)
            fromVDFTypeName = "string";
        else if (firstNonMetadataToken.type == 18 /* ListStartMarker */)
            fromVDFTypeName = "List(object)";
        else if (firstNonMetadataToken.type == 20 /* MapStartMarker */)
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
        node.metadata = tokensAtDepth0[0].type == 9 /* Metadata */ ? fromVDFTypeName : null;

        // if primitive, parse value
        if (firstNonMetadataToken.type == 14 /* Null */)
            node.primitiveValue = null;
        else if (firstNonMetadataToken.type == 15 /* Boolean */)
            node.primitiveValue = firstNonMetadataToken.text == "true" ? true : false;
        else if (firstNonMetadataToken.type == 16 /* Number */)
            node.primitiveValue = parseFloat(firstNonMetadataToken.text);
        else if (firstNonMetadataToken.type == 17 /* String */)
            node.primitiveValue = firstNonMetadataToken.text;
        else if (typeName.StartsWith("List(")) {
            node.isList = true;
            for (var i = 0; i < tokensAtDepth1.Count; i++) {
                var token = tokensAtDepth1[i];
                if (token.type != 19 /* ListEndMarker */ && token.type != 21 /* MapEndMarker */) {
                    var itemFirstToken = tokens[token.index];
                    var itemEnderToken = tokensAtDepth1.FirstOrDefault(function (a) {
                        return a.index > itemFirstToken.index + (itemFirstToken.type == 9 /* Metadata */ ? 1 : 0) && token.type != 19 /* ListEndMarker */ && token.type != 21 /* MapEndMarker */;
                    });
                    node.AddListChild(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), typeGenericArgs[0], options));
                    if (itemFirstToken.type == 9 /* Metadata */)
                        i++;
                }
            }
        } else {
            node.isMap = true;
            for (var i = 0; i < tokensAtDepth1.Count; i++) {
                var token = tokensAtDepth1[i];
                if (token.type == 11 /* Key */) {
                    var propName = token.text;
                    var propValueTypeName;
                    if (typeName.StartsWith("Dictionary("))
                        propValueTypeName = typeGenericArgs[1];
                    else
                        propValueTypeName = typeInfo.props[propName] ? typeInfo.props[propName].propTypeName : null;

                    var propValueFirstToken = tokensAtDepth1[i + 1];
                    var propValueEnderToken = tokensAtDepth1.FirstOrDefault(function (a) {
                        return a.index > propValueFirstToken.index && a.type == 11 /* Key */;
                    });
                    node.SetMapChild(propName, VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueFirstToken, propValueEnderToken), propValueTypeName, options));
                }
            }
        }

        return node;
    };
    VDFLoader.GetTokenRange_Tokens = function (tokens, firstToken, enderToken) {
        //return tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index, a.text)).ToList();
        var result = new List("VDFToken");
        for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
            result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
        return result;
    };
    return VDFLoader;
})();
//# sourceMappingURL=VDFLoader.js.map
