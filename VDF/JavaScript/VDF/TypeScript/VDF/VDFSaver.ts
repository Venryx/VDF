class VDFSaveOptions {}

class VDFSaver
{
	static ToVDFNode(obj: any, saveOptions?: VDFSaveOptions): VDFNode
	{
		if (saveOptions == null)
			saveOptions = new VDFSaveOptions();

		var objVTypeName = VDF.GetVTypeNameOfObject(obj);
		var objNode = new VDFNode();
		if (VDF.typeExporters_inline[objVTypeName])
			objNode.items.push(new VDFNode(VDFSaver.RawDataStringToFinalized(VDF.typeExporters_inline[objVTypeName](obj))));
		else if (objVTypeName == "float" && obj.toString().contains(".")) // float/double
			objNode.items.push(new VDFNode(obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString()));
		else if (objVTypeName == "float" || objVTypeName == "string" || obj.GetTypeName() == "EnumValue")
			objNode.items.push(new VDFNode(VDFSaver.RawDataStringToFinalized(obj.toString())));
		else if (objVTypeName.startsWith("List["))
		{
			objNode.isListOrDictionary = true;
			var objAsList = <List<any>>obj;
			for (var i = 0; i < objAsList.length; i++)
			{
				var item = objAsList[i];
				if (eval("window['" + objAsList.itemType + "'] && " + objAsList.itemType + "['_IsEnum'] === 0")) // special case; if enum
					item = new EnumValue(objAsList.itemType, item);

				var itemVTypeName = VDF.GetVTypeNameOfObject(item);
				var typeDerivedFromDeclaredType: boolean = itemVTypeName != objAsList.itemType; // if value's type is *derived* from list's declared item-type
				var itemValueNode: VDFNode = VDFSaver.ToVDFNode(item, saveOptions);
				if (itemVTypeName.startsWith("List[")) // if list item is itself a list
					itemValueNode.isListItem_list = true;
				if (i > 0)
					itemValueNode.isListItem_nonFirst = true;
				if (typeDerivedFromDeclaredType)
					itemValueNode.metadata_type = itemVTypeName;
				objNode.items.push(itemValueNode);
			}
		}
		else if (objVTypeName.startsWith("Dictionary["))
		{
			objNode.isListOrDictionary = true;
			var objAsDictionary = <Dictionary<any, any>>obj;
			for (var i in objAsDictionary.keys)
			{
				var key = objAsDictionary.keys[i];
				var value = objAsDictionary.get(key);
				if (eval("window['" + objAsDictionary.keyType + "'] && " + objAsDictionary.keyType + "['_IsEnum'] === 0")) // special case; if enum
					key = new EnumValue(objAsDictionary.keyType, key);
				if (eval("window['" + objAsDictionary.valueType + "'] && " + objAsDictionary.valueType + "['_IsEnum'] === 0")) // special case; if enum
					value = new EnumValue(objAsDictionary.valueType, value);

				var keyValuePairPseudoNode = new VDFNode();
				keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

				var keyVTypeName = VDF.GetVTypeNameOfObject(key);
				var keyTypeDerivedFromDeclaredType: boolean = keyVTypeName != objAsDictionary.keyType; // if key's type is *derived* from map's declared key-type
				var keyNode: VDFNode = VDFSaver.ToVDFNode(key);
				if (keyTypeDerivedFromDeclaredType)
					keyNode.metadata_type = keyVTypeName;
				keyValuePairPseudoNode.items.push(keyNode);

				var valueVTypeName = VDF.GetVTypeNameOfObject(value);
				var valueTypeDerivedFromDeclaredType: boolean = valueVTypeName != objAsDictionary.valueType; // if value's type is *derived* from map's declared value-type
				var valueNode: VDFNode = VDFSaver.ToVDFNode(value);
				valueNode.isListItem_nonFirst = true;
				if (valueTypeDerivedFromDeclaredType)
					valueNode.metadata_type = valueVTypeName;
				keyValuePairPseudoNode.items.push(valueNode);

				objNode.items.push(keyValuePairPseudoNode);
			};
		}
		else if (typeof obj == "object") //obj.GetTypeName() == "Object") // an object, with properties
		{
			var typeInfo = obj.GetType()["typeInfo"] || new VDFTypeInfo(); // if not specified, use default values
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
				if (EnumValue.IsEnum(propInfo.propVTypeName)) // special case; if enum
					propValue = new EnumValue(propInfo.propVTypeName, propValue);
				if (propInfo.IsXIgnorableValue(propValue))
					continue;
				
				var propVTypeName = VDF.GetVTypeNameOfObject(propValue);
				var typeDerivedFromDeclaredType: boolean = propVTypeName != propInfo.propVTypeName; // if value's type is *derived* from prop's declared type; note; assumes lists/dictionaries are of declared type
				if (propInfo.popOutItemsToOwnLines)
				{
					var propValueNode: VDFNode = VDFSaver.ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					propValueNode.items.insert(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
					if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
						propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = propVTypeName;
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
						propValueNode.metadata_type = propVTypeName;
					objNode.properties[propName] = propValueNode;
				}
			}
		}

		return objNode;
	}

	private static RawDataStringToFinalized(dataStr: string): string
	{
		var result: string = dataStr;
		if (dataStr.contains("}"))
		{
			if (dataStr.endsWith("@") || dataStr.endsWith("|"))
				result = "@@" + dataStr.replace(/@@(?=\n|}|$)/g, "@@@") + "|@@";
			else
				result = "@@" + dataStr.replace(/@@(?=\n|}|$)/g, "@@@") + "@@";
		}
		return result;
	}
}