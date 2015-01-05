using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)] public class VDFType : Attribute
{
	public bool includePropsL1;
	public bool popOutChildrenL1;
	public VDFType(bool includePropsL1 = false, bool popOutChildrenL1 = false)
	{
		this.includePropsL1 = includePropsL1;
		this.popOutChildrenL1 = popOutChildrenL1;
	}
}
public class VDFTypeInfo
{
	static Dictionary<Type, VDFTypeInfo> cachedTypeInfo = new Dictionary<Type, VDFTypeInfo>();
	public static VDFTypeInfo Get(Type type)
	{
		if (!cachedTypeInfo.ContainsKey(type))
			Set(type, (VDFType)type.GetCustomAttributes(typeof(VDFType), true).FirstOrDefault());
		return cachedTypeInfo[type];
	}
	public static void Set(Type type, VDFType typeTag = null) { cachedTypeInfo[type] = BuildTypeInfo(type, typeTag); }
	static VDFTypeInfo BuildTypeInfo(Type type, VDFType typeTag)
	{
		var result = new VDFTypeInfo();
		foreach (FieldInfo field in type.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
			if (!field.Name.StartsWith("<")) // anonymous types will have some extra field names starting with '<'
				result.propInfoByName[field.Name] = VDFPropInfo.Get(field);
		foreach (PropertyInfo property in type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
			result.propInfoByName[property.Name] = VDFPropInfo.Get(property);
		foreach (MethodBase method in type.GetMembers(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance).Where(member=>member is MethodBase)) // include constructors
			result.methodInfo.Add(VDFMethodInfo.Get(method));
		if (VDF.GetIsTypeAnonymous(type))
			result.props_includeL1 = true;
		if (typeTag != null)
		{
			result.props_includeL1 = typeTag.includePropsL1;
			result.popOutChildrenL1 = typeTag.popOutChildrenL1;
		}
		return result;
	}

	public bool props_includeL1; // by default, use an opt-in approach
	public bool popOutChildrenL1;
	public Dictionary<string, VDFPropInfo> propInfoByName = new Dictionary<string, VDFPropInfo>();
	public List<VDFMethodInfo> methodInfo = new List<VDFMethodInfo>();
}

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)] public class VDFProp : Attribute
{
	public bool? includeL2;
	public bool? popOutChildrenL2;
	public bool writeDefaultValue;
	public VDFProp(bool includeL2 = true, bool popOutChildrenL2 = false, bool writeDefaultValue = true)
	{
		this.includeL2 = includeL2;
		this.popOutChildrenL2 = popOutChildrenL2;
		this.writeDefaultValue = writeDefaultValue;
	}
}
public class VDFPropInfo
{
	static Dictionary<MemberInfo, VDFPropInfo> cachedPropInfo = new Dictionary<MemberInfo, VDFPropInfo>();
	public static VDFPropInfo Get(FieldInfo field)
	{
		if (!cachedPropInfo.ContainsKey(field))
			cachedPropInfo[field] = BuildPropInfo(field, (VDFProp)field.GetCustomAttributes(typeof(VDFProp), true).FirstOrDefault());
		return cachedPropInfo[field];
	}
	public static VDFPropInfo Get(PropertyInfo prop)
	{
		if (!cachedPropInfo.ContainsKey(prop))
			Set(prop, (VDFProp)prop.GetCustomAttributes(typeof(VDFProp), true).FirstOrDefault());
		return cachedPropInfo[prop];
	}
	public static void Set(MemberInfo prop, VDFProp propTag = null) { cachedPropInfo[prop] = BuildPropInfo(prop, propTag); }
	static VDFPropInfo BuildPropInfo(MemberInfo prop, VDFProp propTag)
	{
		var result = new VDFPropInfo();
		result.memberInfo = prop;
		if (propTag != null)
		{
			result.includeL2 = propTag.includeL2;
			result.popOutChildrenL2 = propTag.popOutChildrenL2;
			result.writeDefaultValue = propTag.writeDefaultValue;
		}
		return result;
	}

	public MemberInfo memberInfo;
	public bool? includeL2;
	public bool? popOutChildrenL2;
	public bool writeDefaultValue = true;

	public Type GetPropType() { return memberInfo is PropertyInfo ? ((PropertyInfo)memberInfo).PropertyType : ((FieldInfo)memberInfo).FieldType; }
	public bool IsXValueTheDefault(object x)
	{
		if (x == null) // if null
			return true;
		if (GetPropType().IsValueType && x == Activator.CreateInstance(GetPropType())) // if struct, and equal to struct's default value
			return true;
		/*if (x is IList && ((IList)x).Count == 0) // if list, and empty
			return true;
		if (x is string && ((string)x).Length == 0) // if string, and empty
			return true;*/
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
[AttributeUsage(AttributeTargets.Method)] public class VDFPostSerialize : Attribute {}
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)] public class VDFPreDeserialize : Attribute {}
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)] public class VDFPostDeserialize : Attribute {}
public class VDFMethodInfo
{
	static Dictionary<MemberInfo, VDFMethodInfo> cachedMethodInfo = new Dictionary<MemberInfo, VDFMethodInfo>();
	public static VDFMethodInfo Get(MethodBase method)
	{
		if (!cachedMethodInfo.ContainsKey(method))
			Set(method,
				(VDFPreSerialize)method.GetCustomAttributes(typeof(VDFPreSerialize), true).FirstOrDefault(),
				(VDFPostSerialize)method.GetCustomAttributes(typeof(VDFPostSerialize), true).FirstOrDefault(),
				(VDFPreDeserialize)method.GetCustomAttributes(typeof(VDFPreDeserialize), true).FirstOrDefault(),
				(VDFPostDeserialize)method.GetCustomAttributes(typeof(VDFPostDeserialize), true).FirstOrDefault());
		return cachedMethodInfo[method];
	}
	public static void Set(MethodBase method, VDFPreSerialize preSerializeTag = null, VDFPostSerialize postSerializeTag = null, VDFPreDeserialize preDeserializeTag = null, VDFPostDeserialize postDeserializeTag = null)
		{ cachedMethodInfo[method] = BuildMethodInfo(method, preSerializeTag, postSerializeTag, preDeserializeTag, postDeserializeTag); }
	static VDFMethodInfo BuildMethodInfo(MethodBase method, VDFPreSerialize preSerializeTag, VDFPostSerialize postSerializeTag, VDFPreDeserialize preDeserializeTag, VDFPostDeserialize postDeserializeTag)
	{
		var result = new VDFMethodInfo();
		result.memberInfo = method;
		if (preSerializeTag != null)
			result.preSerializeMethod = true;
		if (postSerializeTag != null)
			result.postSerializeMethod = true;
		if (preDeserializeTag != null)
			result.preDeserializeMethod = true;
		if (postDeserializeTag != null)
			result.postDeserializeMethod = true;
		return result;
	}

	public MethodBase memberInfo;
	public bool preSerializeMethod;
	public bool postSerializeMethod;
	public bool preDeserializeMethod;
	public bool postDeserializeMethod;

	public object Call(object objParent, object[] args) { return memberInfo.Invoke(objParent, args); }
}