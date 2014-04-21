var VDFLoadOptions = (function () {
    function VDFLoadOptions(loadUnknownTypesAsAnonymous) {
        if (typeof loadUnknownTypesAsAnonymous === "undefined") { loadUnknownTypesAsAnonymous = false; }
        this.loadUnknownTypesAsAnonymous = loadUnknownTypesAsAnonymous;
    }
    return VDFLoadOptions;
})();

var VDFLoader = (function () {
    function VDFLoader() {
    }
    VDFLoader.ToVDFNode = function (vdfFile, loadOptions, firstObjTextCharPos, parentSharedData) {
        if (typeof firstObjTextCharPos === "undefined") { firstObjTextCharPos = 0; }
        vdfFile = vdfFile.replace(/\r\n/g, "\n");
        if (!loadOptions)
            loadOptions = new VDFLoadOptions();

        var objNode = new VDFNode();

        var sharedData = { poppedOutPropValueCount: 0 };
        var depth = 0;
        var liveItemNode = new VDFNode();
        var liveItemPropName = null;
        var liveItemPropValueNode = null;
        var lastMetadataStartToken = 0 /* None */;

        var parser = new VDFTokenParser(vdfFile, firstObjTextCharPos);
        while (parser.GetNextToken() != null) {
            var lastToken = parser.tokens.length > 1 ? parser.tokens[parser.tokens.length - 2] : null;
            var token = parser.tokens.last();
            if (token.type == 11 /* DataEndMarker */)
                depth--;

            if (depth < 0)
                break;
            if (depth == 0) {
                if (token.type == 9 /* ItemSeparator */) {
                    if (liveItemNode.metadata_type == null && liveItemNode.baseValue == null && liveItemNode.items.length == 0 && liveItemNode.propertyCount == 0)
                        liveItemNode.baseValue = "";
                    objNode.PushItem(liveItemNode);
                    liveItemNode = new VDFNode();
                    if (parser.nextCharPos >= vdfFile.length || ['|', '}', '\n'].contains(vdfFile[parser.nextCharPos]))
                        liveItemNode.baseValue = "";
                }

                if (token.type == 4 /* MetadataStartMarker */ || token.type == 2 /* WiderMetadataStartMarker */)
                    lastMetadataStartToken = token.type;
                else if (token.type == 5 /* Metadata_BaseValue */)
                    if (lastMetadataStartToken == 2 /* WiderMetadataStartMarker */)
                        objNode.metadata_type = token.text;
                    else
                        liveItemNode.metadata_type = token.text;
                else if (token.type == 10 /* Data_BaseValue */)
                    if (token.text == "#") {
                        //liveItemNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
                        var poppedOutPropValueItemTextPositions = VDFLoader.FindPoppedOutChildDataTextPositions(vdfFile, VDFLoader.FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), VDFLoader.FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentSharedData.poppedOutPropValueCount);
                        for (var i in poppedOutPropValueItemTextPositions)
                            objNode.PushItem(VDFLoader.ToVDFNode(vdfFile, loadOptions, poppedOutPropValueItemTextPositions[i], sharedData));
                        parentSharedData.poppedOutPropValueCount++;
                    } else
                        liveItemNode.baseValue = token.text;
                else if (token.type == 7 /* Data_PropName */) {
                    liveItemPropName = token.text;
                    liveItemPropValueNode = new VDFNode();
                } else if (token.type == 8 /* DataStartMarker */)
                    if (liveItemPropName != null)
                        liveItemPropValueNode = VDFLoader.ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, sharedData);
                    else {
                        if (lastToken != null && lastToken.type == 11 /* DataEndMarker */)
                            objNode.PushItem(liveItemNode);
                        liveItemNode = VDFLoader.ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, sharedData);
                    }
                else if (token.type == 11 /* DataEndMarker */) {
                    if (liveItemPropName != null) {
                        //if (livePropValueNode.items.length > 0 || livePropValueNode.propertyCount > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
                        liveItemNode.SetProperty(liveItemPropName, liveItemPropValueNode);
                        liveItemPropName = null;
                        liveItemPropValueNode = null;
                    } else if (liveItemPropValueNode != null)
                        liveItemNode.PushItem(liveItemPropValueNode);
                } else if (token.type == 12 /* LineBreak */)
                    break;
            }
            if (token.type == 8 /* DataStartMarker */)
                depth++;
        }

        // add final item, if not yet added
        if (liveItemNode.metadata_type != null || liveItemNode.baseValue != null || liveItemNode.items.length > 0 || liveItemNode.propertyCount > 0) {
            if (liveItemNode.metadata_type == null && liveItemNode.baseValue == null && liveItemNode.items.length == 0 && liveItemNode.propertyCount == 0)
                liveItemNode.baseValue = "";
            objNode.PushItem(liveItemNode);
        }

        // note; slightly messy, but seems the best practically; if only one value as obj's data, and obj does not have wider-metadata (i.e. isn't List or Dictionary), then include it both as obj's value and as its solitary item's value
        if (objNode.items.length == 1) {
            objNode.baseValue = objNode.items[0].baseValue;
            if (objNode.items[0].items.length == 0) {
                objNode.metadata_type = objNode.items[0].metadata_type;
                for (var propName in objNode.items[0].properties)
                    objNode.SetProperty(propName, objNode.items[0][propName]);
            }
        }

        return objNode;
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
    VDFLoader.FindPoppedOutChildDataTextPositions = function (vdfFile, parentIndentDepth, searchStartPos, poppedOutChildDataIndex) {
        var result = new Array();

        var poppedOutChildDatasReached = 0;
        var indentsOnThisLine = 0;
        for (var i = searchStartPos; i < vdfFile.length; i++) {
            var ch = vdfFile[i];
            if (ch == '\n')
                indentsOnThisLine = 0;
            else if (ch == '\t')
                indentsOnThisLine++;
            else {
                if (indentsOnThisLine == parentIndentDepth + 1) {
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
        }

        return result;
    };
    return VDFLoader;
})();
//# sourceMappingURL=VDFLoader.js.map
