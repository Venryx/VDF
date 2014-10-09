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
    VDFLoader.ToVDFNode = function (text, declaredTypeName_orLoadOptions, loadOptions_orDeclaredTypeName, objIndent) {
        if (typeof objIndent === "undefined") { objIndent = 0; }
        var declaredTypeName;
        var loadOptions;
        if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions) {
            declaredTypeName = declaredTypeName_orLoadOptions;
            loadOptions = loadOptions_orDeclaredTypeName;
        } else {
            declaredTypeName = loadOptions_orDeclaredTypeName;
            loadOptions = declaredTypeName_orLoadOptions;
        }
        text = (text || "").replace(/\r\n/g, "\n");
        loadOptions = loadOptions || new VDFLoadOptions();

        // parse all tokens
        // ==========
        var parser = new VDFTokenParser(text, 0);
        while (parser.MoveNextToken()) {
        }

        // figure out obj-type
        // ==========
        var depth = 0;
        var tokensNotInDataMarkers = new List("VDFToken");
        for (var i = 0; i < parser.tokens.length; i++) {
            var token = parser.tokens[i];
            if (token.type == 11 /* DataEndMarker */)
                depth--;
            if (depth == 0)
                tokensNotInDataMarkers.Add(token);
            if (token.type == 6 /* DataStartMarker */)
                depth++;
        }
        var isInlineList = tokensNotInDataMarkers.Any(function (a) {
            return a.type == 9 /* ItemSeparator */;
        });

        var objMetadataBaseValueToken = null;
        var objMetadataEndMarkerToken = null;
        if (isInlineList) {
            if (tokensNotInDataMarkers.Count >= 2 && tokensNotInDataMarkers[1].type == 2 /* WiderMetadataEndMarker */) {
                objMetadataBaseValueToken = tokensNotInDataMarkers[0];
                objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
            } else if (tokensNotInDataMarkers.Count >= 1 && tokensNotInDataMarkers[0].type == 2 /* WiderMetadataEndMarker */)
                objMetadataEndMarkerToken = tokensNotInDataMarkers[0];
        } else if (tokensNotInDataMarkers.Count >= 2 && (tokensNotInDataMarkers[1].type == 2 /* WiderMetadataEndMarker */ || (tokensNotInDataMarkers[0].type == 3 /* MetadataBaseValue */ && tokensNotInDataMarkers[1].type == 4 /* MetadataEndMarker */))) {
            objMetadataBaseValueToken = tokensNotInDataMarkers[0];
            objMetadataEndMarkerToken = tokensNotInDataMarkers[1];
        } else if (tokensNotInDataMarkers.Count >= 1 && (tokensNotInDataMarkers[0].type == 2 /* WiderMetadataEndMarker */ || tokensNotInDataMarkers[0].type == 4 /* MetadataEndMarker */))
            objMetadataEndMarkerToken = tokensNotInDataMarkers[0];

        var objTypeStr = null;
        if (objMetadataBaseValueToken != null) {
            objTypeStr = objMetadataBaseValueToken.text;

            // do some expanding of obj-type-str (if applicable)
            if (objMetadataEndMarkerToken.type == 2 /* WiderMetadataEndMarker */ && objTypeStr.indexOf("[") == -1)
                if (objTypeStr == ",")
                    objTypeStr = "System.Collections.IDictionary";
                else if (VDFLoader.FindNextDepthXCharYPos(objTypeStr, 0, 0, ',', '[', ']') != -1)
                    objTypeStr = "Dictionary[" + objTypeStr + "]";
                else
                    objTypeStr = "List[" + objTypeStr + "]";
        } else if (objMetadataEndMarkerToken != null)
            if (objMetadataEndMarkerToken.type == 4 /* MetadataEndMarker */)
                objTypeStr = ""; // if type is not already set, set it to an empty string, for type-inference later
            else
                objTypeStr = "IList";

        // some further inference based on token analysis
        if (objTypeStr == null)
            if (isInlineList)
                objTypeStr = "IList";
            else if (tokensNotInDataMarkers.All(function (a) {
                return a.type != 5 /* DataPropName */;
            }) && tokensNotInDataMarkers.Any(function (a) {
                return a.type == 12 /* LineBreak */;
            }))
                objTypeStr = "IList";

        var objTypeName = declaredTypeName;
        if (objTypeStr != null && objTypeStr.length > 0)
            objTypeName = objTypeStr; // porting-note: dropped CS functionality of making sure metadata-type (objTypeStr) is more specific than obj-type
        if (objTypeName == null)
            objTypeName = "string"; // string is the default/fallback type (note, though, that if the below code finds properties, it'll just add them to the VDFNode anyway)
        var objTypeInfo = VDFTypeInfo.Get(objTypeName);

        // calculate token depths
        // ==========
        isInlineList = isInlineList || ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0) && tokensNotInDataMarkers.Any(function (a) {
            return a != objMetadataBaseValueToken && a != objMetadataEndMarkerToken;
        }) && tokensNotInDataMarkers.All(function (a) {
            return a.type != 12 /* LineBreak */;
        })); // update based on new knowledge of obj-type

        var firstNonObjMetadataGroupToken = objMetadataEndMarkerToken != null ? parser.tokens.FirstOrDefault(function (a) {
            return a.position > objMetadataEndMarkerToken.position;
        }) : parser.tokens.FirstOrDefault();
        var hasPoppedOutChildren = !isInlineList && tokensNotInDataMarkers.Any(function (a) {
            return a.type == 12 /* LineBreak */;
        });

        // calculate token depths, based on our new knowledge of whether we're dealing with an inline-list (in that case, consider the "|"-separated text blocks as being a depth lower)
        // (note: 'depth' is increased not only by '{' chars, but also inferred/virtual '{' chars, e.g. to the left and right of item vdf-text)
        depth = 0;
        var inPoppedOutBlockAtIndent = -1;
        var hasDepth0DataBlocks = false;
        var tokensAtDepth0 = new List("VDFToken");
        var tokensAtDepth1 = new List("VDFToken");
        for (var i = 0; i < parser.tokens.Count; i++) {
            var lastToken = i > 0 ? parser.tokens[i - 1] : null;
            var token = parser.tokens[i];

            if (token.type == 11 /* DataEndMarker */)
                depth--;
            else if (hasPoppedOutChildren) {
                if (depth == 0 && lastToken != null && lastToken.type == 7 /* PoppedOutDataStartMarker */) {
                    depth++;
                    inPoppedOutBlockAtIndent = VDFLoader.FindIndentDepthOfLineContainingCharPos(text, token.position) + 1;
                } else if (inPoppedOutBlockAtIndent != -1 && depth == 1 && lastToken != null && lastToken.type == 12 /* LineBreak */ && VDFLoader.FindIndentDepthOfLineContainingCharPos(text, token.position) == inPoppedOutBlockAtIndent - 1) {
                    depth--;
                    inPoppedOutBlockAtIndent = -1;
                }

                if (objTypeName == "IList" || objTypeName.indexOf("List[") == 0)
                    if (depth == 0 && lastToken != null && lastToken.type == 12 /* LineBreak */)
                        depth++;
                    else if (depth == 1 && token.type == 12 /* LineBreak */)
                        depth--;
            } else if (isInlineList) {
                if (token.type != 9 /* ItemSeparator */ && token.type != 6 /* DataStartMarker */ && depth == 0 && (firstNonObjMetadataGroupToken == token || (lastToken != null && lastToken.type == 9 /* ItemSeparator */)))
                    depth++;
                else if (token.type == 9 /* ItemSeparator */ && !hasDepth0DataBlocks && depth == 1 && lastToken != null && lastToken.type != 9 /* ItemSeparator */)
                    depth--;
            }

            if (depth == 0)
                tokensAtDepth0.Add(token);
            else if (depth == 1)
                tokensAtDepth1.Add(token);

            if (token.type == 6 /* DataStartMarker */) {
                if (depth == 0)
                    hasDepth0DataBlocks = true;
                depth++;
            }
        }

        // create the object's VDFNode, and load in the data
        // ==========
        var objNode = new VDFNode();
        objNode.metadata_type = objTypeStr;

        // if List, parse items
        if ((objTypeName == "IList" || objTypeName.indexOf("List[") == 0))
            if (isInlineList) {
                var firstDepth1Token = tokensAtDepth1.FirstOrDefault();
                var lastDepth0MetadataEndMarkerToken = parser.tokens.LastOrDefault(function (a) {
                    return a.type == 4 /* MetadataEndMarker */ || a.type == 2 /* WiderMetadataEndMarker */;
                });
                var firstItemTextPos = firstDepth1Token != null ? firstDepth1Token.position : (lastDepth0MetadataEndMarkerToken != null ? lastDepth0MetadataEndMarkerToken.position + lastDepth0MetadataEndMarkerToken.text.length : 0);
                var firstItemEnderToken = hasDepth0DataBlocks ? tokensAtDepth0.FirstOrDefault(function (a) {
                    return a.type == 11 /* DataEndMarker */;
                }) : tokensAtDepth0.FirstOrDefault(function (a) {
                    return a.type == 9 /* ItemSeparator */;
                });
                var firstItemText = text.substr(firstItemTextPos, (firstItemEnderToken != null ? firstItemEnderToken.position : text.length) - firstItemTextPos);
                if (firstItemEnderToken != null || firstItemText.length > 0)
                    objNode.AddItem(VDFLoader.ToVDFNode(firstItemText, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));

                for (var i = 0; i < tokensAtDepth0.Count; i++) {
                    var token = tokensAtDepth0[i];
                    if (token.type == 9 /* ItemSeparator */) {
                        var itemTextPos = token.position + token.text.length + (hasDepth0DataBlocks ? 1 : 0);
                        var itemEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                            return a.type == (hasDepth0DataBlocks ? 11 /* DataEndMarker */ : 9 /* ItemSeparator */) && a.position >= itemTextPos;
                        });
                        var itemText = text.substr(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.length) - itemTextPos);
                        objNode.AddItem(VDFLoader.ToVDFNode(itemText, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent));
                    }
                }
            } else
                for (var i = 0; i < tokensAtDepth1.Count; i++) {
                    var token = tokensAtDepth1[i];
                    if (token.type != 7 /* PoppedOutDataStartMarker */ && token.type != 12 /* LineBreak */ && token.position > 0)
                        if (VDFLoader.FindIndentDepthOfLineContainingCharPos(text, token.position) == objIndent + 1) {
                            var itemTextPos = token.position + (objIndent + 1);
                            var itemEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                                return a.type == 12 /* LineBreak */ && a.position >= itemTextPos;
                            });
                            var itemText = text.substr(itemTextPos, (itemEnderToken != null ? itemEnderToken.position : text.length) - itemTextPos);
                            objNode.AddItem(VDFLoader.ToVDFNode(itemText, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, objIndent + 1));
                        } else
                            break;
                }

        for (var i = 0; i < parser.tokens.Count; i++) {
            var token = parser.tokens[i];
            var next3Tokens = parser.tokens.GetRange(i + 1, Math.min(3, parser.tokens.Count - (i + 1)));

            if (token.type == 5 /* DataPropName */ && tokensAtDepth0.Contains(token)) {
                var propName = token.text.replace(/^\t+/, "");
                var propValueTypeName;
                if (objTypeName.indexOf("Dictionary[") == 0)
                    propValueTypeName = VDF.GetGenericParametersOfTypeName(objTypeName)[1];
                else
                    propValueTypeName = objTypeInfo != null && objTypeInfo.propInfoByName.ContainsKey(propName) ? objTypeInfo.propInfoByName[propName].GetPropType() : null;

                if (token.text.indexOf("\t") != 0) {
                    var propValueTextPos = next3Tokens[1].position;
                    var propValueEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                        return (a.type == 11 /* DataEndMarker */ || a.type == 8 /* PoppedOutDataEndMarker */) && a.position >= propValueTextPos;
                    });
                    var propValueText = text.substr(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.length) - propValueTextPos);
                    objNode.SetProperty(propName, VDFLoader.ToVDFNode(propValueText, propValueTypeName, loadOptions, objIndent));
                } else {
                    var propValueTextPos = next3Tokens[1].position;
                    var propValueEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                        return a.type == 11 /* DataEndMarker */ && a.position >= propValueTextPos;
                    });
                    if (objTypeInfo.popOutChildren)
                        propValueEnderToken = tokensAtDepth0.FirstOrDefault(function (a) {
                            return a.type == 5 /* DataPropName */ && a.position > propValueTextPos;
                        });
                    var propValueText = text.substr(propValueTextPos, (propValueEnderToken != null ? propValueEnderToken.position : text.length) - propValueTextPos);
                    objNode.SetProperty(propName, VDFLoader.ToVDFNode(propValueText, propValueTypeName, loadOptions, objIndent + 1));
                }
            }
        }

        // parse base-value (if applicable)
        var firstPropNameToken = parser.tokens.FirstOrDefault(function (a) {
            return a.type == 5 /* DataPropName */;
        });
        var firstBaseValueToken = parser.tokens.FirstOrDefault(function (a) {
            return a.type == 10 /* DataBaseValue */;
        });
        if (firstBaseValueToken != null && (firstPropNameToken == null || firstBaseValueToken.position < firstPropNameToken.position))
            objNode.baseValue = firstBaseValueToken.text;

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
    VDFLoader.FindIndentDepthOfLineContainingCharPos = function (text, charPos) {
        var lineIndentDepth = 0;
        if (text[charPos] != '\n')
            for (var i = charPos + 1; i < text.length && text[i] != '\n'; i++)
                if (text[i] == '\t')
                    lineIndentDepth++;
        for (var i = charPos; i > 0 && (text[i] != '\n' || i == charPos); i--)
            if (text[i] == '\t')
                lineIndentDepth++;
        return lineIndentDepth;
    };
    return VDFLoader;
})();
//# sourceMappingURL=VDFLoader.js.map
