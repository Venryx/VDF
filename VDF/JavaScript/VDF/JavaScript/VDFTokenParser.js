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
    VDFTokenType[VDFTokenType["Indent"] = 13] = "Indent";
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
    function VDFTokenParser() {
    }
    VDFTokenParser.ParseTokens = function (text, postProcessTokens) {
        if (typeof postProcessTokens === "undefined") { postProcessTokens = true; }
        text = (text || "").replace(/\r\n/, "\n");

        var result = new List("VDFToken");

        var inLiteralMarkers = false;
        var currentTokenFirstCharPos = 0;
        var currentTokenType = 0 /* None */;
        var currentTokenTextBuilder = new StringBuilder();
        for (var i = 0; i < text.length && currentTokenType == 0 /* None */; i++) {
            var lastChar = i - 1 >= 0 ? text[i - 1] : null;
            var ch = text[i];
            var nextChar = i + 1 < text.length ? text[i + 1] : null;
            var nextNextChar = i + 2 < text.length ? text[i + 2] : null;
            var nextNextNextChar = i + 3 < text.length ? text[i + 3] : null;

            var grabExtraCharsAsOwnAndSkipTheirProcessing = function (count, addToTokenTextBuilder) {
                if (addToTokenTextBuilder)
                    currentTokenTextBuilder.Append(text.substr(i + 1, count));
                i += count;
            };

            if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') {
                grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
                inLiteralMarkers = true;
            } else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) {
                grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
                currentTokenTextBuilder = new StringBuilder(VDFTokenParser.FinalizedDataStringToRaw(currentTokenTextBuilder.ToString()));
                inLiteralMarkers = false;
                currentTokenType = 9 /* DataBaseValue */; // cause the return of chars as DataBaseValue token
            } else
                currentTokenTextBuilder.Append(ch);

            if (inLiteralMarkers)
                continue;

            if (ch == '>')
                if (nextChar == '>') {
                    currentTokenType = 1 /* WiderMetadataEndMarker */;
                    grabExtraCharsAsOwnAndSkipTheirProcessing(1, true);
                } else
                    currentTokenType = 3 /* MetadataEndMarker */;
            else if (ch == '{')
                currentTokenType = 5 /* DataStartMarker */;
            else if (ch == '}')
                currentTokenType = 10 /* DataEndMarker */;
            else if (ch == ':')
                currentTokenType = 6 /* PoppedOutDataStartMarker */;
            else if (ch == '^')
                currentTokenType = 7 /* PoppedOutDataEndMarker */;
            else if (ch == '\n')
                currentTokenType = 11 /* LineBreak */;
            else if (ch == ';' && nextChar == ';') {
                currentTokenType = 12 /* InLineComment */;
                var newNextCharPos = VDFTokenParser.FindNextLineBreakCharPos(text, i + 2);
                grabExtraCharsAsOwnAndSkipTheirProcessing((newNextCharPos != -1 ? newNextCharPos + 1 : text.length) - (i + 1), true);
            } else if (ch == '\t')
                currentTokenType = 13 /* Indent */;
            else if (ch == '|')
                currentTokenType = 8 /* ItemSeparator */;
            else if (nextChar == '>')
                currentTokenType = 2 /* MetadataBaseValue */;
            else if (nextChar == '{' || nextChar == ':')
                currentTokenType = 4 /* DataPropName */;
            else if (nextChar == '}' || nextChar == ':' || nextChar == '|' || (nextChar == ';' && nextNextChar == ';') || nextChar == '\n' || nextChar == null)
                currentTokenType = 9 /* DataBaseValue */;

            if (currentTokenType != 0 /* None */) {
                result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count, currentTokenTextBuilder.ToString()));

                currentTokenFirstCharPos = i + 1;
                currentTokenType = 0 /* None */;
                currentTokenTextBuilder.Clear();
            }
        }

        if (postProcessTokens)
            VDFTokenParser.PostProcessTokens(result);

        return result;
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

    VDFTokenParser.PostProcessTokens = function (tokens) {
        // maybe temp
        tokens.Insert(0, new VDFToken(5 /* DataStartMarker */, -1, -1, "{"));
        tokens.Add(new VDFToken(10 /* DataEndMarker */, 0, 0, "}"));

        for (var i = 0; i < tokens.Count; i++) {
            var token = tokens[i];
            if ([12 /* InLineComment */].indexOf(token.type) != -1)
                tokens.RemoveAt(i--);
        }

        // pass 1: add brackets surrounding inline-list items
        // ----------
        var depth_base = 0;
        var line_indentsReached = 0;
        var depthStartMarkers = new Dictionary("number", "VDFToken");
        var depthsOfChildrenData = new List("number");
        for (var i = 0; i < tokens.Count; i++) {
            var token = tokens[i];
            if (token.type == 5 /* DataStartMarker */)
                depth_base++;
            else if (token.type == 10 /* DataEndMarker */)
                depth_base--;
            else if (token.type == 13 /* Indent */)
                line_indentsReached++;
            else if (token.type == 11 /* LineBreak */)
                line_indentsReached = 0;
            var depth = depth_base + line_indentsReached;

            if (token.type == 5 /* DataStartMarker */) {
                if (token != null)
                    depthStartMarkers.Set(depth, token);
            } else if (token.type == 10 /* DataEndMarker */) {
                if (depthsOfChildrenData.Contains(depth + 1)) {
                    var firstInDepthTokenIndex = depthStartMarkers.ContainsKey(depth + 1) ? tokens.indexOf(depthStartMarkers.Get(depth + 1)) + 1 : 0;
                    var itemFirstTokenIndex = firstInDepthTokenIndex;
                    if (tokens[firstInDepthTokenIndex].type == 1 /* WiderMetadataEndMarker */)
                        itemFirstTokenIndex = firstInDepthTokenIndex + 1;
                    else if (tokens.Count > firstInDepthTokenIndex + 1 && tokens[firstInDepthTokenIndex + 1].type == 1 /* WiderMetadataEndMarker */)
                        itemFirstTokenIndex = firstInDepthTokenIndex + 2;
                    if (itemFirstTokenIndex < tokens.Count - 1) {
                        tokens.Insert(itemFirstTokenIndex, new VDFToken(5 /* DataStartMarker */, -1, -1, "{")); // (position and index are fixed later)
                        i++; // increment, since we added the token above

                        tokens.Insert(i++, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // (position and index are fixed later)
                        depthsOfChildrenData.Remove(depth_base + 1);
                    }
                }
            } else if (token.type == 1 /* WiderMetadataEndMarker */) {
                var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
                if (lastToken == null || lastToken.type != 2 /* MetadataBaseValue */ || lastToken.text.indexOf(",") == -1)
                    depthsOfChildrenData.Add(depth);
            } else if (token.type == 8 /* ItemSeparator */) {
                tokens.Insert(i++, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // (position and index are fixed later)
                tokens.Insert(++i, new VDFToken(5 /* DataStartMarker */, -1, -1, "{")); // (position and index are fixed later)
                depthsOfChildrenData.Add(depth);
            }
        }

        // pass 2: add inferred indent-block data-[start/end]-marker tokens
        // ----------
        var lastLine_indentsReached = 0;
        line_indentsReached = 0;
        var line_firstNonIndentCharReached = false;
        for (var i = 0; i < tokens.Count; i++) {
            var token = tokens[i];
            if (token.type == 13 /* Indent */)
                line_indentsReached++;
            else if (token.type == 11 /* LineBreak */) {
                lastLine_indentsReached = line_indentsReached;

                line_firstNonIndentCharReached = false;
                line_indentsReached = 0;
            } else if (!line_firstNonIndentCharReached) {
                line_firstNonIndentCharReached = true;
                if (i != 0) {
                    if (line_indentsReached > lastLine_indentsReached) {
                        tokens.Insert(i++, new VDFToken(5 /* DataStartMarker */, -1, -1, "{")); // add inferred indent-block data-start-marker token (for indent-block)

                        var tokenBeforeLineBreak = tokens[i - line_indentsReached - 3];
                        if (tokenBeforeLineBreak.type == 1 /* WiderMetadataEndMarker */) {
                            var tokenBeforeLineBreak_previous = tokens[i - line_indentsReached - 3 - 1];
                            if (tokenBeforeLineBreak_previous.type == 2 /* MetadataBaseValue */) {
                                tokens.Remove(tokenBeforeLineBreak_previous); //RemoveAt(i - line_indentsReached - 2);
                                tokens.Insert(i - 1, tokenBeforeLineBreak_previous);
                            }
                            tokens.Remove(tokenBeforeLineBreak); //RemoveAt(i - line_indentsReached - 2);
                            tokens.Insert(i - 1, tokenBeforeLineBreak);
                        }
                    } else {
                        for (var i2 = lastLine_indentsReached; i2 > line_indentsReached; i2--) {
                            tokens.Insert(i++, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // one for lower-indent-block last-item
                            tokens.Insert(i++, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // one for lower-indent-block
                        }
                        if ([7 /* PoppedOutDataEndMarker */, 10 /* DataEndMarker */].indexOf(token.type) == -1)
                            tokens.Insert(i++, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // one for current-indent-block last-item
                    }

                    if ([7 /* PoppedOutDataEndMarker */, 10 /* DataEndMarker */].indexOf(token.type) == -1)
                        tokens.Insert(i++, new VDFToken(5 /* DataStartMarker */, -1, -1, "{")); // add inferred indent-block data-start-marker token (for item)
                }
            }
        }

        for (var i = line_indentsReached; i > 0; i--) {
            tokens.Insert(tokens.Count, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // one for lower-indent-block last-item
            tokens.Insert(tokens.Count, new VDFToken(10 /* DataEndMarker */, -1, -1, "}")); // one for lower-indent-block
        }

        for (var i = 0; i < tokens.Count; i++) {
            var token = tokens[i];
            if ([6 /* PoppedOutDataStartMarker */, 7 /* PoppedOutDataEndMarker */, 11 /* LineBreak */, 13 /* Indent */, 8 /* ItemSeparator */].indexOf(token.type) != -1)
                tokens.RemoveAt(i--);
        }

        // maybe temp
        tokens.RemoveAt(0);
        tokens.RemoveAt(tokens.Count - 1);

        // pass 4: fix token position-and-index properties
        // ----------
        VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
    };
    VDFTokenParser.RefreshTokenPositionAndIndexProperties = function (tokens) {
        var textProcessedLength = 0;
        for (var i = 0; i < tokens.Count; i++) {
            var token = tokens[i];
            token.position = textProcessedLength;
            token.index = i;
            textProcessedLength += token.text.length;
        }
    };
    return VDFTokenParser;
})();
//# sourceMappingURL=VDFTokenParser.js.map
