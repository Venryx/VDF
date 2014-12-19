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

	enum DepthType
	{
		Unknown,
		Object,
		List,
		Dictionary
	}
	static void PostProcessTokens(List<VDFToken> tokens)
	{
		// maybe temp
		tokens.Insert(0, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{"));
		tokens.Add( new VDFToken(VDFTokenType.DataEndMarker, 0, 0, "}"));

		// pass 0: immediately take out comments
		// ----------

		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (new[] {VDFTokenType.InLineComment}.Contains(token.type))
				tokens.RemoveAt(i--);
		}

		// pass 1: add brackets surrounding inline-list items
		// ----------

		var depth_base = 0;
		var line_indentsReached = 0;
		var depthStartMarkers = new Dictionary<int, VDFToken>();
		var depthTypes = new Dictionary<int, DepthType>{{0, DepthType.Unknown}};
		var token_depthType = new Dictionary<VDFToken, DepthType>();
		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];

			var depth_composite = i == tokens.Count - 1 ? 0 : (depth_base + line_indentsReached + (token.type == VDFTokenType.DataEndMarker ? -1 : 0));
			token_depthType[token] = depthTypes.ContainsKey(depth_composite) ? depthTypes[depth_composite] : DepthType.Unknown; // note: sort of messy

			if (token.type == VDFTokenType.Indent)
				line_indentsReached++;
			else if (token.type == VDFTokenType.LineBreak)
				line_indentsReached = 0;
			else if (token.type == VDFTokenType.DataEndMarker)
			{
				if (depthTypes[depth_composite + 1] == DepthType.List)
				{
					var firstInDepthTokenIndex = depthStartMarkers.ContainsKey(depth_composite + 1) ? tokens.IndexOf(depthStartMarkers[depth_composite + 1]) + 1 : 0;
					int itemFirstTokenIndex = firstInDepthTokenIndex;
					if (tokens[firstInDepthTokenIndex].type == VDFTokenType.WiderMetadataEndMarker)
						itemFirstTokenIndex = firstInDepthTokenIndex + 1;
					else if (tokens.Count > 1 && tokens[firstInDepthTokenIndex + 1].type == VDFTokenType.WiderMetadataEndMarker)
						itemFirstTokenIndex = firstInDepthTokenIndex + 2;
					if (itemFirstTokenIndex < tokens.Count - 1) // if list has tokens/items (- 1, since there is a fake data-end-marker token)
					{
						tokens.Insert(itemFirstTokenIndex, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
						i++; // increment, since we added the token above

						tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
						depthTypes.Remove(depth_composite + 1);
					}
				}
				depth_base--; //depth_composite--;
			}
			else if (token.type == VDFTokenType.PoppedOutDataStartMarker)
				depthTypes[depth_composite + 1] = DepthType.Object;
			else if (token.type == VDFTokenType.WiderMetadataEndMarker)
			{
				var lastLastToken = i - 2 >= 0 ? tokens[i - 2] : null;
				var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
				var depthOffset = (lastLastToken != null && lastLastToken.type == VDFTokenType.PoppedOutDataStartMarker) || (lastToken != null && lastToken.type == VDFTokenType.PoppedOutDataStartMarker) ? 1 : 0;
				if (lastToken != null && lastToken.type == VDFTokenType.MetadataBaseValue && lastToken.text.Contains(",")) // todo: should check for comma char only at depth 0
					depthTypes[depth_composite + depthOffset] = DepthType.Dictionary;
				else
					depthTypes[depth_composite + depthOffset] = DepthType.List;
			}
			else if (token.type == VDFTokenType.ItemSeparator)
			{
				tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)
				tokens.Insert(++i, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
				depthTypes[depth_composite] = DepthType.List;
			}
			else if (token.type == VDFTokenType.DataStartMarker)
			{
				depth_base++;
				depth_composite++;
				if (token != null)
					depthStartMarkers[depth_composite] = token;
				depthTypes[depth_composite] = DepthType.Unknown;
			}
		}

		// special code for inferring brackets within single-item-list's
		/*if (typeof(IList).IsAssignableFrom(declaredType) && !depthsOfInlineListData.Contains(0) && tokens.Count > 0)
		{
			depthsOfInlineListData.Add(0);
			int itemFirstTokenIndex = 0;
			if (tokens[0].type == VDFTokenType.WiderMetadataEndMarker)
				itemFirstTokenIndex = 1;
			else if (tokens.Count > 1 && tokens[1].type == VDFTokenType.WiderMetadataEndMarker)
				itemFirstTokenIndex = 2;
			tokens.Insert(itemFirstTokenIndex, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // (position and index are fixed later)
		}*/

		//if (depthTypes[0] == DepthType.List)
		//	tokens.Add(new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // (position and index are fixed later)

		// pass 2: add inferred indent-block data-[start/end]-marker tokens
		// ----------

		var lastLine_indentsReached = 0;
		line_indentsReached = 0;
		var line_firstNonIndentCharReached = false;
		for (var i = 0; i < tokens.Count; i++)
		{
			var lastToken = i - 1 >= 0 ? tokens[i - 1] : null;
			var token = tokens[i];
			if (token.type == VDFTokenType.Indent)
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
					{
						if (token_depthType[token] != DepthType.Unknown)
						{
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // add inferred indent-block data-start-marker token (for indent-block)

							var tokenBeforeLineBreak = tokens[i - line_indentsReached - 3];
							if (tokenBeforeLineBreak.type == VDFTokenType.WiderMetadataEndMarker) // if list had metadata, move it to after the list's data-start-marker
							{
								var tokenBeforeLineBreak_previous = tokens[i - line_indentsReached - 3 - 1];
								if (tokenBeforeLineBreak_previous.type == VDFTokenType.MetadataBaseValue)
								{
									tokens.Remove(tokenBeforeLineBreak_previous); //RemoveAt(i - line_indentsReached - 2);
									tokens.Insert(i - 1, tokenBeforeLineBreak_previous);
								}
								tokens.Remove(tokenBeforeLineBreak); //RemoveAt(i - line_indentsReached - 2);
								tokens.Insert(i - 1, tokenBeforeLineBreak);
							}
						}
					}
					else
					{
						for (var i2 = lastLine_indentsReached; i2 > line_indentsReached; i2--) // add inferred indent-block data-end-marker tokens
						{
							if (token_depthType[lastToken] == DepthType.List)
								tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block last-item
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block
						}
						if (token.type != VDFTokenType.PoppedOutDataEndMarker) // if not the ^ token (i.e. if actually a new item, instead of a prop continution)
							if (token_depthType[token] == DepthType.List)
								tokens.Insert(i++, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for current-indent-block last-item
					}

					if (token.type != VDFTokenType.PoppedOutDataEndMarker) // if not the ^ token (i.e. if actually a new item, instead of a prop continution)
						if (token_depthType[token] == DepthType.List)
							tokens.Insert(i++, new VDFToken(VDFTokenType.DataStartMarker, -1, -1, "{")); // add inferred indent-block data-start-marker token (for item)
				}
			}
		}

		for (var i = line_indentsReached; i > 0; i--) // add inferred indent-block data-end-marker tokens
		{
			if (token_depthType[tokens[tokens.Count - 2]] == DepthType.List)
			{
				tokens.Insert(tokens.Count, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block last-item
				token_depthType[tokens.Last()] = DepthType.List;
			}
			tokens.Insert(tokens.Count, new VDFToken(VDFTokenType.DataEndMarker, -1, -1, "}")); // one for lower-indent-block
		}

		// pass 3: remove [:, ^, line-break, indent, |, and comment] tokens
		// ----------

		for (var i = 0; i < tokens.Count; i++)
		{
			var token = tokens[i];
			if (new[] {VDFTokenType.PoppedOutDataStartMarker, VDFTokenType.PoppedOutDataEndMarker, VDFTokenType.LineBreak, VDFTokenType.Indent, VDFTokenType.ItemSeparator}.Contains(token.type))
				tokens.RemoveAt(i--);
		}

		// maybe temp
		tokens.RemoveAt(0);
		tokens.RemoveAt(tokens.Count - 1);

		// pass 4: fix token position-and-index properties
		// ----------

		RefreshTokenPositionAndIndexProperties(tokens);
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