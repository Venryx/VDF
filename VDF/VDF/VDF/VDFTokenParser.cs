using System.Collections.Generic;

enum TokenType
{
	None,
	Marker,
	StartMetadataBracket,
	Metadata_BaseValue,
	EndMetadataBracket,
	Data_PropName,
	StartDataBracket,
	ItemSeparator,
	Data_BaseValue,
	EndDataBracket,
	LineBreak,
	Indent
}
class Token
{
	public TokenType type;
	public string text;
	public Token(TokenType type, string text)
	{
		this.type = type;
		this.text = text;
	}
}
class VDFTokenParser
{
	string vdf;
	public int nextCharPos;
	public VDFTokenParser(string vdf, int firstCharPos)
	{
		this.vdf = vdf;
		nextCharPos = firstCharPos;
	}

	public Token GetNextToken()
	{
		var tokenType = TokenType.None;
		var tokenChars = new List<char>();
		for (int i = nextCharPos; i < vdf.Length && tokenType == TokenType.None; i++)
		{
			char? lastChar = i > 0 ? vdf[i - 1] : (char?)null;
			char ch = vdf[i];
			char? nextChar = i < vdf.Length - 1 ? vdf[i + 1] : (char?)null;

			tokenChars.Add(ch);
			if (ch == '<')
				tokenType = TokenType.StartMetadataBracket;
			else if (ch == '>')
				tokenType = TokenType.EndMetadataBracket;
			else if (ch == '{')
				tokenType = TokenType.StartDataBracket;
			else if (ch == '}')
				tokenType = TokenType.EndDataBracket;
			else // non-bracket char
			{
				if (ch == '\n')
					tokenType = TokenType.LineBreak;
				else if (ch == '\t')
					tokenType = TokenType.Indent;
				else if (ch == '#' && lastChar.HasValue && lastChar == '\t')
					tokenType = TokenType.Marker;
				else if (ch == '|')
					tokenType = TokenType.ItemSeparator;
				else if (nextChar.HasValue && nextChar == '>')
					tokenType = TokenType.Metadata_BaseValue;
				else if (nextChar.HasValue && nextChar == '{')
					tokenType = TokenType.Data_PropName;
				else if (nextChar.HasValue && (nextChar == '}' || nextChar == '|'))
					tokenType = TokenType.Data_BaseValue;
			}
		}
		nextCharPos += tokenChars.Count;

		return tokenType != TokenType.None ? new Token(tokenType, new string(tokenChars.ToArray())) : null;
	}
}