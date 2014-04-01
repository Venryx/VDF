using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;

class VDFSaveNode
{
	public string metadata;
	public List<object> items = new List<object>(); 
	public Dictionary<string, VDFSaveNode> properties = new Dictionary<string, VDFSaveNode>();
	public bool popOutToOwnLine;
	public bool isFirstItemOfNonFirstPopOutGroup;
	public bool isNonFirstItemOfArray;
	public string GetInLineItemText()
	{
		var builder = new StringBuilder();
		foreach (object item in items)
		{
			if (item is VDFSaveNode)
			{
				if (!((VDFSaveNode)item).popOutToOwnLine)
					builder.Append(((VDFSaveNode)item).GetInLineItemText());
			}
			else
				builder.Append(item);
		}
		foreach (string propName in properties.Keys)
		{
			VDFSaveNode propValueNode = properties[propName];
			if (!propValueNode.popOutToOwnLine)
				builder.Append(propName + "{" + propValueNode.GetInLineItemText() + "}");
		}
		return (isFirstItemOfNonFirstPopOutGroup ? "#" : "") + (isNonFirstItemOfArray && !popOutToOwnLine ? "|" : "") + (metadata != null ? "<" + metadata + ">" : "") + builder; // markers + metadata + data
	}
	public string GetPoppedOutItemText()
	{
		var lines = new List<string>();
		if (popOutToOwnLine)
			lines.Add(GetInLineItemText());
		foreach (object item in items)
		{
			if (item is VDFSaveNode)
			{
				string poppedOutText = ((VDFSaveNode)item).GetPoppedOutItemText();
				if (poppedOutText.Length > 0)
					foreach (string line in poppedOutText.Split(new[] { '\n' }))
						lines.Add(line);
			}
		}
		foreach (string propName in properties.Keys)
		{
			VDFSaveNode propValueNode = properties[propName];
			string poppedOutText = propValueNode.GetPoppedOutItemText();
			if (poppedOutText.Length > 0)
				foreach (string line in poppedOutText.Split(new[] { '\n' }))
					lines.Add(line);
		}
		var builder = new StringBuilder();
		for (int i = 0; i < lines.Count; i++)
			builder.Append(i == 0 ? "" : "\n").Append(popOutToOwnLine ? "\t" : "").Append(lines[i]); // line-breaks + indents + data
		return builder.ToString();
	}
	public override string ToString() { return GetInLineItemText() + "\n" + GetPoppedOutItemText(); }
}

static class VDFSaver
{
	static VDFSaver() { VDFExtensions.Init(); }
	public static VDFSaveNode ToVDFSaveNode(object obj)
	{
		var objNode = new VDFSaveNode();

		Type type = obj.GetType();
		if (VDF.typeExporters_inline.ContainsKey(type))
			objNode.items.Add(VDF.typeExporters_inline[type](obj));
		else if (type == typeof(float) || type == typeof(double))
			objNode.items.Add(obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj.ToString());
		else if (type.IsPrimitive || type == typeof(string))
			objNode.items.Add(obj.ToString());
		else if (obj is IList)
		{
			var objAsList = (IList)obj;
			for (int i = 0; i < objAsList.Count; i++)
			{
				object item = objAsList[i];
				bool typeDerivedFromDeclaredType = type.IsGenericType && item.GetType() != type.GetGenericArguments()[0]; // if List item is of a type *derived* from the List's base item-type (i.e. we need to specify actual item-type)
				VDFSaveNode itemValueNode = ToVDFSaveNode(item);
				if (i > 0)
					itemValueNode.isNonFirstItemOfArray = true;
				if (typeDerivedFromDeclaredType)
					itemValueNode.metadata = item.GetType().Name;
				objNode.items.Add(itemValueNode);
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
					VDFSaveNode propValueNode = ToVDFSaveNode(propValue);
					propValueNode.items.Add("#");
					if (popOutGroupsAdded > 0)
						((VDFSaveNode)propValueNode.items[0]).isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata = propValue.GetType().Name;
					foreach (object propValueNodeItem in propValueNode.items)
						if (propValueNodeItem is VDFSaveNode)
							((VDFSaveNode)propValueNodeItem).popOutToOwnLine = true;
					objNode.properties.Add(name, propValueNode);
					popOutGroupsAdded++;
				}
				else
				{
					VDFSaveNode propValueNode = ToVDFSaveNode(propValue);
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata = propValue.GetType().Name;
					objNode.properties.Add(name, propValueNode);
				}
			}
		}

		return objNode;
	}
}