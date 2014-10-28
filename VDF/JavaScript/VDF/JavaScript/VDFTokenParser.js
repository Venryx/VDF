var VDFTokenType;
(function (VDFTokenType) {
    VDFTokenType[VDFTokenType["None"] = 0] = "None";
    VDFTokenType[VDFTokenType["WiderMetadataEndMarker"] = 1] = "WiderMetadataEndMarker";
    VDFTokenType[VDFTokenType["MetadataBaseValue"] = 2] = "MetadataBaseValue";
    VDFTokenType[VDFTokenType["MetadataEndMarker"] = 3] = "MetadataEndMarker";

    //LiteralStartMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
    //LiteralEndMarker
    VDFTokenType[VDFTokenType["DataPropName"] = 4] = "DataPropName";
    VDFTokenType[VDFTokenType["DataStartMarker"] = 5] = "DataStartMarker";
    VDFTokenType[VDFTokenType["PoppedOutDataStartMarker"] = 6] = "PoppedOutDataStartMarker";
    VDFTokenType[VDFTokenType["PoppedOutDataEndMarker"] = 7] = "PoppedOutDataEndMarker";
    VDFTokenType[VDFTokenType["ItemSeparator"] = 8] = "ItemSeparator";
    VDFTokenType[VDFTokenType["DataBaseValue"] = 9] = "DataBaseValue";
    VDFTokenType[VDFTokenType["DataEndMarker"] = 10] = "DataEndMarker";
    VDFTokenType[VDFTokenType["LineBreak"] = 11] = "LineBreak";
    VDFTokenType[VDFTokenType["InLineComment"] = 12] = "InLineComment";
})(VDFTokenType || (VDFTokenType = {}));
var VDFToken = (function () {
    function VDFToken(type, position, index, text) {
        this.type = type;
        this.position = position;
        this.index = index;
        this.text = text;
    }
    return VDFToken;
})();
var VDFTokenParser = (function () {
    function VDFTokenParser(text, firstCharPos) {
        text = (text || "").replace(/\r\n/g, "\n");

        this.text = text;
        this.nextCharPos = firstCharPos;
        this.tokens = new List("VDFToken");
    }
    VDFTokenParser.prototype.MoveNextToken = function () {
        var _this = this;
        var tokenType = 0 /* None */;
        var tokenTextBuilder = new StringBuilder();

        var inLiteralMarkers = false;

        var firstCharPos = this.nextCharPos;
        for (var i = this.nextCharPos; i < this.text.length && tokenType == 0 /* None */; i++, this.nextCharPos++) {
            var lastChar = i - 1 >= 0 ? this.text[i - 1] : null;
            var ch = this.text[i];
            var nextChar = i + 1 < this.text.length ? this.text[i + 1] : null;
            var nextNextChar = i + 2 < this.text.length ? this.text[i + 2] : null;
            var nextNextNextChar = i + 3 < this.text.length ? this.text[i + 3] : null;

            var grabExtraCharsAsOwnAndSkipTheirProcessing = function (count, addToTokenTextBuilder) {
                if (addToTokenTextBuilder)
                    tokenTextBuilder.Append(_this.text.substr(i + 1, count));
                i += count;
                _this.nextCharPos += count;
            };

            if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') {
                grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
                inLiteralMarkers = true;
            } else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) {
                grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
                tokenTextBuilder = new StringBuilder(VDFTokenParser.FinalizedDataStringToRaw(tokenTextBuilder.ToString()));
                inLiteralMarkers = false;
                tokenType = 9 /* DataBaseValue */; // cause the return of chars as DataBaseValue token
            } else
                tokenTextBuilder.Append(ch);

            if (inLiteralMarkers)
                continue;

            if (ch == '>')
                if (nextChar == '>') {
                    tokenType = 1 /* WiderMetadataEndMarker */;
                    grabExtraCharsAsOwnAndSkipTheirProcessing(1, true);
                } else
                    tokenType = 3 /* MetadataEndMarker */;
            else if (ch == '{')
                tokenType = 5 /* DataStartMarker */;
            else if (ch == '}')
                tokenType = 10 /* DataEndMarker */;
            else if (ch == ':')
                tokenType = 6 /* PoppedOutDataStartMarker */;
            else if (ch == '^')
                tokenType = 7 /* PoppedOutDataEndMarker */;
            else if (ch == '\n')
                tokenType = 11 /* LineBreak */;
            else if (ch == ';' && nextChar == ';') {
                tokenType = 12 /* InLineComment */;
                var newNextCharPos = VDFTokenParser.FindNextLineBreakCharPos(this.text, i + 2);
                grabExtraCharsAsOwnAndSkipTheirProcessing((newNextCharPos != -1 ? newNextCharPos + 1 : this.text.length) - (i + 1), true);
            } else if (ch == '|')
                tokenType = 8 /* ItemSeparator */;
            else if (nextChar == '>')
                tokenType = 2 /* MetadataBaseValue */;
            else if (nextChar == '{' || nextChar == ':')
                tokenType = 4 /* DataPropName */;
            else if (nextChar == '}' || nextChar == ':' || nextChar == '|' || (nextChar == ';' && nextNextChar == ';') || nextChar == '\n' || nextChar == null)
                tokenType = 9 /* DataBaseValue */;
        }

        if (tokenType == 0 /* None */)
            return false;

        var token = new VDFToken(tokenType, firstCharPos, this.tokens.Count, tokenTextBuilder.ToString());
        this.tokens.Add(token);
        return true;
    };

    VDFTokenParser.FindNextLineBreakCharPos = function (text, searchStartPos) {
        for (var i = searchStartPos; i < text.length; i++)
            if (text[i] == '\n')
                return i;
        return -1;
    };

    VDFTokenParser.FinalizedDataStringToRaw = function (finalizedDataStr) {
        var result = finalizedDataStr;
        if ((result[result.length - 2] == '@' || result[result.length - 2] == '|') && result.lastIndexOf("|") == result.length - 1)
            result = result.substr(0, result.length - 1); // chop off last char, as it was just added by the serializer for separation
        result = result.replace(/@(@{2,})/g, "$1"); // chop off last '@' from in-data '@@...' strings (to undo '@@...' string escaping)
        return result;
    };
    return VDFTokenParser;
})();
//# sourceMappingURL=VDFTokenParser.js.map
