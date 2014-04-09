class VDFSaveOptions
{
}

class VDFSaver
{
	static ToVDFNode(obj: any, saveOptions?: VDFSaveOptions): VDFNode
	{
		if (saveOptions == null)
			saveOptions = new VDFSaveOptions();
		
		var objNode = new VDFNode();
		if (VDF.typeExporters_inline[obj.GetTypeName()])
		{
			var str = VDF.typeExporters_inline[obj.GetTypeName()](obj);
			objNode.items.push(new VDFNode(str.contains("}") ? "@@@" + str + "@@@" : str));
		}
		else if (obj.GetTypeName() == "Number" && obj.toString().contains(".")) // float/double
			objNode.items.push(new VDFNode(obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString()));
		else if (obj.GetTypeName() == "Number" || obj.GetTypeName() == "String")
			objNode.items.push(new VDFNode(obj.toString().contains("}") ? "@@@" + obj + "@@@" : obj.toString()));
		else if (obj.GetTypeName() == "Array")
		{
			objNode.isListOrDictionary = true;
			var objAsList = <Array<any>>obj;
			for (var i = 0; i < objAsList.length; i++)
			{
				var item = objAsList[i];
				var typeDerivedFromDeclaredType: boolean = !obj.GetTypeName().contains(item.GetTypeName()); // if value's type is *derived* from array's declared item-type; todo
				var itemValueNode: VDFNode = VDFSaver.ToVDFNode(item, saveOptions);
				if (item.GetTypeName() == "Array") // if array item is itself an array
					itemValueNode.isArrayItem_array = true;
				if (i > 0)
					itemValueNode.isArrayItem_nonFirst = true;
				if (typeDerivedFromDeclaredType)
					itemValueNode.metadata_type = VDF.GetVNameOfType(item.GetTypeName(), saveOptions);
				objNode.items.push(itemValueNode);
			}
		}
		else if (obj.GetTypeName() == "Map")
		{
			objNode.isListOrDictionary = true;
			var objAsDictionary = <Map<any, any>>obj;
			objAsDictionary.forEach((value: any, key: any, map: Map<any, any>) =>
			{
				var keyValuePairPseudoNode = new VDFNode();
				keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

				var keyTypeDerivedFromDeclaredType: boolean = !obj.GetTypeName().contains(key.GetTypeName() + ","); // if key's type is *derived* from map's declared key-type; todo
				var keyNode: VDFNode = VDFSaver.ToVDFNode(key, saveOptions);
				if (keyTypeDerivedFromDeclaredType)
					keyNode.metadata_type = VDF.GetVNameOfType(key.GetTypeName(), saveOptions);
				keyValuePairPseudoNode.items.push(keyNode);

				var valueTypeDerivedFromDeclaredType: boolean = !obj.GetTypeName().contains(key.GetTypeName()); // if value's type is *derived* from map's declared value-type; todo
				var valueNode: VDFNode = VDFSaver.ToVDFNode(value, saveOptions);
				valueNode.isArrayItem_nonFirst = true;
				if (valueTypeDerivedFromDeclaredType)
					valueNode.metadata_type = VDF.GetVNameOfType(value.GetTypeName(), saveOptions);
				keyValuePairPseudoNode.items.push(valueNode);

				objNode.items.push(keyValuePairPseudoNode);
			});
		}
		else if (typeof obj == "object") //obj.GetTypeName() == "Object") // an object, with properties
		{
			var typeInfo = obj["typeInfo"] || new VDFTypeInfo(); // if not specified, use default values
			var popOutGroupsAdded = 0;
			for (var propName in obj)
			{
				if (typeof obj[propName] == "function")
					continue;

				var propInfo: VDFPropInfo = typeInfo.propInfoByPropName.get(propName) || new VDFPropInfo(null);
				var include = typeInfo.props_includeL1;
				include = propInfo.includeL2 != null ? propInfo.includeL2 : include;
				if (!include)
					continue;

				var propValue = obj[propName];
				if (propInfo.IsXIgnorableValue(propValue))
					continue;

				var propType = propValue.GetTypeName();
				var typeDerivedFromDeclaredType: boolean = propType != propInfo.propType && propType != "Array" && propType != "Map"; // if value's type is *derived* from prop's declared type; note; assumes arrays/maps are of declared type
				if (propInfo.popOutItemsToOwnLines)
				{
					var propValueNode: VDFNode = VDFSaver.ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					propValueNode.items.insert(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
					if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
						propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = VDF.GetVNameOfType(propType, saveOptions);
					for (var key in propValueNode.items)
						if (propValueNode.items[key].baseValue != "#")
							propValueNode.items[key].popOutToOwnLine = true;
					objNode.properties[propName] = propValueNode;
					popOutGroupsAdded++;
				}
				else
				{
					var propValueNode: VDFNode = VDFSaver.ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = VDF.GetVNameOfType(propType, saveOptions);
					objNode.properties[propName] = propValueNode;
				}
			}
		}

		return objNode;
	}
}