var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define("VDFTokenParser", ["require", "exports", "VDFLoader", "VDF"], function (require, exports, VDFLoader_1, VDF_1) {
    "use strict";
    var VDFTokenType;
    (function (VDFTokenType) {
        //WiderMetadataEndMarker,
        //MetadataBaseValue,
        //LiteralStartMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
        //LiteralEndMarker
        //DataPropName,
        //DataStartMarker,
        //PoppedOutDataStartMarker,
        //PoppedOutDataEndMarker,
        //ItemSeparator,
        //DataBaseValue,
        //DataEndMarker,
        //Indent,
        // helper tokens for token-parser (or reader)
        VDFTokenType[VDFTokenType["LiteralStartMarker"] = 0] = "LiteralStartMarker";
        VDFTokenType[VDFTokenType["LiteralEndMarker"] = 1] = "LiteralEndMarker";
        VDFTokenType[VDFTokenType["StringStartMarker"] = 2] = "StringStartMarker";
        VDFTokenType[VDFTokenType["StringEndMarker"] = 3] = "StringEndMarker";
        VDFTokenType[VDFTokenType["InLineComment"] = 4] = "InLineComment";
        VDFTokenType[VDFTokenType["SpaceOrCommaSpan"] = 5] = "SpaceOrCommaSpan";
        VDFTokenType[VDFTokenType["None"] = 6] = "None";
        VDFTokenType[VDFTokenType["Tab"] = 7] = "Tab";
        VDFTokenType[VDFTokenType["LineBreak"] = 8] = "LineBreak";
        VDFTokenType[VDFTokenType["Metadata"] = 9] = "Metadata";
        VDFTokenType[VDFTokenType["MetadataEndMarker"] = 10] = "MetadataEndMarker";
        VDFTokenType[VDFTokenType["Key"] = 11] = "Key";
        VDFTokenType[VDFTokenType["KeyValueSeparator"] = 12] = "KeyValueSeparator";
        VDFTokenType[VDFTokenType["PoppedOutChildGroupMarker"] = 13] = "PoppedOutChildGroupMarker";
        VDFTokenType[VDFTokenType["Null"] = 14] = "Null";
        VDFTokenType[VDFTokenType["Boolean"] = 15] = "Boolean";
        VDFTokenType[VDFTokenType["Number"] = 16] = "Number";
        VDFTokenType[VDFTokenType["String"] = 17] = "String";
        VDFTokenType[VDFTokenType["ListStartMarker"] = 18] = "ListStartMarker";
        VDFTokenType[VDFTokenType["ListEndMarker"] = 19] = "ListEndMarker";
        VDFTokenType[VDFTokenType["MapStartMarker"] = 20] = "MapStartMarker";
        VDFTokenType[VDFTokenType["MapEndMarker"] = 21] = "MapEndMarker";
    })(VDFTokenType = exports.VDFTokenType || (exports.VDFTokenType = {}));
    var VDFToken = (function () {
        function VDFToken(type, position, index, text) {
            this.type = type;
            this.position = position;
            this.index = index;
            this.text = text;
        }
        return VDFToken;
    }());
    exports.VDFToken = VDFToken;
    var VDFTokenParser = (function () {
        function VDFTokenParser() {
        }
        VDFTokenParser.ParseTokens = function (text, options, parseAllTokens, postProcessTokens) {
            if (parseAllTokens === void 0) { parseAllTokens = false; }
            if (postProcessTokens === void 0) { postProcessTokens = true; }
            text = (text || "").replace(/\r\n/g, "\n"); // maybe temp
            options = options || new VDFLoader_1.VDFLoadOptions();
            var result = new VDF_1.List("VDFToken");
            var currentTokenFirstCharPos = 0;
            var currentTokenTextBuilder = new VDF_1.StringBuilder();
            var currentTokenType = VDFTokenType.None;
            var activeLiteralStartChars = null;
            var activeStringStartChar = null;
            var lastScopeIncreaseChar = null;
            var addNextCharToTokenText = true;
            var specialEnderChar = '№';
            text += specialEnderChar; // add special ender-char, so don't need to use Nullable for nextChar var
            var ch;
            var nextChar = text[0];
            for (var i = 0; i < text.length - 1; i++) {
                ch = nextChar;
                nextChar = text[i + 1];
                if (addNextCharToTokenText)
                    currentTokenTextBuilder.Append(ch);
                addNextCharToTokenText = true;
                if (activeLiteralStartChars != null) {
                    // if first char of literal-end-marker
                    if (ch == '>' && i + activeLiteralStartChars.length <= text.length && text.substr(i, activeLiteralStartChars.length) == activeLiteralStartChars.replace(/</g, ">")) {
                        if (parseAllTokens)
                            result.Add(new VDFToken(VDFTokenType.LiteralEndMarker, i, result.Count, activeLiteralStartChars.replace(/</g, ">"))); // (if this end-marker token is within a string, it'll come before the string token)
                        currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                        currentTokenFirstCharPos += activeLiteralStartChars.length; // don't count this inserted token text as part of main-token text
                        i += activeLiteralStartChars.length - 2; // have next char processed be the last char of literal-end-marker
                        addNextCharToTokenText = false; // but don't have it be added to the main-token text
                        if (text[i + 1 - activeLiteralStartChars.length] == '#')
                            currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                        activeLiteralStartChars = null;
                        nextChar = i < text.length - 1 ? text[i + 1] : specialEnderChar; // update after i-modification, since used for next loop's 'ch' value
                        continue;
                    }
                }
                else {
                    if (ch == '<' && nextChar == '<') {
                        activeLiteralStartChars = "";
                        while (i + activeLiteralStartChars.length < text.length && text[i + activeLiteralStartChars.length] == '<')
                            activeLiteralStartChars += "<";
                        if (parseAllTokens)
                            result.Add(new VDFToken(VDFTokenType.LiteralStartMarker, i, result.Count, activeLiteralStartChars));
                        currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                        currentTokenFirstCharPos += activeLiteralStartChars.length; // don't count this inserted token text as part of main-token text
                        i += activeLiteralStartChars.length - 1; // have next char processed be the one right after literal-start-marker
                        if (text[i + 1] == '#') {
                            currentTokenFirstCharPos++;
                            i++;
                        }
                        nextChar = i < text.length - 1 ? text[i + 1] : specialEnderChar; // update after i-modification, since used for next loop's 'ch' value
                        continue;
                    }
                    // else
                    {
                        if (activeStringStartChar == null) {
                            if (ch == '\'' || ch == '"') {
                                activeStringStartChar = ch;
                                if (parseAllTokens)
                                    result.Add(new VDFToken(VDFTokenType.StringStartMarker, i, result.Count, activeStringStartChar));
                                currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                                currentTokenFirstCharPos++; // don't count this inserted token text as part of main-token text
                                // special case; if string-start-marker for an empty string
                                if (ch == nextChar)
                                    result.Add(new VDFToken(VDFTokenType.String, currentTokenFirstCharPos, result.Count, ""));
                                continue;
                            }
                        }
                        else if (activeStringStartChar == ch) {
                            if (parseAllTokens)
                                result.Add(new VDFToken(VDFTokenType.StringEndMarker, i, result.Count, ch));
                            currentTokenTextBuilder.Remove(currentTokenTextBuilder.length - 1, 1); // remove current char from the main-token text
                            currentTokenFirstCharPos++; // don't count this inserted token text as part of main-token text
                            activeStringStartChar = null;
                            continue;
                        }
                    }
                }
                // if not in literal
                if (activeLiteralStartChars == null)
                    // if in a string
                    if (activeStringStartChar != null) {
                        // if last-char of string
                        if (activeStringStartChar == nextChar)
                            currentTokenType = VDFTokenType.String;
                    }
                    else {
                        var firstTokenChar = currentTokenTextBuilder.length == 1;
                        if (nextChar == '>')
                            currentTokenType = VDFTokenType.Metadata;
                        else if (nextChar == ':')
                            currentTokenType = VDFTokenType.Key;
                        else {
                            // at this point, all the options are mutually-exclusive (concerning the 'ch' value), so use a switch statement)
                            switch (ch) {
                                case '#':
                                    if (nextChar == '#' && firstTokenChar) {
                                        currentTokenTextBuilder = new VDF_1.StringBuilder(text.substr(i, (text.indexOf("\n", i + 1) != -1 ? text.indexOf("\n", i + 1) : text.length) - i));
                                        currentTokenType = VDFTokenType.InLineComment;
                                        i += currentTokenTextBuilder.length - 1; // have next char processed by the one right after comment (i.e. the line-break char)
                                        nextChar = i < text.length - 1 ? text[i + 1] : specialEnderChar; // update after i-modification, since used for next loop's 'ch' value
                                    }
                                    break;
                                case ' ':
                                case ',':
                                    if ((ch == ' ' || (options.allowCommaSeparators && ch == ','))
                                        && (nextChar != ' ' && (!options.allowCommaSeparators || nextChar != ','))
                                        && currentTokenTextBuilder.ToString().TrimStart(options.allowCommaSeparators ? [' ', ','] : [' ']).length == 0)
                                        currentTokenType = VDFTokenType.SpaceOrCommaSpan;
                                    break;
                                case '\t':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.Tab;
                                    break;
                                case '\n':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.LineBreak;
                                    break;
                                case '>':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.MetadataEndMarker;
                                    break;
                                case ':':
                                    //else if (nextNonSpaceChar == ':' && ch != ' ')
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.KeyValueSeparator;
                                    break;
                                case '^':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.PoppedOutChildGroupMarker;
                                    break;
                                case 'l':
                                    if (currentTokenTextBuilder.length == 4 && currentTokenTextBuilder.ToString() == "null" && (nextChar == null || !VDFTokenParser.charsAToZ.Contains(nextChar)))
                                        currentTokenType = VDFTokenType.Null;
                                    break;
                                case 'e':
                                    if ((currentTokenTextBuilder.length == 5 && currentTokenTextBuilder.ToString() == "false")
                                        || (currentTokenTextBuilder.length == 4 && currentTokenTextBuilder.ToString() == "true")) {
                                        currentTokenType = VDFTokenType.Boolean;
                                        break;
                                    }
                                /*else
                                    goto case '0';
                                break;*/
                                case '0':
                                case '1':
                                case '2':
                                case '3':
                                case '4':
                                case '5':
                                case '6':
                                case '7':
                                case '8':
                                case '9':
                                case '.':
                                case '-':
                                case '+': /*case 'e':*/
                                case 'E':
                                case 'y':
                                    if ((VDFTokenParser.chars0To9DotAndNegative.Contains(currentTokenTextBuilder.parts[0]) && currentTokenTextBuilder.parts[0].toLowerCase() != "e" // if first-char is valid as start of number
                                        && !VDFTokenParser.chars0To9DotAndNegative.Contains(nextChar) && nextChar != 'I' // and next-char is not valid as part of number
                                        && (lastScopeIncreaseChar == "[" || result.Count == 0 || result.Last().type == VDFTokenType.Metadata || result.Last().type == VDFTokenType.KeyValueSeparator))
                                        || ((currentTokenTextBuilder.length == 8 && currentTokenTextBuilder.ToString() == "Infinity") || (currentTokenTextBuilder.length == 9 && currentTokenTextBuilder.ToString() == "-Infinity")))
                                        currentTokenType = VDFTokenType.Number;
                                    break;
                                case '[':
                                    if (firstTokenChar) {
                                        currentTokenType = VDFTokenType.ListStartMarker;
                                        lastScopeIncreaseChar = ch;
                                    }
                                    break;
                                case ']':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.ListEndMarker;
                                    break;
                                case '{':
                                    if (firstTokenChar) {
                                        currentTokenType = VDFTokenType.MapStartMarker;
                                        lastScopeIncreaseChar = ch;
                                    }
                                    break;
                                case '}':
                                    if (firstTokenChar)
                                        currentTokenType = VDFTokenType.MapEndMarker;
                                    break;
                            }
                        }
                    }
                if (currentTokenType != VDFTokenType.None) {
                    if (parseAllTokens || (currentTokenType != VDFTokenType.InLineComment && currentTokenType != VDFTokenType.SpaceOrCommaSpan && currentTokenType != VDFTokenType.MetadataEndMarker))
                        result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count, currentTokenTextBuilder.ToString()));
                    currentTokenFirstCharPos = i + 1;
                    currentTokenTextBuilder.Clear();
                    currentTokenType = VDFTokenType.None;
                }
            }
            if (postProcessTokens)
                result = VDFTokenParser.PostProcessTokens(result, options);
            return result;
        };
        /*static FindNextNonXCharPosition(text: string, startPos: number, x: string) {
            for (var i = startPos; i < text.length; i++)
                if (text[i] != x)
                    return i;
            return -1;
        }*/
        /*static UnpadString(paddedString: string) {
            var result = paddedString;
            if (result.StartsWith("#"))
                result = result.substr(1); // chop off first char, as it was just added by the serializer for separation
            if (result.EndsWith("#"))
                result = result.substr(0, result.length - 1);
            return result;
        }*/
        /*static PostProcessTokens(tokens: List<VDFToken>, options: VDFLoadOptions): List<VDFToken> {
            // pass 1: update strings-before-key-value-separator-tokens to be considered keys, if that's enabled (one reason being, for JSON compatibility)
            // ----------
            
            if (options.allowStringKeys)
                for (var i = <any>0; i < tokens.Count; i++)
                    if (tokens[i].type == VDFTokenType.String && i + 1 < tokens.Count && tokens[i + 1].type == VDFTokenType.KeyValueSeparator)
                        tokens[i].type = VDFTokenType.Key;
    
            // pass 2: re-wrap popped-out-children with parent brackets/braces
            // ----------
    
            tokens.Add(new VDFToken(VDFTokenType.None, -1, -1, "")); // maybe temp: add depth-0-ender helper token
    
            var line_tabsReached = 0;
            var tabDepth_popOutBlockEndWrapTokens = new Dictionary<number, List<VDFToken>>("int", "List(VDFToken)");
            for (var i = <any>0; i < tokens.Count; i++) {
                var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
                var token = tokens[i];
                if (token.type == VDFTokenType.Tab)
                    line_tabsReached++;
                else if (token.type == VDFTokenType.LineBreak)
                    line_tabsReached = 0;
                else if (token.type == VDFTokenType.PoppedOutChildGroupMarker) {
                    if (lastToken.type == VDFTokenType.ListStartMarker || lastToken.type == VDFTokenType.MapStartMarker) { //lastToken.type != VDFTokenType.Tab)
                        var enderTokenIndex = i + 1;
                        while (enderTokenIndex < tokens.Count - 1 && tokens[enderTokenIndex].type != VDFTokenType.LineBreak && (tokens[enderTokenIndex].type != VDFTokenType.PoppedOutChildGroupMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.ListStartMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.MapStartMarker))
                            enderTokenIndex++;
                        // the wrap-group consists of the on-same-line text after the popped-out-child-marker (eg the "]}" in "{children:[^]}")
                        var wrapGroupTabDepth = tokens[enderTokenIndex].type == VDFTokenType.PoppedOutChildGroupMarker ? line_tabsReached - 1 : line_tabsReached;
                        tabDepth_popOutBlockEndWrapTokens.Set(wrapGroupTabDepth, tokens.GetRange(i + 1, enderTokenIndex - (i + 1)));
                        tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth)[0].index = i + 1; // update index
                        i = enderTokenIndex - 1; // have next token processed be the ender-token (^^[...] or line-break)
                    }
                    else if (lastToken.type == VDFTokenType.Tab) {
                        var wrapGroupTabDepth = lastToken.type == VDFTokenType.Tab ? line_tabsReached - 1 : line_tabsReached;
                        tokens.InsertRange(i, tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth));
                        tokens.RemoveRange(tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth)[0].index, tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth).Count); // index was updated when set put together
    
                        i -= tabDepth_popOutBlockEndWrapTokens.Get(wrapGroupTabDepth).Count + 1; // have next token processed be the first pop-out-block-end-wrap-token
                        tabDepth_popOutBlockEndWrapTokens.Remove(wrapGroupTabDepth);
                    }
                }
                else if (lastToken != null && (lastToken.type == VDFTokenType.LineBreak || lastToken.type == VDFTokenType.Tab || token.type == VDFTokenType.None)) {
                    if (token.type == VDFTokenType.None) // if depth-0-ender helper token
                        line_tabsReached = 0;
    
                    // if we have no popped-out content that we now need to wrap
                    if (tabDepth_popOutBlockEndWrapTokens.Count == 0) continue;
    
                    var maxTabDepth = -1;
                    for (var key in tabDepth_popOutBlockEndWrapTokens.Keys)
                        if (parseInt(key) > maxTabDepth)
                            maxTabDepth = parseInt(key);
                    for (var tabDepth = maxTabDepth; tabDepth >= line_tabsReached; tabDepth--) {
                        if (!tabDepth_popOutBlockEndWrapTokens.ContainsKey(tabDepth)) continue;
                        tokens.InsertRange(i, tabDepth_popOutBlockEndWrapTokens.Get(tabDepth));
                        tokens.RemoveRange(tabDepth_popOutBlockEndWrapTokens.Get(tabDepth)[0].index, tabDepth_popOutBlockEndWrapTokens.Get(tabDepth).Count); // index was updated when set put together
    
                        // old; maybe temp; fix for that tokens were not post-processed correctly for multiply-nested popped-out maps/lists
                        //VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
    
                        tabDepth_popOutBlockEndWrapTokens.Remove(tabDepth);
                    }
                }
            }
    
            tokens.RemoveAt(tokens.Count - 1); // maybe temp: remove depth-0-ender helper token
    
            // pass 3: remove all now-useless tokens
            // ----------
            
            var result = new List<VDFToken>(); //"VDFToken");
            for (let i in tokens.Indexes()) {
                let token = tokens[i];
                if (!(token.type == VDFTokenType.Tab || token.type == VDFTokenType.LineBreak || token.type == VDFTokenType.MetadataEndMarker || token.type == VDFTokenType.KeyValueSeparator || token.type == VDFTokenType.PoppedOutChildGroupMarker))
                    result.Add(token);
            }
    
            // pass 4: fix token position-and-index properties
            // ----------
    
            VDFTokenParser.RefreshTokenPositionAndIndexProperties(result); //tokens);
    
            //Console.Write(String.Join(" ", tokens.Select(a=>a.text).ToArray())); // temp; for testing
    
            return result;
        }*/
        VDFTokenParser.PostProcessTokens = function (origTokens, options) {
            var result = new VDF_1.List(); //"VDFToken");
            // 1: update strings-before-key-value-separator-tokens to be considered keys, if that's enabled (one reason being, for JSON compatibility)
            // 2: re-wrap popped-out-children with parent brackets/braces
            var groupDepth_tokenSetsToProcessAfterGroupEnds = new VDF_1.Dictionary("int", "List(VDFToken)");
            var tokenSetsToProcess = [];
            // maybe temp: add depth-0-ender helper token
            tokenSetsToProcess.push(new TokenSet(new VDF_1.List("VDFToken", new VDFToken(VDFTokenType.None, -1, -1, ""))));
            tokenSetsToProcess.push(new TokenSet(origTokens));
            while (tokenSetsToProcess.length > 0) {
                var tokenSet = tokenSetsToProcess[tokenSetsToProcess.length - 1];
                var tokens = tokenSet.tokens;
                var i = tokenSet.currentTokenIndex;
                var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
                var token = tokens[i];
                //var addThisToken = true;
                var addThisToken = !(token.type == VDFTokenType.Tab || token.type == VDFTokenType.LineBreak
                    || token.type == VDFTokenType.MetadataEndMarker || token.type == VDFTokenType.KeyValueSeparator
                    || token.type == VDFTokenType.PoppedOutChildGroupMarker
                    || token.type == VDFTokenType.None);
                if (token.type == VDFTokenType.String && i + 1 < tokens.Count && tokens[i + 1].type == VDFTokenType.KeyValueSeparator && options.allowStringKeys) {
                    token.type = VDFTokenType.Key;
                }
                //var line_tabsReached_old = line_tabsReached;
                if (token.type == VDFTokenType.Tab) {
                    tokenSet.line_tabsReached++;
                }
                else if (token.type == VDFTokenType.LineBreak) {
                    tokenSet.line_tabsReached = 0;
                }
                if (token.type == VDFTokenType.None ||
                    ((lastToken && (lastToken.type == VDFTokenType.LineBreak || lastToken.type == VDFTokenType.Tab))
                        && token.type != VDFTokenType.LineBreak && token.type != VDFTokenType.Tab)) {
                    // if there's popped-out content, check for any end-stuff that we need to now add (because the popped-out block ended)
                    if (groupDepth_tokenSetsToProcessAfterGroupEnds.Count > 0) {
                        var tabDepthEnded = token.type == VDFTokenType.PoppedOutChildGroupMarker ? tokenSet.line_tabsReached : tokenSet.line_tabsReached + 1;
                        var deepestTokenSetToProcessAfterGroupEnd_depth = groupDepth_tokenSetsToProcessAfterGroupEnds
                            .keys[groupDepth_tokenSetsToProcessAfterGroupEnds.keys.length - 1];
                        if (deepestTokenSetToProcessAfterGroupEnd_depth >= tabDepthEnded) {
                            var deepestTokenSetToProcessAfterGroupEnd = groupDepth_tokenSetsToProcessAfterGroupEnds.Get(deepestTokenSetToProcessAfterGroupEnd_depth);
                            tokenSetsToProcess.push(deepestTokenSetToProcessAfterGroupEnd);
                            groupDepth_tokenSetsToProcessAfterGroupEnds.Remove(deepestTokenSetToProcessAfterGroupEnd_depth);
                            if (token.type == VDFTokenType.PoppedOutChildGroupMarker)
                                tokenSet.currentTokenIndex++;
                            // we just added a collection-to-process, so go process that immediately (we'll get back to our collection later)
                            continue;
                        }
                    }
                }
                if (token.type == VDFTokenType.PoppedOutChildGroupMarker) {
                    addThisToken = false;
                    if (lastToken.type == VDFTokenType.ListStartMarker || lastToken.type == VDFTokenType.MapStartMarker) {
                        var enderTokenIndex = i + 1;
                        while (enderTokenIndex < tokens.Count && tokens[enderTokenIndex].type != VDFTokenType.LineBreak && (tokens[enderTokenIndex].type != VDFTokenType.PoppedOutChildGroupMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.ListStartMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.MapStartMarker))
                            enderTokenIndex++;
                        // the wrap-group consists of the on-same-line text after the popped-out-child-marker (eg the "]}" in "{children:[^]}")
                        var wrapGroupTabDepth = tokenSet.line_tabsReached + 1;
                        var wrapGroupTokens = tokens.GetRange(i + 1, enderTokenIndex - (i + 1));
                        groupDepth_tokenSetsToProcessAfterGroupEnds.Add(wrapGroupTabDepth, new TokenSet(wrapGroupTokens, tokenSet.line_tabsReached));
                        groupDepth_tokenSetsToProcessAfterGroupEnds.Get(wrapGroupTabDepth).tokens[0].index = i + 1; // update index
                        // skip processing the wrap-group-tokens (at this point)
                        i += wrapGroupTokens.Count;
                    }
                }
                if (addThisToken)
                    result.Add(token);
                // if last token in this collection, remove collection (end its processing)
                if (i == tokens.Count - 1)
                    tokenSetsToProcess.pop();
                tokenSet.currentTokenIndex = i + 1;
            }
            // fix token position-and-index properties
            VDFTokenParser.RefreshTokenPositionAndIndexProperties(result); //tokens);
            // for testing
            // ==========
            /*Log(origTokens.Select(a=>a.text).join(" "));
            Log("==========");
            Log(result.Select(a=>a.text).join(" "));*/
            /*Assert(groupDepth_tokenSetsToProcessAfterGroupEnds.Count == 0, "A token-set-to-process-after-group-end was never processed!");
            Assert(result.Where(a=>a.type == VDFTokenType.MapStartMarker).length == result.Where(a=>a.type == VDFTokenType.MapEndMarker).length,
                `Map start-marker count ${result.Where(a=>a.type == VDFTokenType.MapStartMarker).length} and `
                    + `end-marker count ${result.Where(a=>a.type == VDFTokenType.MapEndMarker).length} must be equal.`);
            Assert(result.Where(a=>a.type == VDFTokenType.ListStartMarker).length == result.Where(a=>a.type == VDFTokenType.ListEndMarker).length,
                `List start-marker count ${result.Where(a=>a.type == VDFTokenType.ListStartMarker).length} and `
                    + `end- marker count ${result.Where(a=>a.type == VDFTokenType.ListEndMarker).length } must be equal.`);*/
            return result;
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
    }());
    VDFTokenParser.charsAToZ = VDF_1.List.apply(null, ["string"].concat("abcdefghijklmnopqrstuvwxyz".match(/./g)));
    VDFTokenParser.chars0To9DotAndNegative = VDF_1.List.apply(null, ["string"].concat("0123456789\.\-\+eE".match(/./g)));
    exports.VDFTokenParser = VDFTokenParser;
    var TokenSet = (function () {
        function TokenSet(tokens, line_tabsReached) {
            if (line_tabsReached === void 0) { line_tabsReached = 0; }
            this.currentTokenIndex = 0;
            this.line_tabsReached = 0;
            this.tokens = tokens;
            this.line_tabsReached = line_tabsReached;
        }
        return TokenSet;
    }());
    exports.TokenSet = TokenSet;
});
define("VDFTypeInfo", ["require", "exports", "VDF"], function (require, exports, VDF_2) {
    "use strict";
    var VDFType = (function () {
        function VDFType(propIncludeRegexL1, popOutL1) {
            this.propIncludeRegexL1 = propIncludeRegexL1;
            this.popOutL1 = popOutL1;
        }
        VDFType.prototype.AddDataOf = function (typeTag) {
            if (typeTag.propIncludeRegexL1 != null)
                this.propIncludeRegexL1 = typeTag.propIncludeRegexL1;
            if (typeTag.popOutL1 != null)
                this.popOutL1 = typeTag.popOutL1;
        };
        return VDFType;
    }());
    exports.VDFType = VDFType;
    var VDFTypeInfo = (function () {
        function VDFTypeInfo() {
            this.props = {};
        }
        VDFTypeInfo.Get = function (type_orTypeName) {
            //var type = type_orTypeName instanceof Function ? type_orTypeName : window[type_orTypeName];
            var typeName = type_orTypeName instanceof Function ? type_orTypeName.name : type_orTypeName;
            var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
            if (VDF_2.VDF.GetIsTypeAnonymous(typeNameBase)) {
                var result = new VDFTypeInfo();
                result.typeTag = new VDFType(VDF_2.VDF.PropRegex_Any);
                return result;
            }
            var typeBase = type_orTypeName instanceof Function ? type_orTypeName : window[typeNameBase];
            /*if (typeBase == null)
                throw new Error("Could not find constructor for type: " + typeNameBase);*/
            if (typeBase && !typeBase.hasOwnProperty("typeInfo")) {
                var result = new VDFTypeInfo();
                result.typeTag = new VDFType();
                var currentType = typeBase;
                while (currentType != null) {
                    var currentTypeInfo = currentType.typeInfo;
                    // load type-tag from base-types
                    var typeTag2 = (currentTypeInfo || {}).typeTag;
                    for (var key in typeTag2)
                        if (result.typeTag[key] == null)
                            result.typeTag[key] = typeTag2[key];
                    // load prop-info from base-types
                    if (currentTypeInfo)
                        for (var propName in currentTypeInfo.props)
                            result.props[propName] = currentTypeInfo.props[propName];
                    currentType = currentType.prototype && currentType.prototype.__proto__ && currentType.prototype.__proto__.constructor;
                }
                typeBase.typeInfo = result;
            }
            return typeBase && typeBase.typeInfo;
        };
        VDFTypeInfo.prototype.GetProp = function (propName) {
            if (!(propName in this.props))
                this.props[propName] = new VDFPropInfo(propName, null, []);
            return this.props[propName];
        };
        return VDFTypeInfo;
    }());
    exports.VDFTypeInfo = VDFTypeInfo;
    var VDFProp = (function () {
        function VDFProp(includeL2, popOutL2) {
            if (includeL2 === void 0) { includeL2 = true; }
            this.includeL2 = includeL2;
            this.popOutL2 = popOutL2;
        }
        return VDFProp;
    }());
    exports.VDFProp = VDFProp;
    var P = (function (_super) {
        __extends(P, _super);
        function P(includeL2, popOutL2) {
            if (includeL2 === void 0) { includeL2 = true; }
            return _super.call(this, includeL2, popOutL2) || this;
        }
        return P;
    }(VDFProp));
    exports.P = P;
    var DefaultValue = (function () {
        function DefaultValue(defaultValue) {
            if (defaultValue === void 0) { defaultValue = exports.D.DefaultDefault; }
            this.defaultValue = defaultValue;
        }
        return DefaultValue;
    }());
    exports.DefaultValue = DefaultValue;
    exports.D = function D(defaultValue) {
        return (function (target, name) {
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.AddTags(new DefaultValue(defaultValue));
        });
    };
    exports.D.DefaultDefault = {};
    exports.D.NullOrEmpty = {};
    exports.D.Empty = {};
    var VDFPropInfo = (function () {
        function VDFPropInfo(propName, propTypeName, tags) {
            this.name = propName;
            this.typeName = propTypeName;
            this.tags = new VDF_2.List("object", tags);
            this.propTag = this.tags.First(function (a) { return a instanceof VDFProp; });
            this.defaultValueTag = this.tags.First(function (a) { return a instanceof DefaultValue; });
        }
        VDFPropInfo.prototype.AddTags = function () {
            var tags = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                tags[_i] = arguments[_i];
            }
            this.tags.AddRange(tags);
            this.propTag = this.tags.First(function (a) { return a instanceof VDFProp; });
            this.defaultValueTag = this.tags.First(function (a) { return a instanceof DefaultValue; });
        };
        VDFPropInfo.prototype.ShouldValueBeSaved = function (val) {
            //if (this.defaultValueTag == null || this.defaultValueTag.defaultValue == D.NoDefault)
            if (this.defaultValueTag == null)
                return true;
            if (this.defaultValueTag.defaultValue == exports.D.DefaultDefault) {
                if (val == null)
                    return false;
                if (val === false || val === 0)
                    return true;
            }
            if (this.defaultValueTag.defaultValue == exports.D.NullOrEmpty && val === null)
                return false;
            if (this.defaultValueTag.defaultValue == exports.D.NullOrEmpty || this.defaultValueTag.defaultValue == exports.D.Empty) {
                var typeName = VDF_2.VDF.GetTypeNameOfObject(val);
                if (typeName && typeName.StartsWith("List(") && val.length == 0)
                    return false;
                if (typeName == "string" && !val.length)
                    return false;
            }
            if (val === this.defaultValueTag.defaultValue)
                return false;
            return true;
        };
        return VDFPropInfo;
    }());
    exports.VDFPropInfo = VDFPropInfo;
    var VDFSerializeProp = (function () {
        function VDFSerializeProp() {
        }
        return VDFSerializeProp;
    }());
    exports.VDFSerializeProp = VDFSerializeProp;
    function _VDFSerializeProp() {
        return function (target, name) { return target[name].AddTags(new VDFSerializeProp()); };
    }
    exports._VDFSerializeProp = _VDFSerializeProp;
    ;
    var VDFDeserializeProp = (function () {
        function VDFDeserializeProp() {
        }
        return VDFDeserializeProp;
    }());
    exports.VDFDeserializeProp = VDFDeserializeProp;
    function _VDFDeserializeProp() {
        return function (target, name) { return target[name].AddTags(new VDFDeserializeProp()); };
    }
    exports._VDFDeserializeProp = _VDFDeserializeProp;
    ;
    var VDFPreSerialize = (function () {
        function VDFPreSerialize() {
        }
        return VDFPreSerialize;
    }());
    exports.VDFPreSerialize = VDFPreSerialize;
    function _VDFPreSerialize() {
        return function (target, name) { return target[name].AddTags(new VDFPreSerialize()); };
    }
    exports._VDFPreSerialize = _VDFPreSerialize;
    ;
    var VDFSerialize = (function () {
        function VDFSerialize() {
        }
        return VDFSerialize;
    }());
    exports.VDFSerialize = VDFSerialize;
    function _VDFSerialize() {
        return function (target, name) { return target[name].AddTags(new VDFSerialize()); };
    }
    exports._VDFSerialize = _VDFSerialize;
    ;
    var VDFPostSerialize = (function () {
        function VDFPostSerialize() {
        }
        return VDFPostSerialize;
    }());
    exports.VDFPostSerialize = VDFPostSerialize;
    function _VDFPostSerialize() {
        return function (target, name) { return target[name].AddTags(new VDFPostSerialize()); };
    }
    exports._VDFPostSerialize = _VDFPostSerialize;
    ;
    var VDFPreDeserialize = (function () {
        function VDFPreDeserialize() {
        }
        return VDFPreDeserialize;
    }());
    exports.VDFPreDeserialize = VDFPreDeserialize;
    function _VDFPreDeserialize() {
        return function (target, name) { return target[name].AddTags(new VDFPreDeserialize()); };
    }
    exports._VDFPreDeserialize = _VDFPreDeserialize;
    ;
    var VDFDeserialize = (function () {
        function VDFDeserialize(fromParent) {
            if (fromParent === void 0) { fromParent = false; }
            this.fromParent = fromParent;
        }
        return VDFDeserialize;
    }());
    exports.VDFDeserialize = VDFDeserialize;
    function _VDFDeserialize(fromParent) {
        if (fromParent === void 0) { fromParent = false; }
        return function (target, name) { return target[name].AddTags(new VDFDeserialize(fromParent)); };
    }
    exports._VDFDeserialize = _VDFDeserialize;
    ;
    var VDFPostDeserialize = (function () {
        function VDFPostDeserialize() {
        }
        return VDFPostDeserialize;
    }());
    exports.VDFPostDeserialize = VDFPostDeserialize;
    function _VDFPostDeserialize() {
        return function (target, name) { return target[name].AddTags(new VDFPostDeserialize()); };
    }
    exports._VDFPostDeserialize = _VDFPostDeserialize;
    ;
});
/*export class VDFMethodInfo {
    tags: any[];
    constructor(tags: any[]) { this.tags = tags; }
}*/ 
define("VDFLoader", ["require", "exports", "VDF", "VDFNode", "VDFTokenParser", "VDFTypeInfo"], function (require, exports, VDF_3, VDFNode_1, VDFTokenParser_1, VDFTypeInfo_1) {
    "use strict";
    var VDFLoadOptions = (function () {
        function VDFLoadOptions(initializerObj, messages, allowStringKeys, allowCommaSeparators, loadUnknownTypesAsBasicTypes) {
            if (allowStringKeys === void 0) { allowStringKeys = true; }
            if (allowCommaSeparators === void 0) { allowCommaSeparators = false; }
            if (loadUnknownTypesAsBasicTypes === void 0) { loadUnknownTypesAsBasicTypes = false; }
            this.objPostDeserializeFuncs_early = new VDF_3.Dictionary("object", "List(Function)");
            this.objPostDeserializeFuncs = new VDF_3.Dictionary("object", "List(Function)");
            this.messages = messages || [];
            this.allowStringKeys = allowStringKeys;
            this.allowCommaSeparators = allowCommaSeparators;
            this.loadUnknownTypesAsBasicTypes = loadUnknownTypesAsBasicTypes;
            if (initializerObj)
                for (var key in initializerObj)
                    this[key] = initializerObj[key];
        }
        VDFLoadOptions.prototype.AddObjPostDeserializeFunc = function (obj, func, early) {
            if (early === void 0) { early = false; }
            if (early) {
                if (!this.objPostDeserializeFuncs_early.ContainsKey(obj))
                    this.objPostDeserializeFuncs_early.Add(obj, new VDF_3.List("Function"));
                this.objPostDeserializeFuncs_early.Get(obj).Add(func);
            }
            else {
                if (!this.objPostDeserializeFuncs.ContainsKey(obj))
                    this.objPostDeserializeFuncs.Add(obj, new VDF_3.List("Function"));
                this.objPostDeserializeFuncs.Get(obj).Add(func);
            }
        };
        VDFLoadOptions.prototype.ForJSON = function () {
            this.allowStringKeys = true;
            this.allowCommaSeparators = true;
            return this;
        };
        return VDFLoadOptions;
    }());
    exports.VDFLoadOptions = VDFLoadOptions;
    var VDFLoader = (function () {
        function VDFLoader() {
        }
        VDFLoader.ToVDFNode = function (tokens_orText, declaredTypeName_orOptions, options, firstTokenIndex, enderTokenIndex) {
            if (firstTokenIndex === void 0) { firstTokenIndex = 0; }
            if (enderTokenIndex === void 0) { enderTokenIndex = -1; }
            if (declaredTypeName_orOptions instanceof VDFLoadOptions)
                return VDFLoader.ToVDFNode(tokens_orText, null, declaredTypeName_orOptions);
            if (typeof tokens_orText == "string")
                return VDFLoader.ToVDFNode(VDFTokenParser_1.VDFTokenParser.ParseTokens(tokens_orText, options), declaredTypeName_orOptions, options);
            var tokens = tokens_orText;
            var declaredTypeName = declaredTypeName_orOptions;
            options = options || new VDFLoadOptions();
            enderTokenIndex = enderTokenIndex != -1 ? enderTokenIndex : tokens.Count;
            // figure out obj-type
            // ==========
            var depth = 0;
            var tokensAtDepth0 = new VDF_3.List("VDFToken");
            var tokensAtDepth1 = new VDF_3.List("VDFToken");
            var i;
            for (var i = firstTokenIndex; i < enderTokenIndex; i++) {
                var token = tokens[i];
                if (token.type == VDFTokenParser_1.VDFTokenType.ListEndMarker || token.type == VDFTokenParser_1.VDFTokenType.MapEndMarker)
                    depth--;
                if (depth == 0)
                    tokensAtDepth0.Add(token);
                if (depth == 1)
                    tokensAtDepth1.Add(token);
                if (token.type == VDFTokenParser_1.VDFTokenType.ListStartMarker || token.type == VDFTokenParser_1.VDFTokenType.MapStartMarker)
                    depth++;
            }
            var fromVDFTypeName = "object";
            var firstNonMetadataToken = tokensAtDepth0.First(function (a) { return a.type != VDFTokenParser_1.VDFTokenType.Metadata; });
            if (tokensAtDepth0[0].type == VDFTokenParser_1.VDFTokenType.Metadata)
                fromVDFTypeName = tokensAtDepth0[0].text;
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Boolean)
                fromVDFTypeName = "bool";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Number)
                fromVDFTypeName = firstNonMetadataToken.text == "Infinity" || firstNonMetadataToken.text == "-Infinity" || firstNonMetadataToken.text.Contains(".") || firstNonMetadataToken.text.Contains("e") ? "double" : "int";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.String)
                fromVDFTypeName = "string";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.ListStartMarker)
                fromVDFTypeName = "List(object)";
            else if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.MapStartMarker)
                fromVDFTypeName = "Dictionary(object object)"; //"object";
            var typeName = declaredTypeName;
            if (fromVDFTypeName != null && fromVDFTypeName.length > 0) {
                // porting-note: this is only a limited implementation of CS functionality of making sure from-vdf-type is more specific than declared-type
                if (typeName == null || ["object", "IList", "IDictionary"].Contains(typeName))
                    typeName = fromVDFTypeName;
            }
            // for keys, force load as string, since we're not at the use-importer stage
            if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Key)
                typeName = "string";
            var typeGenericArgs = VDF_3.VDF.GetGenericArgumentsOfType(typeName);
            var typeInfo = VDFTypeInfo_1.VDFTypeInfo.Get(typeName);
            // create the object's VDFNode, and load in the data
            // ==========
            var node = new VDFNode_1.VDFNode();
            node.metadata = tokensAtDepth0[0].type == VDFTokenParser_1.VDFTokenType.Metadata ? fromVDFTypeName : null;
            // if primitive, parse value
            if (firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Null)
                node.primitiveValue = null;
            else if (typeName == "bool")
                node.primitiveValue = firstNonMetadataToken.text == "true" ? true : false;
            else if (typeName == "int")
                node.primitiveValue = parseInt(firstNonMetadataToken.text);
            else if (typeName == "float" || typeName == "double" || firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.Number)
                node.primitiveValue = parseFloat(firstNonMetadataToken.text);
            else if (typeName == "string" || firstNonMetadataToken.type == VDFTokenParser_1.VDFTokenType.String)
                node.primitiveValue = firstNonMetadataToken.text;
            else if (typeName.StartsWith("List(")) {
                node.isList = true;
                for (var i = 0; i < tokensAtDepth1.Count; i++) {
                    var token = tokensAtDepth1[i];
                    if (token.type != VDFTokenParser_1.VDFTokenType.ListEndMarker && token.type != VDFTokenParser_1.VDFTokenType.MapEndMarker) {
                        var itemFirstToken = tokens[token.index];
                        var itemEnderToken = tokensAtDepth1.FirstOrDefault(function (a) { return a.index > itemFirstToken.index + (itemFirstToken.type == VDFTokenParser_1.VDFTokenType.Metadata ? 1 : 0) && token.type != VDFTokenParser_1.VDFTokenType.ListEndMarker && token.type != VDFTokenParser_1.VDFTokenType.MapEndMarker; });
                        //node.AddListChild(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), typeGenericArgs[0], options));
                        node.AddListChild(VDFLoader.ToVDFNode(tokens, typeGenericArgs[0], options, itemFirstToken.index, itemEnderToken != null ? itemEnderToken.index : enderTokenIndex));
                        if (itemFirstToken.type == VDFTokenParser_1.VDFTokenType.Metadata)
                            i++;
                    }
                }
            }
            else {
                node.isMap = true;
                for (var i = 0; i < tokensAtDepth1.Count; i++) {
                    var token = tokensAtDepth1[i];
                    if (token.type == VDFTokenParser_1.VDFTokenType.Key) {
                        var propNameFirstToken = i >= 1 && tokensAtDepth1[i - 1].type == VDFTokenParser_1.VDFTokenType.Metadata ? tokensAtDepth1[i - 1] : tokensAtDepth1[i];
                        var propNameEnderToken = tokensAtDepth1[i + 1];
                        var propNameType = propNameFirstToken.type == VDFTokenParser_1.VDFTokenType.Metadata ? "object" : "string";
                        if (typeName.StartsWith("Dictionary(") && typeGenericArgs[0] != "object")
                            propNameType = typeGenericArgs[0];
                        var propNameNode = VDFLoader.ToVDFNode(tokens, propNameType, options, propNameFirstToken.index, propNameEnderToken.index);
                        var propValueType;
                        //if (typeName.StartsWith("Dictionary(")) //typeof(IDictionary).IsAssignableFrom(objType))
                        if (typeGenericArgs.length >= 2)
                            propValueType = typeGenericArgs[1];
                        else
                            //propValueTypeName = typeInfo && typeInfo.props[propName] ? typeInfo.props[propName].typeName : null;
                            propValueType = typeof propNameNode.primitiveValue == "string" && typeInfo && typeInfo.props[propNameNode.primitiveValue] ? typeInfo.props[propNameNode.primitiveValue].typeName : null;
                        var propValueFirstToken = tokensAtDepth1[i + 1];
                        var propValueEnderToken = tokensAtDepth1.FirstOrDefault(function (a) { return a.index > propValueFirstToken.index && a.type == VDFTokenParser_1.VDFTokenType.Key; });
                        //var propValueNode = VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueFirstToken, propValueEnderToken), propValueTypeName, options);
                        var propValueNode = VDFLoader.ToVDFNode(tokens, propValueType, options, propValueFirstToken.index, propValueEnderToken != null ? propValueEnderToken.index : enderTokenIndex);
                        node.SetMapChild(propNameNode, propValueNode);
                    }
                }
            }
            return node;
        };
        return VDFLoader;
    }());
    exports.VDFLoader = VDFLoader;
});
define("VDFNode", ["require", "exports", "VDFSaver", "VDFLoader", "VDF", "VDFTypeInfo"], function (require, exports, VDFSaver_1, VDFLoader_2, VDF_4, VDFTypeInfo_2) {
    "use strict";
    var VDFNode = (function () {
        function VDFNode(primitiveValue, metadata) {
            this.listChildren = new VDF_4.List("VDFNode");
            this.mapChildren = new VDF_4.Dictionary("VDFNode", "VDFNode"); // this also holds Dictionaries' keys/values
            this.primitiveValue = primitiveValue;
            this.metadata = metadata;
        }
        VDFNode.prototype.SetListChild = function (index, value) {
            this.listChildren[index] = value;
            this[index] = value;
        };
        /*InsertListChild(index: number, value: any)
        {
            var oldItems = this.listChildren;
            for (var i = 0; i < oldItems.length; i++) // we need to first remove old values, so the slate is clean for manual re-adding/re-ordering
                delete this[i];
            for (var i = 0; i < oldItems.length + 1; i++) // now add them all back in, in the correct order
                this.AddListChild(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
        }*/
        VDFNode.prototype.AddListChild = function (value) { this.SetListChild(this.listChildren.length, value); };
        VDFNode.prototype.SetMapChild = function (key, value) {
            this.mapChildren.Set(key, value);
            if (typeof key.primitiveValue == "string")
                this[key] = value;
        };
        VDFNode.prototype.toString = function () { return this.primitiveValue ? this.primitiveValue.toString() : ""; }; // helpful for debugging
        // saving
        // ==================
        VDFNode.PadString = function (unpaddedString) {
            var result = unpaddedString;
            if (result.StartsWith("<") || result.StartsWith("#"))
                result = "#" + result;
            if (result.EndsWith(">") || result.EndsWith("#"))
                result += "#";
            return result;
        };
        VDFNode.prototype.ToVDF = function (options, tabDepth) {
            if (options === void 0) { options = null; }
            if (tabDepth === void 0) { tabDepth = 0; }
            return this.ToVDF_InlinePart(options, tabDepth) + this.ToVDF_PoppedOutPart(options, tabDepth);
        };
        VDFNode.prototype.ToVDF_InlinePart = function (options, tabDepth, isKey) {
            if (options === void 0) { options = null; }
            if (tabDepth === void 0) { tabDepth = 0; }
            if (isKey === void 0) { isKey = false; }
            options = options || new VDFSaver_1.VDFSaveOptions();
            var builder = new VDF_4.StringBuilder();
            var metadata = this.metadata_override != null ? this.metadata_override : this.metadata;
            if (options.useMetadata && metadata != null && metadata != "")
                builder.Append(metadata + ">");
            if (this.primitiveValue == null) {
                if (!this.isMap && this.mapChildren.Count == 0 && !this.isList && this.listChildren.Count == 0)
                    builder.Append("null");
            }
            else if (typeof this.primitiveValue == "boolean")
                builder.Append(this.primitiveValue.toString().toLowerCase());
            else if (typeof this.primitiveValue == "string") {
                var unpaddedString = this.primitiveValue;
                // (the parser doesn't actually need '<<' and '>>' wrapped for single-line strings, but we do so for consistency)
                var needsEscaping = VDFNode.charsThatNeedEscaping_ifAnywhere_regex.test(unpaddedString);
                if (isKey)
                    needsEscaping = needsEscaping || VDFNode.charsThatNeedEscaping_ifNonQuoted_regex.test(unpaddedString);
                if (needsEscaping) {
                    var literalStartMarkerString = "<<";
                    var literalEndMarkerString = ">>";
                    while (unpaddedString.Contains(literalStartMarkerString) || unpaddedString.Contains(literalEndMarkerString)) {
                        literalStartMarkerString += "<";
                        literalEndMarkerString += ">";
                    }
                    builder.Append((isKey ? "" : "\"") + literalStartMarkerString + VDFNode.PadString(unpaddedString) + literalEndMarkerString + (isKey ? "" : "\""));
                }
                else
                    builder.Append((isKey ? "" : "\"") + unpaddedString + (isKey ? "" : "\""));
            }
            else if (VDF_4.VDF.GetIsTypePrimitive(VDF_4.VDF.GetTypeNameOfObject(this.primitiveValue)))
                builder.Append(options.useNumberTrimming && this.primitiveValue.toString().StartsWith("0.") ? this.primitiveValue.toString().substr(1) : this.primitiveValue);
            else
                builder.Append("\"" + this.primitiveValue + "\"");
            if (options.useChildPopOut && this.childPopOut) {
                if (this.isMap || this.mapChildren.Count > 0)
                    builder.Append(this.mapChildren.Count > 0 ? "{^}" : "{}");
                if (this.isList || this.listChildren.Count > 0)
                    builder.Append(this.listChildren.Count > 0 ? "[^]" : "[]");
            }
            else {
                if (this.isMap || this.mapChildren.Count > 0) {
                    builder.Append("{");
                    for (var i = 0, pair = null, pairs = this.mapChildren.Pairs; i < pairs.length && (pair = pairs[i]); i++) {
                        var keyStr = pair.key.ToVDF_InlinePart(options, tabDepth, true);
                        var valueStr = pair.value.ToVDF_InlinePart(options, tabDepth);
                        builder.Append((i == 0 ? "" : (options.useCommaSeparators ? "," : " ")) + (options.useStringKeys ? "\"" : "") + keyStr + (options.useStringKeys ? "\"" : "") + ":" + valueStr);
                    }
                    builder.Append("}");
                }
                if (this.isList || this.listChildren.Count > 0) {
                    builder.Append("[");
                    for (var i = 0; i < this.listChildren.Count; i++)
                        builder.Append((i == 0 ? "" : (options.useCommaSeparators ? "," : " ")) + this.listChildren[i].ToVDF_InlinePart(options, tabDepth));
                    builder.Append("]");
                }
            }
            return builder.ToString();
        };
        VDFNode.prototype.ToVDF_PoppedOutPart = function (options, tabDepth) {
            if (options === void 0) { options = null; }
            if (tabDepth === void 0) { tabDepth = 0; }
            options = options || new VDFSaver_1.VDFSaveOptions();
            var builder = new VDF_4.StringBuilder();
            // include popped-out-content of direct children (i.e. a single directly-under group)
            if (options.useChildPopOut && this.childPopOut) {
                var childTabStr = "";
                for (var i = 0; i < tabDepth + 1; i++)
                    childTabStr += "\t";
                if (this.isMap || this.mapChildren.Count > 0)
                    for (var i = 0, pair = null, pairs = this.mapChildren.Pairs; i < pairs.length && (pair = pairs[i]); i++) {
                        var keyStr = pair.key.ToVDF_InlinePart(options, tabDepth, true);
                        var valueStr = pair.value.ToVDF_InlinePart(options, tabDepth + 1);
                        builder.Append("\n" + childTabStr + (options.useStringKeys ? "\"" : "") + keyStr + (options.useStringKeys ? "\"" : "") + ":" + valueStr);
                        var poppedOutChildText = pair.value.ToVDF_PoppedOutPart(options, tabDepth + 1);
                        if (poppedOutChildText.length > 0)
                            builder.Append(poppedOutChildText);
                    }
                if (this.isList || this.listChildren.Count > 0)
                    for (var _i = 0, _a = this.listChildren; _i < _a.length; _i++) {
                        var item = _a[_i];
                        builder.Append("\n" + childTabStr + item.ToVDF_InlinePart(options, tabDepth + 1));
                        var poppedOutChildText = item.ToVDF_PoppedOutPart(options, tabDepth + 1);
                        if (poppedOutChildText.length > 0)
                            builder.Append(poppedOutChildText);
                    }
            }
            else {
                var poppedOutChildTexts = new VDF_4.List("string");
                var poppedOutChildText = void 0;
                if (this.isMap || this.mapChildren.Count > 0)
                    for (var i = 0, pair = null, pairs = this.mapChildren.Pairs; i < pairs.length && (pair = pairs[i]); i++)
                        if ((poppedOutChildText = pair.value.ToVDF_PoppedOutPart(options, tabDepth)).length)
                            poppedOutChildTexts.Add(poppedOutChildText);
                if (this.isList || this.listChildren.Count > 0) {
                    for (var _b = 0, _c = this.listChildren; _b < _c.length; _b++) {
                        var item = _c[_b];
                        if ((poppedOutChildText = item.ToVDF_PoppedOutPart(options, tabDepth)).length)
                            poppedOutChildTexts.Add(poppedOutChildText);
                    }
                }
                for (var i = 0; i < poppedOutChildTexts.Count; i++) {
                    poppedOutChildText = poppedOutChildTexts[i];
                    var insertPoint = 0;
                    while (poppedOutChildText[insertPoint] == '\n' || poppedOutChildText[insertPoint] == '\t')
                        insertPoint++;
                    builder.Append((insertPoint > 0 ? poppedOutChildText.substr(0, insertPoint) : "") + (i == 0 ? "" : "^") + poppedOutChildText.substr(insertPoint));
                }
            }
            return builder.ToString();
        };
        // loading
        // ==================
        VDFNode.CreateNewInstanceOfType = function (typeName) {
            var typeNameRoot = VDF_4.VDF.GetTypeNameRoot(typeName);
            var genericParameters = VDF_4.VDF.GetGenericArgumentsOfType(typeName);
            /*if (typeNameRoot == "List")
                return new List(genericParameters[0]);
            if (typeNameRoot == "Dictionary")
                return new Dictionary(genericParameters[0], genericParameters[1]);*/
            if (typeName.Contains("("))
                //return window[typeNameRoot].apply(null, genericParameters);
                return new (Function.prototype.bind.apply(window[typeNameRoot], [null].concat(genericParameters)));
            if (!(window[typeNameRoot] instanceof Function))
                throw new Error("Could not find type \"" + typeName + "\".");
            return new window[typeNameRoot]; // maybe todo: add code that resets props to their nulled-out/zeroed-out values (or just don't use any constructors, and just remember to set the __proto__ property afterward)
        };
        VDFNode.GetCompatibleTypeNameForNode = function (node) { return node.mapChildren.Count ? "object" : (node.listChildren.length ? "List(object)" : "string"); };
        VDFNode.prototype.ToObject = function (declaredTypeName_orOptions, options, path) {
            if (options === void 0) { options = new VDFLoader_2.VDFLoadOptions(); }
            if (declaredTypeName_orOptions instanceof VDFLoader_2.VDFLoadOptions)
                return this.ToObject(null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            path = path || new VDF_4.VDFNodePath(new VDF_4.VDFNodePathNode());
            var fromVDFTypeName = "object";
            var metadata = this.metadata_override != null ? this.metadata_override : this.metadata;
            if (metadata != null && (window[VDF_4.VDF.GetTypeNameRoot(metadata)] instanceof Function || !options.loadUnknownTypesAsBasicTypes))
                fromVDFTypeName = metadata;
            else if (typeof this.primitiveValue == "boolean")
                fromVDFTypeName = "bool";
            else if (typeof this.primitiveValue == "number")
                fromVDFTypeName = this.primitiveValue.toString().Contains(".") ? "double" : "int";
            else if (typeof this.primitiveValue == "string")
                fromVDFTypeName = "string";
            else if (this.primitiveValue == null)
                if (this.isList || this.listChildren.Count > 0)
                    fromVDFTypeName = "List(object)"; //"array";
                else if (this.isMap || this.mapChildren.Count > 0)
                    fromVDFTypeName = "Dictionary(object object)"; //"object-anonymous"; //"object";
            var finalTypeName;
            if (window[VDF_4.VDF.GetTypeNameRoot(declaredTypeName)] instanceof Function || !options.loadUnknownTypesAsBasicTypes)
                finalTypeName = declaredTypeName;
            // if there is no declared type, or the from-metadata type is more specific than the declared type
            // (for last condition/way: also assume from-vdf-type is derived, if declared-type name is one of these extra (not actually implemented in JS) types)
            //if (finalTypeName == null || (<Function><object>window[VDF.GetTypeNameRoot(fromVDFTypeName)] || (()=>{})).IsDerivedFrom(<Function><object>window[VDF.GetTypeNameRoot(finalTypeName)] || (()=>{})) || ["object", "IList", "IDictionary"].Contains(finalTypeName))
            if (finalTypeName == null || VDF_4.VDF.IsTypeXDerivedFromY(fromVDFTypeName, finalTypeName) || ["object", "IList", "IDictionary"].Contains(finalTypeName))
                finalTypeName = fromVDFTypeName;
            var result;
            var deserializedByCustomMethod = false;
            var classProps = VDF_4.VDF.GetClassProps(window[finalTypeName]);
            for (var propName in classProps)
                if (classProps[propName] instanceof Function && classProps[propName].tags && classProps[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFDeserialize && a.fromParent; })) {
                    var deserializeResult = classProps[propName](this, path, options);
                    if (deserializeResult !== undefined) {
                        result = deserializeResult;
                        deserializedByCustomMethod = true;
                        break;
                    }
                }
            if (!deserializedByCustomMethod)
                if (finalTypeName == "object") { } //result = null;
                else if (VDF_4.EnumValue.IsEnum(finalTypeName))
                    result = VDF_4.EnumValue.GetEnumIntForStringValue(finalTypeName, this.primitiveValue);
                else if (VDF_4.VDF.GetIsTypePrimitive(finalTypeName)) {
                    result = this.primitiveValue;
                    if (finalTypeName == "int")
                        result = parseInt(this.primitiveValue);
                    else if (finalTypeName == "float" || finalTypeName == "double")
                        result = parseFloat(this.primitiveValue);
                }
                else if (this.primitiveValue != null || this.isList || this.isMap) {
                    result = VDFNode.CreateNewInstanceOfType(finalTypeName);
                    path.currentNode.obj = result;
                    this.IntoObject(result, options, path);
                }
            path.currentNode.obj = result; // in case post-deserialize method was attached as extra-method to the object, that makes use of the (basically useless) path.currentNode.obj property
            return result;
        };
        VDFNode.prototype.IntoObject = function (obj, options, path) {
            if (options === void 0) { options = null; }
            options = options || new VDFLoader_2.VDFLoadOptions();
            path = path || new VDF_4.VDFNodePath(new VDF_4.VDFNodePathNode(obj));
            var typeName = VDF_4.VDF.GetTypeNameOfObject(obj);
            var typeGenericArgs = VDF_4.VDF.GetGenericArgumentsOfType(typeName);
            var typeInfo = VDFTypeInfo_2.VDFTypeInfo.Get(typeName);
            for (var propName in VDF_4.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFPreDeserialize; }))
                    obj[propName](this, path, options);
            var deserializedByCustomMethod2 = false;
            for (var propName in VDF_4.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFDeserialize && !a.fromParent; })) {
                    var deserializeResult = obj[propName](this, path, options);
                    if (deserializeResult !== undefined) {
                        deserializedByCustomMethod2 = true;
                        break;
                    }
                }
            if (!deserializedByCustomMethod2) {
                for (var i = 0; i < this.listChildren.Count; i++) {
                    //obj.Add(this.listChildren[i].ToObject(typeGenericArgs[0], options, path.ExtendAsListItem(i, this.listChildren[i])));
                    var item = this.listChildren[i].ToObject(typeGenericArgs[0], options, path.ExtendAsListItem(i, this.listChildren[i]));
                    if (obj.Count == i)
                        obj.Add(item);
                }
                for (var _i = 0, _a = this.mapChildren.Pairs; _i < _a.length; _i++) {
                    var pair = _a[_i];
                    try {
                        if (obj instanceof VDF_4.Dictionary) {
                            /*let key = VDF.Deserialize("\"" + keyString + "\"", typeGenericArgs[0], options);
                            //obj.Add(key, this.mapChildren[keyString].ToObject(typeGenericArgs[1], options, path.ExtendAsMapItem(key, null)));*/
                            var key = pair.key.ToObject(typeGenericArgs[0], options, path.ExtendAsMapKey(pair.index, null));
                            var value = pair.value.ToObject(typeGenericArgs[1], options, path.ExtendAsMapItem(key, null));
                            obj.Set(key, value); // "obj" prop to be filled in at end of ToObject method // maybe temp; allow child to have already attached itself (by way of the VDF event methods)
                        }
                        else {
                            //obj[keyString] = this.mapChildren[keyString].ToObject(typeInfo.props[keyString] && typeInfo.props[keyString].typeName, options, path.ExtendAsChild(typeInfo.props[keyString] || { name: keyString }, null));
                            var propName = pair.key.primitiveValue;
                            /*if (typeInfo.props[propName]) // maybe temp; just ignore props that are missing
                            {*/
                            var childPath = path.ExtendAsChild(typeInfo.props[propName] || { name: propName }, null);
                            var value = void 0;
                            for (var propName2 in VDF_4.VDF.GetObjectProps(obj))
                                if (obj[propName2] instanceof Function && obj[propName2].tags && obj[propName2].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFDeserializeProp; })) {
                                    var deserializeResult = obj[propName2](pair.value, childPath, options);
                                    if (deserializeResult !== undefined) {
                                        value = deserializeResult;
                                        break;
                                    }
                                }
                            if (value === undefined)
                                value = pair.value.ToObject(typeInfo.props[propName] && typeInfo.props[propName].typeName, options, childPath);
                            obj[propName] = value;
                        }
                    }
                    catch (ex) {
                        ex.message += "\n==================\nRethrownAs) " + ("Error loading map-child with key '" + (typeof pair.key.primitiveValue == "string" ? "'" + pair.key.primitiveValue + "'" : "of type " + pair.key) + "'.") + "\n";
                        throw ex;
                    } /**/
                    finally { }
                }
            }
            if (options.objPostDeserializeFuncs_early.ContainsKey(obj))
                for (var i in options.objPostDeserializeFuncs_early.Get(obj))
                    options.objPostDeserializeFuncs_early.Get(obj)[i]();
            for (var propName in VDF_4.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_2.VDFPostDeserialize; }))
                    obj[propName](this, path, options);
            if (options.objPostDeserializeFuncs.ContainsKey(obj))
                for (var i in options.objPostDeserializeFuncs.Get(obj))
                    options.objPostDeserializeFuncs.Get(obj)[i]();
        };
        return VDFNode;
    }());
    VDFNode.charsThatNeedEscaping_ifAnywhere_regex = /"|'|\n|\t|<<|>>/; // (well, anywhere in string)
    VDFNode.charsThatNeedEscaping_ifNonQuoted_regex = /^([\t^# ,0-9.\-+]|null|true|false)|{|}|\[|\]|:/;
    exports.VDFNode = VDFNode;
    //VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);
    VDF_4.VDF.CancelSerialize = new VDFNode();
});
define("VDFSaver", ["require", "exports", "VDFNode", "VDFTypeInfo", "VDF"], function (require, exports, VDFNode_2, VDFTypeInfo_3, VDF_5) {
    "use strict";
    var VDFTypeMarking;
    (function (VDFTypeMarking) {
        VDFTypeMarking[VDFTypeMarking["None"] = 0] = "None";
        VDFTypeMarking[VDFTypeMarking["Internal"] = 1] = "Internal";
        VDFTypeMarking[VDFTypeMarking["External"] = 2] = "External";
        VDFTypeMarking[VDFTypeMarking["ExternalNoCollapse"] = 3] = "ExternalNoCollapse"; // maybe temp
    })(VDFTypeMarking = exports.VDFTypeMarking || (exports.VDFTypeMarking = {}));
    var VDFSaveOptions = (function () {
        function VDFSaveOptions(initializerObj, messages, typeMarking, useMetadata, useChildPopOut, useStringKeys, useNumberTrimming, useCommaSeparators) {
            if (typeMarking === void 0) { typeMarking = VDFTypeMarking.Internal; }
            if (useMetadata === void 0) { useMetadata = true; }
            if (useChildPopOut === void 0) { useChildPopOut = true; }
            if (useStringKeys === void 0) { useStringKeys = false; }
            if (useNumberTrimming === void 0) { useNumberTrimming = true; }
            if (useCommaSeparators === void 0) { useCommaSeparators = false; }
            this.messages = messages || [];
            this.typeMarking = typeMarking;
            this.useMetadata = useMetadata;
            this.useChildPopOut = useChildPopOut;
            this.useStringKeys = useStringKeys;
            this.useNumberTrimming = useNumberTrimming;
            this.useCommaSeparators = useCommaSeparators;
            if (initializerObj)
                for (var key in initializerObj)
                    this[key] = initializerObj[key];
        }
        VDFSaveOptions.prototype.ForJSON = function () {
            this.useMetadata = false;
            this.useChildPopOut = false;
            this.useStringKeys = true;
            this.useNumberTrimming = false;
            this.useCommaSeparators = true;
            return this;
        };
        return VDFSaveOptions;
    }());
    exports.VDFSaveOptions = VDFSaveOptions;
    var VDFSaver = (function () {
        function VDFSaver() {
        }
        VDFSaver.ToVDFNode = function (obj, declaredTypeName_orOptions, options, path, declaredTypeInParentVDF) {
            if (options === void 0) { options = new VDFSaveOptions(); }
            if (declaredTypeName_orOptions instanceof VDFSaveOptions)
                return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            path = path || new VDF_5.VDFNodePath(new VDF_5.VDFNodePathNode(obj));
            var typeName = obj != null ? (VDF_5.EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF_5.VDF.GetTypeNameOfObject(obj)) : null; // at bottom, enums an integer; but consider it of a distinct type
            var typeGenericArgs = VDF_5.VDF.GetGenericArgumentsOfType(typeName);
            var typeInfo = typeName ? VDFTypeInfo_3.VDFTypeInfo.Get(typeName) : new VDFTypeInfo_3.VDFTypeInfo();
            for (var propName_1 in VDF_5.VDF.GetObjectProps(obj))
                if (obj[propName_1] instanceof Function && obj[propName_1].tags && obj[propName_1].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFPreSerialize; })) {
                    if (obj[propName_1](path, options) == VDF_5.VDF.CancelSerialize)
                        return VDF_5.VDF.CancelSerialize;
                }
            var result;
            var serializedByCustomMethod = false;
            for (var propName_2 in VDF_5.VDF.GetObjectProps(obj))
                if (obj[propName_2] instanceof Function && obj[propName_2].tags && obj[propName_2].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFSerialize; })) {
                    var serializeResult = obj[propName_2](path, options);
                    if (serializeResult !== undefined) {
                        result = serializeResult;
                        serializedByCustomMethod = true;
                        break;
                    }
                }
            if (!serializedByCustomMethod) {
                result = new VDFNode_2.VDFNode();
                if (obj == null) { } //result.primitiveValue = null;
                else if (VDF_5.VDF.GetIsTypePrimitive(typeName))
                    result.primitiveValue = obj;
                else if (VDF_5.EnumValue.IsEnum(typeName))
                    result.primitiveValue = new VDF_5.EnumValue(typeName, obj).toString();
                else if (typeName && typeName.StartsWith("List(")) {
                    result.isList = true;
                    var objAsList = obj;
                    for (var i = 0; i < objAsList.length; i++) {
                        var itemNode = VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, path.ExtendAsListItem(i, objAsList[i]), true);
                        if (itemNode == VDF_5.VDF.CancelSerialize)
                            continue;
                        result.AddListChild(itemNode);
                    }
                }
                else if (typeName && typeName.StartsWith("Dictionary(")) {
                    result.isMap = true;
                    var objAsDictionary = obj;
                    for (var i = 0, pair = null, pairs = objAsDictionary.Pairs; i < pairs.length && (pair = pairs[i]); i++) {
                        var keyNode = VDFSaver.ToVDFNode(pair.key, typeGenericArgs[0], options, path.ExtendAsMapKey(i, pair.key), true); // stringify-attempt-1: use exporter
                        if (typeof keyNode.primitiveValue != "string")
                            //throw new Error("A map key object must either be a string or have an exporter that converts it into a string.");
                            keyNode = new VDFNode_2.VDFNode(pair.key.toString());
                        var valueNode = VDFSaver.ToVDFNode(pair.value, typeGenericArgs[1], options, path.ExtendAsMapItem(pair.key, pair.value), true);
                        if (valueNode == VDF_5.VDF.CancelSerialize)
                            continue;
                        result.SetMapChild(keyNode, valueNode);
                    }
                }
                else {
                    result.isMap = true;
                    // special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
                    for (var propName_3 in typeInfo.props) {
                        if (!(propName_3 in obj))
                            obj[propName_3] = null;
                    }
                    for (var propName_4 in obj)
                        try {
                            var propInfo = typeInfo.props[propName_4]; // || new VDFPropInfo("object"); // if prop-info not specified, consider its declared-type to be 'object'
                            /*let include = typeInfo.typeTag != null && typeInfo.typeTag.propIncludeRegexL1 != null ? new RegExp(typeInfo.typeTag.propIncludeRegexL1).test(propName) : false;
                            include = propInfo && propInfo.propTag && propInfo.propTag.includeL2 != null ? propInfo.propTag.includeL2 : include;*/
                            var include = propInfo && propInfo.propTag && propInfo.propTag.includeL2 != null ? propInfo.propTag.includeL2 : (typeInfo.typeTag != null && typeInfo.typeTag.propIncludeRegexL1 != null && new RegExp(typeInfo.typeTag.propIncludeRegexL1).test(propName_4));
                            if (!include)
                                continue;
                            var propValue = obj[propName_4];
                            if (propInfo && !propInfo.ShouldValueBeSaved(propValue))
                                continue;
                            var propNameNode = new VDFNode_2.VDFNode(propName_4);
                            var propValueNode = void 0;
                            var childPath = path.ExtendAsChild(propInfo, propValue);
                            for (var propName2 in VDF_5.VDF.GetObjectProps(obj))
                                if (obj[propName2] instanceof Function && obj[propName2].tags && obj[propName2].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFSerializeProp; })) {
                                    var serializeResult = obj[propName2](childPath, options);
                                    if (serializeResult !== undefined) {
                                        propValueNode = serializeResult;
                                        break;
                                    }
                                }
                            if (propValueNode === undefined)
                                propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.typeName : null, options, childPath);
                            if (propValueNode == VDF_5.VDF.CancelSerialize)
                                continue;
                            propValueNode.childPopOut = options.useChildPopOut && (propInfo && propInfo.propTag && propInfo.propTag.popOutL2 != null ? propInfo.propTag.popOutL2 : propValueNode.childPopOut);
                            result.SetMapChild(propNameNode, propValueNode);
                        }
                        catch (ex) {
                            ex.message += "\n==================\nRethrownAs) " + ("Error saving property '" + propName_4 + "'.") + "\n";
                            throw ex;
                        } /**/
                        finally { }
                }
            }
            if (declaredTypeName == null)
                if (result.isList || result.listChildren.Count > 0)
                    declaredTypeName = "List(object)";
                else if (result.isMap || result.mapChildren.Count > 0)
                    declaredTypeName = "Dictionary(object object)";
                else
                    declaredTypeName = "object";
            if (options.useMetadata && typeName != null && !VDF_5.VDF.GetIsTypeAnonymous(typeName) && ((options.typeMarking == VDFTypeMarking.Internal && !VDF_5.VDF.GetIsTypePrimitive(typeName) && typeName != declaredTypeName)
                || (options.typeMarking == VDFTypeMarking.External && !VDF_5.VDF.GetIsTypePrimitive(typeName) && (typeName != declaredTypeName || !declaredTypeInParentVDF))
                || options.typeMarking == VDFTypeMarking.ExternalNoCollapse))
                result.metadata = typeName;
            if (result.metadata_override != null)
                result.metadata = result.metadata_override;
            if (options.useChildPopOut && typeInfo && typeInfo.typeTag && typeInfo.typeTag.popOutL1)
                result.childPopOut = true;
            for (var propName in VDF_5.VDF.GetObjectProps(obj))
                if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(function (a) { return a instanceof VDFTypeInfo_3.VDFPostSerialize; }))
                    obj[propName](result, path, options);
            return result;
        };
        return VDFSaver;
    }());
    exports.VDFSaver = VDFSaver;
});
define("VDF", ["require", "exports", "VDFSaver", "VDFLoader", "VDFTypeInfo"], function (require, exports, VDFSaver_2, VDFLoader_3, VDFTypeInfo_4) {
    "use strict";
    // vdf globals
    // ==========
    var g = window;
    function Log() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (g.Log)
            return g.Log.apply(g, args);
        return console.log.apply(console, args);
    }
    exports.Log = Log;
    function Assert(condition, message) {
        if (condition)
            return;
        console.assert(false, message || "");
        debugger;
    }
    exports.Assert = Assert;
    // the below lets you easily add non-enumerable properties
    Object.defineProperty(Object.prototype, "_AddProperty", {
        enumerable: false,
        value: function (name, value) {
            Object.defineProperty(this, name, {
                enumerable: false,
                value: value
            });
        }
    });
    String.prototype._AddProperty("Contains", function (str) { return this.indexOf(str) != -1; });
    String.prototype._AddProperty("StartsWith", function (str) { return this.indexOf(str) == 0; });
    String.prototype._AddProperty("EndsWith", function (str) {
        var expectedPos = this.length - str.length;
        return this.indexOf(str, expectedPos) == expectedPos;
    });
    String.prototype._AddProperty("TrimStart", function (chars) {
        var result = "";
        var doneTrimming = false;
        for (var i = 0; i < this.length; i++)
            if (!chars.Contains(this[i]) || doneTrimming) {
                result += this[i];
                doneTrimming = true;
            }
        return result;
    });
    if (!Array.prototype["Contains"])
        Array.prototype._AddProperty("Contains", function (item) { return this.indexOf(item) != -1; });
    if (!Array.prototype["Where"])
        Array.prototype._AddProperty("Where", function (matchFunc) {
            if (matchFunc === void 0) { matchFunc = (function () { return true; }); }
            var result = this instanceof List ? new List(this.itemType) : [];
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                if (matchFunc.call(item, item))
                    result[this instanceof List ? "Add" : "push"](item);
            }
            return result;
        });
    if (!Array.prototype["First"])
        Array.prototype._AddProperty("First", function (matchFunc) {
            if (matchFunc === void 0) { matchFunc = (function () { return true; }); }
            return this.Where(matchFunc)[0];
        });
    Function.prototype._AddProperty("AddTags", function () {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        if (this.tags == null)
            this.tags = new List("object");
        for (var i = 0; i < tags.length; i++)
            this.tags.push(tags[i]);
        return this;
    });
    /*Function.prototype._AddProperty("IsDerivedFrom", function(baseType) {
        if (baseType == null)
            return false;
        var currentDerived = this.prototype;
        while (currentDerived.__proto__)	{
            if (currentDerived == baseType.prototype)
                return true;
            currentDerived = currentDerived.__proto__;
        }
        return false;
    });*/
    // classes
    // ==========
    var VDFNodePathNode = (function () {
        function VDFNodePathNode(obj, prop, list_index, map_keyIndex, map_key) {
            if (obj === void 0) { obj = null; }
            if (prop === void 0) { prop = null; }
            if (list_index === void 0) { list_index = null; }
            if (map_keyIndex === void 0) { map_keyIndex = null; }
            if (map_key === void 0) { map_key = null; }
            this.list_index = null;
            this.map_keyIndex = null;
            this.obj = obj;
            this.prop = prop;
            this.list_index = list_index;
            this.map_keyIndex = map_keyIndex;
            this.map_key = map_key;
        }
        //Clone(): VDFNodePathNode { return new VDFNodePathNode(this.obj, this.prop, this.list_index, this.map_keyIndex, this.map_key); }
        // for debugging
        VDFNodePathNode.prototype.toString = function () {
            if (this.list_index != null)
                return "i:" + this.list_index;
            if (this.map_keyIndex != null)
                return "ki:" + this.map_keyIndex;
            if (this.map_key != null)
                return "k:" + this.map_key;
            if (this.prop != null)
                //return "p:" + this.prop.name;
                return this.prop.name;
            return "";
        };
        return VDFNodePathNode;
    }());
    exports.VDFNodePathNode = VDFNodePathNode;
    var VDFNodePath = (function () {
        function VDFNodePath(nodes_orRootNode) {
            this.nodes = nodes_orRootNode instanceof Array ? nodes_orRootNode : [nodes_orRootNode];
        }
        Object.defineProperty(VDFNodePath.prototype, "rootNode", {
            get: function () { return this.nodes[0]; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VDFNodePath.prototype, "parentNode", {
            get: function () { return this.nodes.length >= 2 ? this.nodes[this.nodes.length - 2] : null; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(VDFNodePath.prototype, "currentNode", {
            get: function () { return this.nodes[this.nodes.length - 1]; },
            enumerable: true,
            configurable: true
        });
        VDFNodePath.prototype.ExtendAsListItem = function (index, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, null, index));
            return new VDFNodePath(newNodes);
        };
        VDFNodePath.prototype.ExtendAsMapKey = function (keyIndex, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, null, null, keyIndex));
            return new VDFNodePath(newNodes);
        };
        VDFNodePath.prototype.ExtendAsMapItem = function (key, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, null, null, null, key));
            return new VDFNodePath(newNodes);
        };
        VDFNodePath.prototype.ExtendAsChild = function (prop, obj) {
            var newNodes = this.nodes.slice(0);
            newNodes.push(new VDFNodePathNode(obj, prop));
            return new VDFNodePath(newNodes);
        };
        // for debugging
        VDFNodePath.prototype.toString = function () {
            var result = "";
            var index = 0;
            for (var _i = 0, _a = this.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                result += (index++ == 0 ? "" : "/") + node;
            }
            return result;
        };
        return VDFNodePath;
    }());
    exports.VDFNodePath = VDFNodePath;
    var VDF = (function () {
        function VDF() {
        }
        // v-name examples: "List(string)", "System.Collections.Generic.List(string)", "Dictionary(string string)"
        VDF.GetGenericArgumentsOfType = function (typeName) {
            var genericArgumentTypes = new Array(); //<string[]>[];
            var depth = 0;
            var lastStartBracketPos = -1;
            if (typeName != null)
                for (var i = 0; i < typeName.length; i++) {
                    var ch = typeName[i];
                    if (ch == ')')
                        depth--;
                    if ((depth == 0 && ch == ')') || (depth == 1 && ch == ' '))
                        genericArgumentTypes.push(typeName.substring(lastStartBracketPos + 1, i)); // get generic-parameter type-str
                    if ((depth == 0 && ch == '(') || (depth == 1 && ch == ' '))
                        lastStartBracketPos = i;
                    if (ch == '(')
                        depth++;
                }
            return genericArgumentTypes;
        };
        VDF.IsTypeXDerivedFromY = function (xTypeName, yTypeName) {
            if (xTypeName == null || yTypeName == null || window[xTypeName] == null || window[yTypeName] == null)
                return false;
            var currentDerived = window[xTypeName].prototype;
            while (currentDerived.__proto__) {
                if (currentDerived == window[yTypeName].prototype)
                    return true;
                currentDerived = currentDerived.__proto__;
            }
            return false;
        };
        // (technically strings are not primitives in C#, but we consider them such)
        VDF.GetIsTypePrimitive = function (typeName) {
            return [
                "byte", "sbyte", "short", "ushort",
                "int", "uint", "long", "ulong", "float", "double", "decimal",
                "bool", "char", "string"
            ].Contains(typeName);
        };
        VDF.GetIsTypeAnonymous = function (typeName) {
            return typeName != null && typeName == "object";
        };
        VDF.GetTypeNameOfObject = function (obj) {
            var rawType = typeof obj;
            if (rawType == "object") {
                if (obj.realTypeName)
                    return obj.realTypeName;
                if (obj.itemType)
                    return "List(" + obj.itemType + ")";
                var nativeTypeName = obj.constructor.name_fake || obj.constructor.name || null;
                if (nativeTypeName == "Boolean")
                    return "bool";
                if (nativeTypeName == "Number")
                    return obj.toString().Contains(".") ? "double" : "int";
                if (nativeTypeName == "String")
                    return "string";
                if (nativeTypeName == "Object")
                    return "object";
                if (nativeTypeName == "Array")
                    return "List(object)";
                return nativeTypeName;
            }
            if (rawType == "boolean")
                return "bool";
            if (rawType == "number")
                return obj.toString().Contains(".") ? "double" : "int";
            if (rawType == "string")
                return "string";
            //return rawType; // string
            //return null;
            //return "object"; // consider objects with raw-types of undefined, function, etc. to just be anonymous-objects
            return "object"; // consider everything else to be an anonymous-object
        };
        VDF.GetTypeNameRoot = function (typeName) { return typeName != null && typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName; };
        VDF.GetClassProps = function (type, allowGetFromCache) {
            if (allowGetFromCache === void 0) { allowGetFromCache = true; }
            if (type == null)
                return {};
            if (!type.hasOwnProperty("classPropsCache") || type.allowPropsCache === false || !allowGetFromCache) {
                var result = {};
                var currentType = type;
                while (currentType && currentType != Object) {
                    // get static props on constructor itself
                    for (var _i = 0, _a = Object.getOwnPropertyNames(currentType); _i < _a.length; _i++) {
                        var propName = _a[_i];
                        if (propName in result)
                            continue;
                        var propInfo = Object.getOwnPropertyDescriptor(currentType, propName);
                        // don't include if prop is a getter or setter func (causes problems when enumerating)
                        if (propInfo == null || (propInfo.get == null && propInfo.set == null))
                            result[propName] = currentType[propName];
                    }
                    // get "real" props on the prototype-object
                    for (var _b = 0, _c = Object.getOwnPropertyNames(currentType.prototype); _b < _c.length; _b++) {
                        var propName = _c[_b];
                        if (propName in result)
                            continue;
                        var propInfo = Object.getOwnPropertyDescriptor(currentType.prototype, propName);
                        // don't include if prop is a getter or setter func (causes problems when enumerating)
                        if (propInfo == null || (propInfo.get == null && propInfo.set == null))
                            result[propName] = currentType.prototype[propName];
                    }
                    currentType = Object.getPrototypeOf(currentType.prototype).constructor;
                }
                type.classPropsCache = result;
            }
            return type.classPropsCache;
        };
        VDF.GetObjectProps = function (obj) {
            if (obj == null)
                return {};
            var result = {};
            for (var propName in VDF.GetClassProps(obj.constructor))
                result[propName] = null;
            for (var propName in obj)
                result[propName] = null;
            return result;
        };
        VDF.Serialize = function (obj, declaredTypeName_orOptions, options_orNothing) {
            if (declaredTypeName_orOptions instanceof VDFSaver_2.VDFSaveOptions)
                return VDF.Serialize(obj, null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            var options = options_orNothing;
            return VDFSaver_2.VDFSaver.ToVDFNode(obj, declaredTypeName, options).ToVDF(options);
        };
        VDF.Deserialize = function (vdf, declaredTypeName_orOptions, options_orNothing) {
            if (declaredTypeName_orOptions instanceof VDFLoader_3.VDFLoadOptions)
                return VDF.Deserialize(vdf, null, declaredTypeName_orOptions);
            var declaredTypeName = declaredTypeName_orOptions;
            var options = options_orNothing;
            return VDFLoader_3.VDFLoader.ToVDFNode(vdf, declaredTypeName, options).ToObject(declaredTypeName, options);
        };
        VDF.DeserializeInto = function (vdf, obj, options) { VDFLoader_3.VDFLoader.ToVDFNode(vdf, VDF.GetTypeNameOfObject(obj), options).IntoObject(obj, options); };
        return VDF;
    }());
    // for use with VDFSaveOptions
    VDF.AnyMember = "#AnyMember";
    VDF.AllMembers = ["#AnyMember"];
    // for use with VDFType
    VDF.PropRegex_Any = ""; //"^.+$";
    exports.VDF = VDF;
    // helper classes
    // ==================
    var VDFUtils = (function () {
        function VDFUtils() {
        }
        /*static SetUpHiddenFields(obj, addSetters?: boolean, ...fieldNames) 	{
            if (addSetters && !obj._hiddenFieldStore)
                Object.defineProperty(obj, "_hiddenFieldStore", {enumerable: false, value: {}});
            for (var i in fieldNames)
                (()=>{
                    var propName = fieldNames[i];
                    var origValue = obj[propName];
                    if (addSetters)
                        Object.defineProperty(obj, propName, 					{
                            enumerable: false,
                            get: ()=>obj["_hiddenFieldStore"][propName],
                            set: value=>obj["_hiddenFieldStore"][propName] = value
                        });
                    else
                        Object.defineProperty(obj, propName, 					{
                            enumerable: false,
                            value: origValue //get: ()=>obj["_hiddenFieldStore"][propName]
                        });
                    obj[propName] = origValue; // for 'hiding' a prop that was set beforehand
                })();
        }*/
        VDFUtils.MakePropertiesHidden = function (obj, alsoMakeFunctionsHidden, addSetters) {
            for (var propName in obj) {
                var propDescriptor = Object.getOwnPropertyDescriptor(obj, propName);
                if (propDescriptor) {
                    propDescriptor.enumerable = false;
                    Object.defineProperty(obj, propName, propDescriptor);
                }
            }
        };
        return VDFUtils;
    }());
    var StringBuilder = (function () {
        function StringBuilder(startData) {
            this.parts = [];
            this.length = 0;
            if (startData)
                this.Append(startData);
        }
        StringBuilder.prototype.Append = function (str) { this.parts.push(str); this.length += str.length; return this; }; // adds string str to the StringBuilder
        StringBuilder.prototype.Insert = function (index, str) { this.parts.splice(index, 0, str); this.length += str.length; return this; }; // inserts string 'str' at 'index'
        StringBuilder.prototype.Remove = function (index, count) {
            var removedItems = this.parts.splice(index, count != null ? count : 1);
            for (var i = 0; i < removedItems.length; i++)
                this.length -= removedItems[i].length;
            return this;
        };
        StringBuilder.prototype.Clear = function () {
            //this.splice(0, this.length);
            this.parts.length = 0;
            this.length = 0;
        };
        StringBuilder.prototype.ToString = function (joinerString) { return this.parts.join(joinerString || ""); }; // builds the string
        return StringBuilder;
    }());
    exports.StringBuilder = StringBuilder;
    // tags
    // ----------
    var PropDeclarationWrapper = (function () {
        function PropDeclarationWrapper() {
        }
        Object.defineProperty(PropDeclarationWrapper.prototype, "set", {
            set: function (value) { },
            enumerable: true,
            configurable: true
        });
        return PropDeclarationWrapper;
    }());
    // maybe make-so: this is renamed PropInfo
    function Prop(typeOrObj, propName, propType_orFirstTag) {
        var tags = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            tags[_i - 3] = arguments[_i];
        }
        if (propType_orFirstTag != null && typeof propType_orFirstTag != "string")
            return Prop.apply(this, [typeOrObj, propName, null, propType_orFirstTag].concat(tags));
        var type = typeOrObj instanceof Function ? typeOrObj : typeOrObj.constructor;
        var propType = propType_orFirstTag;
        var typeInfo = VDFTypeInfo_4.VDFTypeInfo.Get(type);
        if (typeInfo.props[propName] == null)
            typeInfo.props[propName] = new VDFTypeInfo_4.VDFPropInfo(propName, propType, tags);
        return new PropDeclarationWrapper();
    }
    ;
    /*function MethodDeclarationWrapper(tags) { this.tags = tags; };
    MethodDeclarationWrapper.prototype._AddSetter_Inline = function set(method) { method.methodInfo = new VDFMethodInfo(this.tags); };
    function Method(...tags) { return new MethodDeclarationWrapper(tags); };*/
    function TypeDeclarationWrapper(tags) { this.tags = tags; }
    ;
    TypeDeclarationWrapper.prototype._AddSetter_Inline = function set(type) {
        var s = this;
        type = type instanceof Function ? type : type.constructor;
        var typeInfo = VDFTypeInfo_4.VDFTypeInfo.Get(type.name_fake || type.name);
        var typeTag = {};
        for (var i in s.tags)
            if (s.tags[i] instanceof VDFTypeInfo_4.VDFType)
                typeTag = s.tags[i];
        typeInfo.tags = s.tags;
        typeInfo.typeTag.AddDataOf(typeTag);
    };
    function TypeInfo() {
        var tags = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tags[_i] = arguments[_i];
        }
        return new TypeDeclarationWrapper(tags);
    }
    ;
    // VDF-usable data wrappers
    // ==========
    //class object {} // for use with VDF.Deserialize, to deserialize to an anonymous object
    // for anonymous objects (JS anonymous-objects are all just instances of Object, so we don't lose anything by attaching type-info to the shared constructor)
    //var object = Object;
    //object["typeInfo"] = new VDFTypeInfo(null, true);
    var object = (function () {
        function object() {
        }
        return object;
    }()); // just an alias for Object, to be consistent with C# version
    exports.object = object;
    var EnumValue = (function () {
        function EnumValue(enumTypeName, intValue) {
            this.realTypeName = enumTypeName;
            //this.intValue = intValue;
            this.stringValue = EnumValue.GetEnumStringForIntValue(enumTypeName, intValue);
        }
        EnumValue.prototype.toString = function () { return this.stringValue; };
        EnumValue.IsEnum = function (typeName) { return window[typeName] && window[typeName]["_IsEnum"] === 0; };
        //static IsEnum(typeName: string): boolean { return window[typeName] && /}\)\((\w+) \|\| \(\w+ = {}\)\);/.test(window[typeName].toString()); }
        EnumValue.GetEnumIntForStringValue = function (enumTypeName, stringValue) { return eval(enumTypeName + "[\"" + stringValue + "\"]"); };
        EnumValue.GetEnumStringForIntValue = function (enumTypeName, intValue) { return eval(enumTypeName + "[" + intValue + "]"); };
        return EnumValue;
    }());
    exports.EnumValue = EnumValue;
    var List = (function (_super) {
        __extends(List, _super);
        function List(itemType) {
            var items = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                items[_i - 1] = arguments[_i];
            }
            var _this = _super.apply(this, items) || this;
            _this.itemType = itemType;
            return _this;
        }
        Object.defineProperty(List.prototype, "Count", {
            get: function () { return this.length; },
            enumerable: true,
            configurable: true
        });
        /*s.Indexes = function () {
            var result = {};
            for (var i = 0; i < this.length; i++)
                result[i] = this[i];
            return result;
        };*/
        List.prototype.Add = function () {
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            return this.push.apply(this, items);
        };
        ;
        List.prototype.AddRange = function (items) {
            /*for (var i = 0; i < items.length; i++)
                this.push(items[i]);*/
            this.push.apply(this, items);
        };
        ;
        List.prototype.Insert = function (index, item) { return this.splice(index, 0, item); };
        ;
        List.prototype.InsertRange = function (index, items) { return this.splice.apply(this, [index, 0].concat(items)); };
        ;
        List.prototype.Remove = function (item) { return this.RemoveAt(this.indexOf(item)) != null; };
        ;
        List.prototype.RemoveAt = function (index) { return this.splice(index, 1)[0]; };
        ;
        List.prototype.RemoveRange = function (index, count) { return this.splice(index, count); };
        ;
        List.prototype.Any = function (matchFunc) {
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                if (matchFunc.call(item, item))
                    return true;
            }
            return false;
        };
        ;
        List.prototype.All = function (matchFunc) {
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!matchFunc.call(item, item))
                    return false;
            }
            return true;
        };
        ;
        List.prototype.Select = function (selectFunc, itemType) {
            var result = new List(itemType || "object");
            for (var _i = 0, _a = this; _i < _a.length; _i++) {
                var item = _a[_i];
                result.Add(selectFunc.call(item, item));
            }
            return result;
        };
        ;
        List.prototype.First = function (matchFunc) {
            var result = this.FirstOrDefault(matchFunc);
            if (result == null)
                throw new Error("Matching item not found.");
            return result;
        };
        ;
        List.prototype.FirstOrDefault = function (matchFunc) {
            if (matchFunc) {
                for (var _i = 0, _a = this; _i < _a.length; _i++) {
                    var item = _a[_i];
                    if (matchFunc.call(item, item))
                        return item;
                }
                return null;
            }
            else
                return this[0];
        };
        ;
        List.prototype.Last = function (matchFunc) {
            var result = this.LastOrDefault(matchFunc);
            if (result == null)
                throw new Error("Matching item not found.");
            return result;
        };
        ;
        List.prototype.LastOrDefault = function (matchFunc) {
            if (matchFunc) {
                for (var i = this.length - 1; i >= 0; i--)
                    if (matchFunc.call(this[i], this[i]))
                        return this[i];
                return null;
            }
            else
                return this[this.length - 1];
        };
        ;
        List.prototype.GetRange = function (index, count) {
            var result = new List(this.itemType);
            for (var i = index; i < index + count; i++)
                result.Add(this[i]);
            return result;
        };
        ;
        List.prototype.Contains = function (item) { return this.indexOf(item) != -1; };
        ;
        return List;
    }(Array));
    exports.List = List;
    window["List"] = List;
    var Dictionary = (function () {
        function Dictionary(keyType, valueType, keyValuePairsObj) {
            //VDFUtils.SetUpHiddenFields(this, true, "realTypeName", "keyType", "valueType", "keys", "values");
            this.realTypeName = "Dictionary(" + keyType + " " + valueType + ")";
            this.keyType = keyType;
            this.valueType = valueType;
            this.keys = [];
            this.values = [];
            if (keyValuePairsObj)
                for (var key in keyValuePairsObj)
                    this.Set(key, keyValuePairsObj[key]);
        }
        Object.defineProperty(Dictionary.prototype, "Keys", {
            // properties
            get: function () {
                var result = {};
                for (var i = 0; i < this.keys.length; i++)
                    result[this.keys[i]] = null;
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "Pairs", {
            get: function () {
                var result = [];
                for (var i = 0; i < this.keys.length; i++)
                    result.push({ index: i, key: this.keys[i], value: this.values[i] });
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Dictionary.prototype, "Count", {
            get: function () { return this.keys.length; },
            enumerable: true,
            configurable: true
        });
        // methods
        Dictionary.prototype.ContainsKey = function (key) { return this.keys.indexOf(key) != -1; };
        Dictionary.prototype.Get = function (key) { return this.values[this.keys.indexOf(key)]; };
        Dictionary.prototype.Set = function (key, value) {
            if (this.keys.indexOf(key) == -1)
                this.keys.push(key);
            this.values[this.keys.indexOf(key)] = value;
            if (typeof key == "string")
                this[key] = value; // make value accessible directly on Dictionary object
        };
        Dictionary.prototype.Add = function (key, value) {
            if (this.keys.indexOf(key) != -1)
                throw new Error("Dictionary already contains key '" + key + "'.");
            this.Set(key, value);
        };
        Dictionary.prototype.Remove = function (key) {
            var itemIndex = this.keys.indexOf(key);
            if (itemIndex == -1)
                return;
            this.keys.splice(itemIndex, 1);
            this.values.splice(itemIndex, 1);
            delete this[key];
        };
        return Dictionary;
    }());
    exports.Dictionary = Dictionary;
    window["Dictionary"] = Dictionary;
    //VDFUtils.MakePropertiesHidden(Dictionary.prototype, true);
    // tags
    // ==========
    function T(typeOrTypeName) {
        return function (target, name) {
            //target.prototype[name].AddTags(new VDFPostDeserialize());
            //Prop(target, name, typeOrTypeName);
            //target.p(name, typeOrTypeName);
            var propInfo = VDFTypeInfo_4.VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.typeName = typeOrTypeName instanceof Function ? typeOrTypeName.name : typeOrTypeName;
        };
    }
    exports.T = T;
    ;
    g.Extend({ T: T });
    function P(includeL2, popOutL2) {
        if (includeL2 === void 0) { includeL2 = true; }
        return function (target, name) {
            var propInfo = VDFTypeInfo_4.VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.AddTags(new VDFTypeInfo_4.VDFProp(includeL2, popOutL2));
        };
    }
    exports.P = P;
    ;
    g.Extend({ P: P });
});
//export var D;
/*export let D = ()=> {
    let D_ = function(...args) {
        return (target, name)=> {
            var propInfo = VDFTypeInfo.Get(target.constructor).GetProp(name);
            propInfo.AddTags(new DefaultValue(...args));
        };
    };
    // copy D.NullOrEmpty and such
    for (var key in g.D)
        D_[key] = g.D[key];
    return D_;
};*/ 
//# sourceMappingURL=JavaScript_Bundle.js.map