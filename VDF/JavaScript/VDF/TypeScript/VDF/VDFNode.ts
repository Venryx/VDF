class VDFNode
{
	static builtInProps = ["metadata_type", "baseValue", "items", "properties", "GetDictionaryValueNode", "SetDictionaryValueNode", "AsBool", "AsFloat", "AsString",
		"isNamedPropertyValue", "isListOrDictionary", "popOutToOwnLine", "isFirstItemOfNonFirstPopOutGroup", "isListItem_list", "isListItem_nonFirst", "isKeyValuePairPseudoNode"];

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
	get properties(): any
	{
		var objWithPropKeys = {};
		for (var key in this)
			if (!VDFNode.builtInProps.contains(key) && !(this[key] instanceof Function) && parseInt(key) != key) // if not number-index
				objWithPropKeys[key] = this[key];
		return objWithPropKeys;
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

	GetDictionaryValueNode(key): VDFNode { return this.items.filter((item, index, array)=>item.items[0].ToVDF() == VDFSaver.ToVDFNode(key).ToVDF())[0].items[1]; } // base equality on whether their 'default output' is the same
	SetDictionaryValueNode(key, valueNode: VDFNode): void
	{
		var keyNode = VDFSaver.ToVDFNode(key);
		if (this.items.contains(keyNode))
			this.items.filter((item, index, array) => item.items[0].ToVDF() == VDFSaver.ToVDFNode(key).ToVDF())[0].SetItem(1, valueNode);
		else
		{
			var newNode = new VDFNode();
			newNode.isKeyValuePairPseudoNode = true;
			newNode.PushItem(keyNode);
			newNode.PushItem(valueNode);
			this.PushItem(newNode);
		}
	}
	// in TypeScript/JavaScript we don't have implicit casts, so we have to use these (either that or convert the VDFNode to an anonymous object)
	get AsBool() { return VDFNode.ConvertVDFNodeToCorrectType(new VDFNode(this.baseValue), "bool", null); }
	set AsBool(value: boolean) { this.baseValue = value.toString(); }
	get AsFloat() { return VDFNode.ConvertVDFNodeToCorrectType(new VDFNode(this.baseValue), "float", null); }
	set AsFloat(value: number) { this.baseValue = value.toString(); }
	get AsString() { return this.baseValue; }
	set AsString(value: string) { this.baseValue = value; }
	toString(): string { return this.AsString; } // another way of calling the above as-string getter; equivalent to: vdfNode.AsString

	// saving
	// ==================

	isListOrDictionary: boolean;
	popOutToOwnLine: boolean;
	isFirstItemOfNonFirstPopOutGroup: boolean;
	isListItem_list: boolean;
	isListItem_nonFirst: boolean;
	isKeyValuePairPseudoNode: boolean;
	GetInLineItemText(): string
	{
		var builder = new StringBuilder();
		if (this.isFirstItemOfNonFirstPopOutGroup)
			builder.Append("#");
		if (this.isListItem_nonFirst && !this.popOutToOwnLine)
			builder.Append("|");
		if ((this.isKeyValuePairPseudoNode && !this.popOutToOwnLine) || this.isListItem_list)
			builder.Append("{");
		if (this.metadata_type != null)
			builder.Append("<" + (this.isListOrDictionary ? "<" + this.metadata_type.replace(/ /g, "") + ">" : this.metadata_type.replace(/ /g, "")) + ">");
		
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

		if ((this.isKeyValuePairPseudoNode && !this.popOutToOwnLine) || this.isListItem_list)
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
	
	static GetGenericParametersOfTypeName(typeName: string): string[]
	{
		var genericArgumentTypes = new Array<string>();
		var depth = 0;
		var lastStartBracketPos = -1;
		for (var i = 0; i < typeName.length; i++)
		{
			var ch = typeName[i];
			if (ch == ']')
				depth--;
			if ((depth == 0 && ch == ']') || (depth == 1 && ch == ','))
				genericArgumentTypes.push(typeName.substring(lastStartBracketPos + 1, i)); // get generic-parameter type-str
			if ((depth == 0 && ch == '[') || (depth == 1 && ch == ','))
				lastStartBracketPos = i;
			if (ch == '[')
				depth++;
		}
		return genericArgumentTypes;
	}
	static CreateNewInstanceOfType(typeName: string, loadOptions: VDFLoadOptions)
	{
		// no need to "instantiate" primitives, strings, and enums (we create them straight-forwardly later on)
		if (["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"].contains(typeName) || EnumValue.IsEnum(typeName))
			return null;
		var genericParameters = VDFNode.GetGenericParametersOfTypeName(typeName);
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
	static ConvertVDFNodeToCorrectType(vdfNode: VDFNode, declaredTypeName: string, loadOptions: VDFLoadOptions): any
	{
		var result;
		if (vdfNode.baseValue == null)
			result = vdfNode.ToObject(vdfNode.metadata_type || declaredTypeName, loadOptions); // tell node to return itself as the correct type
		else // base-value must be a string
		{
			if (vdfNode.baseValue == "[#null]") // special case for null-values
				result = null;
			else if (VDF.typeImporters_inline[declaredTypeName])
				result = VDF.typeImporters_inline[declaredTypeName](vdfNode.baseValue); //(string)vdfNode);
			else if (EnumValue.IsEnum(declaredTypeName))
				result = EnumValue.GetEnumIntForStringValue(declaredTypeName, vdfNode.baseValue);
			else if (declaredTypeName == "bool")
				result = vdfNode.baseValue == "true" ? true : false;
			else if (["byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal"].contains(declaredTypeName)) // if number
				result = parseFloat(vdfNode.baseValue);
			else // must be a string or char
				result = vdfNode.baseValue;
		}
		return result;
	}

	public ToObject(declaredTypeName: string, loadOptions?: VDFLoadOptions)
	{
		if (!loadOptions)
			loadOptions = new VDFLoadOptions();

		var type = this.metadata_type || declaredTypeName;
		var typeGenericParameters = VDFNode.GetGenericParametersOfTypeName(declaredTypeName);
		var typeInfo = (window[declaredTypeName] || {}).typeInfo;

		var result = VDFNode.CreateNewInstanceOfType(type, loadOptions);
		for (var i = 0; i < this.items.length; i++)
			if (type.startsWith("List["))
				(<List<any>>result)[i] = VDFNode.ConvertVDFNodeToCorrectType(this.items[i], typeGenericParameters[0], loadOptions);
			else if (type.startsWith("Dictionary[")) // note; if result is of type 'Dictionary', then each of these items we're looping through are key-value-pair-pseudo-objects
				(<Dictionary<any, any>>result).set(VDFNode.ConvertVDFNodeToCorrectType(this.items[i].items[0], typeGenericParameters[0], loadOptions), VDFNode.ConvertVDFNodeToCorrectType(this.items[i].items[1], typeGenericParameters[1], loadOptions));
			else // must be low-level node, with first item's base-value actually being what this node's base-value should be set to
				result = VDFNode.ConvertVDFNodeToCorrectType(this.items[i], type, loadOptions);
		for (var propName in this.properties) // for below; if prop-info not specified, consider its declared-type to be 'object'
			result[propName] = VDFNode.ConvertVDFNodeToCorrectType(this.properties[propName], typeInfo && typeInfo.propInfoByPropName[propName] ? typeInfo.propInfoByPropName[propName].propVTypeName : "object", loadOptions);

		return result;
	}
}