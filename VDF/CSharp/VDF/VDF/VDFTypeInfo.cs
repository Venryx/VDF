using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)] public class VDFType : Attribute
{
	public bool includePropsL1;
	public VDFType(bool includePropsL1) { this.includePropsL1 = includePropsL1; }
}
public class VDFTypeInfo
{
	static Dictionary<Type, VDFTypeInfo> cachedTypeInfo = new Dictionary<Type, VDFTypeInfo>();
	public static VDFTypeInfo Get(Type type)
	{
		if (!cachedTypeInfo.ContainsKey(type))
		{
			var vdfTypeAttribute = (VDF.typeVDFTypeOverrides.ContainsKey(type) ? VDF.typeVDFTypeOverrides[type] : null) ?? (VDFType)type.GetCustomAttributes(typeof(VDFType), true).FirstOrDefault();
			var typeInfo = new VDFTypeInfo();
			foreach (FieldInfo field in type.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
				if (!field.Name.StartsWith("<")) // anonymous types will have some extra field names starting with '<'
					typeInfo.propInfoByName[field.Name] = VDFPropInfo.Get(field);
			foreach (PropertyInfo property in type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
				typeInfo.propInfoByName[property.Name] = VDFPropInfo.Get(property);
			foreach (MethodBase method in type.GetMembers(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(member=>member is MethodBase)) // include constructors
				typeInfo.methodInfo.Add(VDFMethodInfo.Get(method));
			if (type.Name.StartsWith("<>")) // if anonymous type, include all props, by default
				typeInfo.props_includeL1 = true;
			if (vdfTypeAttribute != null)
				typeInfo.props_includeL1 = vdfTypeAttribute.includePropsL1;
			cachedTypeInfo[type] = typeInfo;
		}
		return cachedTypeInfo[type];
	}

	public bool props_includeL1 = false; // by default, use an opt-in approach
	public Dictionary<string, VDFPropInfo> propInfoByName = new Dictionary<string, VDFPropInfo>();
	public List<VDFMethodInfo> methodInfo = new List<VDFMethodInfo>();
}

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)] public class VDFProp : Attribute
{
	public bool includeL2;
	public bool popDataOutOfLine;
	public bool writeEmptyValue;
	public VDFProp(bool includeL2 = true, bool popDataOutOfLine = false, bool writeEmptyValue = true)
	{
		this.includeL2 = includeL2;
		this.popDataOutOfLine = popDataOutOfLine;
		this.writeEmptyValue = writeEmptyValue;
	}
}
public class VDFPropInfo
{
	static Dictionary<MemberInfo, VDFPropInfo> cachedPropInfo = new Dictionary<MemberInfo, VDFPropInfo>();
	public static VDFPropInfo Get(FieldInfo field)
	{
		if (!cachedPropInfo.ContainsKey(field))
		{
			var vdfPropAttribute = (VDF.propVDFPropOverrides.ContainsKey(field) ? VDF.propVDFPropOverrides[field] : null) ?? (VDFProp)field.GetCustomAttributes(typeof(VDFProp), true).FirstOrDefault();

			var propInfo = new VDFPropInfo();
			propInfo.memberInfo = field;
			if (vdfPropAttribute != null)
			{
				propInfo.includeL2 = vdfPropAttribute.includeL2;
				propInfo.popDataOutOfLine = vdfPropAttribute.popDataOutOfLine;
				propInfo.writeEmptyValue = vdfPropAttribute.writeEmptyValue;
			}
			cachedPropInfo[field] = propInfo;
		}
		return cachedPropInfo[field];
	}
	public static VDFPropInfo Get(PropertyInfo property)
	{
		if (!cachedPropInfo.ContainsKey(property))
		{
			var vdfPropAttribute = (VDF.propVDFPropOverrides.ContainsKey(property) ? VDF.propVDFPropOverrides[property] : null) ?? (VDFProp)property.GetCustomAttributes(typeof(VDFProp), true).FirstOrDefault();

			var propInfo = new VDFPropInfo();
			propInfo.memberInfo = property;
			if (vdfPropAttribute != null)
			{
				propInfo.includeL2 = vdfPropAttribute.includeL2;
				propInfo.popDataOutOfLine = vdfPropAttribute.popDataOutOfLine;
				propInfo.writeEmptyValue = vdfPropAttribute.writeEmptyValue;
			}
			cachedPropInfo[property] = propInfo;
		}
		return cachedPropInfo[property];
	}

	public MemberInfo memberInfo;
	public bool? includeL2;
	public bool popDataOutOfLine;
	public bool writeEmptyValue = true;

	public Type GetPropType() { return memberInfo is PropertyInfo ? ((PropertyInfo)memberInfo).PropertyType : ((FieldInfo)memberInfo).FieldType; }
	public bool IsXValueEmpty(object x)
	{
		if (x == null) // if null
			return true;
		if (GetPropType().IsValueType && x == Activator.CreateInstance(GetPropType())) // if struct, and equal to struct's default value
			return true;
		if (x is IList && ((IList)x).Count == 0) // if list, and empty
			return true;
		return false;
	}
	public object GetValue(object objParent)
	{
		if (memberInfo is FieldInfo)
			return ((FieldInfo)memberInfo).GetValue(objParent);
		return ((PropertyInfo)memberInfo).GetValue(objParent, null);
	}
	public void SetValue(object objParent, object value)
	{
		if (memberInfo is FieldInfo)
			((FieldInfo)memberInfo).SetValue(objParent, value);
		else
			((PropertyInfo)memberInfo).SetValue(objParent, value, null);
	}
}

[AttributeUsage(AttributeTargets.Method)] public class VDFPreSerialize : Attribute {}
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)] public class VDFPostDeserialize : Attribute {}
public class VDFMethodInfo
{
	static Dictionary<MemberInfo, VDFMethodInfo> cachedMethodInfo = new Dictionary<MemberInfo, VDFMethodInfo>();
	public static VDFMethodInfo Get(MethodBase method)
	{
		if (!cachedMethodInfo.ContainsKey(method))
		{
			var vdfPreSerializeAttribute = (VDFPreSerialize)method.GetCustomAttributes(typeof(VDFPreSerialize), true).FirstOrDefault();
			var vdfPostDeserializeAttribute = (VDFPostDeserialize)method.GetCustomAttributes(typeof(VDFPostDeserialize), true).FirstOrDefault();

			var methodInfo = new VDFMethodInfo();
			methodInfo.memberInfo = method;
			if (vdfPreSerializeAttribute != null)
				methodInfo.preSerializeMethod = true;
			if (vdfPostDeserializeAttribute != null)
				methodInfo.postDeserializeMethod = true;
			cachedMethodInfo[method] = methodInfo;
		}
		return cachedMethodInfo[method];
	}

	public MethodBase memberInfo;
	public bool preSerializeMethod = false;
	public bool postDeserializeMethod = false;

	public object Call(object objParent, params object[] args) { return memberInfo.Invoke(objParent, args); }
}