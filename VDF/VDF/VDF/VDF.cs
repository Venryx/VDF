using System;
using System.Collections;
using System.Collections.Generic;
using System.Runtime.Serialization;
using System.Text;

class VDFNode
{
	public string metadata;
	public List<object> children = new List<object>();
	public bool popOutToOwnLine;
	public bool isFirstItemOfNonFirstPopOutGroup;
	public bool isNonFirstItemOfArray;
	public string GetInLineItemText()
	{
		var builder = new StringBuilder();
		for (int i = 0; i < children.Count; i++)
		{
			var child = children[i];
			if (child is VDFNode)
			{
				if (!((VDFNode)child).popOutToOwnLine)
					builder.Append(((VDFNode)child).GetInLineItemText());
			}
			else
				builder.Append(child);
		}
		return (isFirstItemOfNonFirstPopOutGroup ? "#" : "") + (isNonFirstItemOfArray && !popOutToOwnLine ? "|" : "") + metadata + builder;
	}
	public string GetPoppedOutItemText()
	{
		var lines = new List<string>();
		if (popOutToOwnLine)
			lines.Add(GetInLineItemText());
		foreach (object child in children)
			if (child is VDFNode)
			{
				var childAsNode = (VDFNode)child;
				string poppedOutText = childAsNode.GetPoppedOutItemText();
				if (poppedOutText.Length > 0)
					foreach (string line in poppedOutText.Split(new[] { '\n' }))
						lines.Add(line);
			}
		var builder = new StringBuilder();
		for (int i = 0; i < lines.Count; i++)
			builder.Append(i == 0 ? "" : "\n").Append(popOutToOwnLine ? "\t" : "").Append(lines[i]);
		return builder.ToString();
	}
	public override string ToString() { return GetInLineItemText() + "\n" + GetPoppedOutItemText(); }
}

static class VDF
{
	static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj => exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str => importer(str); }
	static VDF() { VDFExtensions.Init(); }

	public static string ToVDF(object obj) { return ToVDFNode(obj).ToString(); }
	public static VDFNode ToVDFNode(object obj)
	{
		var objNode = new VDFNode();

		var type = obj.GetType();
		if (typeExporters_inline.ContainsKey(type))
			objNode.children.Add(typeExporters_inline[type](obj));
		else if (type == typeof(float) || type == typeof(double))
			objNode.children.Add(obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj.ToString());
		else if (type.IsPrimitive || type == typeof(string))
			objNode.children.Add(obj.ToString());
		else if (obj is IList)
		{
			var objAsList = (IList)obj;
			for (int i = 0; i < objAsList.Count; i++)
			{
				object item = objAsList[i];
				bool typeDerivedFromDeclaredType = type.IsGenericType && item.GetType() != type.GetGenericArguments()[0]; // if List item is of a type *derived* from the List's base item-type (i.e. we need to specify actual item-type)
				VDFNode itemValueNode = ToVDFNode(item);
				if (i > 0)
					itemValueNode.isNonFirstItemOfArray = true;
				if (typeDerivedFromDeclaredType)
					itemValueNode.metadata += "<" + item.GetType().Name + ">";
				objNode.children.Add(itemValueNode);
			}
		}
		else
		{
			var typeInfo = VDFTypeInfo.Get(type);
			int popOutGroupsAdded = 0;
			foreach (string name in typeInfo.propInfoByName.Keys)
			{
				VDFPropInfo propInfo = typeInfo.propInfoByName[name];
				bool include = typeInfo.props_includeL1;
				include = propInfo.includeL2.HasValue ? propInfo.includeL2.Value : include;
				if (!include)
					continue;

				object propValue = propInfo.GetValue(obj);
				if (propInfo.IsXIgnorableValue(propValue))
					continue;

				bool typeDerivedFromDeclaredType = propValue.GetType() != propInfo.propType; // if value is of a type *derived* from the property's base value-type (i.e. we need to specify actual value-type)
				if (propInfo.popOutItemsToOwnLines)
				{
					objNode.children.Add(name + "{#}");
					VDFNode propValueNode = ToVDFNode(propValue);
					if (popOutGroupsAdded > 0)
						((VDFNode)propValueNode.children[0]).isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata = "<" + propValue.GetType().Name + ">";
					foreach (object child in propValueNode.children)
						if (child is VDFNode)
							((VDFNode)child).popOutToOwnLine = true;
					objNode.children.Add(propValueNode);
					popOutGroupsAdded++;
				}
				else
				{
					objNode.children.Add(name + "{");
					VDFNode propValueNode = ToVDFNode(propValue);
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata = "<" + propValue.GetType().Name + ">";
					objNode.children.Add(propValueNode);
					objNode.children.Add("}");
				}
			}
		}

		return objNode;
	}

	public static T FromVDF<T>(string vdf)
	{
		//var result = (T)Activator.CreateInstance(typeof(T));
		//var result = ((Func<T>)Expression.Lambda(typeof(Func<object>), Expression.New(typeof(T).GetConstructors()[0])).Compile())();
		var result = (T)FormatterServices.GetUninitializedObject(typeof(T));
		return result;
	}
}