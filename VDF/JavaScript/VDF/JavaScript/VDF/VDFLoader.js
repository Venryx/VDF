var VDFLoadOptions = (function () {
    function VDFLoadOptions(message, inferCompatibleTypesForUnknownTypes) {
        if (typeof inferCompatibleTypesForUnknownTypes === "undefined") { inferCompatibleTypesForUnknownTypes = false; }
        this.message = message;
        this.inferCompatibleTypesForUnknownTypes = inferCompatibleTypesForUnknownTypes;
    }
    return VDFLoadOptions;
})();

var VDFLoader_LineInfo = (function () {
    function VDFLoader_LineInfo() {
        this.fromLinePoppedOutGroupCount = 0;
    }
    return VDFLoader_LineInfo;
})();
var VDFLoader = (function () {
    function VDFLoader() {
    }
    VDFLoader.ToVDFNode = function (vdfFile, declaredTypeName_orLoadOptions, loadOptions_orDeclaredTypeName, firstObjTextCharPos, lineInfo) {
        if (typeof firstObjTextCharPos === "undefined") { firstObjTextCharPos = 0; }
        var declaredTypeName;
        var loadOptions;
        if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions) {
            declaredTypeName = declaredTypeName_orLoadOptions;
            loadOptions = loadOptions_orDeclaredTypeName;
        } else {
            declaredTypeName = loadOptions_orDeclaredTypeName;
            loadOptions = declaredTypeName_orLoadOptions;
        }
        vdfFile = vdfFile.replace(/\r\n/g, "\n");
        loadOptions = loadOptions || new VDFLoadOptions();

        var objNode = new VDFNode();
        var objTypeName = declaredTypeName;
        if (objTypeName == null && VDFLoader.FindNextDepthXItemSeparatorCharPos(vdfFile, firstObjTextCharPos, 0) != -1)
            objTypeName = "List[object]";
        var livePropAddNode = objTypeName != null && objTypeName.startsWith("List[") ? new VDFNode() : objNode;
        var livePropAddNodeTypeInfo = livePropAddNode != objNode ? VDF.GetTypeInfo(VDF.GetGenericParametersOfTypeName(objTypeName)[0]) : (objTypeName != null ? VDF.GetTypeInfo(objTypeName) : null);

        lineInfo = lineInfo || new VDFLoader_LineInfo();

        var depth = 0;
        var dataIsPoppedOut = false;
        var livePropName = null;

        var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
        while (parser.MoveNextToken()) {
            var token = parser.tokens[parser.tokens.length - 1];
            if (token.type == 9 /* DataEndMarker */)
                depth--;

            if (depth < 0)
                break;
            if (depth == 0) {
                if (token.type == 7 /* ItemSeparator */) {
                    objNode.PushItem(livePropAddNode);
                    livePropAddNode = new VDFNode();
                }

                if (token.type == 2 /* WiderMetadataEndMarker */) {
                    objNode.metadata_type = objNode.metadata_type || "List[object]"; // if metadata-type text is empty, infer it to mean "List[object]"
                    objTypeName = objNode.metadata_type;
                    if (objTypeName != null && objTypeName.startsWith("List[")) {
                        livePropAddNode = new VDFNode(); // we found out we're a list, so create a new item-node to hold the about-to-be-reached props
                        livePropAddNodeTypeInfo = VDF.GetTypeInfo(VDF.GetGenericParametersOfTypeName(objTypeName)[0]); // if primitive, there's no constructor
                    }
                } else if (token.type == 4 /* MetadataEndMarker */) {
                    if (objNode.metadata_type == null)
                        objNode.metadata_type = "";
                } else if (token.type == 3 /* Metadata_BaseValue */)
                    if (parser.PeekNextChars(2) == ">>") {
                        objNode.metadata_type = token.text == "," ? "Dictionary[object,object]" : token.text;
                        objNode.metadata_type = VDFLoader.FindNextDepthXCharYPos(objNode.metadata_type, 0, 0, ',', '[', ']') != -1 ? "Dictionary[" + objNode.metadata_type + "]" : objNode.metadata_type; // if has generic-params without root-type, infer root type to be "Dictionary"
                        objNode.metadata_type = !objNode.metadata_type.contains("[") ? "List[" + objNode.metadata_type + "]" : objNode.metadata_type; // if has no generic-params, infer root type to be "List"
                        objTypeName = objNode.metadata_type;
                        if (objTypeName != null && objTypeName.startsWith("List[")) {
                            livePropAddNode = new VDFNode(); // we found out we're a list, so create a new item-node to hold the about-to-be-reached props
                            livePropAddNodeTypeInfo = VDF.GetTypeInfo(VDF.GetGenericParametersOfTypeName(objTypeName)[0]);
                        }
                    } else {
                        livePropAddNode.metadata_type = token.text;
                        livePropAddNodeTypeInfo = VDF.GetTypeInfo(token.text); // if primitive, there's no constructor
                    }
                else if (token.type == 8 /* Data_BaseValue */)
                    if (token.text == "#") {
                        var poppedOutPropValueItemTextPositions = VDFLoader.FindPoppedOutChildTextPositions(vdfFile, VDFLoader.FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), VDFLoader.FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, lineInfo.fromLinePoppedOutGroupCount);
                        if ((objTypeName != null && objTypeName.startsWith("List[")) || poppedOutPropValueItemTextPositions.length > 1)
                            for (var i in poppedOutPropValueItemTextPositions)
                                objNode.PushItem(VDFLoader.ToVDFNode(vdfFile, declaredTypeName != null ? (VDF.GetGenericParametersOfTypeName(declaredTypeName)[0] || "object") : null, loadOptions, poppedOutPropValueItemTextPositions[i]));
                        else
                            objNode = VDFLoader.ToVDFNode(vdfFile, declaredTypeName != null ? (VDF.GetGenericParametersOfTypeName(declaredTypeName)[0] || "object") : null, loadOptions, poppedOutPropValueItemTextPositions[0]);
                        lineInfo.fromLinePoppedOutGroupCount++;
                        dataIsPoppedOut = true;
                    } else
                        livePropAddNode.baseValue = token.text;
                else if (token.type == 5 /* Data_PropName */)
                    livePropName = token.text;
                else if (token.type == 6 /* DataStartMarker */)
                    if (livePropName != null)
                        if (objTypeName && objTypeName.startsWith("Dictionary["))
                            livePropAddNode.SetProperty(livePropName, VDFLoader.ToVDFNode(vdfFile, VDF.GetGenericParametersOfTypeName(objTypeName)[0], loadOptions, parser.nextCharPos, lineInfo));
                        else
                            livePropAddNode.SetProperty(livePropName, VDFLoader.ToVDFNode(vdfFile, livePropAddNodeTypeInfo != null && livePropAddNodeTypeInfo.propInfoByName[livePropName] ? livePropAddNodeTypeInfo.propInfoByName[livePropName].propVTypeName : null, loadOptions, parser.nextCharPos, lineInfo));
                    else
                        livePropAddNode = VDFLoader.ToVDFNode(vdfFile, declaredTypeName != null ? (VDF.GetGenericParametersOfTypeName(declaredTypeName)[0] || "object") : "List[object]", loadOptions, parser.nextCharPos, lineInfo);
                else if (token.type == 9 /* DataEndMarker */ && livePropName != null)
                    livePropName = null;
                else if (token.type == 10 /* LineBreak */)
                    break;
            }
            if (token.type == 6 /* DataStartMarker */)
                depth++;
        }

        // if live-prop-add-node is not obj itself, and block wasn't empty, and data is in-line, (meaning we're adding the items as we pass their last char), add final item
        if (livePropAddNode != objNode && parser.tokens.filter(function (token) {
            return [6 /* DataStartMarker */, 8 /* Data_BaseValue */, 7 /* ItemSeparator */].contains(token.type);
        }).length && !dataIsPoppedOut)
            objNode.PushItem(livePropAddNode);

        return objNode;
    };

    VDFLoader.FindNextDepthXCharYPos = function (vdfFile, searchStartPos, targetDepth, ch, depthStartChar, depthEndChar) {
        var depth = 0;
        for (var i = searchStartPos; i < vdfFile.length && depth >= 0; i++)
            if (vdfFile[i] == depthStartChar)
                depth++;
            else if (vdfFile[i] == ch && depth == targetDepth)
                return i;
            else if (vdfFile[i] == depthEndChar)
                depth--;
        return -1;
    };
    VDFLoader.FindNextDepthXItemSeparatorCharPos = function (vdfFile, searchStartPos, targetDepth) {
        var depth = 0;
        var parser = new VDFTokenParser(vdfFile, searchStartPos);
        while (parser.MoveNextToken() && depth >= 0)
            if (parser.tokens[parser.tokens.length - 1].type == 6 /* DataStartMarker */)
                depth++;
            else if (parser.tokens[parser.tokens.length - 1].type == 7 /* ItemSeparator */ && depth == targetDepth)
                return parser.nextCharPos - 1;
            else if (parser.tokens[parser.tokens.length - 1].type == 9 /* DataEndMarker */) {
                depth--;
                if (depth < 0)
                    break;
            }
        return -1;
    };
    VDFLoader.FindIndentDepthOfLineContainingCharPos = function (vdfFile, charPos) {
        var lineIndentDepth = 0;
        for (var i = charPos - 1; i > 0 && vdfFile[i] != '\n'; i--)
            if (vdfFile[i] == '\t')
                lineIndentDepth++;
        return lineIndentDepth;
    };
    VDFLoader.FindNextLineBreakCharPos = function (vdfFile, searchStartPos) {
        for (var i = searchStartPos; i < vdfFile.length; i++)
            if (vdfFile[i] == '\n')
                return i;
        return -1;
    };
    VDFLoader.FindPoppedOutChildTextPositions = function (vdfFile, parentIndentDepth, searchStartPos, poppedOutChildDataIndex) {
        var result = new Array();

        var poppedOutChildDatasReached = 0;
        var indentsOnThisLine = 0;
        for (var i = searchStartPos; i < vdfFile.length; i++) {
            var ch = vdfFile[i];
            if (ch == '\n')
                indentsOnThisLine = 0;
            else if (ch == '\t')
                indentsOnThisLine++;
            else if (indentsOnThisLine == parentIndentDepth + 1) {
                if (poppedOutChildDatasReached == 0 || ch == '#')
                    poppedOutChildDatasReached++;
                if (poppedOutChildDatasReached == poppedOutChildDataIndex + 1)
                    result.push(i);
                if (poppedOutChildDatasReached > poppedOutChildDataIndex + 1)
                    break;

                var nextLineBreakCharPos = VDFLoader.FindNextLineBreakCharPos(vdfFile, i);
                if (nextLineBreakCharPos != -1)
                    i = nextLineBreakCharPos - 1; // we only care about the tabs, and the first non-tab char; so skip to next line, once we process first non-tab char
                else
                    break;
            } else if (indentsOnThisLine <= parentIndentDepth)
                break;
        }

        return result;
    };
    return VDFLoader;
})();
//# sourceMappingURL=VDFLoader.js.map
