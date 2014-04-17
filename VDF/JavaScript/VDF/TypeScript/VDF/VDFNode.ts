class VDFNode
{
	metadata_type: string;
	baseValue: string;
	items: Array<VDFNode> = []; // note; it'd be nice to get base-value system working without having to use the one-length-item-list system
	properties: Dictionary<string, VDFNode> = new Dictionary<string, VDFNode>();

	constructor(baseValue?: string, metadata_type?: string)
	{
		this.baseValue = baseValue;
		this.metadata_type = metadata_type;
	}

	// saving
	// ==================

	isNamedPropertyValue: boolean;
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
			builder.Append("<" + (this.isListOrDictionary /*&& isNamedPropertyValue*/ ? "<" + this.metadata_type.replace(/ /g, "") + ">" : this.metadata_type.replace(/ /g, "")) + ">");
		
		builder.Append(this.baseValue);
		for (var key in this.items)
			if (!this.items[key].popOutToOwnLine)
				builder.Append(this.items[key].GetInLineItemText());
		for (var i in this.properties.keys)
		{
			var propName = this.properties.keys[i];
			if (!this.properties.get(propName).popOutToOwnLine)
				builder.Append(propName + "{" + this.properties.get(propName).GetInLineItemText() + "}");
		}

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
		for (var i in this.properties.keys)
		{
			var propName = this.properties.keys[i];
			var propValueNode: VDFNode = this.properties.get(propName);
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
	ToString(): string
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
	static CreateNewInstanceOfType(typeName: string)
	{
		if (["bool", "float", "string"].contains(typeName) || EnumValue.IsEnum(typeName)) // no need to "instantiate" primitives and enums (we create them straight-forwardly later on)
			return null;
		var genericParameters = VDFNode.GetGenericParametersOfTypeName(typeName);
		if (typeName.startsWith("List["))
			return eval("new List(\"" + genericParameters[0] + "\")");
		if (typeName.startsWith("Dictionary["))
			return eval("new Dictionary(\"" + genericParameters[0] + "\",\"" + genericParameters[1] + "\")");
		return eval("new " + typeName + "()");
	}
	static ConvertRawValueToCorrectType(rawValue: any, declaredTypeName: string, loadOptions: VDFLoadOptions): any
	{
		var result;
		if (rawValue.GetTypeName() == "VDFNode" && (<VDFNode>rawValue).baseValue == null)
			result = (<VDFNode>rawValue).ToObject((<VDFNode>rawValue).metadata_type || declaredTypeName, loadOptions); // tell node to return itself as the correct type
		else // base-value must be a string (todo; update the 'items' var to only accept VDFNodes now)
		{
			if (VDF.typeImporters_inline[declaredTypeName])
				result = VDF.typeImporters_inline[declaredTypeName]((<VDFNode>rawValue).baseValue); //(string)rawValue);
			else if (EnumValue.IsEnum(declaredTypeName))
				result = EnumValue.GetEnumIntForStringValue(declaredTypeName, (<VDFNode>rawValue).baseValue);
			else if (declaredTypeName == "bool")
				result = (<VDFNode>rawValue).baseValue == "true" ? true : false;
			else // if no specific handler, try auto-converting string to the correct (primitive) type
				result = declaredTypeName == "float" ? parseFloat((<VDFNode>rawValue).baseValue) : (<VDFNode>rawValue).baseValue;
		}
		return result;
	}

	public ToObject(declaredTypeName: string, loadOptions?: VDFLoadOptions)
	{
		if (declaredTypeName == "string") // special case for properties of type 'string'; just return first item (there will always only be one, and it will always either be 'null' or the string itself)
			return this.items[0].baseValue == "null" ? null : this.items[0].baseValue;

		var type = this.metadata_type || declaredTypeName;
		var typeGenericParameters = VDFNode.GetGenericParametersOfTypeName(declaredTypeName);
		var typeInfo = (window[declaredTypeName] || {}).typeInfo;

		var result = VDFNode.CreateNewInstanceOfType(type);
		for (var i = 0; i < this.items.length; i++)
			if (type.startsWith("List["))
				(<List<any>>result)[i] = VDFNode.ConvertRawValueToCorrectType(this.items[i], typeGenericParameters[0], loadOptions);
			else if (type.startsWith("Dictionary[")) // note; if result is of type 'Dictionary', then each of these items we're looping through are key-value-pair-pseudo-objects
				(<Dictionary<any, any>>result).set(VDFNode.ConvertRawValueToCorrectType(this.items[i].items[0], typeGenericParameters[0], loadOptions), VDFNode.ConvertRawValueToCorrectType(this.items[i].items[1], typeGenericParameters[1], loadOptions));
			else // must be low-level node, with first item's base-value actually being what this node's base-value should be set to
				result = VDFNode.ConvertRawValueToCorrectType(this.items[i], type, loadOptions);
		for (var i in this.properties.keys)
		{
			var propName = this.properties.keys[i];
			result[propName] = VDFNode.ConvertRawValueToCorrectType(this.properties.get(propName), typeInfo.propInfoByPropName[propName].propVTypeName, loadOptions);
		}

		return result;
	}
}