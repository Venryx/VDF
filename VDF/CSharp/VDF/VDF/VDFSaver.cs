using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

public enum VDFTypeSafety
{
	None,
	TypeSafeForAssembly,
	TypeSafeForAll,
	All
}
public class VDFSaveOptions
{
	public List<MemberInfo> includePropsL3;
	public List<MemberInfo> excludePropsL4;
	public List<MemberInfo> includePropsL5;
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;
	public VDFTypeSafety typeSafety;

	public VDFSaveOptions(IEnumerable<MemberInfo> includePropsL3 = null, IEnumerable<MemberInfo> excludePropsL4 = null, IEnumerable<MemberInfo> includePropsL5 = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null, VDFTypeSafety typeSafety = VDFTypeSafety.TypeSafeForAssembly)
	{
		this.includePropsL3 = includePropsL3 != null ? includePropsL3.ToList() : new List<MemberInfo>();
		this.excludePropsL4 = excludePropsL4 != null ? excludePropsL4.ToList() : new List<MemberInfo>();
		this.includePropsL5 = includePropsL5 != null ? includePropsL5.ToList() : new List<MemberInfo>();
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
		this.typeSafety = typeSafety;
	}
}

public static class VDFSaver
{
	public static VDFNode ToVDFNode(object obj, VDFSaveOptions saveOptions = null)
	{
		if (saveOptions == null)
			saveOptions = new VDFSaveOptions();
		
		var objNode = new VDFNode();
		Type type = obj != null ? obj.GetType() : null;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfoByName.Values.Where(methodInfo=>methodInfo.preSerializeMethod))
				method.Call(obj);

		// if we're marking types for all objects, just do it here (no need to compare actual type with base type)
		if (saveOptions.typeSafety == VDFTypeSafety.All)
			objNode.metadata_type = obj != null ? VDF.GetVNameOfType(obj.GetType(), saveOptions) : null;

		if (obj == null)
			objNode.baseValue = "[#null]";
		else if (VDF.typeExporters_inline.ContainsKey(type))
			objNode.baseValue = RawDataStringToFinalized(VDF.typeExporters_inline[type](obj));
		else if (type == typeof(bool))
			objNode.baseValue = obj.ToString().ToLower();
		else if (type == typeof(float) || type == typeof(double) || type == typeof(decimal)) // if floating-point primitive
			objNode.baseValue = obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj.ToString();
		else if (type.IsPrimitive || type == typeof(string)) // if other primitive (i.e. char or integer-based number), or string
			objNode.baseValue = RawDataStringToFinalized(obj.ToString());
		else if (obj is IList) // note; this saves arrays also
		{
			objNode.isList = true;
			var objAsList = (IList)obj;
			for (int i = 0; i < objAsList.Count; i++)
			{
				object item = objAsList[i];
				bool typeDerivedFromDeclaredType = item != null && type.IsGenericType && item.GetType() != type.GetGenericArguments()[0]; // if List item is of a type *derived* from the List's base item-type (i.e. we need to specify actual item-type)
				VDFNode itemValueNode = ToVDFNode(item, saveOptions);
				itemValueNode.isListItem = true;
				if (i > 0)
					itemValueNode.isListItem_nonFirst = true;
				if (typeDerivedFromDeclaredType && saveOptions.typeSafety != VDFTypeSafety.None)
					itemValueNode.metadata_type = VDF.GetVNameOfType(item.GetType(), saveOptions);
				objNode.items.Add(itemValueNode);
			}
			if (saveOptions.typeSafety != VDFTypeSafety.None && objNode.items.Count == 1) // only one item, so we have to indicate this object is a list; we'll do that by setting its wider-metadata to ""
				objNode.metadata_type = "";
		}
		else if (obj is IDictionary)
		{
			objNode.isDictionary = true;
			var objAsDictionary = (IDictionary)obj;
			foreach (object key in objAsDictionary.Keys)
			{
				object value = objAsDictionary[key];

				bool keyTypeDerivedFromDeclaredType = type.IsGenericType && key.GetType() != type.GetGenericArguments()[0]; // if key is of a type *derived* from the Dictionary's base key-type (i.e. we need to specify actual key-type)
				VDFNode keyNode = ToVDFNode(key, saveOptions); // todo; add checks to ensure that key ends up as a string
				if (keyTypeDerivedFromDeclaredType && saveOptions.typeSafety != VDFTypeSafety.None)
					keyNode.metadata_type = VDF.GetVNameOfType(key.GetType(), saveOptions);
				
				bool valueTypeDerivedFromDeclaredType = value != null && type.IsGenericType && value.GetType() != type.GetGenericArguments()[1]; // if value is of a type *derived* from the Dictionary's base value-type (i.e. we need to specify actual value-type)
				VDFNode valueNode = ToVDFNode(value, saveOptions);
				if (valueTypeDerivedFromDeclaredType && saveOptions.typeSafety != VDFTypeSafety.None)
					valueNode.metadata_type = VDF.GetVNameOfType(value.GetType(), saveOptions);

				objNode.properties.Add(keyNode, valueNode);
			}
			if (saveOptions.typeSafety == VDFTypeSafety.TypeSafeForAll)
				objNode.metadata_type = ","; // we always have to mark dictionaries, for universal type-safety, since their key-values-pairs look just like properties
		}
		else // an object, with properties
		{
			var typeInfo = VDFTypeInfo.Get(type);
			int popOutGroupsAdded = 0;
			foreach (string propName in typeInfo.propInfoByName.Keys)
			{
				VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
				bool include = typeInfo.props_includeL1;
				include = propInfo.includeL2.HasValue ? propInfo.includeL2.Value : include;
				include = saveOptions.includePropsL3.Contains(propInfo.memberInfo) || saveOptions.includePropsL3.Contains(VDF.AnyMember) ? true : include;
				include = saveOptions.excludePropsL4.Contains(propInfo.memberInfo) || saveOptions.excludePropsL4.Contains(VDF.AnyMember) ? false : include;
				include = saveOptions.includePropsL5.Contains(propInfo.memberInfo) || saveOptions.includePropsL5.Contains(VDF.AnyMember) ? true : include;
				if (!include)
					continue;

				object propValue = propInfo.GetValue(obj);
				if (propInfo.IsXValueEmpty(propValue) && !propInfo.writeEmptyValue)
					continue;

				var propDeclaredType = !type.Name.StartsWith("<>") ? propInfo.GetPropType() : typeof(object); // if obj is an anonymous type, considers its props' declared-types to be 'object'
				bool typeDerivedFromDeclaredType = propValue != null && propValue.GetType() != propDeclaredType; // if value is of a type *derived* from the property's base value-type (i.e. we need to specify actual value-type)
				VDFNode propValueNode = ToVDFNode(propValue, saveOptions);
				if (propInfo.popDataOutOfLine)
				{
					if (propValueNode.baseValue != "[#null]")
					{
						foreach (VDFNode propValueNodeItem in propValueNode.items)
							propValueNodeItem.popOutToOwnLine = true;
						if (popOutGroupsAdded > 0 && propValueNode.items.Count > 0)
							propValueNode.items[0].isFirstItemOfNonFirstPopOutGroup = true;
						propValueNode.items.Insert(0, new VDFNode {baseValue = "#"}); // add in-line marker, indicating that items are popped-out
					}
					popOutGroupsAdded++;
				}
				if (saveOptions.typeSafety != VDFTypeSafety.None && typeDerivedFromDeclaredType)
					propValueNode.metadata_type = VDF.GetVNameOfType(propValue.GetType(), saveOptions);
				objNode.properties.Add(propName, propValueNode);
			}
		}

		return objNode;
	}

	static string RawDataStringToFinalized(string rawDataStr)
	{
		string result = rawDataStr;
		if (rawDataStr.Contains("}"))
			if (rawDataStr.EndsWith("@") || rawDataStr.EndsWith("|"))
				result = "@@" + new Regex("@@(?=\n|}|$)").Replace(rawDataStr, "@@@") + "|@@";
			else
				result = "@@" + new Regex("@@(?=\n|}|$)").Replace(rawDataStr, "@@@") + "@@";
		return result;
	}
}