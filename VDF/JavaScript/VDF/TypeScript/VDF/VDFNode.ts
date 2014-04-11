class VDFNode
{
	metadata_type: string;
	baseValue: string;
	items: Array<VDFNode> = []; // note; it'd be nice to get base-value system working without having to use the one-length-item-list system
	properties: Map<string, VDFNode> = new Map<string, VDFNode>();

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
		for (var i = 0; i < lines.length; i++)
			builder.Append(i == 0 ? "" : "\n").Append(this.popOutToOwnLine ? "\t" : "").Append(lines[i]); // line-breaks + indents + data
		return builder.ToString();
	}
	ToString(): string
	{
		var poppedOutItemText: string = this.GetPoppedOutItemText();
		return this.GetInLineItemText() + (poppedOutItemText.length > 0 ? "\n" + poppedOutItemText : "");
	}

	// loading
	// ==================
	
	static CreateNewInstanceOfType(type: string)
	{
		// todo; get this to handle List and Dictionary types
		return eval("new " + type + "()");
	}
	static ConvertRawValueToCorrectType(rawValue: any, declaredType: string, loadOptions: VDFLoadOptions): any
	{
		var result;
		if (rawValue.GetTypeName() == "VDFNode" && (<VDFNode>rawValue).baseValue == null)
			result = (<VDFNode>rawValue).ToObject((<VDFNode>rawValue).metadata_type || declaredType, loadOptions); // tell node to return itself as the correct type
		else // base-value must be a string (todo; update the 'items' var to only accept VDFNodes now)
		{
			if (VDF.typeImporters_inline[declaredType])
				result = VDF.typeImporters_inline[declaredType]((<VDFNode>rawValue).baseValue); //(string)rawValue);
			else if (EnumValue.IsEnum(declaredType))
				result = EnumValue.GetEnumStringForIntValue(declaredType, parseInt((<VDFNode>rawValue).baseValue));
			else // if no specific handler, try auto-converting string to the correct (primitive) type
				result = (<VDFNode>rawValue).baseValue; // todo
		}
		return result;
	}

	public ToObject(declaredType: string, loadOptions?: VDFLoadOptions)
	{
		if (declaredType == "string") // special case for properties of type 'string'; just return first item (there will always only be one, and it will always either be 'null' or the string itself)
			return this.items[0].baseValue == "null" ? null : this.items[0].baseValue;

		var type = this.metadata_type || declaredType;
		var typeInfo = null; // todo

		var result = VDFNode.CreateNewInstanceOfType(type);
		for (var i = 0; i < this.items.length; i++)
			if (type.startsWith("List["))
				(<List<any>>result)[i] = VDFNode.ConvertRawValueToCorrectType(this.items[i], typeInfo.itemType, loadOptions);
			else if (type.startsWith("Dictionary[")) // note; if result is of type 'Dictionary', then each of these items we're looping through are key-value-pair-pseudo-objects
				(<Dictionary<any, any>>result).set(VDFNode.ConvertRawValueToCorrectType(this.items[i].items[0], typeInfo.keyType, loadOptions), VDFNode.ConvertRawValueToCorrectType(this.items[i].items[1], typeInfo.valueType, loadOptions));
			else // must be low-level node, with first item's base-value actually being what this node's base-value should be set to
				result = VDFNode.ConvertRawValueToCorrectType(this.items[i], type, loadOptions);
		for (var propName in this.properties)
		{
			var propInfo: VDFPropInfo = null; // todo
			result[propName] = VDFNode.ConvertRawValueToCorrectType(this.properties[propName], propInfo.propVTypeName, loadOptions);
		}

		return result;
	}
}