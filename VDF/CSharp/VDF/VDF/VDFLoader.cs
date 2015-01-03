using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;

public class VDFLoadOptions
{
	public object message;

	// CS only
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;
	//public List<string> extraSearchAssemblyNames; // maybe add this option later

	public VDFLoadOptions(object message = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null)
	{
		this.message = message;
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
	}
}

public static class VDFLoader
{
	public static VDFNode ToVDFNode<T>(string text, VDFLoadOptions loadOptions = null) { return ToVDFNode(text, typeof(T), loadOptions); }
	public static VDFNode ToVDFNode(string text, VDFLoadOptions loadOptions, Type declaredType = null) { return ToVDFNode(text, declaredType, loadOptions); }
	public static VDFNode ToVDFNode(string text, Type declaredType = null, VDFLoadOptions loadOptions = null) { return ToVDFNode(VDFTokenParser.ParseTokens(text), declaredType, loadOptions); }
	public static VDFNode ToVDFNode(List<VDFToken> tokens, Type declaredType = null, VDFLoadOptions loadOptions = null)
	{
		loadOptions = loadOptions ?? new VDFLoadOptions();

		// figure out obj-type
		// ==========

		var depth = 0;
		var tokensAtDepth0 = new List<VDFToken>();
		var tokensAtDepth1 = new List<VDFToken>();
		foreach (VDFToken token in tokens)
		{
			if (token.type == VDFTokenType.ListEndMarker || token.type == VDFTokenType.MapEndMarker)
				depth--;
			if (depth == 0)
				tokensAtDepth0.Add(token);
			if (depth == 1)
				tokensAtDepth1.Add(token);
			if (token.type == VDFTokenType.ListStartMarker || token.type == VDFTokenType.MapStartMarker)
				depth++;
		}

		string fromVDFTypeString = "object";
		var firstNonMetadataToken = tokensAtDepth0.First(a=>a.type != VDFTokenType.Metadata);
		if (tokensAtDepth0[0].type == VDFTokenType.Metadata)
			fromVDFTypeString = tokensAtDepth0[0].text;
		else if (firstNonMetadataToken.type == VDFTokenType.Boolean)
			fromVDFTypeString = "bool";
		else if (firstNonMetadataToken.type == VDFTokenType.Number)
			fromVDFTypeString = firstNonMetadataToken.text.Contains(".") ? "double" : "int";
		else if (firstNonMetadataToken.type == VDFTokenType.String)
			fromVDFTypeString = "string";
		else if (firstNonMetadataToken.type == VDFTokenType.ListStartMarker)
			fromVDFTypeString = "List(object)";
		else if (firstNonMetadataToken.type == VDFTokenType.MapStartMarker)
			fromVDFTypeString = "Dictionary(object object)"; //"object";

		Type objType = declaredType;
		if (fromVDFTypeString != null && fromVDFTypeString.Length > 0)
		{
			var fromVDFType = VDF.GetTypeByVName(fromVDFTypeString, loadOptions);
			if (objType == null || objType.IsAssignableFrom(fromVDFType)) // if there is no declared type, or the from-vdf type is more specific than the declared type
				objType = fromVDFType;
		}
		var objTypeInfo = VDFTypeInfo.Get(objType);

		// create the object's VDFNode, and load in the data
		// ==========

		var objNode = new VDFNode();
		objNode.metadata = tokensAtDepth0[0].type == VDFTokenType.Metadata ? fromVDFTypeString : null;
		
		// if primitive, parse value
		if (firstNonMetadataToken.type == VDFTokenType.Null)
			objNode.primitiveValue = null;
		else if (firstNonMetadataToken.type == VDFTokenType.Boolean)
			objNode.primitiveValue = bool.Parse(firstNonMetadataToken.text);
		else if (firstNonMetadataToken.type == VDFTokenType.Number)
			if (firstNonMetadataToken.text.Contains("."))
				objNode.primitiveValue = double.Parse(firstNonMetadataToken.text);
			else
				objNode.primitiveValue = int.Parse(firstNonMetadataToken.text);
		else if (firstNonMetadataToken.type == VDFTokenType.String)
			objNode.primitiveValue = firstNonMetadataToken.text;

		// if list, parse items
		else if (typeof(IList).IsAssignableFrom(objType))
			for (var i = 0; i < tokensAtDepth1.Count; i++)
			{
				var token = tokensAtDepth1[i];
				if (/*token.type != VDFTokenType.Metadata && */token.type != VDFTokenType.ListEndMarker && token.type != VDFTokenType.MapEndMarker)
				{
					var itemFirstToken = tokens[token.index];
					var itemEnderToken = tokensAtDepth1.FirstOrDefault(a=>a.index > itemFirstToken.index + (itemFirstToken.type == VDFTokenType.Metadata ? 1 : 0) && token.type != VDFTokenType.ListEndMarker && token.type != VDFTokenType.MapEndMarker);
					objNode.listChildren.Add(ToVDFNode(GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), objType.IsGenericType ? objType.GetGenericArguments()[0] : null, loadOptions));
					if (itemFirstToken.type == VDFTokenType.Metadata) // if item had metadata, skip an extra token (since it had two non-end tokens)
						i++;
				}
			}

		// if not primitive and not list (i.e. map/object/dictionary), parse pairs/properties
		else //if (!typeof(IList).IsAssignableFrom(objType))
			for (var i = 0; i < tokensAtDepth1.Count; i++)
			{
				var token = tokensAtDepth1[i];
				if (token.type == VDFTokenType.PropertyName)
				{
					var propName = token.text;
					Type propValueType;
					if (typeof(IDictionary).IsAssignableFrom(objType))
						propValueType = objType.IsGenericType ? objType.GetGenericArguments()[1] : null;
					else
						propValueType = objTypeInfo.propInfoByName.ContainsKey(propName) ? objTypeInfo.propInfoByName[propName].GetPropType() : null;

					var propValueFirstToken = tokensAtDepth1[i + 1];
					var propValueEnderToken = tokensAtDepth1.FirstOrDefault(a=>a.index > propValueFirstToken.index && a.type == VDFTokenType.PropertyName);
					objNode.mapChildren.Add(propName, ToVDFNode(GetTokenRange_Tokens(tokens, propValueFirstToken, propValueEnderToken), propValueType, loadOptions));
				}
			}

		return objNode;
	}
	static List<VDFToken> GetTokenRange_Tokens(List<VDFToken> tokens, VDFToken firstToken, VDFToken enderToken)
	{
		//return tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index, a.text)).ToList();

		var result = new List<VDFToken>();
		for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
			result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
		return result;
	}
}