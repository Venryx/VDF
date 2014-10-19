var VDFLoadOptions = (function () {
    function VDFLoadOptions(message, inferCompatibleTypesForUnknownTypes) {
        if (typeof inferCompatibleTypesForUnknownTypes === "undefined") { inferCompatibleTypesForUnknownTypes = false; }
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
            var parser_ = new VDFTokenParser(arg1, 0);
            while (parser_.MoveNextToken()) {
            }
            ;
            tokens = parser_.tokens;
        }
        if (typeof arg2 == "string" || arg3 instanceof VDFLoadOptions) {
            declaredTypeName = arg2;
            loadOptions = arg3;
        } else {
            declaredTypeName = arg3;
            loadOptions = arg2;
        }
        loadOptions = loadOptions || new VDFLoadOptions();

        // figure out obj-type
        // ==========
        var depth = 0;
        var tokensNotInDataMarkers = new List("VDFToken");
        for (var i = 0; i < tokens.length; i++) {
            var token = tokens[i];
            if (token.type == 10 /* DataEndMarker */)
                depth--;
            if (depth == 0)
                tokensNotInDataMarkers.Add(token);
            if (token.type == 5 /* DataStartMarker */)
                depth++;
        }
        var isInlineList = tokensNotInDataMarkers.Any(function (a) {
            return a.type == 8 /* ItemSeparator */;
        });

        var objMetadataBaseValueToken = null;
        var objMetadataEndMarkerToken = null;
        if (isInlineList) {
            if (tokensNotInDataMarkers.Count >= 2 && tokensNotInDataMarkers[1].type == 1 /* WiderMetadataEndMarker */) {
                objMetadataBaseValueToken = tokensNotInDataMarkers[0];
                objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
            } else if (tokensNotInDataMarkers.Count >= 1 && tokensNotInDataMarkers[0].type == 1 /* WiderMetadataEndMarker */)
                objMetadataEndMarkerToken = tokensNotInDataMarkers[0];
        } else if (tokensNotInDataMarkers.Count >= 2 && (tokensNotInDataMarkers[1].type == 1 /* WiderMetadataEndMarker */ || (tokensNotInDataMarkers[0].type == 2 /* MetadataBaseValue */ && tokensNotInDataMarkers[1].type == 3 /* MetadataEndMarker */))) {
            objMetadataBaseValueToken = tokensNotInDataMarkers[0];
            objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
        } else if (tokensNotInDataMarkers.Count >= 1 && (tokensNotInDataMarkers[0].type == 1 /* WiderMetadataEndMarker */ || tokensNotInDataMarkers[0].type == 3 /* MetadataEndMarker */))
            objMetadataEndMarkerToken = tokensNotInDataMarkers[0];

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
        if (objTypeStr == null)
            if (isInlineList)
                objTypeStr = "IList";
            else if (tokensNotInDataMarkers.All(function (a) {
                return a.type != 6 /* PoppedOutDataStartMarker */;
            }) && tokensNotInDataMarkers.Any(function (a) {
                return a.type == 11 /* LineBreak */;
            }) && (declaredTypeName == null || declaredTypeName == "object"))
                objTypeStr = "IList";

        var objTypeName = declaredTypeName;
        if (objTypeStr != null && objTypeStr.length > 0) {
            // porting-note: this is only a limited implementation of CS functionality of making sure metadata-type (objTypeStr) is more specific than declared-type (objTypeName)
            if (objTypeName == null || ["object", "IList", "IDictionary"].indexOf(objTypeName) != -1)
                objTypeName = objTypeStr;
        }
        if (objTypeName == null)
            objTypeName = "string"; // string is the default/fallback type (note, though, that if the below code finds properties, it'll just add them to the VDFNode anyway)
        var objTypeInfo = VDFTypeInfo.Get(objTypeName);

        // calculate token depths
        // ==========
        isInlineList = isInlineList || ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0) && tokensNotInDataMarkers.Any(function (a) {
            return a != objMetadataBaseValueToken && a != objMetadataEndMarkerToken;
        }) && tokensNotInDataMarkers.All(function (a) {
            return a.type != 11 /* LineBreak */;
        })); // update based on new knowledge of obj-type

        var firstNonObjMetadataGroupToken = objMetadataEndMarkerToken != null ? tokens.FirstOrDefault(function (a) {
            return a.position > objMetadataEndMarkerToken.position;
        }) : tokens.FirstOrDefault();
        var hasPoppedOutChildren = !isInlineList && tokensNotInDataMarkers.Any(function (a) {
            return a.type == 11 /* LineBreak */;
        });

        // calculate token depths, based on our new knowledge of whether we're dealing with an inline-list (in that case, consider the "|"-separated text blocks as being a depth lower)
        // (note: 'depth' is increased not only by '{' chars, but also inferred/virtual '{' chars, e.g. to the left and right of item vdf-text)
        depth = 0;
        var inPoppedOutBlockAtIndent = -1;
        var hasDepth0DataBlocks = false;
        var tokensAtDepth0 = new List("VDFToken");
        var tokensAtDepth1 = new List("VDFToken");
        for (var i = 0; i < tokens.Count; i++) {
            var lastToken = i > 0 ? tokens[i - 1] : null;
            var token = tokens[i];

            if (token.type == 10 /* DataEndMarker */)
                depth--;
            else if (hasPoppedOutChildren) {
                if (depth == 0 && lastToken != null && lastToken.type == 6 /* PoppedOutDataStartMarker */) {
                    depth++;
                    inPoppedOutBlockAtIndent = VDFLoader.GetIndentDepthOfToken(tokens, token) + 1;
                } else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == 11 /* LineBreak */ && VDFLoader.GetIndentDepthOfToken(tokens, token) == inPoppedOutBlockAtIndent - 1) {
                    depth--;
                    inPoppedOutBlockAtIndent = -1;
                }

                if (objTypeName == "IList" || objTypeName.indexOf("List[") == 0)
                    if (depth == 0 && lastToken != null && lastToken.type == 11 /* LineBreak */)
                        depth++;
                    else if (depth == 1 && token.type == 11 /* LineBreak */)
                        depth--;
            } else if (isInlineList) {
                if (token.type != 8 /* ItemSeparator */ && token.type != 5 /* DataStartMarker */ && depth == 0 && (firstNonObjMetadataGroupToken == token || (lastToken != null && lastToken.type == 8 /* ItemSeparator */)))
                    depth++;
                else if (token.type == 8 /* ItemSeparator */ && !hasDepth0DataBlocks && depth == 1 && lastToken != null && lastToken.type != 8 /* ItemSeparator */)
                    depth--;
            }

            if (depth == 0)
                tokensAtDepth0.Add(token);
            else if (depth == 1)
                tokensAtDepth1.Add(token);

            if (token.type == 5 /* DataStartMarker */) {
                if (depth == 0)
                    hasDepth0DataBlocks = true;
                depth++;
            }
        }

        // create the object's VDFNode, and load in the data
        // ==========
        var objNode = new VDFNode();
        objNode.metadata_type = objTypeStr;

        var getTokenAtIndex = function (index) {
            return tokens.Count > index ? tokens[index] : null;
        };
        var getTokenRange_tokens = function (firstToken, enderToken) {
            var result = new List("VDFToken");
            for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
                result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
            return result;
        };

        // if List, parse items
        if ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0))
            if (isInlineList) {
                var firstDepth1Token = tokensAtDepth1.FirstOrDefault();
                var lastDepth0MetadataEndMarkerToken = tokens.LastOrDefault(function (a) {
                    return a.type == 3 /* MetadataEndMarker */ || a.type == 1 /* WiderMetadataEndMarker */;
                });
                var firstItemToken = firstDepth1Token || (lastDepth0MetadataEndMarkerToken != null ? tokens.FirstOrDefault(function (a) {
                    return a.position == lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.length;
                }) : tokens.First());
                var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(function (a) {
                    return a.type == 10 /* DataEndMarker */;
                }) : tokensAtDepth0.FirstOrDefault(function (a) {
                    return a.type == 8 /* ItemSeparator */;
                });
                if (firstItemEnderToken != null || firstItemEnderToken == null || firstItemEnderToken.position > firstItemToken.position)
                    objNode.AddItem(VDFLoader.ToVDFNode(getTokenRange_tokens(firstItemToken, firstItemEnderToken), VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));

                for (var i in tokensAtDepth0.indexes()) {
                    var token = tokensAtDepth0[i];
                    if (token.type == 8 /* ItemSeparator */) {
                        var itemToken = getTokenAtIndex(token.index + 1 + (hasDepth0DataBlocks ? 1 : 0));
                        var itemEnderToken = itemToken != null ? tokensAtDepth0.FirstOrDefault(function (a) {
                            return a.type == (hasDepth0DataBlocks ? 10 /* DataEndMarker */ : 8 /* ItemSeparator */) && a.position >= itemToken.position;
                        }) : null;
                        objNode.AddItem(VDFLoader.ToVDFNode(itemToken != null ? getTokenRange_tokens(itemToken, itemEnderToken) : new List("VDFToken"), VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
                    }
                }
            } else
                for (var i = 0; i < tokensAtDepth0.Count; i++) {
                    var token = tokensAtDepth0[i];
                    if (token.type == 11 /* LineBreak */ && tokensAtDepth1.Any(function (a) {
                        return a.position > token.position;
                    }) && tokensAtDepth1.FirstOrDefault(function (a) {
                        return a.position > token.position;
                    }).text.indexOf("\t") == 0) {
                        var itemToken = getTokenAtIndex(token.index + 1);
                        var itemEnderToken = itemToken != null ? tokensAtDepth0.FirstOrDefault(function (a) {
                            return a.type == 11 /* LineBreak */ && a.position >= itemToken.position;
                        }) : null;
                        var itemTokens = itemToken != null ? getTokenRange_tokens(itemToken, itemEnderToken) : new List("VDFToken");
                        if (itemTokens.Count > 0)
                            itemTokens[0].text = itemTokens[0].text.substr(1);
                        objNode.AddItem(VDFLoader.ToVDFNode(itemTokens, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
                    }
                }

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
                else if (token.text.indexOf("\t") != 0) {
                    var propValueToken = next3Tokens[1];
                    var propValueEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                        return (a.type == 10 /* DataEndMarker */ || a.type == 7 /* PoppedOutDataEndMarker */) && a.position >= propValueToken.position;
                    });
                    objNode.SetProperty(propName, VDFLoader.ToVDFNode(getTokenRange_tokens(propValueToken, propValueEnderToken), propValueTypeName, loadOptions, objIndent));
                } else {
                    var propValueToken = next3Tokens[1];
                    var propValueEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                        return a.type == 4 /* DataPropName */ && a.position > propValueToken.position;
                    });
                    objNode.SetProperty(propName, VDFLoader.ToVDFNode(getTokenRange_tokens(propValueToken, propValueEnderToken), propValueTypeName, loadOptions, objIndent + 1));
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
