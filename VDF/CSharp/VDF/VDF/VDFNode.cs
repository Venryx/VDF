using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

class VDFNode
{
	public string metadata_type;
	public string baseValue;
	public List<VDFNode> items = new List<VDFNode>(); // note; it'd be nice to get base-value system working without having to use the one-length-item-list system
	public Dictionary<string, VDFNode> properties = new Dictionary<string, VDFNode>();
	
	// saving
	// ==================

	public bool isNamedPropertyValue;
	public bool isListOrDictionary;
	public bool popOutToOwnLine;
	public bool isFirstItemOfNonFirstPopOutGroup;
	public bool isListItem_list;
	public bool isListItem_nonFirst;
	public bool isKeyValuePairPseudoNode;
	public string GetInLineItemText()
	{
		var builder = new StringBuilder();
		if (isFirstItemOfNonFirstPopOutGroup)
			builder.Append("#");
		if (isListItem_nonFirst && !popOutToOwnLine)
			builder.Append("|");
		if ((isKeyValuePairPseudoNode && !popOutToOwnLine) || isListItem_list)
			builder.Append("{");
		if (metadata_type != null)
			builder.Append("<" + (isListOrDictionary /*&& isNamedPropertyValue*/ ? "<" + metadata_type.Replace(" ", "") + ">" : metadata_type.Replace(" ", "")) + ">");

		builder.Append(baseValue);
		foreach (VDFNode item in items)
			if (!item.popOutToOwnLine)
				builder.Append(item.GetInLineItemText());
		foreach (string propName in properties.Keys)
			if (!properties[propName].popOutToOwnLine)
				builder.Append(propName + "{" + properties[propName].GetInLineItemText() + "}");

		if ((isKeyValuePairPseudoNode && !popOutToOwnLine) || isListItem_list)
			builder.Append("}");

		return builder.ToString();
	}
	public string GetPoppedOutItemText()
	{
		var lines = new List<string>();
		if (popOutToOwnLine)
			lines.Add(GetInLineItemText());
		foreach (VDFNode item in items)
		{
			string poppedOutText = item.GetPoppedOutItemText();
			if (poppedOutText.Length > 0)
				foreach (string line in poppedOutText.Split(new[] {'\n'}))
					lines.Add(line);
		}
		foreach (string propName in properties.Keys)
		{
			VDFNode propValueNode = properties[propName];
			string poppedOutText = propValueNode.GetPoppedOutItemText();
			if (poppedOutText.Length > 0)
				foreach (string line in poppedOutText.Split(new[] {'\n'}))
					lines.Add(line);
		}
		var builder = new StringBuilder();
		for (int i = 0; i < lines.Count; i++)
			builder.Append(i == 0 ? "" : "\n").Append(popOutToOwnLine ? "\t" : "").Append(lines[i]); // line-breaks + indents + data
		return builder.ToString();
	}
	public override string ToString()
	{
		string poppedOutItemText = GetPoppedOutItemText();
		return GetInLineItemText() + (poppedOutItemText.Length > 0 ? "\n" + poppedOutItemText : "");
	}

	// loading
	// ==================

	static object CreateNewInstanceOfType(Type type)
	{
		if (typeof(IList).IsAssignableFrom(type) || typeof(IDictionary).IsAssignableFrom(type)) // special cases, which require that we call the constructor
			return Activator.CreateInstance(type, true);
		return FormatterServices.GetUninitializedObject(type); // preferred (for simplicity/consistency's sake): create an instance of the type, completely uninitialized 
	}
	static object ConvertRawValueToCorrectType(object rawValue, Type declaredType, VDFLoadOptions loadOptions)
	{
		object result;
		if (rawValue is VDFNode && ((VDFNode)rawValue).baseValue == null)
			result = ((VDFNode)rawValue).ToObject(((VDFNode)rawValue).metadata_type != null ? VDF.GetTypeByVName(((VDFNode)rawValue).metadata_type, loadOptions) : declaredType, loadOptions); // tell node to return itself as the correct type
		else // base-value must be a string (todo; update the 'items' var to only accept VDFNodes now)
		{
			if (VDF.typeImporters_inline.ContainsKey(declaredType))
				result = VDF.typeImporters_inline[declaredType](((VDFNode)rawValue).baseValue); //(string)rawValue);
			else if (declaredType.IsEnum)
				result = Enum.Parse(declaredType, ((VDFNode)rawValue).baseValue);
			else // if no specific handler, try auto-converting string to the correct (primitive) type
				result = Convert.ChangeType(((VDFNode)rawValue).baseValue, declaredType);
		}
		return result;
	}

	public T ToObject<T>(VDFLoadOptions loadOptions = null) { return (T)ToObject(typeof(T), loadOptions); }
	public object ToObject(Type declaredType, VDFLoadOptions loadOptions = null)
	{
		if (declaredType == typeof(string)) // special case for properties of type 'string'; just return first item (there will always only be one, and it will always either be 'null' or the string itself)
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
		foreach (string propName in properties.Keys)
		{
			VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
			propInfo.SetValue(result, ConvertRawValueToCorrectType(properties[propName], propInfo.GetPropType(), loadOptions));
		}

		return result;
	}
}