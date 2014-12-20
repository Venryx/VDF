using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

public enum VDFTypeMarking
{
	None, // can cause errors; only real use is for saving anonymous types, without redundant type-markings
	Assembly,
	AssemblyExternal,
	AssemblyExternalNoCollapse
}
public class VDFSaveOptions
{
	public object message;
	public VDFTypeMarking typeMarking;

	// CS only
	public List<MemberInfo> includePropsL3;
	public List<MemberInfo> excludePropsL4;
	public List<MemberInfo> includePropsL5;
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;

	public VDFSaveOptions(object message = null, IEnumerable<MemberInfo> includePropsL3 = null, IEnumerable<MemberInfo> excludePropsL4 = null, IEnumerable<MemberInfo> includePropsL5 = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null, VDFTypeMarking typeMarking = VDFTypeMarking.Assembly)
	{
		this.message = message;
		this.typeMarking = typeMarking;
		this.includePropsL3 = includePropsL3 != null ? includePropsL3.ToList() : new List<MemberInfo>();
		this.excludePropsL4 = excludePropsL4 != null ? excludePropsL4.ToList() : new List<MemberInfo>();
		this.includePropsL5 = includePropsL5 != null ? includePropsL5.ToList() : new List<MemberInfo>();
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
	}
}

public static class VDFSaver
{
	public static VDFNode ToVDFNode<T>(object obj, VDFSaveOptions saveOptions = null) { return ToVDFNode(obj, typeof(T), saveOptions); }
	public static VDFNode ToVDFNode(object obj, VDFSaveOptions saveOptions, Type declaredType = null) { return ToVDFNode(obj, declaredType, saveOptions); }
	public static VDFNode ToVDFNode(object obj, Type declaredType = null, VDFSaveOptions saveOptions = null, bool isGenericParamValue = false)
	{
		saveOptions = saveOptions ?? new VDFSaveOptions();
		
		var objNode = new VDFNode();
		Type type = obj != null ? obj.GetType() : null;
		var typeInfo = type != null ? VDFTypeInfo.Get(type) : null;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo=>methodInfo.preSerializeMethod))
				method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {saveOptions.message} : new object[0]);

		if (type == null)
			objNode.baseValue = "null";
		else if (type == typeof(string) && (string)obj == "")
			objNode.baseValue = "empty";
		else if (VDF.typeExporters_inline.ContainsKey(type))
			objNode.baseValue = VDF.typeExporters_inline[type](obj);
		else if (type.IsGenericType && VDF.typeExporters_inline.ContainsKey(type.GetGenericTypeDefinition()))
			objNode.baseValue = VDF.typeExporters_inline[type.GetGenericTypeDefinition()](obj);
		else if (type.IsEnum)
			objNode.baseValue = obj.ToString();
		else if (type == typeof(bool))
			objNode.baseValue = obj.ToString().ToLower();
		else if (type == typeof(float) || type == typeof(double) || type == typeof(decimal)) // if floating-point primitive
			objNode.baseValue = obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj.ToString();
		else if (type.IsPrimitive || type == typeof(string)) // if other primitive (i.e. char or integer-based number), or string
			objNode.baseValue = obj.ToString();
		else if (obj is IList) // note; this saves arrays also
		{
			objNode.isList = true;
			var objAsList = (IList)obj;
			for (var i = 0; i < objAsList.Count; i++)
				objNode.items.Add(ToVDFNode(objAsList[i], type.HasElementType ? type.GetElementType() : type.GetGenericArguments()[0], saveOptions, true));
		}
		else if (obj is IDictionary)
		{
			objNode.isDictionary = true;
			var objAsDictionary = (IDictionary)obj;
			foreach (object key in objAsDictionary.Keys)
				objNode.properties.Add(ToVDFNode(key, type.GetGenericArguments()[0], saveOptions, true), ToVDFNode(objAsDictionary[key], type.GetGenericArguments()[1], saveOptions, true));
		}
		else // an object, with properties
			foreach (string propName in typeInfo.propInfoByName.Keys)
				try
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

					// if obj is an anonymous type, considers its props' declared-types to be 'object'; also, if not popped-out, pass it the same line-info pack that we were given
					var propValueNode = ToVDFNode(propValue, !type.Name.StartsWith("<>") ? propInfo.GetPropType() : typeof(object), saveOptions);
					propValueNode.popOutChildren = propInfo.popOutChildrenL2.HasValue ? propInfo.popOutChildrenL2.Value : propValueNode.popOutChildren;
					objNode.properties.Add(propName, propValueNode);
				}
				catch (Exception ex) { throw new VDFException("Error saving property '" + propName + "'.", ex); }

		// do type-marking at the end, since it depends quite a bit on the actual data (since the data determines how much can be inferred, and how much needs to be specified)
		bool markType = saveOptions.typeMarking == VDFTypeMarking.AssemblyExternalNoCollapse;
		markType = markType || (saveOptions.typeMarking == VDFTypeMarking.AssemblyExternal && obj is IList && objNode.items.Count == 1); // if list with only one item (i.e. indistinguishable from base-prop)
		markType = markType || (saveOptions.typeMarking == VDFTypeMarking.AssemblyExternal && obj is IDictionary); // if dictionary (i.e. indistinguishable from prop-set)
		markType = markType || (saveOptions.typeMarking == VDFTypeMarking.AssemblyExternal && !isGenericParamValue); // we're a non-generics-based value (i.e. we have no value-default-type specified)
		markType = markType || (new[]{VDFTypeMarking.AssemblyExternal, VDFTypeMarking.Assembly}.Contains(saveOptions.typeMarking) && (obj == null || obj.GetType() != declaredType)); // if actual type is *derived* from the declared type, we must mark type, even if in the same Assembly
		if (obj == null || (type == typeof(string) && (string)obj == ""))
			objNode.metadata_type = "";
		else
			objNode.metadata_type = markType ? VDF.GetVNameOfType(obj != null ? obj.GetType() : null, saveOptions) : null;
		if (saveOptions.typeMarking != VDFTypeMarking.AssemblyExternalNoCollapse)
		{
			var collapseMap = new Dictionary<string, string> {{"string", null}, {"bool", ""}, {"int", ""}, {"float", ""}, {"List[object]", ""}, {"Dictionary[object,object]", ""}};
			if (objNode.metadata_type != null && collapseMap.ContainsKey(objNode.metadata_type))
				objNode.metadata_type = collapseMap[objNode.metadata_type];
			// if list of generic-params-without-generic-params, or dictionary, chop out name and just include generic-params
			if (objNode.metadata_type != null && ((objNode.metadata_type.StartsWith("List[") && !objNode.metadata_type.Substring(5).Contains("[")) || objNode.metadata_type.StartsWith("Dictionary[")))
				objNode.metadata_type = objNode.metadata_type.StartsWith("List[") ? objNode.metadata_type.Substring(5, objNode.metadata_type.Length - 6) : objNode.metadata_type.Substring(11, objNode.metadata_type.Length - 12);
		}

		if (typeInfo != null && typeInfo.popOutChildrenL1)
			objNode.popOutChildren = true;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo=>methodInfo.postSerializeMethod))
				method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {saveOptions.message} : new object[0]);

		return objNode;
	}
}