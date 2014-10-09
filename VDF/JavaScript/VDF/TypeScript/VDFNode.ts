class VDFNode
{
	metadata_type: string;
	baseValue: string;
	get items(): Array<VDFNode>
	{
		var result = [];
		for (var key in this)
			if (!(this[key] instanceof Function) && parseInt(key) == key) // if number-index
				result.push(this[key]);
		return result;
	}
	get properties(): any // this also holds Dictionaries' keys/values
	{
		var objWithPropKeys = {};
		for (var key in this)
			if (!(this[key] instanceof Function) && parseInt(key) != key) // if not number-index
				objWithPropKeys[key] = this[key];
		return objWithPropKeys;
	}
	get propertyCount()
	{
		var result = 0;
		for (var key in this.properties)
			result++;
		return result;
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

	constructor(baseValue?: string, metadata_type?: string)
	{
		VDFUtils.SetUpStashFields(this, "metadata_type", "baseValue", "isList", "isDictionary", "popOutToOwnLine", "isFirstItemOfNonFirstPopOutGroup", "isListItem", "isListItem_nonFirst");
		this.baseValue = baseValue;
		this.metadata_type = metadata_type;
	}

	SetItem(index: number, value: any)
	{
		this.items[index] = value;
		this[index] = value;
	}
	PushItem(value: any) { this.SetItem(this.items.length, value); }
	InsertItem(index: number, value: any)
	{
		var oldItems = this.items;
		for (var i = 0; i < oldItems.length; i++) // we need to first remove old values, so the slate is clean for manual re-adding/re-ordering
			delete this[i];
		for (var i = 0; i < oldItems.length + 1; i++) // now add them all back in, in the correct order
			this.PushItem(i == 0 ? value : (i < index ? oldItems[i] : oldItems[i - 1]));
	}
	SetProperty(key: string, value: any)
	{
		this.properties[key] = value;
		this[key] = value;
	}

	// saving
	// ==================

	isList: boolean;
	isDictionary: boolean;
	popOutToOwnLine: boolean;
	isFirstItemOfNonFirstPopOutGroup: boolean;
	isListItem: boolean;
	isListItem_nonFirst: boolean;
	GetInLineItemText(): string
	{
		var builder = new StringBuilder();
		if (this.isFirstItemOfNonFirstPopOutGroup)
			builder.Append("#");
		if (this.isListItem_nonFirst && !this.popOutToOwnLine)
			builder.Append("|");
		if (this.isListItem && this.isList)
			builder.Append("{");
		if (this.metadata_type != null)
			builder.Append(this.isList || this.isDictionary ? this.metadata_type.replace(/ /g, "") + ">>" : this.metadata_type.replace(/ /g, "") + ">");
		
		if (this.baseValue != null)
			builder.Append(VDFNode.RawDataStringToFinalized(this.baseValue));
		else if (this.items.length > 0)
		{
			for (var key in this.items)
				if (!this.items[key].popOutToOwnLine)
					builder.Append(this.items[key].GetInLineItemText());
		}
		else
			for (var propName in this.properties)
				if (this.properties[propName].popOutToOwnLine)
					builder.Append(propName + "{#}");
				else if (this.properties[propName].items.filter(item=>item.popOutToOwnLine).length)
					builder.Append(propName + "{" + this.properties[propName].GetInLineItemText() + "#}");
				else
					builder.Append(propName + "{" + this.properties[propName].GetInLineItemText() + "}");

		if (this.isListItem && this.isList)
			builder.Append("}");

		return builder.ToString();
	}
	static RawDataStringToFinalized(rawDataStr: string): string
	{
		var result = rawDataStr;
		if (rawDataStr.contains(">") || rawDataStr.contains("}") || rawDataStr.contains("@@") || rawDataStr.contains("\n"))
			if (rawDataStr.endsWith("@") || rawDataStr.endsWith("|"))
				result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "|@@";
			else
				result = "@@" + rawDataStr.replace(/(@{2,})/g, "@$1") + "@@";
		return result;
	}
	GetPoppedOutItemText(): string
	{
		var lines = new Array<string>();
		if (this.popOutToOwnLine)
			lines.push(this.GetInLineItemText());
		for (var key in this.items)
		{
			var item = this.items[key];
			var poppedOutText: string = item.GetPoppedOutItemText();
			if (poppedOutText.length > 0)
			{
				var poppedOutLines = poppedOutText.split('\n');
				for (var index in poppedOutLines)
					if (poppedOutLines[index].length)
						lines.push(poppedOutLines[index]);
			}
		}
		for (var propName in this.properties)
		{
			var propValueNode: VDFNode = this.properties[propName];
			var poppedOutText: string = propValueNode.GetPoppedOutItemText();
			{
				var poppedOutLines = poppedOutText.split('\n');
				for (var index in poppedOutLines)
					if (poppedOutLines[index].length)
						lines.push(poppedOutLines[index]);
			}
		}
		var builder = new StringBuilder();
		for (var i2 = 0; i2 < lines.length; i2++)
			builder.Append(i2 == 0 ? "" : "\n").Append(this.popOutToOwnLine ? "\t" : "").Append(lines[i2]); // line-breaks + indents + data
		return builder.ToString();
	}
	ToVDF(): string
	{
		var poppedOutItemText: string = this.GetPoppedOutItemText();
		return this.GetInLineItemText() + (poppedOutItemText.length > 0 ? "\n" + poppedOutItemText : "");
	}

	// loading
	// ==================

	static CreateNewInstanceOfType(typeName: string, loadOptions: VDFLoadOptions)
	{
		// no need to "instantiate" primitives, strings, and enums (we create them straight-forwardly later on)
		if (["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"].contains(typeName) || EnumValue.IsEnum(typeName))
			return null;
		var genericParameters = VDF.GetGenericParametersOfTypeName(typeName);
		if (typeName.startsWith("List["))
			return new List(genericParameters[0]);
		if (typeName.startsWith("Dictionary["))
			return new Dictionary(genericParameters[0], genericParameters[1]);
		return new window[typeName];
	}
	static GetCompatibleTypeNameForNode(node: VDFNode) { return node.propertyCount ? "object" : (node.items.length ? "List[object]" : "string"); }

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
		if (finalMetadata_type == "") // empty string, so infer type
		{
			if (this.baseValue == "null")
				finalMetadata_type = "null";
			else if (["true", "false"].contains(this.baseValue))
				finalMetadata_type = "bool";
			else if (this.baseValue.contains("."))
				finalMetadata_type = "float";
			else
				finalMetadata_type = "int";
		}
		else if (finalMetadata_type == null && this.baseValue != null && (declaredTypeName == null || declaredTypeName == "object")) // if no type specified, but it has a base-value and no declared-type is set (or declared type is object), infer it to be string
			finalMetadata_type = "string";

		if (finalMetadata_type == "null") // special case for null-values
			return null;

		var finalTypeName = finalMetadata_type != null ? finalMetadata_type : declaredTypeName;
		if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].contains(finalTypeName))
			finalTypeName = "number";
		else if (finalTypeName == "char")
			finalTypeName = "string";

		if (finalTypeName == null) // if no metadata-type, and no declared-type, infer a compatible, anonymous-like type from the node-data (final-type must be something)
			finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
		var finalTypeName_root = finalTypeName.contains("[") ? finalTypeName.substring(0, finalTypeName.indexOf("[")) : finalTypeName;
		if (!VDF.typeImporters_inline[finalTypeName] && !EnumValue.IsEnum(finalTypeName) && !(window[finalTypeName_root] instanceof Function) && !["bool", "number", "string"].contains(finalTypeName_root)) // if type was specified, but the type doesn't exist
			if (loadOptions.inferCompatibleTypesForUnknownTypes) // and user allows inference-of-compatible-types-for-unknown-types (final-type must be something)
				finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this); // infer a compatible, anonymous-like type from the node-data
			else // otherwise, throw an error, because we can't go on without a final-type
				throw new Error("Type \"" + finalMetadata_type + "\" not found.");

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
			this.IntoObject(result, loadOptions);
		}

		return result;
	}
	IntoObject(obj: any, loadOptions?: VDFLoadOptions)
	{
		loadOptions = loadOptions || new VDFLoadOptions();
		var finalTypeName = VDF.GetVTypeNameOfObject(obj);
		if (finalTypeName == null) // if no metadata-type, and no declared-type, infer a compatible, anonymous-like type from the node-data (final-type must be something)
			finalTypeName = VDFNode.GetCompatibleTypeNameForNode(this);
		var typeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
		var finalTypeInfo = VDF.GetTypeInfo(finalTypeName);
		for (var i = 0; i < this.items.length; i++)
			(<List<any>>obj).push(this.items[i].ToObject(typeGenericParameters[0], loadOptions));
		for (var propName in this.properties)
			try
			{
				if (obj instanceof Dictionary)
					(<Dictionary<any, any>>obj).Set(VDF.typeImporters_inline[typeGenericParameters[0]] ? VDF.typeImporters_inline[typeGenericParameters[0]](propName) : propName, this.properties[propName].ToObject(typeGenericParameters[1], loadOptions));
				else
					obj[propName] = this.properties[propName].ToObject(finalTypeInfo && finalTypeInfo.propInfoByName[propName] ? finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
			}
			catch (ex) { throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error loading key-value-pair or property '" + propName + "'.") + "\n"); }

		if (obj && obj.VDFPostDeserialize)
			obj.VDFPostDeserialize(loadOptions.message);
	}
}
VDFUtils.MakePropertiesNonEnumerable(VDFNode.prototype, true);