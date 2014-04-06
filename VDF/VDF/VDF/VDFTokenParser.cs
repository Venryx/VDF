using System.Collections.Generic;

enum VDFTokenType
{
	None,
	PoppedOutNodeMarker,
	SpecialMetadataStart,
	SpecialMetadataEnd,
	StartMetadataBracket,
	Metadata_BaseValue,
	EndMetadataBracket,
	//LiteralMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
	Data_PropName,
	StartDataBracket,
	ItemSeparator,
	Data_BaseValue,
	EndDataBracket,
	LineBreak,
	InLineComment,
	//Indent // this is taken care of at a higher level by the VDFLoader class
}
class VDFToken
{
	public VDFTokenType type;
	public string text;
	public VDFToken(VDFTokenType type, string text)
	{
		this.type = type;
		this.text = text;
	}
}
class VDFTokenParser
{
	string vdf;
	public int nextCharPos;
	public List<VDFToken> tokens; 
	public VDFTokenParser(string vdf, int firstCharPos)
	{
		this.vdf = vdf;
		nextCharPos = firstCharPos;
		tokens = new List<VDFToken>();
	}

	public VDFToken GetNextToken()
	{
		var tokenType = VDFTokenType.None;
		var tokenChars = new List<char>();

		bool inLiteralMarkers = false;

		int i = nextCharPos;
		for (; i < vdf.Length && tokenType == VDFTokenType.None; i++)
		{
			char? lastChar = i > 0 ? vdf[i - 1] : (char?)null;
			char ch = vdf[i];
			char? nextChar = i < vdf.Length - 1 ? vdf[i + 1] : (char?)null;
			char? nextNextChar = i < vdf.Length - 2 ? vdf[i + 2] : (char?)null;

			if (ch == '@' && nextChar.HasValue && nextChar == '@' && nextNextChar.HasValue && nextNextChar == '@') // special case; escape literals
			{
				inLiteralMarkers = !inLiteralMarkers;
				i += 2; // skip to first char after literal-marker
				if (!inLiteralMarkers) // if literal-block ended, return chars as Data_BaseValue token
					tokenType = VDFTokenType.Data_BaseValue;
				continue;
			}
			tokenChars.Add(ch);
			if (inLiteralMarkers) // don't do any token processing, (other than the literal-block-related stuff), until end-literal-marker is reached
				continue;

			if (ch == '<')
			{
				if (nextChar == '<')
				{
					tokenType = VDFTokenType.SpecialMetadataStart;
					i++;
				}
				else
					tokenType = VDFTokenType.StartMetadataBracket;
			}
			else if (ch == '>')
			{
				if (nextChar == '>')
				{
					tokenType = VDFTokenType.SpecialMetadataEnd;
					i++;
				}
				else
					tokenType = VDFTokenType.EndMetadataBracket;
			}
			else if (ch == '{')
				tokenType = VDFTokenType.StartDataBracket;
			else if (ch == '}')
				tokenType = VDFTokenType.EndDataBracket;
			else // non-bracket char
			{
				if (ch == '\n')
					tokenType = VDFTokenType.LineBreak;
				else if ((lastChar == null || lastChar == '\n') && ch == '/' && nextChar == '/')
				{
					tokenType = VDFTokenType.InLineComment;
					i += nextNextChar == '\n' ? 2 : (nextNextChar == '\r' ? 3 : 0); // skip to first char of next line (if line ends right after comment marker)
				}
				//else if (ch == '\t')
				//	tokenType = VDFTokenType.Indent;
				else if (ch == '#' && lastChar.HasValue && lastChar == '\t')
					tokenType = VDFTokenType.PoppedOutNodeMarker;
				else if (ch == '|')
					tokenType = VDFTokenType.ItemSeparator;
				else if (nextChar.HasValue && nextChar == '>')
					tokenType = VDFTokenType.Metadata_BaseValue;
				else if (nextChar.HasValue && nextChar == '{')
					tokenType = VDFTokenType.Data_PropName;
				else if (nextChar.HasValue && (nextChar == '}' || nextChar == '|')) // if normal char, and we're at end of normal-segment
					tokenType = VDFTokenType.Data_BaseValue;
			}
		}
		nextCharPos = i;

		var token = tokenType != VDFTokenType.None ? new VDFToken(tokenType, new string(tokenChars.ToArray())) : null;
		tokens.Add(token);
		return token;
	}
}