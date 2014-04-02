using System;
using System.Collections;

static class VDFSaver
{
	static VDFSaver() { VDFExtensions.Init(); }
	public static VDFNode ToVDFNode(object obj)
	{
		var objNode = new VDFNode();

		Type type = obj.GetType();
		if (VDF.typeExporters_inline.ContainsKey(type))
			objNode.items.Add(VDF.typeExporters_inline[type](obj));
		else if (type == typeof(float) || type == typeof(double))
			objNode.items.Add(obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj.ToString());
		else if (type.IsPrimitive || type == typeof(string))
			objNode.items.Add(obj.ToString());
		else if (obj is IList) // note; this saves arrays also
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
					itemValueNode.metadata = item.GetType().FullName;
				objNode.items.Add(itemValueNode);
			}
		}
		else
		{
			var typeInfo = VDFTypeInfo.Get(type);
			int popOutGroupsAdded = 0;
			foreach (string propName in typeInfo.propInfoByName.Keys)
			{
				VDFPropInfo propInfo = typeInfo.propInfoByName[propName];
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
					VDFNode propValueNode = ToVDFNode(propValue);
					propValueNode.items.Add("#");
					if (popOutGroupsAdded > 0)
						((VDFNode)propValueNode.items[0]).isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata = propValue.GetType().FullName;
					foreach (object propValueNodeItem in propValueNode.items)
						if (propValueNodeItem is VDFNode)
							((VDFNode)propValueNodeItem).popOutToOwnLine = true;
					objNode.properties.Add(propName, propValueNode);
					popOutGroupsAdded++;
				}
				else
				{
					VDFNode propValueNode = ToVDFNode(propValue);
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata = propValue.GetType().FullName;
					objNode.properties.Add(propName, propValueNode);
				}
			}
		}

		return objNode;
	}
}