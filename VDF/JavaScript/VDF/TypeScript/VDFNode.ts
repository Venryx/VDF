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
	hasDanglingIndentation: boolean;
	static RawDataStringToFinalized(rawDataStr: string, disallowRawPipe?: boolean): string
	{
		var result = rawDataStr;
		if (rawDataStr.indexOf(">") != -1 || rawDataStr.indexOf("}") != -1 || (disallowRawPipe && rawDataStr.indexOf("|") != -1) || rawDataStr.indexOf("@@") != -1 || rawDataStr.indexOf("\n") != -1)
			if (rawDataStr.lastIndexOf("@") == rawDataStr.length - 1 || rawDataStr.lastIndexOf("|") == rawDataStr.length - 1)
				result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "|@@";
			else
				result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "@@";
		return result;
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
			var hasListItem = this.items.filter(a=>a.isList).length;
			for (var i = 0; i < this.items.length; i++)
			{
				var lastItem = i > 0 ? this.items[i - 1] : null;
				var item = this.items[i];

				if (lastItem != null && lastItem.hasDanglingIndentation)
				{
					builder.Append("\n");
					lastItem.hasDanglingIndentation = false;
				}

				if (this.popOutChildren)
				{
					var lines = item.ToVDF().split('\n');
					for (var i2 = 0; i2 < lines.length; i2++)
						lines[i2] = "\t" + lines[i2];
					builder.Append("\n" + lines.join("\n"));
				}
				else
					if (hasListItem)
						builder.Append((i > 0 ? "|" : "") + "{" + item.ToVDF() + "}");
					else
						builder.Append((i > 0 ? "|" : "") + item.ToVDF(item.baseValue != null && item.baseValue.indexOf("@@") != 0 && item.baseValue.indexOf("|") != -1));
			}
		}
		else
		{
			var lastPropName: string = null;
			for (var propName in this.properties)
			{
				var lastPropValue = lastPropName != null ? this.properties[lastPropName] : null;
				var propValue = this.properties[propName];

				if (lastPropValue != null && lastPropValue.hasDanglingIndentation)
					if (this.popOutChildren) // if we're popping out this current child, we can ignore adding a marker for it, because it's supposed to be on its own line
						lastPropValue.hasDanglingIndentation = false;
					else
					{
						builder.Append("\n");
						lastPropValue.hasDanglingIndentation = false;
						if (lastPropValue.popOutChildren)
							builder.Append("^");
					}

				var propNameAndValueVDF: string;
				if (propValue.popOutChildren)
					propNameAndValueVDF = propName + ":" + propValue.ToVDF();
				else
				{
					var propValueVDF = propValue.ToVDF();
					if (propValue.hasDanglingIndentation)
					{
						propValueVDF += "\n";
						propValue.hasDanglingIndentation = false;
					}
					propNameAndValueVDF = propName + "{" + propValueVDF + "}";
				}
				if (this.popOutChildren)
				{
					var lines = propNameAndValueVDF.split('\n');
					for (var i = 0; i < lines.length; i++)
						lines[i] = "\t" + lines[i];
					propNameAndValueVDF = "\n" + lines.join("\n");
					builder.Append(propNameAndValueVDF);
				}
				else
					builder.Append(propNameAndValueVDF);

				lastPropName = propName;
			}
		}

		this.hasDanglingIndentation = (this.popOutChildren && (this.items.length > 0 || this.properties.Count > 0));
		if (this.items.filter(a=>a.hasDanglingIndentation).length > 0)
		{
			this.hasDanglingIndentation = true; 
			for (var i = 0; i < this.items.length; i++)
				if (this.items[i].hasDanglingIndentation)
				{
					this.items[i].hasDanglingIndentation = false; // we've taken it as our own
					break;
				}
		}
		else
			for (var key in this.properties)
				if (this.properties[key].hasDanglingIndentation)
				{
					this.hasDanglingIndentation = true;
					this.properties[key].hasDanglingIndentation = false; // we've taken it as our own
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
		var finalTypeName = VDF.GetVTypeNameOfObject(obj);
		if (finalTypeName == null) // if no metadata-type, and no declared-type, infer a compatible, anonymous-like type from the node-data (final-type must be something)
			finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
		var typeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
		var finalTypeInfo = VDFTypeInfo.Get(finalTypeName);
		for (var i = 0; i < this.items.length; i++)
			(<List<any>>obj).push(this.items[i].ToObject(typeGenericArgumentsAreReal ? typeGenericParameters[0] : null, loadOptions));
		for (var propName in this.properties)
			try
			{
				if (obj instanceof Dictionary)
				{
					var key: any = propName; // in most cases, the Dictionary's in-code key-type will be a string, so we can just use the in-VDF raw-key-string directly
					if (typeGenericArgumentsAreReal)
						if (VDF.typeImporters_inline[typeGenericParameters[0]]) // porting-note: the JS version doesn't let you register importer-func's for generic-type-definitions
							key = VDF.typeImporters_inline[typeGenericParameters[0]](propName);
					(<Dictionary<any, any>>obj).Set(key, this.properties[propName].ToObject(typeGenericArgumentsAreReal ? typeGenericParameters[1] : null, loadOptions));
				}
				else
					obj[propName] = this.properties[propName].ToObject(typeGenericArgumentsAreReal ? finalTypeInfo && finalTypeInfo.propInfoByName[propName] && finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
			}
			catch (ex) { throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error loading key-value-pair or property '" + propName + "'.") + "\n"); }

		if (obj && obj.VDFPostDeserialize)
			obj.VDFPostDeserialize(loadOptions.message);
	}
}
VDFUtils.MakePropertiesHidden(VDFNode.prototype, true);