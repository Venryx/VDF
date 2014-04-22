class VDFNode
{
	static builtInProps = ["metadata_type", "baseValue", "items", "properties", "propertyCount", "GetDictionaryValueNode", "SetDictionaryValueNode", "AsBool", "AsInt", "AsFloat", "AsString",
		"isNamedPropertyValue", "isList", "isDictionary", "popOutToOwnLine", "isFirstItemOfNonFirstPopOutGroup", "isListItem", "isListItem_nonFirst"];

	metadata_type: string;
	baseValue: string;
	get items(): Array<VDFNode>
	{
		var result = [];
		for (var key in this)
			if (!VDFNode.builtInProps.contains(key) && !(this[key] instanceof Function) && parseInt(key) == key) // if number-index
				result.push(this[key]);
		return result;
	}
	get properties(): any // this also holds Dictionaries' keys/values
	{
		var objWithPropKeys = {};
		for (var key in this)
			if (!VDFNode.builtInProps.contains(key) && !(this[key] instanceof Function) && parseInt(key) != key) // if not number-index
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

	constructor(baseValue?: string, metadata_type?: string)
	{
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
			builder.Append(this.baseValue);
		else if (this.items.length > 0)
		{
			for (var key in this.items)
				if (!this.items[key].popOutToOwnLine)
					builder.Append(this.items[key].GetInLineItemText());
		}
		else
			for (var propName in this.properties)
				if (!this.properties[propName].popOutToOwnLine)
					builder.Append(propName + "{" + this.properties[propName].GetInLineItemText() + "}");

		if (this.isListItem && this.isList)
			builder.Append("}");

		return builder.ToString();
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
			return eval("new List(\"" + genericParameters[0] + "\")");
		if (typeName.startsWith("Dictionary["))
			return eval("new Dictionary(\"" + genericParameters[0] + "\",\"" + genericParameters[1] + "\")");
		if (window[typeName] instanceof Function) // if class found
			return new window[typeName];
		else if (loadOptions.loadUnknownTypesAsAnonymous)
			return {};
		throw new Error("Class \"" + typeName + "\" not found.");
	}

	ToObject(loadOptions: VDFLoadOptions, declaredTypeName: string): any;
	ToObject(declaredTypeName: string, loadOptions: VDFLoadOptions): any;
	ToObject(declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any): any;
	ToObject(declaredTypeName_orLoadOptions?: any, loadOptions_orDeclaredTypeName?: any): any
	{
		var declaredTypeName: string;
		var loadOptions: VDFLoadOptions;
		if (typeof declaredTypeName_orLoadOptions == "string" || loadOptions_orDeclaredTypeName instanceof VDFLoadOptions)
			{declaredTypeName = declaredTypeName_orLoadOptions; loadOptions = loadOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = loadOptions_orDeclaredTypeName; loadOptions = declaredTypeName_orLoadOptions;}
		if (loadOptions == null)
			loadOptions = new VDFLoadOptions();

		var finalTypeName = this.metadata_type != null ? this.metadata_type : declaredTypeName;
		if (finalTypeName == null) // if no metadata-type, and no declared-type, infer a compatible, anonymous-like type from the node-data (final type must be something)
			finalTypeName = this.propertyCount ? "object" : (this.items.length ? "List[object]" : "string");
		var finalTypeGenericParameters = VDF.GetGenericParametersOfTypeName(finalTypeName);
		var finalTypeInfo = VDF.GetTypeInfo(finalTypeName);

		var result;
		if (this.baseValue == "[#null]") // special case for null-values
			result = null;
		else if (VDF.typeImporters_inline[finalTypeName])
			result = VDF.typeImporters_inline[finalTypeName](this.baseValue);
		else if (EnumValue.IsEnum(finalTypeName))
			result = EnumValue.GetEnumIntForStringValue(finalTypeName, this.baseValue);
		else if (finalTypeName == "bool")
			result = this.baseValue == "true" ? true : false;
		else if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].contains(finalTypeName)) // if number
			result = parseFloat(this.baseValue);
		else if (["string", "char"].contains(finalTypeName))
			result = this.baseValue;
		else
		{
			result = VDFNode.CreateNewInstanceOfType(finalTypeName, loadOptions);
			for (var i = 0; i < this.items.length; i++)
				(<List<any>>result).push(this.items[i].ToObject(finalTypeGenericParameters[0], loadOptions));
			for (var propName in this.properties)
				if (result instanceof Dictionary)
					(<Dictionary<any, any>>result).set(VDF.typeImporters_inline[finalTypeGenericParameters[0]] ? VDF.typeImporters_inline[finalTypeGenericParameters[0]](propName) : propName, this.properties[propName].ToObject(finalTypeGenericParameters[1], loadOptions));
				else
					result[propName] = this.properties[propName].ToObject(finalTypeInfo && finalTypeInfo.propInfoByName[propName] ? finalTypeInfo.propInfoByName[propName].propVTypeName : null, loadOptions);
		}

		if (result.VDFPostDeserialize)
			result.VDFPostDeserialize();

		return result;
	}
}