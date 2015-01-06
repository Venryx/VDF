enum VDFTokenType
{
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
	LiteralStartMarker,
	LiteralEndMarker,
	StringStartMarker,
	StringEndMarker,
	InLineComment,
	SpaceOrCommaSpan,

	None,
	Tab,
	LineBreak,

	Metadata,
	MetadataEndMarker,
	Key,
	KeyValueSeparator,
	PoppedOutChildGroupMarker,

	Null,
	Boolean,
	Number,
	String,
	ListStartMarker,
	ListEndMarker,
	MapStartMarker,
	MapEndMarker
}
class VDFToken
{
	type: VDFTokenType;
	position: number;
	index: number;
	text: string;
	constructor(type: VDFTokenType, position: number, index: number, text: string)
	{
		this.type = type;
		this.position = position;
		this.index = index;
		this.text = text;
	}
}
class VDFTokenParser
{
	static charsAToZ: List<string> = <List<string>>List.apply(null, ["string"].concat("abcdefghijklmnopqrstuvwxyz".match(/./g)));
	static chars0To9DotAndNegative: List<string> = <List<string>>List.apply(null, ["string"].concat("0123456789\.\-".match(/./g)));
	public static ParseTokens(text: string, options?: VDFLoadOptions, parseAllTokens = false, postProcessTokens = true): List<VDFToken>
	{
		text = (text || "").replace(/\r\n/g, "\n"); // maybe temp
		options = options || new VDFLoadOptions();

		var result = new List<VDFToken>("VDFToken");

		var currentTokenFirstCharPos = 0;
		var currentTokenTextBuilder = new StringBuilder();
		var currentTokenType = VDFTokenType.None;
		var activeLiteralStartChars: string = null;
		var activeStringStartChar: string = null;
		var lastScopeIncreaseChar: string = null;
		for (var i = 0; i < text.length; i++)
		{
			var ch = text[i];
			var nextChar = i + 1 < text.length ? text[i + 1] : null;

			var nextNonSpaceCharPos = VDFTokenParser.FindNextNonXCharPosition(text, i + 1, ' ');
			var nextNonSpaceChar = nextNonSpaceCharPos != -1 ? text[nextNonSpaceCharPos] : null;

			currentTokenTextBuilder.Append(ch);

			if (activeLiteralStartChars == null)
			{
				if (ch == '<' && nextChar == '<') // if first char of literal-start-marker
				{
					activeLiteralStartChars = "";
					while (i + activeLiteralStartChars.length < text.length && text[i + activeLiteralStartChars.length] == '<')
						activeLiteralStartChars += "<";
					currentTokenTextBuilder = new StringBuilder(activeLiteralStartChars);
					currentTokenType = VDFTokenType.LiteralStartMarker;
					i += currentTokenTextBuilder.Length - 1; // have next char processed be the one right after comment (i.e. the line-break char)
				}
			}
			else if (i + activeLiteralStartChars.length <= text.length && text.substr(i, activeLiteralStartChars.length) == activeLiteralStartChars.replace(/</g, ">"))
			{
				currentTokenTextBuilder = new StringBuilder(activeLiteralStartChars.replace(/</g, ">"));
				currentTokenType = VDFTokenType.LiteralEndMarker;
				i += currentTokenTextBuilder.Length - 1; // have next char processed be the one right after literal-end-marker
				activeLiteralStartChars = null;
			}
			if (activeStringStartChar == null)
			{
				if (ch == '\'' || ch == '"') // if char of string-start-marker
				{
					activeStringStartChar = ch.toString();
					currentTokenType = VDFTokenType.StringStartMarker;
				}
			}
			else if (((activeStringStartChar == "'" && ch == '\'') || (activeStringStartChar == "\"" && ch == '"')) && activeLiteralStartChars == null)
			{
				currentTokenType = VDFTokenType.StringEndMarker;
				activeStringStartChar = null;
			}

			var lastCharInLiteral = activeLiteralStartChars != null && i + 1 + activeLiteralStartChars.length <= text.length && text.substr(i + 1, activeLiteralStartChars.length) == activeLiteralStartChars.replace(/</g, ">");
			if (lastCharInLiteral)
				nextChar = i + 1 + activeLiteralStartChars.length < text.length ? text[i + 1 + activeLiteralStartChars.length] : null; // shift next-char to one right after literal-end-marker (i.e. pretend it isn't there)
			var lastCharInString = (activeStringStartChar == "'" && nextChar == '\'') || (activeStringStartChar == "\"" && nextChar == '"');
			if (currentTokenType == VDFTokenType.None && (activeLiteralStartChars == null || lastCharInLiteral) && (activeStringStartChar == null || lastCharInString)) // if not in pass-through-span
			{
				var firstTokenChar = currentTokenTextBuilder.Length == 1;
				if (ch == '#' && nextChar == '#' && firstTokenChar) // if first char of in-line-comment
				{
					currentTokenTextBuilder = new StringBuilder(text.substr(i, (text.indexOf("\n", i + 1) != -1 ? text.indexOf("\n", i + 1) : text.length) - i));
					currentTokenType = VDFTokenType.InLineComment;
					i += currentTokenTextBuilder.Length - 1; // have next char processed by the one right after comment (i.e. the line-break char)
				}
				else if (currentTokenTextBuilder.ToString().TrimStart(options.allowCommaSeparators ? [' ', ','] : [' ']).length == 0 && (ch == ' ' || (options.allowCommaSeparators && ch == ',')) && (nextChar != ' ' && (!options.allowCommaSeparators || nextChar != ','))) // if last char of space-or-comma-span
					currentTokenType = VDFTokenType.SpaceOrCommaSpan;

				else if (ch == '\t' && firstTokenChar)
					currentTokenType = VDFTokenType.Tab;
				else if (ch == '\n' && firstTokenChar)
					currentTokenType = VDFTokenType.LineBreak;

				else if (nextNonSpaceChar == '>' && activeLiteralStartChars == null)
					currentTokenType = VDFTokenType.Metadata;
				else if (ch == '>' && firstTokenChar)
					currentTokenType = VDFTokenType.MetadataEndMarker;
				else if (nextNonSpaceChar == ':')
					currentTokenType = VDFTokenType.Key;
				else if (ch == ':' && firstTokenChar)
					currentTokenType = VDFTokenType.KeyValueSeparator;
				else if (ch == '^' && firstTokenChar)
					currentTokenType = VDFTokenType.PoppedOutChildGroupMarker;

				else if (currentTokenTextBuilder.Length == 4 && currentTokenTextBuilder.ToString() == "null" && (nextChar == null || !VDFTokenParser.charsAToZ.Contains(nextChar))) // if text-so-far is 'null', and there's no more letters
					currentTokenType = VDFTokenType.Null;
				else if (((currentTokenTextBuilder.Length == 5 && currentTokenTextBuilder.ToString() == "false") || (currentTokenTextBuilder.Length == 4 && currentTokenTextBuilder.ToString() == "true")) && (nextChar == null || !VDFTokenParser.charsAToZ.Contains(nextChar)))
					currentTokenType = VDFTokenType.Boolean;
				else if (VDFTokenParser.chars0To9DotAndNegative.Contains(currentTokenTextBuilder.data[0]) && (nextChar == null || !VDFTokenParser.chars0To9DotAndNegative.Contains(nextChar)) && nextChar != '\'' && nextChar != '"' && (lastScopeIncreaseChar == "[" || result.Count == 0 || result.Last().type == VDFTokenType.Metadata || result.Last().type == VDFTokenType.KeyValueSeparator))
					currentTokenType = VDFTokenType.Number;
				else if ((activeStringStartChar == "'" && nextChar == '\'') || (activeStringStartChar == "\"" && nextChar == '"'))
				{
					if (activeLiteralStartChars != null)
					{
						currentTokenFirstCharPos++;
						currentTokenTextBuilder = new StringBuilder(VDFTokenParser.UnpadString(currentTokenTextBuilder.ToString()));
					}
					currentTokenType = VDFTokenType.String;
				}
				else if (ch == '[' && firstTokenChar)
				{
					currentTokenType = VDFTokenType.ListStartMarker;
					lastScopeIncreaseChar = ch;
				}
				else if (ch == ']' && firstTokenChar)
					currentTokenType = VDFTokenType.ListEndMarker;
				else if (ch == '{' && firstTokenChar)
				{
					currentTokenType = VDFTokenType.MapStartMarker;
					lastScopeIncreaseChar = ch;
				}
				else if (ch == '}' && firstTokenChar)
					currentTokenType = VDFTokenType.MapEndMarker;
			}

			if (currentTokenType != VDFTokenType.None)
			{
				if (currentTokenType == VDFTokenType.StringStartMarker && ch == nextChar) // special case; empty string
					result.Add(new VDFToken(VDFTokenType.String, currentTokenFirstCharPos, result.Count, ""));
				if (parseAllTokens || (currentTokenType != VDFTokenType.LiteralStartMarker && currentTokenType != VDFTokenType.LiteralEndMarker && currentTokenType != VDFTokenType.StringStartMarker && currentTokenType != VDFTokenType.StringEndMarker && currentTokenType != VDFTokenType.InLineComment && currentTokenType != VDFTokenType.SpaceOrCommaSpan && currentTokenType != VDFTokenType.MetadataEndMarker))
					result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count, currentTokenTextBuilder.ToString()));

				currentTokenFirstCharPos = i + 1;
				currentTokenTextBuilder.Clear();
				currentTokenType = VDFTokenType.None;
			}
		}

		if (postProcessTokens)
			VDFTokenParser.PostProcessTokens(result, options);

		return result;
	}
	static FindNextNonXCharPosition(text: string, startPos: number, x: string)
	{
		for (var i = startPos; i < text.length; i++)
			if (text[i] != x)
				return i;
		return -1;
	}
	static UnpadString(paddedString: string)
	{
		var result = paddedString;
		if (result.StartsWith("#"))
			result = result.substr(1); // chop off first char, as it was just added by the serializer for separation
		if (result.EndsWith("#"))
			result = result.substr(0, result.length - 1);
		return result;
	}

	static PostProcessTokens(tokens: List<VDFToken>, options: VDFLoadOptions)
	{
		// pass 1: update strings-before-key-value-separator-tokens to be considered keys, if that's enabled (for JSON compatibility)
		// ----------
		
		if (options.allowStringKeys)
			for (var i = 0; i < tokens.Count; i++)
				if (tokens[i].type == VDFTokenType.String && i + 1 < tokens.Count && tokens[i + 1].type == VDFTokenType.KeyValueSeparator)
					tokens[i].type = VDFTokenType.Key;

		// pass 2: re-wrap popped-out-children with parent brackets/braces
		// ----------

		tokens.Add(new VDFToken(VDFTokenType.None, -1, -1, "")); // maybe temp: add depth-0-ender helper token

		var line_tabsReached = 0;
		var tabDepth_popOutBlockEndWrapTokens = new Dictionary<number, List<VDFToken>>("int", "List(VDFToken)");
		for (var i = 0; i < tokens.Count; i++)
		{
			var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
			var token = tokens[i];
			if (token.type == VDFTokenType.Tab)
				line_tabsReached++;
			else if (token.type == VDFTokenType.LineBreak)
				line_tabsReached = 0;
			else if (token.type == VDFTokenType.PoppedOutChildGroupMarker)
			{
				if (lastToken.type == VDFTokenType.ListStartMarker || lastToken.type == VDFTokenType.MapStartMarker) //lastToken.type != VDFTokenType.Tab)
				{
					var enderTokenIndex = i + 1;
					while (enderTokenIndex < tokens.Count - 1 && tokens[enderTokenIndex].type != VDFTokenType.LineBreak && (tokens[enderTokenIndex].type != VDFTokenType.PoppedOutChildGroupMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.ListStartMarker || tokens[enderTokenIndex - 1].type == VDFTokenType.MapStartMarker))
						enderTokenIndex++;
					var wrapGroupTabDepth = tokens[enderTokenIndex].type == VDFTokenType.PoppedOutChildGroupMarker ? line_tabsReached - 1 : line_tabsReached;
					tabDepth_popOutBlockEndWrapTokens.Set(wrapGroupTabDepth, tokens.GetRange(i + 1, enderTokenIndex - (i + 1)));
					i = enderTokenIndex - 1; // have next token processed be the ender-token (^^[...] or line-break)
				}
				else if (lastToken.type == VDFTokenType.Tab)
				{
					var wrapGroupTabDepth = lastToken.type == VDFTokenType.Tab ? line_tabsReached - 1 : line_tabsReached;
					for (var i2 in tabDepth_popOutBlockEndWrapTokens[wrapGroupTabDepth].Indexes())
					{
						var token2 = tabDepth_popOutBlockEndWrapTokens[wrapGroupTabDepth][i2];
						tokens.Remove(token2);
						tokens.Insert(i - 1, token2);
					}
					i -= tabDepth_popOutBlockEndWrapTokens[wrapGroupTabDepth].Count + 1; // have next token processed be the first pop-out-block-end-wrap-token
					tabDepth_popOutBlockEndWrapTokens.Remove(wrapGroupTabDepth);
				}
			}
			else if (lastToken != null && (lastToken.type == VDFTokenType.LineBreak || lastToken.type == VDFTokenType.Tab || token.type == VDFTokenType.None))
			{
				if (token.type == VDFTokenType.None) // if depth-0-ender helper token
					line_tabsReached = 0;
				if (tabDepth_popOutBlockEndWrapTokens.Count > 0)
				{
					var maxTabDepth = -1;
					for (var key in tabDepth_popOutBlockEndWrapTokens.Keys)
						if (parseInt(key) > maxTabDepth)
							maxTabDepth = parseInt(key);
					for (var tabDepth = maxTabDepth; tabDepth >= line_tabsReached; tabDepth--)
						if (tabDepth_popOutBlockEndWrapTokens.ContainsKey(tabDepth))
						{
							for (var i2 in tabDepth_popOutBlockEndWrapTokens[tabDepth].Indexes())
							{
								var token2 = tabDepth_popOutBlockEndWrapTokens[tabDepth][i2];
								tokens.Remove(token2);
								tokens.Insert(i - 1, token2);
							}
							tabDepth_popOutBlockEndWrapTokens.Remove(tabDepth);
						}
				}
			}
		}

		tokens.RemoveAt(tokens.Count - 1); // maybe temp: remove depth-0-ender helper token

		// pass 3: remove all now-useless tokens
		// ----------

		for (var i = tokens.Count - 1; i >= 0; i--)
			if (tokens[i].type == VDFTokenType.Tab || tokens[i].type == VDFTokenType.LineBreak || tokens[i].type == VDFTokenType.MetadataEndMarker || tokens[i].type == VDFTokenType.KeyValueSeparator || tokens[i].type == VDFTokenType.PoppedOutChildGroupMarker)
				tokens.RemoveAt(i);

		// pass 4: fix token position-and-index properties
		// ----------

		VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);

		//Console.Write(String.Join(" ", tokens.Select(a=>a.text).ToArray())); // temp; for testing
	}
	static RefreshTokenPositionAndIndexProperties(tokens: List<VDFToken>)
	{
		var textProcessedLength = 0;
		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			token.position = textProcessedLength;
			token.index = i;
			textProcessedLength += token.text.length;
		}
	}
}