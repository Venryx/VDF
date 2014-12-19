using System;
using System.Collections;
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
	Indent
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
public static class VDFTokenParser
{
	public static List<VDFToken> ParseTokens(string text, bool postProcessTokens = true)
	{
		text = (text ?? "").Replace("\r\n", "\n");

		var result = new List<VDFToken>();

		bool inLiteralMarkers = false;
		int currentTokenFirstCharPos = 0;
		var currentTokenType = VDFTokenType.None;
		//var currentTokenRawTextBuilder = new StringBuilder();
		var currentTokenTextBuilder = new StringBuilder();
		for (int i = 0; i < text.Length && currentTokenType == VDFTokenType.None; i++)
		{
			char? lastChar = i - 1 >= 0 ? text[i - 1] : (char?)null;
			char ch = text[i];
			char? nextChar = i + 1 < text.Length ? text[i + 1] : (char?)null;
			char? nextNextChar = i + 2 < text.Length ? text[i + 2] : (char?)null;
			char? nextNextNextChar = i + 3 < text.Length ? text[i + 3] : (char?)null;

			var grabExtraCharsAsOwnAndSkipTheirProcessing = (Action<int, bool>)((count, addToTokenTextBuilder)=>
			{
				//currentTokenRawTextBuilder.Append(text.Substring(i + 1, count));
				if (addToTokenTextBuilder)
					currentTokenTextBuilder.Append(text.Substring(i + 1, count));
				i += count;
			});

			//currentTokenRawTextBuilder.Append(ch);
			if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') // if first char of literal-start-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				inLiteralMarkers = true;
			}
			else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) // if first char of literal-end-marker
			{
				grabExtraCharsAsOwnAndSkipTheirProcessing(1, false);
				currentTokenTextBuilder = new StringBuilder(FinalizedDataStringToRaw(currentTokenTextBuilder.ToString()));
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
				var newNextCharPos = FindNextLineBreakCharPos(text, i + 2); // since rest of line is comment, skip to first char of next line
				grabExtraCharsAsOwnAndSkipTheirProcessing((newNextCharPos != -1 ? newNextCharPos + 1 : text.Length) - (i + 1), true);
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
				result.Add(new VDFToken(currentTokenType, currentTokenFirstCharPos, result.Count/*, currentTokenRawTextBuilder.ToString()*/, currentTokenTextBuilder.ToString()));

				currentTokenFirstCharPos = i + 1;
				currentTokenType = VDFTokenType.None;
				//currentTokenRawTextBuilder.Length = 0; // clear
				currentTokenTextBuilder.Length = 0; // clear
			}
		}

		if (postProcessTokens)
			PostProcessTokens(result);

		return result;
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
		if ((result[result.Length - 2] == '@' || result[result.Length - 2] == '|') && result.EndsWith("|"))
			result = result.Substring(0, result.Length - 1); // chop off last char, as it was just added by the serializer for separation
		result = new Regex("@(@{2,})").Replace(result, "$1"); // chop off last '@' from in-data '@@...' strings (to undo '@@...' string escaping)
		return result;
	}

	static void PostProcessTokens(List<VDFToken> tokens)
	{
		// pass 1: find brackets that start and end inline-lists
		// ----------

		var depth_basic = 0;
		var depthStartMarkers = new List<VDFToken>();
		var inlineListStartMarkers = new HashSet<VDFToken>();
		var depthsWaitingForInlineListEndMarkers = new HashSet<int>();
		var inlineListEndMarkers = new HashSet<VDFToken>();
		foreach (var token in tokens)
			if (token.type == VDFTokenType.DataStartMarker)
			{
				depth_basic++;
				depthStartMarkers[depth_basic] = token;
			}
			else if (token.type == VDFTokenType.ItemSeparator)
			{
				inlineListStartMarkers.Add(depthStartMarkers[depth_basic]);
				depthsWaitingForInlineListEndMarkers.Add(depth_basic);
			}
			else if (token.type == VDFTokenType.DataEndMarker)
			{
				if (depthsWaitingForInlineListEndMarkers.Contains(depth_basic))
				{
					inlineListEndMarkers.Add(token);
					depthsWaitingForInlineListEndMarkers.Remove(depth_basic);
				}
				depthStartMarkers.RemoveAt(depth_basic);
				depth_basic--;
			}

		// pass 2: add brackets surrounding inline-list items
		// ----------

		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (token.type == VDFTokenType.DataStartMarker && inlineListStartMarkers.Contains(token))
				tokens.Insert(++i, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
			else if (token.type == VDFTokenType.ItemSeparator)
			{
				tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
				tokens.Insert(++i, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
			}
			else if (token.type == VDFTokenType.DataEndMarker && inlineListEndMarkers.Contains(token))
				tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
		}

		// pass 3: add inferred indent-block data-[start/end]-marker tokens
		// ----------

		var lastLine_indentsReached = 0;
		var line_indentsReached = 0;
		var line_firstNonIndentCharReached = false;
		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (new[] {VDFTokenType.PoppedOutDataStartMarker, VDFTokenType.PoppedOutDataEndMarker, VDFTokenType.LineBreak}.Contains(token.type))
				tokens.RemoveAt(i--);
			else if (token.type == VDFTokenType.Indent)
				line_indentsReached++;
			else if (token.type == VDFTokenType.LineBreak)
			{
				lastLine_indentsReached = line_indentsReached;

				line_firstNonIndentCharReached = false;
				line_indentsReached = 0;
			}
			else if (!line_firstNonIndentCharReached)
			{
				line_firstNonIndentCharReached = true;
				if (i != 0)
				{
					if (line_indentsReached > lastLine_indentsReached)
						tokens.Insert(i++, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // add inferred indent-block data-start-marker token (for list)
					else
					{
						for (var i2 = lastLine_indentsReached; i2 > line_indentsReached; i2++) // add inferred indent-block data-end-marker tokens
						{
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block last-item
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block
						}
						if (token.type != VDFTokenType.PoppedOutDataEndMarker) // if not the ^ token (i.e. if actually a new item, instead of a prop continution)
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for current-indent-block last-item
					}

					if (token.type != VDFTokenType.PoppedOutDataEndMarker) // if not the ^ token (i.e. if actually a new item, instead of a prop continution)
						tokens.Insert(i++, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // add inferred indent-block data-start-marker token (for item)
				}
			}
		}

		for (var i = lastLine_indentsReached; i > 0; i++) // add inferred indent-block data-end-marker tokens
		{
			tokens.Insert(tokens.Count, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block last-item
			tokens.Insert(tokens.Count, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block
		}

		// pass 4: remove [:, ^, line-break, indent, |, and comment] tokens
		// ----------

		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (new[] {VDFTokenType.PoppedOutDataStartMarker, VDFTokenType.PoppedOutDataEndMarker, VDFTokenType.LineBreak, VDFTokenType.Indent, VDFTokenType.ItemSeparator, VDFTokenType.InLineComment}.Contains(token.type))
				tokens.RemoveAt(i--);
		}

		// pass 5: fix token position-and-index properties
		// ----------

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