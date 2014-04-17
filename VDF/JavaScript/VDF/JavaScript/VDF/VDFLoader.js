var VDFLoadOptions = (function () {
    function VDFLoadOptions() {
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

        var depth = 0;
        var sharedData = { poppedOutPropValueCount: 0 };
        var livePropName = null;
        var livePropValueNode = null;
        var lastMetadata_type = null;
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
                if ((lastToken == null || lastToken.type == 9 /* ItemSeparator */) && token.type == 9 /* ItemSeparator */)
                    objNode.items.push(new VDFNode("", lastMetadata_type));
                if (token.type == 9 /* ItemSeparator */ && (parser.nextCharPos >= vdfFile.length || vdfFile[parser.nextCharPos] == '}' || vdfFile[parser.nextCharPos] == '\n'))
                    objNode.items.push(new VDFNode(""));

                if (token.type == 4 /* MetadataStartMarker */ || token.type == 2 /* SpecialMetadataStartMarker */)
                    lastMetadataStartToken = token.type;
                else if (token.type == 5 /* Metadata_BaseValue */) {
                    if (objNode.metadata_type == null && (lastMetadataStartToken == 2 /* SpecialMetadataStartMarker */ || (!token.text.startsWith("List[") && !token.text.startsWith("Dictionary["))))
                        objNode.metadata_type = token.text;
                    else
                        lastMetadata_type = token.text; //Type.GetType(vdfToken.text);
                } else if (token.type == 10 /* Data_BaseValue */) {
                    if (token.text == "#") {
                        //objNode.children.Add(token.text); // don't need to load marker itself as child, as it was just to let the person change the visual layout in-file
                        var poppedOutPropValueItemTextPositions = VDFLoader.FindPoppedOutChildDataTextPositions(vdfFile, VDFLoader.FindIndentDepthOfLineContainingCharPos(vdfFile, firstObjTextCharPos), VDFLoader.FindNextLineBreakCharPos(vdfFile, parser.nextCharPos) + 1, parentSharedData.poppedOutPropValueCount);
                        for (var key in poppedOutPropValueItemTextPositions)
                            objNode.items.push(VDFLoader.ToVDFNode(vdfFile, loadOptions, poppedOutPropValueItemTextPositions[key], sharedData));
                        parentSharedData.poppedOutPropValueCount++;
                    } else
                        objNode.items.push(new VDFNode(token.text, lastMetadata_type));
                } else if (token.type == 7 /* Data_PropName */) {
                    livePropName = token.text;
                    livePropValueNode = new VDFNode();
                } else if (token.type == 8 /* DataStartMarker */)
                    livePropValueNode = VDFLoader.ToVDFNode(vdfFile, loadOptions, parser.nextCharPos, sharedData);
                else if (token.type == 11 /* DataEndMarker */) {
                    if (livePropName != null) {
                        //if (livePropValueNode.items.Count > 0 || livePropValueNode.properties.Count > 0) // only add properties if the property-value node has items or properties of its own (i.e. data)
                        objNode.properties.set(livePropName, livePropValueNode);
                        livePropName = null;
                        livePropValueNode = null;
                    } else
                        objNode.items.push(livePropValueNode);
                } else if (token.type == 12 /* LineBreak */)
                    break;
            }
            if (token.type == 8 /* DataStartMarker */)
                depth++;
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
