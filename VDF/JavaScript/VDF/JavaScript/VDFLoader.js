var VDFLoadOptions = (function () {
    function VDFLoadOptions(initializerObj, message, inferCompatibleTypesForUnknownTypes) {
        if (typeof inferCompatibleTypesForUnknownTypes === "undefined") { inferCompatibleTypesForUnknownTypes = false; }
        if (initializerObj)
            for (var key in initializerObj)
                this[key] = initializerObj[key];

        this.message = message;
        this.inferCompatibleTypesForUnknownTypes = inferCompatibleTypesForUnknownTypes;
    }
    return VDFLoadOptions;
})();

var VDFLoader = (function () {
    function VDFLoader() {
    }
    VDFLoader.ToVDFNode = function (arg1, arg2, arg3, objIndent) {
        if (typeof objIndent === "undefined") { objIndent = 0; }
        var tokens;
        var declaredTypeName;
        var loadOptions;

        if (arg1 instanceof List)
            tokens = arg1;
        else {
            /*var parser_ = new VDFTokenParser(arg1, 0);
            while (parser_.MoveNextToken()) { };
            tokens = parser_.tokens;*/
            tokens = VDFTokenParser.ParseTokens(arg1);
        }
        if (typeof arg2 == "string" || arg3 instanceof VDFLoadOptions) {
            declaredTypeName = arg2;
            loadOptions = arg3;
        } else {
            declaredTypeName = arg3;
            loadOptions = arg2;
        }
        loadOptions = loadOptions || new VDFLoadOptions();

        // pre-process/fix tokens
        // ==========
        // if we're a non-list object
        var depth;
        for (var i0 = 0; i0 < 2; i0++)
            if ((declaredTypeName != null && !(declaredTypeName == "IList" || declaredTypeName.indexOf("List[") == 0)) || (tokens.Count > 0 && tokens[0].type == 2 /* MetadataBaseValue */ && tokens[0].text.indexOf(",") != -1)) {
                depth = 0;
                var hasItems = false;
                for (var i = 0; i < tokens.Count; i++) {
                    var token = tokens[i];

                    if (token.type == 10 /* DataEndMarker */)
                        depth--;

                    if (depth == 0 && !hasItems)
                        if (token.type == 5 /* DataStartMarker */)
                            hasItems = true;
                        else if (token.type == 4 /* DataPropName */)
                            break;

                    // and yet we have items (i.e. data was ambiguous to parser, and was considered to be within popped-out items), fix tokens to have them end up as properties
                    if (hasItems && depth == 0 && [5 /* DataStartMarker */, 10 /* DataEndMarker */].indexOf(token.type) != -1)
                        tokens.RemoveAt(i--);

                    if (token.type == 5 /* DataStartMarker */)
                        depth++;
                }
                if (hasItems)
                    VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
            }

        // figure out obj-type
        // ==========
        /*var depth = 0;
        var tokensNotInDataMarkers = new List<VDFToken>("VDFToken");
        for (var i = 0; i < tokens.length; i++)
        {
        var token: VDFToken = tokens[i];
        if (token.type == VDFTokenType.DataEndMarker)
        depth--;
        if (depth == 0)
        tokensNotInDataMarkers.Add(token);
        if (token.type == VDFTokenType.DataStartMarker)
        depth++;
        }
        var isInlineList = tokensNotInDataMarkers.Any(a=>a.type == VDFTokenType.ItemSeparator);
        
        var objMetadataBaseValueToken: VDFToken = null;
        var objMetadataEndMarkerToken: VDFToken = null;
        if (isInlineList)
        {
        if (tokensNotInDataMarkers.Count >= 2 && tokensNotInDataMarkers[1].type == VDFTokenType.WiderMetadataEndMarker)
        {
        objMetadataBaseValueToken = tokensNotInDataMarkers[0];
        objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
        }
        else if (tokensNotInDataMarkers.Count >= 1 && tokensNotInDataMarkers[0].type == VDFTokenType.WiderMetadataEndMarker)
        objMetadataEndMarkerToken = tokensNotInDataMarkers[0];
        }
        else
        if (tokensNotInDataMarkers.Count >= 2 && (tokensNotInDataMarkers[1].type == VDFTokenType.WiderMetadataEndMarker || (tokensNotInDataMarkers[0].type == VDFTokenType.MetadataBaseValue && tokensNotInDataMarkers[1].type == VDFTokenType.MetadataEndMarker)))
        {
        objMetadataBaseValueToken = tokensNotInDataMarkers[0];
        objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
        }
        else if (tokensNotInDataMarkers.Count >= 1 && (tokensNotInDataMarkers[0].type == VDFTokenType.WiderMetadataEndMarker || tokensNotInDataMarkers[0].type == VDFTokenType.MetadataEndMarker))
        objMetadataEndMarkerToken = tokensNotInDataMarkers[0];*/
        depth = 0;
        var tokensAtDepth0 = new List("VDFToken");
        for (var i in tokens.indexes()) {
            var token = tokens[i];
            if (token.type == 10 /* DataEndMarker */)
                depth--;
            if (depth == 0)
                tokensAtDepth0.Add(token);
            if (token.type == 5 /* DataStartMarker */)
                depth++;
        }
        var isList = declaredTypeName != null && (declaredTypeName == "IList" || declaredTypeName.indexOf("List[") == 0);
        for (var i = 0; i < tokensAtDepth0.Count; i++) {
            var lastToken = (i - 1 >= 0 ? tokensAtDepth0[i - 1] : null);
            var token = tokensAtDepth0[i];
            if (lastToken != null && lastToken.type == 10 /* DataEndMarker */ && token.type == 5 /* DataStartMarker */)
                isList = true;
        }

        var objMetadataBaseValueToken = null;
        var objMetadataEndMarkerToken = null;
        if (tokensAtDepth0.Count >= 2 && ([1 /* WiderMetadataEndMarker */, 3 /* MetadataEndMarker */].indexOf(tokensAtDepth0[1].type) != -1)) {
            objMetadataBaseValueToken = tokensAtDepth0[0];
            objMetadataEndMarkerToken = tokensAtDepth0[1];
        } else if (tokensAtDepth0.Count >= 1 && ([1 /* WiderMetadataEndMarker */, 3 /* MetadataEndMarker */].indexOf(tokensAtDepth0[0].type) != -1))
            objMetadataEndMarkerToken = tokensAtDepth0[0];

        var objTypeStr = null;
        if (objMetadataBaseValueToken != null) {
            objTypeStr = objMetadataBaseValueToken.text;

            // do some expanding of obj-type-str (if applicable)
            if (objMetadataEndMarkerToken.type == 1 /* WiderMetadataEndMarker */ && objTypeStr.indexOf("[") == -1)
                if (objTypeStr == ",")
                    objTypeStr = "IDictionary";
                else if (VDFLoader.FindNextDepthXCharYPos(objTypeStr, 0, 0, ',', '[', ']') != -1)
                    objTypeStr = "Dictionary[" + objTypeStr + "]";
                else
                    objTypeStr = "List[" + objTypeStr + "]";
        } else if (objMetadataEndMarkerToken != null)
            if (objMetadataEndMarkerToken.type == 3 /* MetadataEndMarker */)
                objTypeStr = ""; // if type is not already set, set it to an empty string, for type-inference later
            else
                objTypeStr = "IList";

        // some further inference based on token analysis
        if (objTypeStr == null && isList)
            objTypeStr = "System.Collections.IList";

        var objTypeName = declaredTypeName;
        if (objTypeStr != null && objTypeStr.length > 0) {
            // porting-note: this is only a limited implementation of CS functionality of making sure metadata-type (objTypeStr) is more specific than declared-type (objTypeName)
            if (objTypeName == null || ["object", "IList", "IDictionary"].indexOf(objTypeName) != -1)
                objTypeName = objTypeStr;
        }
        if (objTypeName == null)
            objTypeName = "string"; // string is the default/fallback type (note, though, that if the below code finds properties, it'll just add them to the VDFNode anyway)
        var objTypeInfo = VDFTypeInfo.Get(objTypeName);

        // create the object's VDFNode, and load in the data
        // ==========
        var objNode = new VDFNode();
        objNode.metadata_type = objTypeStr;

        for (var i = 0; i < tokensAtDepth0.Count; i++) {
            var token = tokensAtDepth0[i];
            if (token.type == 5 /* DataStartMarker */) {
                var itemFirstToken = token.index + 1 < tokens.Count ? tokens[token.index + 1] : null;
                var itemEnderToken = itemFirstToken != null ? tokensAtDepth0.FirstOrDefault(function (a) {
                    return a.type == 10 /* DataEndMarker */ && a.index > itemFirstToken.index;
                }) : null;
                objNode.AddItem(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
            }
        }

        // if not list (i.e. if perhaps object or dictionary), parse keys-and-values/properties (depending on whether we're a dictionary)
        if (objTypeName == null || (objTypeName != "IList" && objTypeName.indexOf("List[") != 0))
            for (var i = 0; i < tokens.Count; i++) {
                var token = tokens[i];
                var next3Tokens = tokens.GetRange(i + 1, Math.min(3, tokens.Count - (i + 1)));

                if (token.type == 4 /* DataPropName */ && tokensAtDepth0.Contains(token)) {
                    var propName = token.text.replace(/^\t+/, "");
                    var propValueTypeName;
                    if (objTypeName.indexOf("Dictionary[") == 0)
                        propValueTypeName = VDF.GetGenericParametersOfTypeName(objTypeName)[1];
                    else
                        propValueTypeName = objTypeInfo.propInfoByName[propName] ? objTypeInfo.propInfoByName[propName].propVTypeName : null;

                    if (next3Tokens.Count < 2 || next3Tokens[1].type == 10 /* DataEndMarker */)
                        objNode.SetProperty(propName, VDFLoader.ToVDFNode(new List("VDFToken"), propValueTypeName, loadOptions, objIndent));
                    else {
                        var propValueToken = next3Tokens[1];
                        var propValueEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                            return (a.type == 10 /* DataEndMarker */ || a.type == 7 /* PoppedOutDataEndMarker */) && a.index > propValueToken.index;
                        });
                        objNode.SetProperty(propName, VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueToken, propValueEnderToken), propValueTypeName, loadOptions, objIndent));
                    }
                }
            }

        // parse base-value (if applicable)
        if (objNode.items.Count == 0 && objNode.properties.Count == 0) {
            var firstPropNameToken = tokens.FirstOrDefault(function (a) {
                return a.type == 4 /* DataPropName */;
            });
            var firstBaseValueToken = tokens.FirstOrDefault(function (a) {
                return a.type == 9 /* DataBaseValue */;
            });
            if (firstBaseValueToken != null && (firstPropNameToken == null || firstBaseValueToken.position < firstPropNameToken.position))
                objNode.baseValue = firstBaseValueToken.text;
        }

        return objNode;
    };
    VDFLoader.GetTokenRange_Tokens = function (tokens, firstToken, enderToken) {
        //return tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index, a.text)).ToList();
        var result = new List("VDFToken");
        for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
            result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
        return result;
    };

    VDFLoader.FindNextDepthXCharYPos = function (text, searchStartPos, targetDepth, ch, depthStartChar, depthEndChar) {
        var depth = 0;
        for (var i = searchStartPos; i < text.length && depth >= 0; i++)
            if (text[i] == depthStartChar)
                depth++;
            else if (text[i] == ch && depth == targetDepth)
                return i;
            else if (text[i] == depthEndChar)
                depth--;
        return -1;
    };
    VDFLoader.GetIndentDepthOfToken = function (tokens, token) {
        var firstTokenOfLine = null;
        for (var i = token.index - 1; firstTokenOfLine == null; i--)
            if (tokens[i].type == 11 /* LineBreak */ || i == 0)
                if (tokens.Count > i + 1)
                    firstTokenOfLine = tokens[i + 1];

        var result = 0;
        for (var i = 0; i < firstTokenOfLine.text.length; i++)
            if (firstTokenOfLine.text[i] == '\t')
                result++;
            else
                break;
        return result;
    };
    return VDFLoader;
})();
//# sourceMappingURL=VDFLoader.js.map
