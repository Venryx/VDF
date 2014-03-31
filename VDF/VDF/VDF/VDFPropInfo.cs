using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)]
public class VDFProp : Attribute
{
	public bool includeL2;
	public bool inlineData;
	public bool ignoreEmptyValue;
	public VDFProp(bool includeL2 = true, bool inlineData = true, bool ignoreEmptyValue = false)
	{
		this.includeL2 = includeL2;
		this.inlineData = inlineData;
		this.ignoreEmptyValue = ignoreEmptyValue;
	}
}

public class VDFPropInfo
{
	static Dictionary<MemberInfo, VDFPropInfo> cachedTypeInfo = new Dictionary<MemberInfo, VDFPropInfo>();
	public static VDFPropInfo Get(FieldInfo field)
	{
		if (!cachedTypeInfo.ContainsKey(field))
		{
			var vdfPropAttribute = (VDFProp)field.GetCustomAttributes(typeof(VDFProp), true).FirstOrDefault();

			var propInfo = new VDFPropInfo();
			propInfo.memberInfo = field;
			propInfo.propType = field.FieldType;
			if (vdfPropAttribute != null)
			{
				propInfo.includeL2 = vdfPropAttribute.includeL2;
				propInfo.inlineData = vdfPropAttribute.inlineData;
				propInfo.ignoreEmptyValue = vdfPropAttribute.ignoreEmptyValue;
			}
			cachedTypeInfo[field] = propInfo;
		}
		return cachedTypeInfo[field];
	}
	public static VDFPropInfo Get(PropertyInfo property)
	{
		if (!cachedTypeInfo.ContainsKey(property))
		{
			var vdfPropAttribute = (VDFProp)property.GetCustomAttributes(typeof(VDFProp), true).FirstOrDefault();

			var propInfo = new VDFPropInfo();
			propInfo.memberInfo = property;
			propInfo.propType = property.PropertyType;
			if (vdfPropAttribute != null)
			{
				propInfo.includeL2 = vdfPropAttribute.includeL2;
				propInfo.inlineData = vdfPropAttribute.inlineData;
				propInfo.ignoreEmptyValue = vdfPropAttribute.ignoreEmptyValue;
			}
			cachedTypeInfo[property] = propInfo;
		}
		return cachedTypeInfo[property];
	}

	MemberInfo memberInfo;
	Type propType;
	bool ignoreEmptyValue;
	
	public bool? includeL2;
	public bool inlineData;

	public VDFPropInfo() { inlineData = true; }

	public bool IsXIgnorableValue(object x)
	{
		if (ignoreEmptyValue)
		{
			if (x is IList && ((IList)x).Count == 0)
				return true;
		}
		if (propType.IsValueType)
			return x == Activator.CreateInstance(propType);
		return x == null;
	}
	public object GetValue(object objParent)
	{
		if (memberInfo is FieldInfo)
			return ((FieldInfo)memberInfo).GetValue(objParent);
		return ((PropertyInfo)memberInfo).GetValue(objParent, null);
	}
}