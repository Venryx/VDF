enum VDFTokenType
{
	None,
	WiderMetadataEndMarker,
	MetadataBaseValue,
	MetadataEndMarker,
	//LiteralStartMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
	//LiteralEndMarker
	DataPropName,
	DataStartMarker,
	PoppedOutDataStartMarker,
	PoppedOutDataEndMarker,
	ItemSeparator,
	DataBaseValue,
	DataEndMarker,
	LineBreak,
	InLineComment,
	Indent
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
	public static ParseTokens(text: string, postProcessTokens: boolean = true): List<VDFToken>
	{
		text = (text || "").replace(/\r\n/, "\n");

		var result = new List<VDFToken>("VDFToken");

		var inLiteralMarkers = false;
		var currentTokenFirstCharPos = 0;
		var currentTokenType = VDFTokenType.None;
		var currentTokenTextBuilder = new StringBuilder();
		for (var i = 0; i < text.length && currentTokenType == VDFTokenType.None; i++)
		{
			var lastChar = i - 1 >= 0 ? text[i - 1] : null;
			var ch = text[i];
			var nextChar = i + 1 < text.length ? text[i + 1] : null;
			var nextNextChar = i + 2 < text.length ? text[i + 2] : null;
			var nextNextNextChar = i + 3 < text.length ? text[i + 3] : null;

			var grabExtraCharsAsOwnAndSkipTheirProcessing = (count, addToTokenTextBuilder)=>
			{
				if (addToTokenTextBuilder)
					currentTokenTextBuilder.Append(text.substr(i + 1, count));
				i += count;
			};

			if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') // if first char of literal-start-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				inLiteralMarkers = true;
			}
			else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) // if first char of literal-end-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				currentTokenTextBuilder = new StringBuilder(VDFTokenParser.FinalizedDataStringToRaw(currentTokenTextBuilder.ToString()));
				inLiteralMarkers = false;
				currentTokenType = VDFTokenType.DataBaseValue; // cause the return of chars as DataBaseValue token
			}
			else
				currentTokenTextBuilder.Append(ch);

			if (inLiteralMarkers) // don't do any token processing, (other than the literal-block-related stuff), until literal-end-marker is reached
				continue;

			if (ch == '>')
				if (nextChar == '>')
				{
					currentTokenType = VDFTokenType.WiderMetadataEndMarker;
					grabExtraCharsAsOwnAndSkipTheirProcessing(1, true);
				}
				else
					currentTokenType = VDFTokenType.MetadataEndMarker;
			else if (ch == '{')
				currentTokenType = VDFTokenType.DataStartMarker;
			else if (ch == '}')
				currentTokenType = VDFTokenType.DataEndMarker;
			else if (ch == ':')
				currentTokenType = VDFTokenType.PoppedOutDataStartMarker;
			else if (ch == '^')
				currentTokenType = VDFTokenType.PoppedOutDataEndMarker;
			else if (ch == '\n')
				currentTokenType = VDFTokenType.LineBreak;
			else if (ch == ';' && nextChar == ';')
			{
				currentTokenType = VDFTokenType.InLineComment;
				var newNextCharPos = VDFTokenParser.FindNextLineBreakCharPos(text, i + 2); // since rest of line is comment, skip to first char of next line
				grabExtraCharsAsOwnAndSkipTheirProcessing((newNextCharPos != -1 ? newNextCharPos + 1 : text.length) - (i + 1), true);
			}
			else if (ch == '\t')
				currentTokenType = VDFTokenType.Indent;
			else if (ch == '|')
				currentTokenType = VDFTokenType.ItemSeparator;
			else if (nextChar == '>')
				currentTokenType = VDFTokenType.MetadataBaseValue;
			else if (nextChar == '{' || nextChar == ':')
				currentTokenType = VDFTokenType.DataPropName;
			else if (nextChar == '}' || nextChar == ':' || nextChar == '|' || (nextChar == ';' && nextNextChar == ';') || nextChar == '\n' || nextChar == null) // if normal char, and we're at end of normal-segment
				currentTokenType = VDFTokenType.DataBaseValue;

			if (currentTokenType != VDFTokenType.None)
			{
				result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count, currentTokenTextBuilder.ToString()));

				currentTokenFirstCharPos = i + 1;
				currentTokenType = VDFTokenType.None;
				currentTokenTextBuilder.Clear();
			}
		}
		
		if (postProcessTokens)
			VDFTokenParser.PostProcessTokens(result);

		return result;
	}
	static FindNextLineBreakCharPos(text: string, searchStartPos: number): number
	{
		for (var i = searchStartPos; i < text.length; i++)
			if (text[i] == '\n')
				return i;
		return -1;
	}
	static FinalizedDataStringToRaw(finalizedDataStr: string): string
	{
		var result: string = finalizedDataStr;
		if ((result[result.length - 2] == '@' || result[result.length - 2] == '|') && result.lastIndexOf("|") == result.length - 1)
			result = result.substr(0, result.length - 1); // chop off last char, as it was just added by the serializer for separation
		result = result.replace(/@(@{2,})/g, "$1"); // chop off last '@' from in-data '@@...' strings (to undo '@@...' string escaping)
		return result;
	}

	static PostProcessTokens(tokens: List<VDFToken>): void
	{
		// maybe temp
		tokens.Insert(0, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{"));
		tokens.Add( new VDFToken(VDFTokenType.DataEndMarker, 0, 0, "}"));

		// pass 0: immediately take out comments
		// ----------

		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if ([VDFTokenType.InLineComment].indexOf(token.type) != -1)
				tokens.RemoveAt(i--);
		}

		// pass 1: add brackets surrounding inline-list items (the ones that don't already have a set, anyway)
		// ----------

		var depth_base = 0;
		var line_indentsReached = 0;
		var depthData = new List<DepthData>("DepthData", new DepthData()); // add empty item, for level-0
		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (token.type == VDFTokenType.DataStartMarker)
				depth_base++;
			else if (token.type == VDFTokenType.DataEndMarker)
				depth_base--;
			else if (token.type == VDFTokenType.Indent)
				line_indentsReached++;
			else if (token.type == VDFTokenType.LineBreak)
				line_indentsReached = 0;
			var depth = depth_base + line_indentsReached;

			if (token.type == VDFTokenType.DataStartMarker)
			{
				while (depthData.Count <= depth)
					depthData.Add(new DepthData());
				depthData[depth] = new DepthData();
				if (token != null)
					depthData[depth].startMarker = token;
			}
			else if (token.type == VDFTokenType.DataEndMarker)
			{
				if (depthData.Count > depth + 1 && (depthData[depth + 1].needsChildStartBracket || depthData[depth + 1].needsChildEndBracket))
				{
					var firstInDepthTokenIndex = (depthData[depth + 1].needsChildStartBracket || depthData[depth + 1].needsChildEndBracket) ? tokens.indexOf(depthData[depth + 1].startMarker) + 1 : 0; //tokens.IndexOf(depthData[depth + 1].startMarker) + 1;
					var itemFirstTokenIndex = firstInDepthTokenIndex;
					if (tokens[firstInDepthTokenIndex].type == VDFTokenType.WiderMetadataEndMarker)
						itemFirstTokenIndex = firstInDepthTokenIndex + 1;
					else if (tokens.Count > firstInDepthTokenIndex + 1 && tokens[firstInDepthTokenIndex + 1].type == VDFTokenType.WiderMetadataEndMarker)
						itemFirstTokenIndex = firstInDepthTokenIndex + 2;

					if (depthData[depth + 1].lastItemFirstToken == null)
						depthData[depth + 1].lastItemFirstToken = tokens[itemFirstTokenIndex];

					if (itemFirstTokenIndex < i) // if first token is less than this (ender) token (i.e. if list has at least one item)
					{
						if (depthData[depth + 1].needsChildStartBracket)
							if (tokens[itemFirstTokenIndex].type != VDFTokenType.DataStartMarker)
							{
								tokens.Insert(itemFirstTokenIndex, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
								i++; // increment, since we added the token above
								depthData[depth + 1].needsChildStartBracket = false;
							}

						if (depthData[depth + 1].needsChildEndBracket)
							if (depthData[depth + 1].lastItemFirstToken != null && depthData[depth + 1].lastItemFirstToken.type != VDFTokenType.DataStartMarker)
							{
								tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
								depthData[depth + 1].needsChildEndBracket = false;
							}
					}
				}
				//depthData.RemoveAt(depth);
			}
			else if (token.type == VDFTokenType.WiderMetadataEndMarker)
			{
				var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
				if (lastToken == null || lastToken.type != VDFTokenType.MetadataBaseValue || lastToken.text.indexOf(",") == -1) // todo: should check for comma char only at depth 0
				{
					depthData[depth].needsChildStartBracket = true;
					depthData[depth].needsChildEndBracket = true;
				}
			}
			else if (token.type == VDFTokenType.ItemSeparator)
			{
				if (depthData[depth].lastItemFirstToken == null) // first item, so we didn't know it was item until now, so only now can we add it
				{
					var firstInDepthTokenIndex = tokens.indexOf(depthData[depth].startMarker) + 1; //depthData[depth].hasUnpairedChildBrackets ? tokens.IndexOf(depthData[depth].startMarker) + 1 : tokens.IndexOf(depthData[depth].startMarker) + 1;
					var itemFirstTokenIndex = firstInDepthTokenIndex;
					if (tokens[firstInDepthTokenIndex].type == VDFTokenType.WiderMetadataEndMarker)
						itemFirstTokenIndex = firstInDepthTokenIndex + 1;
					else if (tokens.Count > firstInDepthTokenIndex + 1 && tokens[firstInDepthTokenIndex + 1].type == VDFTokenType.WiderMetadataEndMarker)
						itemFirstTokenIndex = firstInDepthTokenIndex + 2;

					depthData[depth].lastItemFirstToken = tokens[itemFirstTokenIndex];

					if (tokens[itemFirstTokenIndex].type != VDFTokenType.DataStartMarker)
					{
						tokens.Insert(itemFirstTokenIndex, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
						i++; // increment, since we added the token above
					}
				}

				if (depthData[depth].lastItemFirstToken.type != VDFTokenType.DataStartMarker)
					tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
				if (tokens[i + 1].type != VDFTokenType.DataStartMarker)
				{
					tokens.Insert(++i, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
					depthData[depth].needsChildEndBracket = true;
				}
				var nextToken = tokens[i + 1];
				depthData[depth].lastItemFirstToken = nextToken;
			}
		}

		// pass 2: add inferred indent-block data-[start/end]-marker tokens
		// ----------

		var lastLine_indentsReached = 0;
		line_indentsReached = 0;
		var line_firstNonIndentCharReached = false;
		var indentDepthsNeedingEndBracket = new List<number>("number");
		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (token.type == VDFTokenType.Indent)
				line_indentsReached++;
			else if (token.type == VDFTokenType.LineBreak)
			{
				lastLine_indentsReached = line_indentsReached;

				line_firstNonIndentCharReached = false;
				line_indentsReached = 0;
			}
			else if (token.type == VDFTokenType.PoppedOutDataStartMarker)
			{
				tokens.Insert(i++, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // add inferred indent-block data-start-marker token (for indent-block)
				indentDepthsNeedingEndBracket.Add(line_indentsReached + 1);
			}
			else if (!line_firstNonIndentCharReached) // if normal char, and first-normal-char-reached flag hasn't been set
			{
				line_firstNonIndentCharReached = true;
				if (i != 0)
				{
					if (line_indentsReached <= lastLine_indentsReached) // if indent-depth stayed the same, or decreased, since last line
					{
						for (var i2 = lastLine_indentsReached; i2 > line_indentsReached; i2--) // add inferred indent-block data-end-marker tokens
						{
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block last-item
							if (indentDepthsNeedingEndBracket.Contains(line_indentsReached + 1))
							{
								tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block
								indentDepthsNeedingEndBracket.Remove(line_indentsReached + 1);
							}
						}
						if ([VDFTokenType.PoppedOutDataEndMarker, VDFTokenType.DataEndMarker].indexOf(token.type) == -1) // if not the ^ or } token (i.e. if actually a new item, instead of a prop continution)
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for current-indent-block last-item
					}

					if ([VDFTokenType.PoppedOutDataEndMarker, VDFTokenType.DataEndMarker].indexOf(token.type) == -1) // if not the ^ or } token (i.e. if actually a new item, instead of a prop continution)
						tokens.Insert(i++, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // add inferred indent-block data-start-marker token (for item)
				}
			}
		}

		for (var i = line_indentsReached; i >= 0; i--) // add inferred indent-block data-end-marker tokens
		{
			if (i > 0)
				tokens.Insert(tokens.Count, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block last-item
			if (indentDepthsNeedingEndBracket.Contains(0 + 1))
			{
				tokens.Insert(tokens.Count, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block
				indentDepthsNeedingEndBracket.Remove(0 + 1);
			}
		}

		// pass 3: remove [:, ^, line-break, indent, and |] tokens
		// ----------

		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if ([VDFTokenType.PoppedOutDataStartMarker, VDFTokenType.PoppedOutDataEndMarker, VDFTokenType.LineBreak, VDFTokenType.Indent, VDFTokenType.ItemSeparator].indexOf(token.type) != -1)
				tokens.RemoveAt(i--);
		}

		// maybe temp
		tokens.RemoveAt(0);
		tokens.RemoveAt(tokens.Count - 1);

		// pass 4: fix token position-and-index properties
		// ----------

		VDFTokenParser.RefreshTokenPositionAndIndexProperties(tokens);
	}
	public static RefreshTokenPositionAndIndexProperties(tokens: List<VDFToken>): void
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

class DepthData
{
	public startMarker: VDFToken;
	public lastItemFirstToken: VDFToken;
	public needsChildStartBracket: boolean;
	public needsChildEndBracket: boolean;
}