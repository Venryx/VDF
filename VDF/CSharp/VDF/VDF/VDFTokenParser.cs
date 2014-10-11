using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

public enum VDFTokenType
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
	//Indent // this is taken care of at a higher level by the VDFLoader class
}
public class VDFToken
{
	public VDFTokenType type;
	public int position;
	public int index;
	//public string rawText;
	public string text;
	public VDFToken(VDFTokenType type, int position, int index/*, string rawText*/, string text)
	{
		this.type = type;
		this.position = position;
		this.index = index;
		//this.rawText = rawText;
		this.text = text;
	}
}
public class VDFTokenParser
{
	string text;
	public int nextCharPos;
	public List<VDFToken> tokens;
	public VDFTokenParser(string text, int firstCharPos)
	{
		text = (text ?? "").Replace("\r\n", "\n");

		this.text = text;
		nextCharPos = firstCharPos;
		tokens = new List<VDFToken>();
	}

	public bool MoveNextToken()
	{
		var tokenType = VDFTokenType.None;
		//var tokenRawTextBuilder = new StringBuilder();
		var tokenTextBuilder = new StringBuilder();

		bool inLiteralMarkers = false;

		var firstCharPos = nextCharPos;
		for (int i = nextCharPos; i < text.Length && tokenType == VDFTokenType.None; i++, nextCharPos++)
		{
			char? lastChar = i - 1 >= 0 ? text[i - 1] : (char?)null;
			char ch = text[i];
			char? nextChar = i + 1 < text.Length ? text[i + 1] : (char?)null;
			char? nextNextChar = i + 2 < text.Length ? text[i + 2] : (char?)null;
			char? nextNextNextChar = i + 3 < text.Length ? text[i + 3] : (char?)null;

			var grabExtraCharsAsOwnAndSkipTheirProcessing = (Action<int, bool>)((count, addToTokenTextBuilder)=>
			{
				//tokenRawTextBuilder.Append(text.Substring(i + 1, count));
				if (addToTokenTextBuilder)
					tokenTextBuilder.Append(text.Substring(i + 1, count));
				i += count;
				nextCharPos += count;
			});

			//tokenRawTextBuilder.Append(ch);
			if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') // if first char of literal-start-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				inLiteralMarkers = true;
			}
			else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) // if first char of literal-end-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				tokenTextBuilder = new StringBuilder(FinalizedDataStringToRaw(tokenTextBuilder.ToString()));
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
			else if (ch == ';' && nextChar == ';')
			{
				tokenType = VDFTokenType.InLineComment;
				var newNextCharPos = FindNextLineBreakCharPos(text, i + 2); // since rest of line is comment, skip to first char of next line
				grabExtraCharsAsOwnAndSkipTheirProcessing((newNextCharPos != -1 ? newNextCharPos + 1 : text.Length) - (i + 1), true);
			}
			//else if (ch == '\t')
			//	tokenType = VDFTokenType.Indent;
			else if (ch == '|')
				tokenType = VDFTokenType.ItemSeparator;
			else if (nextChar == '>')
				tokenType = VDFTokenType.MetadataBaseValue;
			else if (nextChar == '{' || nextChar == ':')
				tokenType = VDFTokenType.DataPropName;
			else if (nextChar == '}' || nextChar == ':' || nextChar == '|' || (nextChar == ';' && nextNextChar == ';') || nextChar == '\n' || nextChar == null) // if normal char, and we're at end of normal-segment
				tokenType = VDFTokenType.DataBaseValue;
		}

		if (tokenType == VDFTokenType.None)
			return false;

		var token = new VDFToken(tokenType, firstCharPos, tokens.Count/*, tokenRawTextBuilder.ToString()*/, tokenTextBuilder.ToString());
		tokens.Add(token);
		return true;
	}

	static int FindNextLineBreakCharPos(string text, int searchStartPos)
	{
		for (int i = searchStartPos; i < text.Length; i++)
			if (text[i] == '\n')
				return i;
		return -1;
	}

	static string FinalizedDataStringToRaw(string finalizedDataStr)
	{
		string result = finalizedDataStr;
		if (finalizedDataStr.Contains("}"))
		{
			if ((result[result.Length - 2] == '@' || result[result.Length - 2] == '|') && result.EndsWith("|"))
				result = result.Substring(0, result.Length - 1); // chop off last char, as it was just added by the serializer for separation
			result = new Regex("@(@{2,})").Replace(result, "$1"); // chop off last '@' from in-data '@@...' strings (to undo '@@...' string escaping)
		}
		return result;
	}
}