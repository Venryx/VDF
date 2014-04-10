class VDFNode
{
	metadata_type: string;
	baseValue: string;
	items: Array<VDFNode> = []; // note; it'd be nice to get base-value system working without having to use the one-length-item-list system
	properties: Map<string, VDFNode> = new Map<string, VDFNode>();

	constructor(baseValue?: string)
	{
		this.baseValue = baseValue;
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
	
	/*static object ConvertRawValueToCorrectType(object rawValue, Type declaredType, VDFLoadOptions loadOptions)
	{
		object result;
		if (rawValue is VDFNode && ((VDFNode)rawValue).baseValue == null)
			result = ((VDFNode)rawValue).ToObject(((VDFNode) rawValue).metadata_type != null ? VDF.GetTypeByVName(((VDFNode) rawValue).metadata_type, loadOptions) : declaredType, loadOptions); // tell node to return itself as the correct type
		else // base-value must be a string (todo; update the 'items' var to only accept VDFNodes now)
		{
			if (VDF.typeImporters_inline.ContainsKey(declaredType))
				result = VDF.typeImporters_inline[declaredType](((VDFNode) rawValue).baseValue); //(string)rawValue);
				else if (declaredType.IsEnum)
				result = Enum.Parse(declaredType, ((VDFNode) rawValue).baseValue);
				else // if no specific handler, try auto-converting string to the correct (primitive) type
			result = Convert.ChangeType(((VDFNode) rawValue).baseValue, declaredType);
		}
		return result;
	}

	public T ToObject<T>(VDFLoadOptions loadOptions = null) { return (T) ToObject(typeof (T), loadOptions); }
	public object ToObject(Type declaredType, VDFLoadOptions loadOptions = null)
	{
		if (declaredType == typeof (string)) // special case for properties of type 'string'; just return first item (there will always only be one, and it will always either be 'null' or the string itself)
			return items[0].baseValue == "null" ? null : items[0].baseValue;

		Type type = metadata_type != null ? VDF.GetTypeByVName(metadata_type, loadOptions) : declaredType;
		var typeInfo = VDFTypeInfo.Get(type);

		object result = CreateNewInstanceOfType(type);
		for (int i = 0; i < items.Count; i++)
			if (result is Array)
				((Array)result).SetValue(ConvertRawValueToCorrectType(items[i], type.GetElementType(), loadOptions), i);
			else if (result is IList)
				((IList)result).Add(ConvertRawValueToCorrectType(items[i], type.GetGenericArguments()[0], loadOptions));
			else if (result is IDictionary) // note; if result is of type 'Dictionary', then each of these items we're looping through are key-value-pair-pseudo-objects
				((IDictionary)result).Add(ConvertRawValueToCorrectType(items[i].items[0], type.GetGenericArguments()[0], loadOptions), ConvertRawValueToCorrectType(items[i].items[1], type.GetGenericArguments()[1], loadOptions));
			else // must be low-level node, with first item's base-value actually being what this node's base-value should be set to
				result = ConvertRawValueToCorrectType(items[i], type, loadOptions);
		foreach(string propName in properties.Keys)
		{
			VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
			propInfo.SetValue(result, ConvertRawValueToCorrectType(properties[propName], propInfo.GetPropType(), loadOptions));
		}

		return result;
	}*/
}