class VDFLoadOptions
{
	messages: any[];

	// for JSON compatibility
	allowStringKeys: boolean;
	allowCommaSeparators: boolean;

	// JS only
	loadUnknownTypesAsBasicTypes: boolean;

	constructor(initializerObj?: any, messages?: any[], allowStringKeys = false, allowCommaSeparators = false, loadUnknownTypesAsBasicTypes = false)
	{
		this.messages = messages || [];
		this.allowStringKeys = allowStringKeys;
		this.allowCommaSeparators = allowCommaSeparators;
		this.loadUnknownTypesAsBasicTypes = loadUnknownTypesAsBasicTypes;

		if (initializerObj)
			for (var key in initializerObj)
				this[key] = initializerObj[key];
	}

	ForJSON() // helper function for JSON compatibility
	{
		this.allowStringKeys = true;
		this.allowCommaSeparators = true;
		return this;
	}
}

class VDFLoader
{
	static ToVDFNode(text: string, options: VDFLoadOptions): VDFNode;
	static ToVDFNode(text: string, declaredTypeName?: string, options?: VDFLoadOptions): VDFNode;
	static ToVDFNode(text: List<VDFToken>, options: VDFLoadOptions): VDFNode;
	static ToVDFNode(text: List<VDFToken>, declaredTypeName?: string, options?: VDFLoadOptions, firstTokenIndex?: number, enderTokenIndex?: number): VDFNode;
	static ToVDFNode(tokens_orText: any, declaredTypeName_orOptions?: any, options?: VDFLoadOptions, firstTokenIndex = 0, enderTokenIndex = -1): VDFNode
	{
		if (declaredTypeName_orOptions instanceof VDFLoadOptions)
			return VDFLoader.ToVDFNode(tokens_orText, null, declaredTypeName_orOptions);
		if (typeof tokens_orText == "string")
			return VDFLoader.ToVDFNode(VDFTokenParser.ParseTokens(tokens_orText, options), declaredTypeName_orOptions, options);

		var tokens: List<VDFToken> = tokens_orText;
		var declaredTypeName: string = declaredTypeName_orOptions;
		options = options || new VDFLoadOptions();
		enderTokenIndex = enderTokenIndex != -1 ? enderTokenIndex : tokens.Count;

		// figure out obj-type
		// ==========

		var depth = 0;
		var tokensAtDepth0 = new List<VDFToken>("VDFToken");
		var tokensAtDepth1 = new List<VDFToken>("VDFToken");
		var i: number;
		//for (var i in tokens.Indexes())
		for (var i = firstTokenIndex; i < enderTokenIndex; i++)
		{
			var token = tokens[i];
			if (token.type == VDFTokenType.ListEndMarker || token.type == VDFTokenType.MapEndMarker)
				depth--;
			if (depth == 0)
				tokensAtDepth0.Add(token);
			if (depth == 1)
				tokensAtDepth1.Add(token);
			if (token.type == VDFTokenType.ListStartMarker || token.type == VDFTokenType.MapStartMarker)
				depth++;
		}

		var fromVDFTypeName = "object";
		var firstNonMetadataToken = tokensAtDepth0.First(a=>a.type != VDFTokenType.Metadata);
		if (tokensAtDepth0[0].type == VDFTokenType.Metadata)
			fromVDFTypeName = tokensAtDepth0[0].text;
		else if (firstNonMetadataToken.type == VDFTokenType.Boolean)
			fromVDFTypeName = "bool";
		else if (firstNonMetadataToken.type == VDFTokenType.Number)
			fromVDFTypeName = firstNonMetadataToken.text.Contains(".") ? "double" : "int";
		else if (firstNonMetadataToken.type == VDFTokenType.String)
			fromVDFTypeName = "string";
		else if (firstNonMetadataToken.type == VDFTokenType.ListStartMarker)
			fromVDFTypeName = "List(object)";
		else if (firstNonMetadataToken.type == VDFTokenType.MapStartMarker)
			fromVDFTypeName = "Dictionary(object object)"; //"object";

		var typeName = declaredTypeName;
		if (fromVDFTypeName != null && fromVDFTypeName.length > 0)
		{
			// porting-note: this is only a limited implementation of CS functionality of making sure from-vdf-type is more specific than declared-type
			if (typeName == null || ["object", "IList", "IDictionary"].Contains(typeName)) // if there is no declared type, or the from-metadata type is more specific than the declared type (i.e. declared type is most basic type 'object')
				typeName = fromVDFTypeName;
		}
		var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
		var typeInfo = VDFTypeInfo.Get(typeName);

		// create the object's VDFNode, and load in the data
		// ==========

		var node = new VDFNode();
		node.metadata = tokensAtDepth0[0].type == VDFTokenType.Metadata ? fromVDFTypeName : null;
		
		// if primitive, parse value
		if (firstNonMetadataToken.type == VDFTokenType.Null)
			node.primitiveValue = null;
		else if (firstNonMetadataToken.type == VDFTokenType.Boolean)
			node.primitiveValue = firstNonMetadataToken.text == "true" ? true : false;
		else if (firstNonMetadataToken.type == VDFTokenType.Number)
			node.primitiveValue = parseFloat(firstNonMetadataToken.text);
		else if (firstNonMetadataToken.type == VDFTokenType.String)
			node.primitiveValue = firstNonMetadataToken.text;
		
		// if list, parse items
		else if (typeName.StartsWith("List(")) //typeof(IList).IsAssignableFrom(objType))
		{
			node.isList = true;
			for (var i = 0; i < tokensAtDepth1.Count; i++)
			{
				var token = tokensAtDepth1[i];
				if (token.type != VDFTokenType.ListEndMarker && token.type != VDFTokenType.MapEndMarker)
				{
					var itemFirstToken = tokens[token.index];
					var itemEnderToken = tokensAtDepth1.FirstOrDefault(a=>a.index > itemFirstToken.index + (itemFirstToken.type == VDFTokenType.Metadata ? 1 : 0) && token.type != VDFTokenType.ListEndMarker && token.type != VDFTokenType.MapEndMarker);
					//node.AddListChild(VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, itemFirstToken, itemEnderToken), typeGenericArgs[0], options));
					node.AddListChild(VDFLoader.ToVDFNode(tokens, typeGenericArgs[0], options, itemFirstToken.index, itemEnderToken != null ? itemEnderToken.index : enderTokenIndex));
					if (itemFirstToken.type == VDFTokenType.Metadata) // if item had metadata, skip an extra token (since it had two non-end tokens)
						i++;
				}
			}
		}

		// if not primitive and not list (i.e. map/object/dictionary), parse pairs/properties
		else //if (!typeof(IList).IsAssignableFrom(objType))
		{
			node.isMap = true;
			for (var i = 0; i < tokensAtDepth1.Count; i++)
			{
				var token = tokensAtDepth1[i];
				if (token.type == VDFTokenType.Key)
				{
					var propName = token.text;
					var propValueTypeName;
					if (typeName.StartsWith("Dictionary(")) //typeof(IDictionary).IsAssignableFrom(objType))
						propValueTypeName = typeGenericArgs[1];
					else
						propValueTypeName = typeInfo && typeInfo.props[propName] ? typeInfo.props[propName].propTypeName : null;

					var propValueFirstToken = tokensAtDepth1[i + 1];
					var propValueEnderToken = tokensAtDepth1.FirstOrDefault(a=>a.index > propValueFirstToken.index && a.type == VDFTokenType.Key);
					//node.SetMapChild(propName, VDFLoader.ToVDFNode(VDFLoader.GetTokenRange_Tokens(tokens, propValueFirstToken, propValueEnderToken), propValueTypeName, options));
					node.SetMapChild(propName, VDFLoader.ToVDFNode(tokens, propValueTypeName, options, propValueFirstToken.index, propValueEnderToken != null ? propValueEnderToken.index : enderTokenIndex));
				}
			}
		}

		return node;
	}
	/*static GetTokenRange_Tokens(tokens: List<VDFToken>, firstToken: VDFToken, enderToken: VDFToken): List<VDFToken>
	{
		//return tokens.GetRange(firstToken.index, (enderToken != null ? enderToken.index : tokens.Count) - firstToken.index).Select(a=>new VDFToken(a.type, a.position - firstToken.position, a.index - firstToken.index, a.text)).ToList();

		var result = new List<VDFToken>("VDFToken");
		for (var i = firstToken.index; i < (enderToken != null ? enderToken.index : tokens.Count); i++)
			result.Add(new VDFToken(tokens[i].type, tokens[i].position - firstToken.position, tokens[i].index - firstToken.index, tokens[i].text));
		return result;
	}*/
}