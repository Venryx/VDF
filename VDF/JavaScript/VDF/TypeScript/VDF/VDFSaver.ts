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
			objNode.baseValue = VDFSaver.RawDataStringToFinalized(VDF.typeExporters_inline[objVTypeName](obj));
		else if (objVTypeName == "bool")
			objNode.baseValue = obj.toString().toLowerCase();
		else if (objVTypeName == "float" && obj.toString().contains(".")) // float/double
			objNode.baseValue = obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString();
		else if (objVTypeName == "float" || objVTypeName == "string" || obj.GetTypeName() == "EnumValue")
			objNode.baseValue = VDFSaver.RawDataStringToFinalized(obj.toString());
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
				objNode.PushItem(itemValueNode);
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
				keyValuePairPseudoNode.PushItem(keyNode);

				var valueVTypeName = VDF.GetVTypeNameOfObject(value);
				var valueTypeDerivedFromDeclaredType: boolean = valueVTypeName != objAsDictionary.valueType; // if value's type is *derived* from map's declared value-type
				var valueNode: VDFNode = VDFSaver.ToVDFNode(value);
				valueNode.isListItem_nonFirst = true;
				if (valueTypeDerivedFromDeclaredType)
					valueNode.metadata_type = valueVTypeName;
				keyValuePairPseudoNode.PushItem(valueNode);

				objNode.PushItem(keyValuePairPseudoNode);
			};
		}
		else if (typeof obj == "object") //obj.GetTypeName() == "Object") // an object, with properties
		{
			var isAnonymousType = obj.__proto__ == (<any>{}).__proto__;
			var typeInfo = obj.GetType()["typeInfo"] || (isAnonymousType ? new VDFTypeInfo(true) : new VDFTypeInfo()); // if not specified: if anon type, include all props, otherwise, use default values
			var popOutGroupsAdded = 0;

			// special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
			var oldObj = obj;
			obj = {};
			for (var propName in typeInfo.propInfoByPropName)
				obj[propName] = null; // first, clear each declared prop to a null value, to ensure that the code below can process each declared property
			for (var propName in oldObj) // now add in the actual data, for any that are attached to the actual instance
				obj[propName] = oldObj[propName];

			for (var propName in obj)
			{
				if (typeof obj[propName] == "function")
					continue;

				var propInfo: VDFPropInfo = typeInfo.propInfoByPropName[propName] || new VDFPropInfo(null);
				var include = typeInfo.props_includeL1;
				include = propInfo.includeL2 != null ? propInfo.includeL2 : include;
				if (!include)
					continue;

				var propValue = obj[propName];
				if (EnumValue.IsEnum(propInfo.propVTypeName)) // special case; if enum
					propValue = new EnumValue(propInfo.propVTypeName, propValue);
				if (propInfo.IsXValueEmpty(propValue) && !propInfo.writeEmptyValue)
					continue;
				if (propValue == null)
				{
					objNode.SetProperty(propName, new VDFNode("[#null]"));
					continue;
				}

				var propVTypeName = VDF.GetVTypeNameOfObject(propValue);
				var typeDerivedFromDeclaredType: boolean = propVTypeName != propInfo.propVTypeName && propInfo.propVTypeName != null; // if value's type is *derived* from prop's declared type; note; assumes lists/dictionaries are of declared type
				if (propInfo.popOutItemsToOwnLines)
				{
					var propValueNode: VDFNode = VDFSaver.ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					propValueNode.InsertItem(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
					if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
						propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = propVTypeName;
					for (var key in propValueNode.items)
						if (propValueNode.items[key].baseValue != "#")
							propValueNode.items[key].popOutToOwnLine = true;
					objNode.SetProperty(propName, propValueNode);
					popOutGroupsAdded++;
				}
				else
				{
					var propValueNode: VDFNode = VDFSaver.ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					if (typeDerivedFromDeclaredType)
						propValueNode.metadata_type = propVTypeName;
					objNode.SetProperty(propName, propValueNode);
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