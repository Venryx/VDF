using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

enum VDFTokenType
{
	None,
	PoppedOutNodeMarker,
	SpecialMetadataStartMarker,
	SpecialMetadataEndMarker,
	MetadataStartMarker,
	Metadata_BaseValue,
	MetadataEndMarker,
	//LiteralMarker, // this is taken care of within the TokenParser class, so we don't need a passable-to-the-outside enum-value for it
	Data_PropName,
	DataStartMarker,
	ItemSeparator,
	Data_BaseValue,
	DataEndMarker,
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
		var tokenTextBuilder = new StringBuilder();

		bool inLiteralMarkers = false;

		int i = nextCharPos;
		for (; i < vdf.Length && tokenType == VDFTokenType.None; i++)
		{
			char? lastChar = i > 0 ? vdf[i - 1] : (char?)null;
			char ch = vdf[i];
			char? nextChar = i < vdf.Length - 1 ? vdf[i + 1] : (char?)null;
			char? nextNextChar = i < vdf.Length - 2 ? vdf[i + 2] : (char?)null;

			if (lastChar != '@' && ch == '@' && nextChar == '@' && (!inLiteralMarkers || nextNextChar == '}' || nextNextChar == '\n')) // special case; escape literals
			{
				tokenTextBuilder = new StringBuilder(FinalizedDataStringToRaw(tokenTextBuilder.ToString()));
				inLiteralMarkers = !inLiteralMarkers;
				i++; // increment index by one extra, so as to have the next char processed be the first char after literal-marker
				if (!inLiteralMarkers) // if literal-block ended, return chars as Data_BaseValue token
					tokenType = VDFTokenType.Data_BaseValue;
				continue;
			}
			tokenTextBuilder.Append(ch);
			if (inLiteralMarkers) // don't do any token processing, (other than the literal-block-related stuff), until end-literal-marker is reached
				continue;

			if (ch == '<')
			{
				if (nextChar == '<')
				{
					tokenType = VDFTokenType.SpecialMetadataStartMarker;
					i++;
				}
				else
					tokenType = VDFTokenType.MetadataStartMarker;
			}
			else if (ch == '>')
			{
				if (nextChar == '>')
				{
					tokenType = VDFTokenType.SpecialMetadataEndMarker;
					i++;
				}
				else
					tokenType = VDFTokenType.MetadataEndMarker;
			}
			else if (ch == '{')
				tokenType = VDFTokenType.DataStartMarker;
			else if (ch == '}')
				tokenType = VDFTokenType.DataEndMarker;
			else // non-bracket char
			{
				if (ch == '\n')
					tokenType = VDFTokenType.LineBreak;
				else if ((lastChar == null || lastChar == '\n') && ch == '/' && nextChar == '/')
				{
					tokenType = VDFTokenType.InLineComment;
					i = FindNextLineBreakCharPos(vdf, i + 2); // since rest of line is comment, skip to first char of next line
				}
					//else if (ch == '\t')
					//	tokenType = VDFTokenType.Indent;
				else if (ch == '#' && lastChar == '\t')
					tokenType = VDFTokenType.PoppedOutNodeMarker;
				else if (ch == '|')
					tokenType = VDFTokenType.ItemSeparator;
				else if (nextChar == '>')
					tokenType = VDFTokenType.Metadata_BaseValue;
				else if (nextChar == '{')
					tokenType = VDFTokenType.Data_PropName;
				else if (nextChar == '}' || nextChar == '|' || nextChar == '\n' || nextChar == null) // if normal char, and we're at end of normal-segment
					tokenType = VDFTokenType.Data_BaseValue;
			}
		}
		nextCharPos = i;

		var token = tokenType != VDFTokenType.None ? new VDFToken(tokenType, tokenTextBuilder.ToString()) : null;
		tokens.Add(token);
		return token;
	}

	static int FindNextLineBreakCharPos(string vdfFile, int searchStartPos)
	{
		for (int i = searchStartPos; i < vdfFile.Length; i++)
			if (vdfFile[i] == '\n')
				return i;
		return -1;
	}

	static string FinalizedDataStringToRaw(string finalizedDataStr)
	{
		string result = finalizedDataStr;
		if (finalizedDataStr.Contains("}"))
		{
			if ((result[result.Length - 2] == '@' || result[result.Length - 2] == '|') && result.EndsWith("|"))
				result = result.Substring(0, result.Length - 1); // chop of last char, as it was just added by the serializer for separation
			result = new Regex("@@@(?=\n|}|$)").Replace(result, "@@"); // remove extra '@' char added to all troublesome (before-end-of-line-or-end-bracket-or-end-of-string) two-at-signs char-segments
		}
		return result;
	}
}