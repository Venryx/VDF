using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

class VDFNode
{
	public string metadata;
	public List<object> items = new List<object>();
	public Dictionary<string, VDFNode> properties = new Dictionary<string, VDFNode>();
	
	// saving
	// ==================

	public bool popOutToOwnLine;
	public bool isFirstItemOfNonFirstPopOutGroup;
	public bool isNonFirstItemOfArray;
	public bool isKeyValuePairPseudoNode;
	public string GetInLineItemText()
	{
		var builder = new StringBuilder();
		if (isFirstItemOfNonFirstPopOutGroup)
			builder.Append("#");
		if (isNonFirstItemOfArray && !popOutToOwnLine)
			builder.Append("|");
		if (metadata != null)
			builder.Append("<" + metadata + ">");
		if (isKeyValuePairPseudoNode && !popOutToOwnLine)
			builder.Append("{");

		foreach (object item in items)
			if (item is VDFNode)
			{
				if (!((VDFNode)item).popOutToOwnLine)
					builder.Append(((VDFNode)item).GetInLineItemText());
			}
			else
				builder.Append(item);
		foreach (string propName in properties.Keys)
			if (!properties[propName].popOutToOwnLine)
				builder.Append(propName + "{" + properties[propName].GetInLineItemText() + "}");

		if (isKeyValuePairPseudoNode && !popOutToOwnLine)
			builder.Append("}");

		return builder.ToString();
	}
	public string GetPoppedOutItemText()
	{
		var lines = new List<string>();
		if (popOutToOwnLine)
			lines.Add(GetInLineItemText());
		foreach (object item in items)
			if (item is VDFNode)
			{
				string poppedOutText = ((VDFNode)item).GetPoppedOutItemText();
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
	static object ConvertRawValueToType(object rawValue, Type type)
	{
		object result;
		if (rawValue is VDFNode)
			result = ((VDFNode)rawValue).ToObject(type); // tell node to return itself as the correct type
		else // must be a string
		{
			if (VDF.typeImporters_inline.ContainsKey(type))
				result = VDF.typeImporters_inline[type]((string)rawValue);
			else if (type.IsEnum)
				result = Enum.Parse(type, (string)rawValue);
			else // if no specific handler, try auto-converting string to the correct (primitive) type
				result = Convert.ChangeType(rawValue, type);
		}
		return result;
	}

	public T ToObject<T>() { return (T)ToObject(typeof(T)); }
	public object ToObject(Type baseType)
	{
		if (baseType == typeof(string))
			return (string)items[0] == "null" ? null : items[0]; // special case for properties of type 'string'; just return first item (there will always only be one, and it will always either be 'null' or the string itself)

		Type type = baseType;
		if (metadata != null)
			type = Type.GetType(metadata);
		var typeInfo = VDFTypeInfo.Get(type);
		object result = CreateNewInstanceOfType(type);
		for (int i = 0; i < items.Count; i++)
			if (result is Array)
				((Array)result).SetValue(ConvertRawValueToType(items[i], type.GetElementType()), i);
			else if (result is IList)
				((IList)result).Add(ConvertRawValueToType(items[i], type.GetGenericArguments()[0]));
			else if (result is IDictionary) // note; if result is of type 'Dictionary', then each of these items we're looping through are key-value-pair-pseudo-objects
				((IDictionary)result).Add(ConvertRawValueToType(((VDFNode)items[i]).items[0], type.GetGenericArguments()[0]), ConvertRawValueToType(((VDFNode)items[i]).items[1], type.GetGenericArguments()[1]));
			else // must be primitive, with first item actually being this node's value
				result = ConvertRawValueToType(items[i], type);
		foreach (string propName in properties.Keys)
		{
			VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
			propInfo.SetValue(result, ConvertRawValueToType(properties[propName], propInfo.GetPropType()));
		}
		return result;
	}
}