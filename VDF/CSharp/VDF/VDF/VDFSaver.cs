using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;

class VDFSaveOptions
{
	public List<MemberInfo> includePropsL3;
	public List<MemberInfo> excludePropsL4;
	public List<MemberInfo> includePropsL5;
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;
	public bool saveTypesForAllObjects;

	public VDFSaveOptions(IEnumerable<MemberInfo> includePropsL3 = null, IEnumerable<MemberInfo> excludePropsL4 = null, IEnumerable<MemberInfo> includePropsL5 = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null, bool saveTypesForAllObjects = false)
	{
		this.includePropsL3 = includePropsL3 != null ? includePropsL3.ToList() : new List<MemberInfo>();
		this.excludePropsL4 = excludePropsL4 != null ? excludePropsL4.ToList() : new List<MemberInfo>();
		this.includePropsL5 = includePropsL5 != null ? includePropsL5.ToList() : new List<MemberInfo>();
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
		this.saveTypesForAllObjects = saveTypesForAllObjects;
	}
}

static class VDFSaver
{
	public static VDFNode ToVDFNode(object obj, VDFSaveOptions saveOptions = null)
	{
		if (saveOptions == null)
			saveOptions = new VDFSaveOptions();

		var objNode = new VDFNode();

		// if we're adding types for all objects, just do it here (no need to compare actual type with base type)
		if (saveOptions.saveTypesForAllObjects)
			objNode.metadata_type = VDF.GetVNameOfType(obj.GetType(), saveOptions);

		Type type = obj.GetType();
		if (VDF.typeExporters_inline.ContainsKey(type))
			objNode.items.Add(new VDFNode { baseValue = RawDataStringToFinalized(VDF.typeExporters_inline[type](obj)) });
		else if (type == typeof(float) || type == typeof(double))
			objNode.items.Add(new VDFNode {baseValue = obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj.ToString()});
		else if (type.IsPrimitive || type == typeof(string))
			objNode.items.Add(new VDFNode { baseValue = RawDataStringToFinalized(obj.ToString()) });
		else if (obj is IList) // note; this saves arrays also
		{
			objNode.isListOrDictionary = true;
			var objAsList = (IList)obj;
			for (int i = 0; i < objAsList.Count; i++)
			{
				object item = objAsList[i];
				bool typeDerivedFromDeclaredType = type.IsGenericType && item.GetType() != type.GetGenericArguments()[0]; // if List item is of a type *derived* from the List's base item-type (i.e. we need to specify actual item-type)
				VDFNode itemValueNode = ToVDFNode(item, saveOptions);
				if (item is IList) // if list item is itself a list
					itemValueNode.isListItem_list = true;
				if (i > 0)
					itemValueNode.isListItem_nonFirst = true;
				if (typeDerivedFromDeclaredType)
					itemValueNode.metadata_type = VDF.GetVNameOfType(item.GetType(), saveOptions);
				objNode.items.Add(itemValueNode);
			}
		}
		else if (obj is IDictionary)
		{
			objNode.isListOrDictionary = true;
			var objAsDictionary = (IDictionary)obj;
			foreach (object key in objAsDictionary.Keys)
			{
				object value = objAsDictionary[key];
				var keyValuePairPseudoNode = new VDFNode();
				keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

				bool keyTypeDerivedFromDeclaredType = type.IsGenericType && key.GetType() != type.GetGenericArguments()[0]; // if key is of a type *derived* from the Dictionary's base key-type (i.e. we need to specify actual key-type)
				VDFNode keyNode = ToVDFNode(key, saveOptions);
				if (keyTypeDerivedFromDeclaredType)
					keyNode.metadata_type = VDF.GetVNameOfType(key.GetType(), saveOptions);
				keyValuePairPseudoNode.items.Add(keyNode);

				bool valueTypeDerivedFromDeclaredType = type.IsGenericType && value.GetType() != type.GetGenericArguments()[1]; // if value is of a type *derived* from the Dictionary's base value-type (i.e. we need to specify actual value-type)
				VDFNode valueNode = ToVDFNode(value, saveOptions);
				valueNode.isListItem_nonFirst = true;
				if (valueTypeDerivedFromDeclaredType)
					valueNode.metadata_type = VDF.GetVNameOfType(value.GetType(), saveOptions);
				keyValuePairPseudoNode.items.Add(valueNode);

				objNode.items.Add(keyValuePairPseudoNode);
			}
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
				if (propInfo.IsXIgnorableValue(propValue))
					continue;

				bool typeDerivedFromDeclaredType = propValue.GetType() != propInfo.GetPropType(); // if value is of a type *derived* from the property's base value-type (i.e. we need to specify actual value-type)
				if (propInfo.popOutItemsToOwnLines)
				{
					VDFNode propValueNode = ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					propValueNode.items.Insert(0, new VDFNode {baseValue = "#"}); // add in-line marker, indicating that items are popped-out
					if (popOutGroupsAdded > 0 && propValueNode.items.Count > 1)
						propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = VDF.GetVNameOfType(propValue.GetType(), saveOptions);
					foreach (VDFNode propValueNodeItem in propValueNode.items)
						if (propValueNodeItem.baseValue != "#")
							propValueNodeItem.popOutToOwnLine = true;
					objNode.properties.Add(propName, propValueNode);
					popOutGroupsAdded++;
				}
				else
				{
					VDFNode propValueNode = ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = VDF.GetVNameOfType(propValue.GetType(), saveOptions);
					objNode.properties.Add(propName, propValueNode);
				}
			}
		}

		return objNode;
	}

	static string RawDataStringToFinalized(string rawDataStr)
	{
		string result = rawDataStr;
		if (rawDataStr.Contains("}"))
		{
			if (rawDataStr.EndsWith("@") || rawDataStr.EndsWith("|"))
				result = "@@" + new Regex("@@(?=\n|}|$)").Replace(rawDataStr, "@@@") + "|@@";
			else
				result = "@@" + new Regex("@@(?=\n|}|$)").Replace(rawDataStr, "@@@") + "@@";
		}
		return result;
	}
}