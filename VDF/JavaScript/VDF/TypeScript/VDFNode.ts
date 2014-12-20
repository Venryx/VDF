class VDFNode
{
	metadata_type: string;
	baseValue: string;
	items = new List<VDFNode>("VDFNode");
	properties = new Dictionary<string, VDFNode>("string", "VDFNode"); // this also holds Dictionaries' keys/values
	
	constructor(baseValue?: string, metadata_type?: string)
	{
		this.baseValue = baseValue;
		this.metadata_type = metadata_type;
	}

	// in TypeScript/JavaScript we don't have implicit casts, so we have to use these (either that or convert the VDFNode to an anonymous object)
	get AsBool() { return new VDFNode(this.baseValue).ToObject("bool"); }
	set AsBool(value: boolean) { this.baseValue = value.toString(); }
	get AsInt() { return new VDFNode(this.baseValue).ToObject("int"); }
	set AsInt(value: number) { this.baseValue = parseInt(value.toString()).toString(); }
	get AsFloat() { return new VDFNode(this.baseValue).ToObject("float"); }
	set AsFloat(value: number) { this.baseValue = value.toString(); }
	get AsString() { return this.baseValue; }
	set AsString(value: string) { this.baseValue = value; }
	toString(): string { return this.AsString; } // another way of calling the above as-string getter; equivalent to: vdfNode.AsString

	SetItem(index: number, value: any)
	{
		this.items[index] = value;
		this[index] = value;
	}
	AddItem(value: any) { this.SetItem(this.items.length, value); }
	InsertItem(index: number, value: any)
	{
		var oldItems = this.items;
		for (var i = 0; i < oldItems.length; i++) // we need to first remove old values, so the slate is clean for manual re-adding/re-ordering
			delete this[i];
		for (var i = 0; i < oldItems.length + 1; i++) // now add them all back in, in the correct order
			this.AddItem(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
	}
	SetProperty(key: string, value: any)
	{
		this.properties.Set(key, value);
		this[key] = value;
	}

	// saving
	// ==================

	isList: boolean;
	isDictionary: boolean;
	popOutChildren: boolean;
	guardingItsLastLine: boolean;
	static RawDataStringToFinalized(rawDataStr: string, disallowRawPipe?: boolean): string
	{
		var result = rawDataStr;
		if (rawDataStr.indexOf(":") != -1 || rawDataStr.indexOf(">") != -1 || rawDataStr.indexOf("}") != -1 || (disallowRawPipe && rawDataStr.indexOf("|") != -1) || rawDataStr.indexOf("@@") != -1 || rawDataStr.indexOf(";;") != -1 || rawDataStr.indexOf("\n") != -1 || rawDataStr.indexOf("\t") != -1) // note: tabs can probably be put back in without escaping, in certain cases
			if (rawDataStr.lastIndexOf("@") == rawDataStr.length - 1 || rawDataStr.lastIndexOf("|") == rawDataStr.length - 1)
				result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "|@@";
			else
				result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "@@";
		return result;
	}
	static AddIndentToChildText(childText: string): string
	{
		var builder = new StringBuilder();
		builder.Append("\t");
		var inLiteralMarkers = false;
		for (var i = 0; i < childText.length; i++)
		{
			var lastChar = i - 1 >= 0 ? childText[i - 1] : null;
			var ch = childText[i];
			var nextChar = i + 1 < childText.length ? childText[i + 1] : null;
			var nextNextChar = i + 2 < childText.length ? childText[i + 2] : null;
			var nextNextNextChar = i + 3 < childText.length ? childText[i + 3] : null;

			if (!inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@') // if first char of literal-start-marker
				inLiteralMarkers = true;
			else if (inLiteralMarkers && lastChar != '@' && ch == '@' && nextChar == '@' && ((nextNextChar == '|' && nextNextNextChar != '|') || nextNextChar == '}' || nextNextChar == '\n' || nextNextChar == null)) // if first char of literal-end-marker
				inLiteralMarkers = false;

			if (lastChar == '\n' && !inLiteralMarkers)
				builder.Append("\t");

			builder.Append(ch);
		}
		return builder.ToString();
	}
	ToVDF(disallowRawPipe?: boolean): string
	{
		var builder = new StringBuilder();
		if (this.metadata_type != null)
			builder.Append(this.isList || this.isDictionary ? this.metadata_type.replace(/ /g, "") + ">>" : this.metadata_type.replace(/ /g, "") + ">");
		
		if (this.baseValue != null)
			builder.Append(VDFNode.RawDataStringToFinalized(this.baseValue, disallowRawPipe));
		else if (this.items.length > 0)
		{
			//var hasItemWeMustBracket = this.items.filter(a=>a.isList || a.popOutChildren).length;
			for (var i = 0; i < this.items.length; i++)
			{
				var lastItem = i > 0 ? this.items[i - 1] : null;
				var item = this.items[i];

				var isItemWeMustBracket = item.isList || item.popOutChildren;

				if (lastItem != null && lastItem.guardingItsLastLine)
				{
					builder.Append("\n");
					lastItem.guardingItsLastLine = false;
				}

				if (this.popOutChildren)
					builder.Append("\n" + VDFNode.AddIndentToChildText(item.ToVDF()));
				else
					if (isItemWeMustBracket) //hasItemWeMustBracket)
					{
						var itemVDF = item.ToVDF();
						var beforeEndBracketExtraText = "";
						if (item.guardingItsLastLine)
						{
							beforeEndBracketExtraText = "\n";
							item.guardingItsLastLine = false;
						}
						builder.Append((i > 0 ? "|" : "") + "{" + itemVDF + beforeEndBracketExtraText + "}");
					}
					else
						builder.Append((i > 0 ? "|" : "") + item.ToVDF(item.baseValue != null && item.baseValue.indexOf("@@") != 0 && item.baseValue.indexOf("|") != -1));
			}
		}
		else
		{
			var lastPropName: string = null;
			for (var propName in this.properties.Keys)
			{
				var lastPropValue = lastPropName != null ? this.properties.Get(lastPropName) : null;
				var propValue = this.properties.Get(propName);

				if (lastPropValue != null && lastPropValue.guardingItsLastLine)
					if (this.popOutChildren) // if we're popping out this current child, we can ignore adding a marker for it, because it's supposed to be on its own line
						lastPropValue.guardingItsLastLine = false;
					else
					{
						builder.Append("\n");
						lastPropValue.guardingItsLastLine = false;
						if (lastPropValue.popOutChildren)
							builder.Append("^");
					}

				var propNameAndValueVDF: string;
				if (propValue.popOutChildren)
					propNameAndValueVDF = propName + ":" + propValue.ToVDF();
				else
				{
					var propValueVDF = propValue.ToVDF();
					if (propValue.guardingItsLastLine)
					{
						propValueVDF += "\n";
						propValue.guardingItsLastLine = false;
					}
					propNameAndValueVDF = propName + "{" + propValueVDF + "}";
				}
				if (this.popOutChildren)
					builder.Append("\n" + VDFNode.AddIndentToChildText(propNameAndValueVDF));
				else
					builder.Append(propNameAndValueVDF);

				lastPropName = propName;
			}
		}

		this.guardingItsLastLine = (this.popOutChildren && (this.items.length > 0 || this.properties.Count > 0));
		if (this.items.filter(a=>a.guardingItsLastLine).length > 0)
		{
			this.guardingItsLastLine = true; 
			for (var i = 0; i < this.items.length; i++)
				if (this.items[i].guardingItsLastLine)
				{
					this.items[i].guardingItsLastLine = false; // we've taken it as our own
					break;
				}
		}
		else
			for (var key in this.properties.Keys)
				if (this.properties.Get(key).guardingItsLastLine)
				{
					this.guardingItsLastLine = true;
					this.properties.Get(key).guardingItsLastLine = false; // we've taken it as our own
					break;
				}

		return builder.ToString();
	}

	// loading
	// ==================

	static CreateNewInstanceOfType(typeName: string, loadOptions: VDFLoadOptions)
	{
		// no need to "instantiate" primitives, strings, and enums (we create them straight-forwardly later on)
		if (["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"].indexOf(typeName) != -1 || EnumValue.IsEnum(typeName))
			return null;
		var genericParameters = VDF.GetGenericParametersOfTypeName(typeName);
		if (typeName.indexOf("List[") == 0)
			return new List(genericParameters[0]);
		if (typeName.indexOf("Dictionary[") == 0)
			return new Dictionary(genericParameters[0], genericParameters[1]);
		return new window[typeName];
	}
	static GetCompatibleTypeNameForNode(node: VDFNode) { return node.properties.Count ? "object" : (node.items.length ? "List[object]" : "string"); }

	ToObject(loadOptions: VDFLoadOptions, declaredTypeName?: string): any;
	ToObject(declaredTypeName?: string, loadOptions?: VDFLoadOptions): any;
	ToObject(declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any): any
	{
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;
		if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions)
			{declaredTypeName = declaredTypeName_orLoadOptions; loadOptions = loadOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = loadOptions_orDeclaredTypeName; loadOptions = declaredTypeName_orLoadOptions;}
		loadOptions = loadOptions || new VDFLoadOptions();

		var finalMetadata_type = this.metadata_type;
		if (finalMetadata_type == "") // empty string for metadata_type, so infer type
		{
			if (this.baseValue == "null")
				return null;
			if (this.baseValue == "empty")
				return "";
			if (["true", "false"].indexOf(this.baseValue) != -1)
				finalMetadata_type = "bool";
			else if (this.baseValue.indexOf(".") != -1)
				finalMetadata_type = "float";
			else
				finalMetadata_type = "int";
		}
		else if (finalMetadata_type == "IList")
			finalMetadata_type = "List[object]";
		else if (finalMetadata_type == "IDictionary")
			finalMetadata_type = "Dictionary[object,object]";

		var finalTypeName = declaredTypeName;
		if (finalMetadata_type != null && finalMetadata_type.length > 0)
		{
			// porting-note: this is only a limited implementation of CS functionality of making sure metadata-type (finalMetadata_type) is more specific than declared-type (finalTypeName)
			if (finalTypeName == null || ["object", "IList", "IDictionary"].indexOf(finalTypeName) != -1) // if there is no declared type, or the from-metadata type is more specific than the declared type
				finalTypeName = finalMetadata_type;
		}

		// porting-added; special type-mapping from C# types to JS types
		if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].indexOf(finalTypeName) != -1)
			finalTypeName = "number";
		else if (finalTypeName == "char")
			finalTypeName = "string";

		var finalTypeName_root = finalTypeName != null && (finalTypeName.indexOf("[") != -1 ? finalTypeName.substring(0, finalTypeName.indexOf("[")) : finalTypeName);
		if (finalTypeName_root) // if type specified
		{
			if (!VDF.typeImporters_inline[finalTypeName] && !EnumValue.IsEnum(finalTypeName) && !(window[finalTypeName_root] instanceof Function) && ["bool", "number", "string"].indexOf(finalTypeName_root) == -1) // if type doesn't exist
				if (loadOptions.inferCompatibleTypesForUnknownTypes)
					finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this); // infer a compatible, anonymous-like type from the node-data
				else
					throw new Error("Type \"" + finalMetadata_type + "\" not found."); // throw an error, because we can't go on without a final-type
		}
		else // if no metadata-type, and no declared-type
			if (loadOptions.inferCompatibleTypesForUnknownTypes) // if inference allowed, infer a compatible, anonymous-like type from the node-data (final-type must be something)
				finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
			else // otherwise, infer that it's a string (string is the default type)
				finalTypeName = "string"; // string is the default/fallback type

		var result;
		if (VDF.typeImporters_inline[finalTypeName])
			result = VDF.typeImporters_inline[finalTypeName](this.baseValue);
		else if (EnumValue.IsEnum(finalTypeName))
			result = EnumValue.GetEnumIntForStringValue(finalTypeName, this.baseValue);
		else if (finalTypeName == "bool")
			result = this.baseValue == "true" ? true : false;
		else if (finalTypeName == "number")
			result = parseFloat(this.baseValue);
		else if (finalTypeName == "string")
			result = this.baseValue;
		else if (this.baseValue != null) // (non-importer-registered objects, the only alternative to base-value-fallback-strings left, doesn't store base-values)
			result = this.baseValue;
		else
		{
			result = VDFNode.CreateNewInstanceOfType(finalTypeName, loadOptions);
			this.IntoObject(result, loadOptions, (declaredTypeName != null && (declaredTypeName.indexOf("List[") == 0 || declaredTypeName.indexOf("Dictionary[") == 0)) || (this.metadata_type != "IList" && this.metadata_type != "IDictionary"));
		}

		return result;
	}
	IntoObject(obj: any, loadOptions?: VDFLoadOptions, typeGenericArgumentsAreReal: boolean = true)
	{
		loadOptions = loadOptions || new VDFLoadOptions();

		if (obj && obj.VDFPreDeserialize)
			obj.VDFPreDeserialize(loadOptions.message);

		var finalTypeName = VDF.GetVTypeNameOfObject(obj);
		if (finalTypeName == null) // if no metadata-type, and no declared-type, infer a compatible, anonymous-like type from the node-data (final-type must be something)
			finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
		var typeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
		var finalTypeInfo = VDFTypeInfo.Get(finalTypeName);
		if (obj.push) // if push method actually exists // maybe todo: remove/rework this
			for (var i = 0; i < this.items.length; i++)
				(<List<any>>obj).push(this.items[i].ToObject(typeGenericArgumentsAreReal ? typeGenericParameters[0] : null, loadOptions));
		for (var propName in this.properties.Keys)
			try
			{
				if (obj instanceof Dictionary)
				{
					var key: any = propName; // in most cases, the Dictionary's in-code key-type will be a string, so we can just use the in-VDF raw-key-string directly
					if (typeGenericArgumentsAreReal)
						if (VDF.typeImporters_inline[typeGenericParameters[0]]) // porting-note: the JS version doesn't let you register importer-func's for generic-type-definitions
							key = VDF.typeImporters_inline[typeGenericParameters[0]](propName);
					(<Dictionary<any, any>>obj).Set(key, this.properties.Get(propName).ToObject(typeGenericArgumentsAreReal ? typeGenericParameters[1] : null, loadOptions));
				}
				else
					obj[propName] = this.properties.Get(propName).ToObject(typeGenericArgumentsAreReal ? finalTypeInfo && finalTypeInfo.propInfoByName[propName] && finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
			}
			catch (ex) { throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error loading key-value-pair or property '" + propName + "'.") + "\n"); }

		if (obj && obj.VDFPostDeserialize)
			obj.VDFPostDeserialize(loadOptions.message);
	}
}
VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);