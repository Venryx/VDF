enum VDFTokenType
{
	None,
	PoppedOutNodeMarker,
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
	//Indent // this is taken care of at a higher level by the VDFLoader class
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
	text: string;
	nextCharPos: number;
	tokens: List<VDFToken>;
	constructor(text: string, firstCharPos: number)
	{
		this.text = text;
		this.nextCharPos = firstCharPos;
		this.tokens = new List<VDFToken>("VDFToken");
	}

	MoveNextToken(): boolean
	{
		var tokenType = VDFTokenType.None;
		var tokenTextBuilder = new StringBuilder();

		var inLiteralMarkers = false;

		var firstCharPos = this.nextCharPos;
		for (var i = this.nextCharPos; i < this.text.length && tokenType == VDFTokenType.None; i++, this.nextCharPos++)
		{
			var lastChar = i - 1 >= 0 ? this.text[i - 1] : null;
			var ch = this.text[i];
			var nextChar = i + 1 < this.text.length ? this.text[i + 1] : null;
			var nextNextChar = i + 2 < this.text.length ? this.text[i + 2] : null;
			var nextNextNextChar = i + 3 < this.text.length ? this.text[i + 3] : null;

			var grabExtraCharsAsOwnAndSkipTheirProcessing = (count, addToNormalBuilder)=>
			{
				if (addToNormalBuilder)
					tokenTextBuilder.Append(this.text.substr(i + 1, count));
				i += count;
				this.nextCharPos += count;
			};

			if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') // if first char of literal-start-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				inLiteralMarkers = true;
			}
			else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) // if first char of literal-end-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				tokenTextBuilder = new StringBuilder(VDFTokenParser.FinalizedDataStringToRaw(tokenTextBuilder.ToString()));
				inLiteralMarkers = false;
				tokenType = VDFTokenType.DataBaseValue; // cause the return of chars as DataBaseValue token
			}
			else
				tokenTextBuilder.Append(ch);

			if (inLiteralMarkers) // don't do any token processing, (other than the literal-block-related stuff), until literal-end-marker is reached
				continue;

			if (ch == '>')
				if (nextChar == '>')
				{
					tokenType = VDFTokenType.WiderMetadataEndMarker;
					grabExtraCharsAsOwnAndSkipTheirProcessing(1, true);
				}
				else
					tokenType = VDFTokenType.MetadataEndMarker;
			else if (ch == '{')
				tokenType = VDFTokenType.DataStartMarker;
			else if (ch == '}')
				tokenType = VDFTokenType.DataEndMarker;
			else if (ch == ':')
				tokenType = VDFTokenType.PoppedOutDataStartMarker;
			else if (ch == '^')
				tokenType = VDFTokenType.PoppedOutDataEndMarker;
			else if (ch == '\n')
				tokenType = VDFTokenType.LineBreak;
			else if ((lastChar == null || lastChar == '\n') && ch == '/' && nextChar == '/')
			{
				tokenType = VDFTokenType.InLineComment;
				var newNextCharPos = VDFTokenParser.FindNextLineBreakCharPos(this.text, i + 2); // since rest of line is comment, skip to first char of next line
				grabExtraCharsAsOwnAndSkipTheirProcessing(newNextCharPos - (i + 1), true);
			}
			//else if (ch == '\t')
			//	tokenType = VDFTokenType.Indent;
			else if (ch == '#' && lastChar == '\t')
				tokenType = VDFTokenType.PoppedOutNodeMarker;
			else if (ch == '|')
				tokenType = VDFTokenType.ItemSeparator;
			else if (nextChar == '>')
				tokenType = VDFTokenType.MetadataBaseValue;
			else if (nextChar == '{' || nextChar == ':')
				tokenType = VDFTokenType.DataPropName;
			else if (nextChar == '}' || nextChar == ':' || nextChar == '|' || nextChar == '\n' || nextChar == null) // if normal char, and we're at end of normal-segment
				tokenType = VDFTokenType.DataBaseValue;
		}
		
		if (tokenType == VDFTokenType.None)
			return false;

		var token = new VDFToken(tokenType, firstCharPos, this.tokens.Count, tokenTextBuilder.ToString());
		this.tokens.Add(token);
		return true;
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
		if (finalizedDataStr.indexOf("}") != -1)
		{
			if ((result[result.length - 2] == '@' || result[result.length - 2] == '|') && result.lastIndexOf("|") == result.length - 1)
				result = result.substr(0, result.length - 1); // chop off last char, as it was just added by the serializer for separation
			result = result.replace(/@(@{2,})/g, "$1"); // chop off last '@' from in-data '@@...' strings (to undo '@@...' string escaping)
		}
		return result;
	}
}