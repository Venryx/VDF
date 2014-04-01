﻿using System;
using System.Collections.Generic;
using System.Reflection;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)]
public class VDFType : Attribute
{
	public bool includePropsL1;
	public VDFType(bool includePropsL1) { this.includePropsL1 = includePropsL1; }
}

public class VDFTypeInfo
{
	static Dictionary<Type, VDFTypeInfo> cachedTypeInfo = new Dictionary<Type, VDFTypeInfo>();

	public bool props_includeL1;
	public Dictionary<string, VDFPropInfo> propInfoByName;

	public VDFTypeInfo()
	{
		props_includeL1 = true; // note; may want to have this default to false
		propInfoByName = new Dictionary<string, VDFPropInfo>();
	}

	public static VDFTypeInfo Get(Type type)
	{
		if (!cachedTypeInfo.ContainsKey(type))
		{
			var typeInfo = new VDFTypeInfo();
			foreach (FieldInfo field in type.GetFields(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance))
				typeInfo.propInfoByName[field.Name] = VDFPropInfo.Get(field);
			foreach (PropertyInfo property in type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance))
				typeInfo.propInfoByName[property.Name] = VDFPropInfo.Get(property);
			cachedTypeInfo[type] = typeInfo;
		}
		return cachedTypeInfo[type];
	}
}