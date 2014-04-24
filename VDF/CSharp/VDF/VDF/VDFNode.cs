using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Runtime.Serialization;
using System.Text;
using System.Text.RegularExpressions;

public class VDFNode
{
	public string metadata_type;
	public string baseValue;
	public List<VDFNode> items = new List<VDFNode>();
	public Dictionary<string, VDFNode> properties = new Dictionary<string, VDFNode>(); // this also holds Dictionaries' keys/values

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

	public bool isList;
	public bool isDictionary;
	public bool popOutToOwnLine;
	public bool isFirstItemOfNonFirstPopOutGroup;
	public bool isListItem;
	public bool isListItem_nonFirst;
	public string GetInLineItemText()
	{
		var builder = new StringBuilder();
		if (isFirstItemOfNonFirstPopOutGroup)
			builder.Append("#");
		if (isListItem_nonFirst && !popOutToOwnLine)
			builder.Append("|");
		if (isListItem && isList)
			builder.Append("{");
		if (metadata_type != null)
			builder.Append(isList || isDictionary ? metadata_type.Replace(" ", "") + ">>" : metadata_type.Replace(" ", "") + ">");

		if (baseValue != null)
			builder.Append(RawDataStringToFinalized(baseValue));
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

		if (isListItem && isList)
			builder.Append("}");

		return builder.ToString();
	}
	static string RawDataStringToFinalized(string rawDataStr)
	{
		string result = rawDataStr;
		if (rawDataStr.Contains(">") || rawDataStr.Contains("}"))
			if (rawDataStr.EndsWith("@") || rawDataStr.EndsWith("|"))
				result = "@@" + new Regex("@@(?=\n|}|$)").Replace(rawDataStr, "@@@") + "|@@";
			else
				result = "@@" + new Regex("@@(?=\n|}|$)").Replace(rawDataStr, "@@@") + "@@";
		return result;
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

	public T ToObject<T>(VDFLoadOptions loadOptions = null) { return (T)ToObject(typeof(T), loadOptions); }
	public object ToObject(VDFLoadOptions loadOptions, Type declaredType = null) { return ToObject(declaredType, loadOptions); }
	public object ToObject(Type declaredType = null, VDFLoadOptions loadOptions = null)
	{
		loadOptions = loadOptions ?? new VDFLoadOptions();

		var finalMetadata_type = metadata_type;
		if (finalMetadata_type == "") // empty string, so infer type
		{
			if (baseValue == "null")
				finalMetadata_type = "null";
			else if (new[] { "true", "false" }.Contains(baseValue))
				finalMetadata_type = "bool";
			else if (baseValue.Contains("."))
				finalMetadata_type = "float";
			else
				finalMetadata_type = "int";
		}
		else if (finalMetadata_type == null && baseValue != null && declaredType == null) // if no type specified, but it has a base-value and no declared-type is set, infer it to be string
			finalMetadata_type = "string";

		if (finalMetadata_type == "null") // special case for null-values
			return null;

		// note; C# 3.5 doesn't have anonymous objects, so if the type isn't specified in the VDF text itself, a declared-type is required
		Type finalType = finalMetadata_type != null ? VDF.GetTypeByVName(finalMetadata_type, loadOptions) : declaredType;
		
		object result;
		if (VDF.typeImporters_inline.ContainsKey(finalType))
			result = VDF.typeImporters_inline[finalType](baseValue);
		else if (finalType.IsEnum)
			result = Enum.Parse(finalType, baseValue);
		else if (finalType.IsPrimitive || finalType == typeof(string))
			result = Convert.ChangeType(baseValue, finalType);
		else
		{
			result = CreateNewInstanceOfType(finalType);
			IntoObject(result, loadOptions);
		}

		return result;
	}
	public void IntoObject(object obj, VDFLoadOptions loadOptions = null)
	{
		loadOptions = loadOptions ?? new VDFLoadOptions();
		var type = obj.GetType();
		var typeInfo = VDFTypeInfo.Get(type);
		for (int i = 0; i < items.Count; i++)
			if (obj is Array)
				((Array)obj).SetValue(items[i].ToObject(type.GetElementType(), loadOptions), i);
			else if (obj is IList)
				((IList)obj).Add(items[i].ToObject(type.GetGenericArguments()[0], loadOptions));
		foreach (string propName in properties.Keys)
			if (obj is IDictionary)
				((IDictionary)obj).Add(VDF.typeImporters_inline.ContainsKey(type.GetGenericArguments()[0]) ? VDF.typeImporters_inline[type.GetGenericArguments()[0]](propName) : propName, properties[propName].ToObject(type.GetGenericArguments()[1], loadOptions));
			else
				typeInfo.propInfoByName[propName].SetValue(obj, properties[propName].ToObject(typeInfo.propInfoByName[propName].GetPropType(), loadOptions));

		// call post-deserialize constructors before post-deserialize normal methods
		foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo => methodInfo.memberInfo is ConstructorInfo && methodInfo.postDeserializeMethod))
			method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[]{loadOptions.message} : new object[0]);
		foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo => methodInfo.memberInfo is MethodInfo && methodInfo.postDeserializeMethod))
			method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[]{ loadOptions.message } : new object[0]);
	}
}