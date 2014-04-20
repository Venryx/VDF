using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;

public class VDFNode
{
	public string metadata_type;
	public string baseValue;
	public List<VDFNode> items = new List<VDFNode>();
	public Dictionary<string, VDFNode> properties = new Dictionary<string, VDFNode>();

	public VDFNode this[int index]
	{
		get { return items[index]; }
		set
		{
			if (items.Count == index) // lets you add new items easily: vdfNode[0] = new VDFNode();
				items.Add(value);
			else
				items[index] = value;
		}
	}
	public VDFNode this[string key]
	{
		get { return properties[key]; }
		set { properties[key] = value; }
	}
	public VDFNode GetDictionaryValueNode(object key) { return items.FirstOrDefault(item=>item.items[0].Equals(VDFSaver.ToVDFNode(key))).items[1]; }
	public void SetDictionaryValueNode(object key, VDFNode valueNode)
	{
		var keyNode = VDFSaver.ToVDFNode(key);
		if (items.Exists(item=>item.items[0].Equals(keyNode)))
			items.FirstOrDefault(item=>item.items[0].Equals(keyNode)).items[1] = valueNode;
		else
			items.Add(new VDFNode {isKeyValuePairPseudoNode = true, items = new List<VDFNode> {keyNode, valueNode}});
	}
	public bool Equals(VDFNode other) { return ToVDF() == other.ToVDF(); } // base equality on whether their 'default output' is the same
	// base-types: ["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"]
	public static implicit operator bool(VDFNode node) { return bool.Parse(node.baseValue); }
	public static implicit operator VDFNode(bool val) { return new VDFNode { baseValue = val.ToString().ToLower() }; }
	public static implicit operator char(VDFNode node) { return char.Parse(node.baseValue); }
	public static implicit operator VDFNode(char val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator byte(VDFNode node) { return byte.Parse(node.baseValue); }
	public static implicit operator VDFNode(byte val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator sbyte(VDFNode node) { return sbyte.Parse(node.baseValue); }
	public static implicit operator VDFNode(sbyte val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator short(VDFNode node) { return short.Parse(node.baseValue); }
	public static implicit operator VDFNode(short val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator ushort(VDFNode node) { return ushort.Parse(node.baseValue); }
	public static implicit operator VDFNode(ushort val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator int(VDFNode node) { return int.Parse(node.baseValue); }
	public static implicit operator VDFNode(int val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator uint(VDFNode node) { return uint.Parse(node.baseValue); }
	public static implicit operator VDFNode(uint val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator long(VDFNode node) { return long.Parse(node.baseValue); }
	public static implicit operator VDFNode(long val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator ulong(VDFNode node) { return ulong.Parse(node.baseValue); }
	public static implicit operator VDFNode(ulong val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator float(VDFNode node) { return float.Parse(node.baseValue); }
	public static implicit operator VDFNode(float val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator double(VDFNode node) { return double.Parse(node.baseValue); }
	public static implicit operator VDFNode(double val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator decimal(VDFNode node) { return decimal.Parse(node.baseValue); }
	public static implicit operator VDFNode(decimal val) { return new VDFNode { baseValue = val.ToString() }; }
	public static implicit operator string(VDFNode node) { return node.baseValue; }
	public static implicit operator VDFNode(string val) { return new VDFNode { baseValue = val }; }
	public override string ToString() { return this; } // another way of calling the above string cast; equivalent to: (string)vdfNode
	// saving
	// ==================

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
			builder.Append("<" + (isListOrDictionary ? "<" + metadata_type.Replace(" ", "") + ">" : metadata_type.Replace(" ", "")) + ">");

		if (baseValue != null)
			builder.Append(baseValue);
		else if (items.Count > 0)
		{
			foreach (VDFNode item in items)
				if (!item.popOutToOwnLine)
					builder.Append(item.GetInLineItemText());
		}
		else
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
	public string ToVDF()
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
	static object ConvertVDFNodeToCorrectType(VDFNode vdfNode, Type declaredType, VDFLoadOptions loadOptions)
	{
		object result;
		if (vdfNode.baseValue == null)
			result = vdfNode.ToObject(vdfNode.metadata_type != null ? VDF.GetTypeByVName(vdfNode.metadata_type, loadOptions) : declaredType, loadOptions); // tell node to return itself as the correct type
		else // base-value must be a string
		{
			if (vdfNode.baseValue == "[#null]") // special case for null-values
				result = null;
			else if (VDF.typeImporters_inline.ContainsKey(declaredType))
				result = VDF.typeImporters_inline[declaredType](vdfNode.baseValue); //(string)vdfNode);
			else if (declaredType.IsEnum)
				result = Enum.Parse(declaredType, vdfNode.baseValue);
			else // if no specific handler, try auto-converting string to the correct (string-or-primitive) type
				result = Convert.ChangeType(vdfNode.baseValue, declaredType);
		}
		return result;
	}

	public T ToObject<T>(VDFLoadOptions loadOptions = null) { return (T)ToObject(typeof(T), loadOptions); }
	public object ToObject(Type declaredType, VDFLoadOptions loadOptions = null)
	{
		if (loadOptions == null)
			loadOptions = new VDFLoadOptions();

		Type type = metadata_type != null ? VDF.GetTypeByVName(metadata_type, loadOptions) : declaredType;
		var typeInfo = VDFTypeInfo.Get(type);

		object result = CreateNewInstanceOfType(type);
		for (int i = 0; i < items.Count; i++)
			if (result is Array)
				((Array)result).SetValue(ConvertVDFNodeToCorrectType(items[i], type.GetElementType(), loadOptions), i);
			else if (result is IList)
				((IList)result).Add(ConvertVDFNodeToCorrectType(items[i], type.GetGenericArguments()[0], loadOptions));
			else if (result is IDictionary) // note; if result is of type 'Dictionary', then each of these items we're looping through are key-value-pair-pseudo-objects
				((IDictionary)result).Add(ConvertVDFNodeToCorrectType(items[i].items[0], type.GetGenericArguments()[0], loadOptions), ConvertVDFNodeToCorrectType(items[i].items[1], type.GetGenericArguments()[1], loadOptions));
			else // must be low-level node, with first item's base-value actually being what this node's base-value should be set to
				result = ConvertVDFNodeToCorrectType(items[i], type, loadOptions);
		foreach (string propName in properties.Keys)
		{
			VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
			propInfo.SetValue(result, ConvertVDFNodeToCorrectType(properties[propName], propInfo.GetPropType(), loadOptions));
		}

		return result;
	}
}