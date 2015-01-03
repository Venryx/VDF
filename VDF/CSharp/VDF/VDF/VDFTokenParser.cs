using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

public enum VDFTokenType
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
	SpaceSpan,

	None,
	Tab,
	LineBreak,

	Metadata,
	MetadataEndMarker,
	PropertyName,
	PropertyNameValueSeparator,
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
public class VDFToken
{
	public VDFTokenType type;
	public int position;
	public int index;
	public string text;
	public VDFToken(VDFTokenType type, int position, int index, string text)
	{
		this.type = type;
		this.position = position;
		this.index = index;
		this.text = text;
	}

	public override string ToString() // for debugging
	{
		var result = "   " + text.Replace("\t", "\\t").Replace("\n", "\\n") + "   ";
		for (var i = result.Length; i < 30; i++)
			result += " ";
		return result;
	}
}
public static class VDFTokenParser
{
	static List<char> charsAToZ = new Regex(".").Matches("abcdefghijklmnopqrstuvwxyz").OfType<Match>().Select(a=>a.Value[0]).ToList();
	static List<char> chars0To9AndDot = new Regex(".").Matches("0123456789.").OfType<Match>().Select(a=>a.Value[0]).ToList();
	public static List<VDFToken> ParseTokens(string text, bool postProcessTokens = true)
	{
		text = (text ?? "").Replace("\r\n", "\n"); // maybe temp

		var result = new List<VDFToken>();

		int currentTokenFirstCharPos = 0;
		var currentTokenTextBuilder = new StringBuilder();
		var currentTokenType = VDFTokenType.None;
		string activeLiteralStartChars = null;
		string activeStringStartChar = null;
		string lastScopeIncreaseChar = null;
		for (var i = 0; i < text.Length; i++)
		{
			//char? lastChar = i - 1 >= 0 ? text[i - 1] : (char?)null;
			char ch = text[i];
			char? nextChar = i + 1 < text.Length ? text[i + 1] : (char?)null;
			//char? nextNextChar = i + 2 < text.Length ? text[i + 2] : (char?)null;
			//char? nextNextNextChar = i + 3 < text.Length ? text[i + 3] : (char?)null;

			int nextNonSpaceCharPos = FindNextNonXCharPosition(text, i + 1, ' ');
			char? nextNonSpaceChar = nextNonSpaceCharPos != -1 ? text[nextNonSpaceCharPos] : (char?)null;

			currentTokenTextBuilder.Append(ch);

			if (activeLiteralStartChars == null)
			{
				if (ch == '<' && nextChar == '<') // if first char of literal-start-marker
				{
					activeLiteralStartChars = "";
					while (i + activeLiteralStartChars.Length < text.Length && text[i + activeLiteralStartChars.Length] == '<')
						activeLiteralStartChars += "<";
					currentTokenTextBuilder = new StringBuilder(activeLiteralStartChars);
					currentTokenType = VDFTokenType.LiteralStartMarker;
					i += currentTokenTextBuilder.Length - 1; // have next char processed be the one right after comment (i.e. the line-break char)
				}
			}
			else if (i + activeLiteralStartChars.Length <= text.Length && text.Substring(i, activeLiteralStartChars.Length) == activeLiteralStartChars.Replace("<", ">"))
			{
				currentTokenTextBuilder = new StringBuilder(activeLiteralStartChars.Replace("<", ">"));
				currentTokenType = VDFTokenType.LiteralEndMarker;
				i += currentTokenTextBuilder.Length - 1; // have next char processed be the one right after literal-end-marker
				activeLiteralStartChars = null;
			}
			if (activeStringStartChar == null)
			{
				if (ch == '\'' || ch == '"') // if char of string-start-marker
				{
					activeStringStartChar = ch.ToString();
					currentTokenType = VDFTokenType.StringStartMarker;
				}
			}
			else if (((activeStringStartChar == "'" && ch == '\'') || (activeStringStartChar == "\"" && ch == '"')) && activeLiteralStartChars == null)
			{
				currentTokenType = VDFTokenType.StringEndMarker;
				activeStringStartChar = null;
			}

			bool lastCharInLiteral = activeLiteralStartChars != null && i + 1 + activeLiteralStartChars.Length <= text.Length && text.Substring(i + 1, activeLiteralStartChars.Length) == activeLiteralStartChars.Replace("<", ">");
			if (lastCharInLiteral)
				nextChar = i + 1 + activeLiteralStartChars.Length < text.Length ? text[i + 1 + activeLiteralStartChars.Length] : (char?)null; // shift next-char to one right after literal-end-marker (i.e. pretend it isn't there)
			bool lastCharInString = (activeStringStartChar == "'" && nextChar == '\'') || (activeStringStartChar == "\"" && nextChar == '"');
			if (currentTokenType == VDFTokenType.None && (activeLiteralStartChars == null || lastCharInLiteral) && (activeStringStartChar == null || lastCharInString)) // if not in pass-through-span
			{
				if (ch == '#' && nextChar == '#') // if first char of in-line-comment
				{
					currentTokenTextBuilder = new StringBuilder(text.Substring(i, (text.IndexOf("\n", i + 1) != -1 ? text.IndexOf("\n", i + 1) : text.Length) - i));
					currentTokenType = VDFTokenType.InLineComment;
					i += currentTokenTextBuilder.Length - 1; // have next char processed by the one right after comment (i.e. the line-break char)
				}
				else if (currentTokenTextBuilder.ToString().TrimStart(new[] {' '}).Length == 0 && ch == ' ' && nextChar != ' ') // if last char of space-span
					currentTokenType = VDFTokenType.SpaceSpan;

				else if (ch == '\t')
					currentTokenType = VDFTokenType.Tab;
				else if (ch == '\n')
					currentTokenType = VDFTokenType.LineBreak;

				else if (nextNonSpaceChar == '>' && activeLiteralStartChars == null)
					currentTokenType = VDFTokenType.Metadata;
				else if (ch == '>')
					currentTokenType = VDFTokenType.MetadataEndMarker;
				else if (nextNonSpaceChar == ':')
					currentTokenType = VDFTokenType.PropertyName;
				else if (ch == ':')
					currentTokenType = VDFTokenType.PropertyNameValueSeparator;
				else if (ch == '^')
					currentTokenType = VDFTokenType.PoppedOutChildGroupMarker;

				else if (currentTokenTextBuilder.Length == 4 && currentTokenTextBuilder.ToString() == "null" && (!nextChar.HasValue || !charsAToZ.Contains(nextChar.Value))) // if text-so-far is 'null', and there's no more letters
					currentTokenType = VDFTokenType.Null;
				else if (((currentTokenTextBuilder.Length == 5 && currentTokenTextBuilder.ToString() == "false") || (currentTokenTextBuilder.Length == 4 && currentTokenTextBuilder.ToString() == "true")) && (!nextChar.HasValue || !charsAToZ.Contains(nextChar.Value)))
					currentTokenType = VDFTokenType.Boolean;
				else if (chars0To9AndDot.Contains(currentTokenTextBuilder[0]) && (!nextChar.HasValue || !chars0To9AndDot.Contains(nextChar.Value)) && nextChar != '\'' && nextChar != '"' && (lastScopeIncreaseChar == "[" || result.Count == 0 || result.Last().type == VDFTokenType.MetadataEndMarker || result.Last().type == VDFTokenType.PropertyNameValueSeparator))
					currentTokenType = VDFTokenType.Number;
				else if ((activeStringStartChar == "'" && nextChar == '\'') || (activeStringStartChar == "\"" && nextChar == '"'))
				{
					if (activeLiteralStartChars != null)
					{
						currentTokenFirstCharPos++;
						currentTokenTextBuilder = new StringBuilder(UnpadString(currentTokenTextBuilder.ToString()));
					}
					currentTokenType = VDFTokenType.String;
				}
				else if (ch == '[')
				{
					currentTokenType = VDFTokenType.ListStartMarker;
					lastScopeIncreaseChar = ch.ToString();
				}
				else if (ch == ']')
					currentTokenType = VDFTokenType.ListEndMarker;
				else if (ch == '{')
				{
					currentTokenType = VDFTokenType.MapStartMarker;
					lastScopeIncreaseChar = ch.ToString();
				}
				else if (ch == '}')
					currentTokenType = VDFTokenType.MapEndMarker;
			}

			if (currentTokenType != VDFTokenType.None)
			{
				if (currentTokenType != VDFTokenType.LiteralStartMarker && currentTokenType != VDFTokenType.LiteralEndMarker && currentTokenType != VDFTokenType.StringStartMarker && currentTokenType != VDFTokenType.StringEndMarker && currentTokenType != VDFTokenType.InLineComment && currentTokenType != VDFTokenType.SpaceSpan)
					result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count, currentTokenTextBuilder.ToString()));
				if (currentTokenType == VDFTokenType.StringStartMarker && ch == nextChar) // special case; empty string
					result.Add(new VDFToken(VDFTokenType.String, -1, result.Count, "")); // char-pos has invalid value (should be fine, though)

				currentTokenFirstCharPos = i + 1;
				currentTokenTextBuilder.Length = 0; // clear
				currentTokenType = VDFTokenType.None;
			}
		}

		if (postProcessTokens)
			PostProcessTokens(result);

		return result;
	}
	static int FindNextNonXCharPosition(string text, int startPos, char x)
	{
		for (int i = startPos; i < text.Length; i++)
			if (text[i] != x)
				return i;
		return -1;
	}
	static string UnpadString(string paddedString)
	{
		var result = paddedString;
		if (result.StartsWith("#"))
			result = result.Substring(1); // chop off first char, as it was just added by the serializer for separation
		if (result.EndsWith("#"))
			result = result.Substring(0, result.Length - 1);
		return result;
	}

	static void PostProcessTokens(List<VDFToken> tokens)
	{
		// pass 1: re-wrap popped-out-children with parent brackets/braces
		// ----------

		tokens.Add(new VDFToken(VDFTokenType.None, -1, -1, "")); // maybe temp: add depth-0-ender helper token

		var line_tabsReached = 0;
		var tabDepth_popOutBlockEndWrapTokens = new Dictionary<int, List<VDFToken>>();
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
					tabDepth_popOutBlockEndWrapTokens[wrapGroupTabDepth] = tokens.GetRange(i + 1, enderTokenIndex - (i + 1));
					i = enderTokenIndex - 1; // have next token processed be the ender-token (^^[...] or line-break)
				}
				else if (lastToken.type == VDFTokenType.Tab)
				{
					var wrapGroupTabDepth = lastToken.type == VDFTokenType.Tab ? line_tabsReached - 1 : line_tabsReached;
					foreach (VDFToken token2 in tabDepth_popOutBlockEndWrapTokens[wrapGroupTabDepth])
					{
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
					for (int tabDepth = tabDepth_popOutBlockEndWrapTokens.Max(a=>a.Key); tabDepth >= line_tabsReached; tabDepth--)
						if (tabDepth_popOutBlockEndWrapTokens.ContainsKey(tabDepth))
						{
							foreach (VDFToken token2 in tabDepth_popOutBlockEndWrapTokens[tabDepth])
							{
								tokens.Remove(token2);
								tokens.Insert(i - 1, token2);
							}
							tabDepth_popOutBlockEndWrapTokens.Remove(tabDepth);
						}
			}
		}

		tokens.RemoveAt(tokens.Count - 1); // maybe temp: remove depth-0-ender helper token

		// pass 2: remove all now-useless tokens
		// ----------

		for (var i = tokens.Count - 1; i >= 0; i--)
		{
			var token = tokens[i];
			if (token.type == VDFTokenType.Tab || token.type == VDFTokenType.LineBreak || token.type == VDFTokenType.MetadataEndMarker || token.type == VDFTokenType.PropertyNameValueSeparator || token.type == VDFTokenType.PoppedOutChildGroupMarker)
				tokens.RemoveAt(i);
		}

		// pass 3: fix token position-and-index properties
		// ----------

		RefreshTokenPositionAndIndexProperties(tokens);

		//Console.Write(String.Join(" ", tokens.Select(a=>a.text).ToArray())); // temp; for testing
	}
	public static void RefreshTokenPositionAndIndexProperties(List<VDFToken> tokens)
	{
		var textProcessedLength = 0;
		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			token.position = textProcessedLength;
			token.index = i;
			textProcessedLength += token.text.Length;
		}
	}
}