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
		objNode.metadata_type = typeof obj;
		if (typeof obj == "number" && (typeof obj).contains(".")) // float/double
			objNode.items.push(new VDFNode(obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString()));
		else if (typeof obj == "number" || typeof obj == "string")
			objNode.items.push(new VDFNode(obj.toString().contains("}") ? "@@@" + obj + "@@@" : obj.toString()));
		else if (obj instanceof Array)
		{
			objNode.metadata_type = "List[object]";
			objNode.isListOrDictionary = true;
			var objAsList = <Array<any>>obj;
			for (var i = 0; i < objAsList.length; i++)
			{
				var item = objAsList[i];
				var itemValueNode: VDFNode = VDFSaver.ToVDFNode(item, saveOptions);
				if (item instanceof Array) // if array item is itself an array
					itemValueNode.isArrayItem_array = true;
				if (i > 0)
					itemValueNode.isArrayItem_nonFirst = true;
				itemValueNode.metadata_type = typeof item;
				objNode.items.push(itemValueNode);
			}
		}
		else if (obj instanceof Map)
		{
			objNode.metadata_type = "List[object, object]";
			objNode.isListOrDictionary = true;
			var objAsDictionary = <Map<any, any>>obj;
			for (var key in objAsDictionary)
			{
				var value = objAsDictionary[key];
				var keyValuePairPseudoNode = new VDFNode();
				keyValuePairPseudoNode.isKeyValuePairPseudoNode = true;

				var keyNode: VDFNode = VDFSaver.ToVDFNode(key, saveOptions);
				keyNode.metadata_type = typeof key;
				keyValuePairPseudoNode.items.push(keyNode);

				var valueNode: VDFNode = VDFSaver.ToVDFNode(value, saveOptions);
				valueNode.isArrayItem_nonFirst = true;
				valueNode.metadata_type = typeof value;
				keyValuePairPseudoNode.items.push(valueNode);

				objNode.items.push(keyValuePairPseudoNode);
			}
		}
		else if (typeof obj == "object")// an object, with properties
		{
			
			var popOutGroupsAdded = 0;
			for (var propName in obj)
			{
				if (typeof obj[propName] == "function")
					continue;
				var include = true; // todo
				if (!include)
					continue;

				var propValue = obj[propName];
				if (propValue == null)
					continue;

				var popOutItemsToOwnLines = typeof propValue == "object"; // todo
				if (popOutItemsToOwnLines)
				{
					var propValueNode: VDFNode = VDFSaver.ToVDFNode(propValue, saveOptions);
					propValueNode.isNamedPropertyValue = true;
					propValueNode.items.insert(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
					if (popOutGroupsAdded > 0 && propValueNode.items.length > 1)
						propValueNode.items[1].isFirstItemOfNonFirstPopOutGroup = true;
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
					objNode.properties[propName] = propValueNode;
				}
			}
		}

		return objNode;
	}
}