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

	// for JSON compatibility
	public bool useMetadata;
	public bool useChildPopOut;
	public bool useStringKeys;
	public bool useNumberTrimming; // e.g. trims 0.123 to .123
	public bool useCommaSeparators; // currently only applies to non-popped-out children

	// CS only
	public List<MemberInfo> includePropsL3;
	public List<MemberInfo> excludePropsL4;
	public List<MemberInfo> includePropsL5;
	public Dictionary<string, string> namespaceAliasesByName;
	public Dictionary<Type, string> typeAliasesByType;

	public VDFSaveOptions(object message = null, VDFTypeMarking typeMarking = VDFTypeMarking.Internal,
		bool useMetadata = true, bool useChildPopOut = true, bool useStringKeys = false, bool useNumberTrimming = true, bool useCommaSeparators = false, 
		IEnumerable<MemberInfo> includePropsL3 = null, IEnumerable<MemberInfo> excludePropsL4 = null, IEnumerable<MemberInfo> includePropsL5 = null, Dictionary<string, string> namespaceAliasesByName = null, Dictionary<Type, string> typeAliasesByType = null)
	{
		this.message = message;
		this.typeMarking = typeMarking;
		this.useMetadata = useMetadata;
		this.useChildPopOut = useChildPopOut;
		this.useStringKeys = useStringKeys;
		this.useNumberTrimming = useNumberTrimming;
		this.useCommaSeparators = useCommaSeparators;
		this.includePropsL3 = includePropsL3 != null ? includePropsL3.ToList() : new List<MemberInfo>();
		this.excludePropsL4 = excludePropsL4 != null ? excludePropsL4.ToList() : new List<MemberInfo>();
		this.includePropsL5 = includePropsL5 != null ? includePropsL5.ToList() : new List<MemberInfo>();
		this.namespaceAliasesByName = namespaceAliasesByName ?? new Dictionary<string, string>();
		this.typeAliasesByType = typeAliasesByType ?? new Dictionary<Type, string>();
	}

	public VDFSaveOptions ForJSON() // helper function for JSON compatibility
	{
		useMetadata = false;
		useChildPopOut = false;
		useStringKeys = true;
		useNumberTrimming = false;
		useCommaSeparators = true;
		return this;
	}
}

public static class VDFSaver
{
	public static VDFNode ToVDFNode<T>(object obj, VDFSaveOptions options = null) { return ToVDFNode(obj, typeof(T), options); }
	public static VDFNode ToVDFNode(object obj, VDFSaveOptions options, Type declaredType = null) { return ToVDFNode(obj, declaredType, options); }
	public static VDFNode ToVDFNode(object obj, Type declaredType = null, VDFSaveOptions options = null, bool declaredTypeFromParent = false)
	{
		options = options ?? new VDFSaveOptions();
		
		var objNode = new VDFNode();
		Type type = obj != null ? obj.GetType() : null;
		var typeGenericArgs = VDF.GetGenericArgumentsOfType(type);
		var typeInfo = type != null ? VDFTypeInfo.Get(type) : null;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo=>methodInfo.preSerializeMethod))
				method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {options.message} : new object[0]);

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
				objNode.listChildren.Add(ToVDFNode(objAsList[i], typeGenericArgs[0], options, true));
		}
		else if (obj is IDictionary)
		{
			objNode.isMap = true;
			var objAsDictionary = (IDictionary)obj;
			foreach (object key in objAsDictionary.Keys)
				objNode.mapChildren.Add(ToVDFNode(key, typeGenericArgs[0], options), ToVDFNode(objAsDictionary[key], typeGenericArgs[1], options, true));
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
					include = options.includePropsL3.Contains(propInfo.memberInfo) || options.includePropsL3.Contains(VDF.AnyMember) ? true : include;
					include = options.excludePropsL4.Contains(propInfo.memberInfo) || options.excludePropsL4.Contains(VDF.AnyMember) ? false : include;
					include = options.includePropsL5.Contains(propInfo.memberInfo) || options.includePropsL5.Contains(VDF.AnyMember) ? true : include;
					if (!include)
						continue;

					object propValue = propInfo.GetValue(obj);
					if (propInfo.IsXValueTheDefault(propValue) && !propInfo.writeDefaultValue)
						continue;

					// if obj is an anonymous type, considers its props' declared-types to be null, since even internal loading doesn't have a class declaration it can look up
					var propValueNode = ToVDFNode(propValue, !type.Name.StartsWith("<>") ? propInfo.GetPropType() : null, options);
					propValueNode.popOutChildren = options.useChildPopOut && (propInfo.popOutChildrenL2.HasValue ? propInfo.popOutChildrenL2.Value : propValueNode.popOutChildren);
					objNode.mapChildren.Add(propName, propValueNode);
				}
				catch (Exception ex) { throw new VDFException("Error saving property '" + propName + "'.", ex); }
		}

		if (declaredType != null && declaredType.Name.StartsWith("<>")) // if anonymous type, consider just an object, as the name would not be usable (note; this may not actually be true; should test it sometime)
			declaredType = typeof(object);
		if (declaredType == null)
			if (objNode.isList || objNode.listChildren.Count > 0)
				declaredType = typeof(List<object>);
			else if (objNode.isMap || objNode.mapChildren.Count > 0)
				declaredType = typeof(Dictionary<object, object>);
			else
				declaredType = typeof(object);
		if (type != null && type.Name.StartsWith("<>")) // if anonymous type, consider just an object, as the name would not be usable (note; this may not actually be true; should test it sometime)
			type = typeof(object);
		if (options.useMetadata && type != null && !type.IsPrimitive && type != typeof(string) &&
		(
			(options.typeMarking == VDFTypeMarking.Internal && type != declaredType) ||
			(options.typeMarking == VDFTypeMarking.External && (type != declaredType || !declaredTypeFromParent) && type != typeof(object)) ||
			options.typeMarking == VDFTypeMarking.ExternalNoCollapse
		))
			objNode.metadata = VDF.GetVNameOfType(type, options);

		if (options.useChildPopOut && typeInfo != null && typeInfo.popOutChildrenL1)
			objNode.popOutChildren = true;

		if (obj != null)
			foreach (VDFMethodInfo method in VDFTypeInfo.Get(type).methodInfo.Where(methodInfo=>methodInfo.postSerializeMethod))
				method.Call(obj, method.memberInfo.GetParameters().Length > 0 ? new[] {options.message} : new object[0]);

		return objNode;
	}
}