var VDFTokenType;
(function (VDFTokenType) {
    VDFTokenType[VDFTokenType["None"] = 0] = "None";
    VDFTokenType[VDFTokenType["PoppedOutNodeMarker"] = 1] = "PoppedOutNodeMarker";
    VDFTokenType[VDFTokenType["WiderMetadataEndMarker"] = 2] = "WiderMetadataEndMarker";
    VDFTokenType[VDFTokenType["Metadata_BaseValue"] = 3] = "Metadata_BaseValue";
    VDFTokenType[VDFTokenType["MetadataEndMarker"] = 4] = "MetadataEndMarker";

    //LiteralMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
    VDFTokenType[VDFTokenType["Data_PropName"] = 5] = "Data_PropName";
    VDFTokenType[VDFTokenType["DataStartMarker"] = 6] = "DataStartMarker";
    VDFTokenType[VDFTokenType["ItemSeparator"] = 7] = "ItemSeparator";
    VDFTokenType[VDFTokenType["Data_BaseValue"] = 8] = "Data_BaseValue";
    VDFTokenType[VDFTokenType["DataEndMarker"] = 9] = "DataEndMarker";
    VDFTokenType[VDFTokenType["LineBreak"] = 10] = "LineBreak";
    VDFTokenType[VDFTokenType["InLineComment"] = 11] = "InLineComment";
})(VDFTokenType || (VDFTokenType = {}));
var VDFToken = (function () {
    function VDFToken(type, text) {
        this.type = type;
        this.text = text;
    }
    return VDFToken;
})();
var VDFTokenParser = (function () {
    function VDFTokenParser(vdf, firstCharPos) {
        this.vdf = vdf;
        this.nextCharPos = firstCharPos;
        this.tokens = new Array();
    }
    VDFTokenParser.prototype.MoveNextToken = function () {
        var tokenType = 0 /* None */;
        var tokenTextBuilder = new StringBuilder();

        var inLiteralMarkers = false;

        var i = this.nextCharPos;
        for (; i < this.vdf.length && tokenType == 0 /* None */; i++) {
            var lastChar = i > 0 ? this.vdf[i - 1] : null;
            var ch = this.vdf[i];
            var nextChar = i < this.vdf.length - 1 ? this.vdf[i + 1] : null;
            var nextNextChar = i < this.vdf.length - 2 ? this.vdf[i + 2] : null;

            if (lastChar != '@' && ch == '@' && nextChar == '@' && (!inLiteralMarkers || nextNextChar == '}' || nextNextChar == '\n')) {
                tokenTextBuilder = new StringBuilder(VDFTokenParser.FinalizedDataStringToRaw(tokenTextBuilder.ToString()));
                inLiteralMarkers = !inLiteralMarkers;
                i++; // increment index by one extra, so as to have the next char processed be the first char after literal-marker
                if (!inLiteralMarkers)
                    tokenType = 8 /* Data_BaseValue */;
                continue;
            }
            tokenTextBuilder.Append(ch);
            if (inLiteralMarkers)
                continue;

            if (ch == '>')
                if (nextChar == '>') {
                    tokenType = 2 /* WiderMetadataEndMarker */;
                    i++;
                } else
                    tokenType = 4 /* MetadataEndMarker */;
            else if (ch == '>') {
                if (nextChar == '>') {
                    tokenType = 2 /* WiderMetadataEndMarker */;
                    i++;
                } else
                    tokenType = 4 /* MetadataEndMarker */;
            } else if (ch == '{')
                tokenType = 6 /* DataStartMarker */;
            else if (ch == '}')
                tokenType = 9 /* DataEndMarker */;
            else {
                if (ch == '\n')
                    tokenType = 10 /* LineBreak */;
                else if ((lastChar == null || lastChar == '\n') && ch == '/' && nextChar == '/') {
                    tokenType = 11 /* InLineComment */;
                    i = VDFTokenParser.FindNextLineBreakCharPos(this.vdf, i + 2); // since rest of line is comment, skip to first char of next line
                } else if (ch == '#' && lastChar == '\t')
                    tokenType = 1 /* PoppedOutNodeMarker */;
                else if (ch == '|')
                    tokenType = 7 /* ItemSeparator */;
                else if (nextChar == '>')
                    tokenType = 3 /* Metadata_BaseValue */;
                else if (nextChar == '{')
                    tokenType = 5 /* Data_PropName */;
                else if (nextChar == '}' || nextChar == '|' || nextChar == '\n' || nextChar == null)
                    tokenType = 8 /* Data_BaseValue */;
            }
        }
        this.nextCharPos = i;

        var token = tokenType != 0 /* None */ ? new VDFToken(tokenType, tokenTextBuilder.ToString()) : null;
        if (token != null)
            this.tokens.push(token);
        return token != null;
    };

    VDFTokenParser.prototype.PeekNextToken = function () {
        var oldPos = this.nextCharPos;
        var oldTokenCount = this.tokens.length;
        this.MoveNextToken();
        this.nextCharPos = oldPos;
        if (this.tokens.length > oldTokenCount)
            return this.tokens[this.tokens.length - 1];
        return null;
    };

    VDFTokenParser.FindNextLineBreakCharPos = function (vdfFile, searchStartPos) {
        for (var i = searchStartPos; i < vdfFile.length; i++)
            if (vdfFile[i] == '\n')
                return i;
        return -1;
    };

    VDFTokenParser.FinalizedDataStringToRaw = function (finalizedDataStr) {
        var result = finalizedDataStr;
        if (finalizedDataStr.contains("}")) {
            if ((result[result.length - 2] == '@' || result[result.length - 2] == '|') && result.endsWith("|"))
                result = result.substring(0, result.length - 1); // chop off last char, as it was just added by the serializer for separation
            result = result.replace(/@@@(?=\n|}|$)/g, "@@"); // remove extra '@' char added to all troublesome (before-end-of-line-or-end-bracket-or-end-of-string) two-at-signs char-segments
        }
        return result;
    };
    return VDFTokenParser;
})();
//# sourceMappingURL=VDFTokenParser.js.map
