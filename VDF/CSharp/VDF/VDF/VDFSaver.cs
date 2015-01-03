using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

public enum VDFTypeMarking
{
	None,
	Internal,
	External,
	ExternalNoCollapse // maybe temp
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

	public VDFSaveOptions(object message = null, IEnumerable<MemberInfo> includePropsL3 = null, IEnumerable<MemberInfo> excludePropsL4 = null, IEnumerable<MemberInfo> includePropsL5 = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null, VDFTypeMarking typeMarking = VDFTypeMarking.Internal)
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
	public static VDFNode ToVDFNode(object obj, Type declaredType = null, VDFSaveOptions saveOptions = null, bool declaredTypeFromParent = false)
	{
		saveOptions = saveOptions ?? new VDFSaveOptions();
		
		var objNode = new VDFNode();
		Type type = obj != null ? obj.GetType() : null;
		var typeInfo = type != null ? VDFTypeInfo.Get(type) : null;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo=>methodInfo.preSerializeMethod))
				method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {saveOptions.message} : new object[0]);

		if (obj != null && VDF.typeExporters_inline.ContainsKey(type))
			objNode.primitiveValue = VDF.typeExporters_inline[type](obj);
		else if (obj != null && type.IsGenericType && VDF.typeExporters_inline.ContainsKey(type.GetGenericTypeDefinition()))
			objNode.primitiveValue = VDF.typeExporters_inline[type.GetGenericTypeDefinition()](obj);
		else if (obj == null)
			objNode.primitiveValue = null;
		else if (type.IsPrimitive || type == typeof(string)) // if primitive (technically the C# string is 'not a primitive', but we consider it one)
			objNode.primitiveValue = obj;
		else if (type.IsEnum) // helper exporter for enums
			objNode.primitiveValue = obj.ToString();
		else if (obj is IList) // this saves arrays also
		{
			objNode.isList = true;
			var objAsList = (IList)obj;
			for (var i = 0; i < objAsList.Count; i++)
				objNode.listChildren.Add(ToVDFNode(objAsList[i], type.HasElementType ? type.GetElementType() : type.GetGenericArguments()[0], saveOptions, true));
		}
		else if (obj is IDictionary)
		{
			objNode.isMap = true;
			var objAsDictionary = (IDictionary)obj;
			foreach (object key in objAsDictionary.Keys)
				objNode.mapChildren.Add(ToVDFNode(key, type.GetGenericArguments()[0], saveOptions), ToVDFNode(objAsDictionary[key], type.GetGenericArguments()[1], saveOptions, true));
		}
		else // if an object, with properties
		{
			objNode.isMap = true;
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
					if (propInfo.IsXValueTheDefault(propValue) && !propInfo.writeDefaultValue)
						continue;

					// if obj is an anonymous type, considers its props' declared-types to be null, since even internal loading doesn't have a class declaration it can look up
					var propValueNode = ToVDFNode(propValue, !type.Name.StartsWith("<>") ? propInfo.GetPropType() : null, saveOptions);
					propValueNode.popOutChildren = propInfo.popOutChildrenL2.HasValue ? propInfo.popOutChildrenL2.Value : propValueNode.popOutChildren;
					objNode.mapChildren.Add(propName, propValueNode);
				}
				catch (Exception ex) { throw new VDFException("Error saving property '" + propName + "'.", ex); }
		}

		if (declaredType != null && declaredType.Name.StartsWith("<>")) // if anonymous type, consider just an object, as the name would not be usable (note; this may not actually be true; should test it sometime)
			declaredType = typeof(object);
		if (declaredType== null)
			if (objNode.isList || objNode.listChildren.Count > 0)
				declaredType = typeof(List<object>);
			else if (objNode.isMap || objNode.mapChildren.Count > 0)
				declaredType = typeof(Dictionary<object, object>);
			else
				declaredType = typeof(object);
		if (type != null && type.Name.StartsWith("<>")) // if anonymous type, consider just an object, as the name would not be usable (note; this may not actually be true; should test it sometime)
			type = typeof(object);
		if (type != null && !type.IsPrimitive && type != typeof(string) &&
		(
			(saveOptions.typeMarking == VDFTypeMarking.Internal && type != declaredType) ||
			(saveOptions.typeMarking == VDFTypeMarking.External && (type != declaredType || !declaredTypeFromParent) && type != typeof(object)) ||
			saveOptions.typeMarking == VDFTypeMarking.ExternalNoCollapse
		))
			objNode.metadata = VDF.GetVNameOfType(type, saveOptions);

		if (typeInfo != null && typeInfo.popOutChildrenL1)
			objNode.popOutChildren = true;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo=>methodInfo.postSerializeMethod))
				method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {saveOptions.message} : new object[0]);

		return objNode;
	}
}