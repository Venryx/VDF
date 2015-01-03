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
	public string metadata;
	public object primitiveValue;
	public List<VDFNode> listChildren = new List<VDFNode>();
	public Dictionary<string, VDFNode> mapChildren = new Dictionary<string, VDFNode>(); // holds object-properties, as well as dictionary-key-value-pairs

	public VDFNode(string primitiveValue = null, string metadata = null)
	{
		this.primitiveValue = primitiveValue;
		this.metadata = metadata;
	}

	public VDFNode this[int index]
	{
		get { return listChildren[index]; }
		set
		{
			if (listChildren.Count == index) // lets you add new items easily: vdfNode[0] = new VDFNode();
				listChildren.Add(value);
			else
				listChildren[index] = value;
		}
	}
	public VDFNode this[string key]
	{
		get { return mapChildren[key]; }
		set { mapChildren[key] = value; }
	}
	public bool Equals(VDFNode other) { return ToVDF() == other.ToVDF(); } // base equality on whether their 'default output' is the same
	// base-types: ["bool", "char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "float", "double", "decimal", "string"]
	public static implicit operator bool(VDFNode node) { return (bool)node.primitiveValue; }
	public static implicit operator VDFNode(bool val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator char(VDFNode node) { return (char)node.primitiveValue; }
	public static implicit operator VDFNode(char val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator byte(VDFNode node) { return (byte)node.primitiveValue; }
	public static implicit operator VDFNode(byte val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator sbyte(VDFNode node) { return (sbyte)node.primitiveValue; }
	public static implicit operator VDFNode(sbyte val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator short(VDFNode node) { return (short)node.primitiveValue; }
	public static implicit operator VDFNode(short val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator ushort(VDFNode node) { return (ushort)node.primitiveValue; }
	public static implicit operator VDFNode(ushort val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator int(VDFNode node) { return (int)node.primitiveValue; }
	public static implicit operator VDFNode(int val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator uint(VDFNode node) { return (uint)node.primitiveValue; }
	public static implicit operator VDFNode(uint val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator long(VDFNode node) { return (long)node.primitiveValue; }
	public static implicit operator VDFNode(long val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator ulong(VDFNode node) { return (ulong)node.primitiveValue; }
	public static implicit operator VDFNode(ulong val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator float(VDFNode node) { return (float)node.primitiveValue; }
	public static implicit operator VDFNode(float val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator double(VDFNode node) { return (double)node.primitiveValue; }
	public static implicit operator VDFNode(double val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator decimal(VDFNode node) { return (decimal)node.primitiveValue; }
	public static implicit operator VDFNode(decimal val) { return new VDFNode { primitiveValue = val }; }
	public static implicit operator string(VDFNode node) { return (string)node.primitiveValue; }
	public static implicit operator VDFNode(string val) { return new VDFNode { primitiveValue = val }; }
	public override string ToString() { return this; } // another way of calling the above string cast; equivalent to: (string)vdfNode

	// saving
	// ==========

	static string PadString(string unpaddedString)
	{
		var result = unpaddedString;
		if (result.StartsWith("<") || result.StartsWith("#"))
			result = "#" + result;
		if (result.EndsWith(">") || result.EndsWith("#"))
			result += "#";
		return result;
	}

	public bool isList; // can also be inferred from use of list-children collection
	public bool isMap; // can also be inferred from use of map-children collection
	public bool popOutChildren;
	public string ToVDF(int tabDepth = 0) { return ToVDF_InlinePart(tabDepth) + ToVDF_PoppedOutPart(tabDepth); }
	public string ToVDF_InlinePart(int tabDepth = 0)
	{
		var builder = new StringBuilder();

		if (metadata != null)
			builder.Append(metadata + ">");

		if (primitiveValue == null)
		{
			if (!isMap && mapChildren.Count == 0 && !isList && listChildren.Count == 0)
				builder.Append("null");
		}
		else if (primitiveValue is bool)
			builder.Append(primitiveValue.ToString().ToLower());
		else if (primitiveValue is string)
		{
			var unpaddedString = (string)primitiveValue;
			if (unpaddedString.Contains("\"") || unpaddedString.Contains("\n") || unpaddedString.Contains("<<") || unpaddedString.Contains(">>")) // the parser doesn't actually need '<<' and '>>' wrapped for single-line strings, but we do so for consistency
			{
				var literalStartMarkerString = "<<";
				var literalEndMarkerString = ">>";
				while (unpaddedString.Contains(literalStartMarkerString) || unpaddedString.Contains(literalEndMarkerString))
				{
					literalStartMarkerString += "<";
					literalEndMarkerString += ">";
				}
				builder.Append("\"" + literalStartMarkerString + PadString(unpaddedString) + literalEndMarkerString + "\"");
			}
			else
				builder.Append("\"" + unpaddedString + "\"");
		}
		else if (primitiveValue.GetType().IsPrimitive) // if number
			builder.Append(primitiveValue.ToString().StartsWith("0.") ? primitiveValue.ToString().Substring(1) : primitiveValue);
		else
			builder.Append("\"" + primitiveValue + "\"");

		if (popOutChildren)
		{
			if (isMap || mapChildren.Count > 0)
				builder.Append(mapChildren.Count > 0 ? "{^}" : "{}");
			if (isList || listChildren.Count > 0)
				builder.Append(listChildren.Count > 0 ? "[^]" : "[]");
		}
		else
		{
			if (isMap || mapChildren.Count > 0)
			{
				builder.Append("{");
				var propertyPairs = mapChildren.ToList();
				for (var i = 0; i < propertyPairs.Count; i++)
					builder.Append((i == 0 ? "" : " ") + propertyPairs[i].Key + ":" + propertyPairs[i].Value.ToVDF_InlinePart(tabDepth));
				builder.Append("}");
			}
			if (isList || listChildren.Count > 0)
			{
				builder.Append("[");
				for (var i = 0; i < listChildren.Count; i++)
					builder.Append((i == 0 ? "" : " ") + listChildren[i].ToVDF_InlinePart(tabDepth));
				builder.Append("]");
			}
		}

		return builder.ToString();
	}
	public string ToVDF_PoppedOutPart(int tabDepth = 0)
	{
		var builder = new StringBuilder();

		// include popped-out-content of direct children (i.e. a single directly-under group)
		if (popOutChildren)
		{
			var childTabStr = "";
			for (var i = 0; i < tabDepth + 1; i++)
				childTabStr += "\t";
			if (isMap || mapChildren.Count > 0)
				foreach (KeyValuePair<string, VDFNode> pair in mapChildren)
				{
					builder.Append("\n" + childTabStr + pair.Key + ":" + pair.Value.ToVDF_InlinePart(tabDepth + 1));
					var poppedOutChildText = pair.Value.ToVDF_PoppedOutPart(tabDepth + 1);
					if (poppedOutChildText.Length > 0)
						builder.Append(poppedOutChildText);
				}
			if (isList || listChildren.Count > 0)
				foreach (VDFNode item in listChildren)
				{
					builder.Append("\n" + childTabStr + item.ToVDF_InlinePart(tabDepth + 1));
					var poppedOutChildText = item.ToVDF_PoppedOutPart(tabDepth + 1);
					if (poppedOutChildText.Length > 0)
						builder.Append(poppedOutChildText);
				}
		}
		else // include popped-out-content of inline-items' descendents (i.e. one or more pulled-up groups)
		{
			var poppedOutChildTexts = new List<string>();
			string poppedOutChildText;
			if (isMap || mapChildren.Count > 0)
				foreach (KeyValuePair<string, VDFNode> pair in mapChildren)
					if ((poppedOutChildText = pair.Value.ToVDF_PoppedOutPart(tabDepth)).Length > 0)
						poppedOutChildTexts.Add(poppedOutChildText);
			if (isList || listChildren.Count > 0)
				foreach (VDFNode item in listChildren.ToList())
					if ((poppedOutChildText = item.ToVDF_PoppedOutPart(tabDepth)).Length > 0)
						poppedOutChildTexts.Add(poppedOutChildText);
			for (var i = 0; i < poppedOutChildTexts.Count; i++)
			{
				poppedOutChildText = poppedOutChildTexts[i];
				var insertPoint = 0;
				while (poppedOutChildText[insertPoint] == '\n' || poppedOutChildText[insertPoint] == '\t')
					insertPoint++;
				builder.Append((insertPoint > 0 ? poppedOutChildText.Substring(0, insertPoint) : "") + (i == 0 ? "" : "^") + poppedOutChildText.Substring(insertPoint));
			}
		}

		return builder.ToString();
	}

	// loading
	// ==========

	static object CreateNewInstanceOfType(Type type)
	{
		if (typeof(Array).IsAssignableFrom(type)) // if array, we start out with a list, and then turn it into an array at the end
			return Activator.CreateInstance(typeof(List<>).MakeGenericType(type.GetElementType()), true);
		if (typeof(IList).IsAssignableFrom(type) || typeof(IDictionary).IsAssignableFrom(type)) // special cases, which require that we call the constructor
			return Activator.CreateInstance(type, true);
		return FormatterServices.GetUninitializedObject(type); // preferred (for simplicity/consistency's sake): create an instance of the type, completely uninitialized 
	}

	public T ToObject<T>(VDFLoadOptions loadOptions = null) { return (T)ToObject(typeof(T), loadOptions); }
	public object ToObject(VDFLoadOptions loadOptions, Type declaredType = null) { return ToObject(declaredType, loadOptions); }
	public object ToObject(Type declaredType = null, VDFLoadOptions loadOptions = null)
	{
		loadOptions = loadOptions ?? new VDFLoadOptions();

		var fromVDFTypeString = "object";
		if (metadata != null)
			fromVDFTypeString = metadata;
		else if (primitiveValue is bool)
			fromVDFTypeString = "bool";
		else if (primitiveValue is int)
			fromVDFTypeString = "int";
		else if (primitiveValue is double)
			fromVDFTypeString = "double";
		else if (primitiveValue is string)
			fromVDFTypeString = "string";
		else if (primitiveValue == null)
			if (isList || listChildren.Count > 0)
				fromVDFTypeString = "List(object)";
			else if (isMap || mapChildren.Count > 0)
				fromVDFTypeString = "Dictionary(object object)"; //"object";

		Type finalType = declaredType;
		var fromVDFType = VDF.GetTypeByVName(fromVDFTypeString, loadOptions);
		if (finalType == null || finalType.IsAssignableFrom(fromVDFType)) // if there is no declared type, or the from-vdf type is more specific than the declared type
			finalType = fromVDFType;
		
		object result;
		if (VDF.typeImporters_inline.ContainsKey(finalType))
			result = VDF.typeImporters_inline[finalType]((string)primitiveValue, finalType.GetGenericArguments().ToList());
		else if (finalType.IsGenericType && VDF.typeImporters_inline.ContainsKey(finalType.GetGenericTypeDefinition()))
			result = VDF.typeImporters_inline[finalType.GetGenericTypeDefinition()]((string)primitiveValue, finalType.GetGenericArguments().ToList());
		else if (finalType == typeof(object))
			result = null;
		else if (finalType.IsEnum) // helper importer for enums
			result = Enum.Parse(finalType, primitiveValue.ToString()); //primitiveValue);
		else if (primitiveValue != null)
			result = Convert.ChangeType(primitiveValue, finalType); //primitiveValue;
		else
		{
			result = CreateNewInstanceOfType(finalType);
			IntoObject(result, loadOptions);
			if (typeof(Array).IsAssignableFrom(finalType)) // if type is array, we created a temp-list for item population; so, now, replace the temp-list with an array
			{
				var newResult = Array.CreateInstance(finalType.GetElementType(), ((IList)result).Count);
				((IList)result).CopyTo(newResult, 0);
				result = newResult;
			}
		}

		return result;
	}
	public void IntoObject(object obj, VDFLoadOptions loadOptions = null)
	{
		loadOptions = loadOptions ?? new VDFLoadOptions();

		var type = obj.GetType();
		var typeInfo = VDFTypeInfo.Get(type);

		// call pre-deserialize constructors before pre-deserialize normal methods
		foreach (VDFMethodInfo method in typeInfo.methodInfo.Where(methodInfo=>methodInfo.memberInfo is ConstructorInfo && methodInfo.preDeserializeMethod))
			method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {loadOptions.message} : new object[0]);
		foreach (VDFMethodInfo method in typeInfo.methodInfo.Where(methodInfo=>methodInfo.memberInfo is MethodInfo && methodInfo.preDeserializeMethod))
			method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {loadOptions.message} : new object[0]);

		for (var i = 0; i < listChildren.Count; i++)
			if (obj is Array)
				((Array)obj).SetValue(listChildren[i].ToObject(type.GetElementType(), loadOptions), i);
			else if (obj is IList)
				((IList)obj).Add(listChildren[i].ToObject(type.GetGenericArguments()[0], loadOptions));
		foreach (string keyString in mapChildren.Keys)
			try
			{
				if (obj is IDictionary)
				{
					object key = keyString; // in most cases, the dictionary's in-code key-type will be a string, so we can just use the in-VDF key-string directly
					if (VDF.typeImporters_inline.ContainsKey(type.GetGenericArguments()[0]))
						key = VDF.typeImporters_inline[type.GetGenericArguments()[0]](keyString, type.GetGenericArguments()[0].GetGenericArguments().ToList());
					else if (type.GetGenericArguments()[0].IsGenericType && VDF.typeImporters_inline.ContainsKey(type.GetGenericArguments()[0].GetGenericTypeDefinition()))
						key = VDF.typeImporters_inline[type.GetGenericArguments()[0].GetGenericTypeDefinition()](keyString, type.GetGenericArguments()[0].GetGenericArguments().ToList());
					((IDictionary)obj).Add(key, mapChildren[keyString].ToObject(type.GetGenericArguments()[1], loadOptions));
				}
				else
					typeInfo.propInfoByName[keyString].SetValue(obj, mapChildren[keyString].ToObject(typeInfo.propInfoByName[keyString].GetPropType(), loadOptions));
			}
			catch (Exception ex) { throw new VDFException("Error loading map-child with key '" + keyString + "'.", ex); }

		// call post-deserialize constructors before post-deserialize normal methods
		foreach (VDFMethodInfo method in typeInfo.methodInfo.Where(methodInfo=>methodInfo.memberInfo is ConstructorInfo && methodInfo.postDeserializeMethod))
			method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {loadOptions.message} : new object[0]);
		foreach (VDFMethodInfo method in typeInfo.methodInfo.Where(methodInfo=>methodInfo.memberInfo is MethodInfo && methodInfo.postDeserializeMethod))
			method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {loadOptions.message} : new object[0]);
	}
}