using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Struct)] public class VDFType : Attribute
{
	public string propIncludeRegexL1;
	public bool childPopOutL1;
	public VDFType(string propIncludeRegexL1 = null, bool childPopOutL1 = false)
	{
		this.propIncludeRegexL1 = propIncludeRegexL1;
		this.childPopOutL1 = childPopOutL1;
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
				result.props[field.Name] = VDFPropInfo.Get(field);
		foreach (PropertyInfo property in type.GetProperties(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Instance))
			result.props[property.Name] = VDFPropInfo.Get(property);
		foreach (MethodBase method in type.GetMembers(BindingFlags.Public | BindingFlags.NonPublic | BindingFlags.Static | BindingFlags.Instance).Where(member=>member is MethodBase)) // include constructors
			if (!result.methods.ContainsKey(method.Name))
				result.methods.Add(method.Name, VDFMethodInfo.Get(method));
		if (VDF.GetIsTypeAnonymous(type))
			result.propIncludeRegexL1 = VDF.PropRegex_Any;
		if (typeTag != null)
		{
			result.propIncludeRegexL1 = typeTag.propIncludeRegexL1;
			result.childPopOutL1 = typeTag.childPopOutL1;
		}
		return result;
	}

	public string propIncludeRegexL1; // by default, use an opt-in approach
	public bool childPopOutL1;
	public Dictionary<string, VDFPropInfo> props = new Dictionary<string, VDFPropInfo>();
	public Dictionary<string, VDFMethodInfo> methods = new Dictionary<string, VDFMethodInfo>();

	public void AddExtraMethod_Base(Delegate method, List<Attribute> tags)
	{
		var methodInfo = new VDFMethodInfo();
		methodInfo.memberInfo = method.Method;
		methodInfo.tags = tags;
		methods.Add(method.Method.Name, methodInfo);
	}
	public void AddExtraMethod(Action method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A>(Action<A> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A1, A2>(Action<A1, A2> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A1, A2, A3>(Action<A1, A2, A3> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A1, A2, A3, A4>(Action<A1, A2, A3, A4> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<R>(Func<R> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A, R>(Func<A, R> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A1, A2, R>(Func<A1, A2, R> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	public void AddExtraMethod<A1, A2, A3, R>(Func<A1, A2, A3, R> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }
	//public void AddExtraMethod<A1, A2, A3, A4, R>(Func<A1, A2, A3, A4, R> method, params Attribute[] tags) { AddExtraMethod_Base(method, tags.ToList()); }

	public void AddSerializeMethod<T>(Func<T, VDFPropInfo, VDFSaveOptions, VDFNode> method, params Attribute[] tags)
	{
		var finalAttributes = tags.ToList();
		if (!finalAttributes.Any(a=>a is VDFSerialize))
			finalAttributes.Add(new VDFSerialize());
		AddExtraMethod(method, tags);
	}
	public void AddDeserializeMethod<T>(Action<T, VDFNode, VDFPropInfo, VDFLoadOptions> method, params Attribute[] tags)
	{
		var finalAttributes = tags.ToList();
		if (!finalAttributes.Any(a=>a is VDFDeserialize))
			finalAttributes.Add(new VDFDeserialize());
		AddExtraMethod(method, tags);
	}
	public void AddDeserializeMethod_WithReturn<T>(Func<VDFNode, VDFPropInfo, VDFLoadOptions, object> method, params Attribute[] tags)
	{
		var finalAttributes = tags.ToList();
		if (!finalAttributes.Any(a=>a is VDFDeserialize))
			finalAttributes.Add(new VDFDeserialize());
		AddExtraMethod(method, tags);
	}
	public void AddDeserializeMethod_FromParent<T>(Func<VDFNode, VDFPropInfo, VDFLoadOptions, T> method, params Attribute[] tags)
	{
		var finalAttributes = tags.ToList();
		if (!finalAttributes.Any(a=>a is VDFDeserialize))
			finalAttributes.Add(new VDFDeserialize(fromParent: true));
		AddExtraMethod(method, tags);
	}
}

[AttributeUsage(AttributeTargets.Field | AttributeTargets.Property)] public class VDFProp : Attribute
{
	public bool? includeL2;
	public bool? popOutL2;
	public bool writeDefaultValue;
	public VDFProp(bool includeL2 = true, bool popOutL2 = false, bool writeDefaultValue = true)
	{
		this.includeL2 = includeL2;
		this.popOutL2 = popOutL2;
		this.writeDefaultValue = writeDefaultValue;
	}
}
public class VDFPropInfo
{
	static Dictionary<MemberInfo, VDFPropInfo> cachedPropInfo = new Dictionary<MemberInfo, VDFPropInfo>();
	public static VDFPropInfo Get(MemberInfo prop)
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
			result.popOutL2 = propTag.popOutL2;
			result.writeDefaultValue = propTag.writeDefaultValue;
		}
		return result;
	}

	public MemberInfo memberInfo;
	public bool? includeL2;
	public bool? popOutL2;
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
[AttributeUsage(AttributeTargets.Method)] public class VDFSerialize : Attribute {}
[AttributeUsage(AttributeTargets.Method)] public class VDFPostSerialize : Attribute {}
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)] public class VDFPreDeserialize : Attribute {}
[AttributeUsage(AttributeTargets.Method)] public class VDFDeserialize : Attribute
{
	public bool fromParent;
	public VDFDeserialize(bool fromParent = false) { this.fromParent = fromParent; }
}
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Constructor)] public class VDFPostDeserialize : Attribute {}
public class VDFMethodInfo
{
	static Dictionary<MemberInfo, VDFMethodInfo> cachedMethodInfo = new Dictionary<MemberInfo, VDFMethodInfo>();
	public static VDFMethodInfo Get(MethodBase method)
	{
		if (!cachedMethodInfo.ContainsKey(method))
			Set(method, method.GetCustomAttributes(typeof(Attribute), true).OfType<Attribute>().ToList());
		return cachedMethodInfo[method];
	}
	public static void Set(MethodBase method, List<Attribute> tags) { cachedMethodInfo[method] = BuildMethodInfo(method, tags); }
	static VDFMethodInfo BuildMethodInfo(MethodBase method, List<Attribute> tags)
	{
		var result = new VDFMethodInfo();
		result.memberInfo = method;
		result.tags = tags;
		return result;
	}

	public MethodBase memberInfo;
	public List<Attribute> tags; 

	public object Call(object objParent, params object[] args)
	{
		if (args.Length > memberInfo.GetParameters().Length)
			args = args.Take(memberInfo.GetParameters().Length).ToArray();
		if (memberInfo.Name.Contains("<")) // if anonymous/lambda method
			return memberInfo.Invoke(null, new[] {objParent}.Concat(args).ToArray());
		return memberInfo.Invoke(objParent, args);
	}
}