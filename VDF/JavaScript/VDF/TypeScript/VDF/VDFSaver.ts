enum VDFTypeMarking
{
	None, // can cause errors; only real use is for saving anonymous types, without redundant type-markings
	Assembly,
	AssemblyExternal,
	AssemblyExternalNoCollapse
}
class VDFSaveOptions
{
	message: any;
	typeMarking: VDFTypeMarking;
	constructor(message?: any, typeMarking: VDFTypeMarking = VDFTypeMarking.Assembly)
	{
		this.message = message;
		this.typeMarking = typeMarking;
	}
}

class VDFSaver
{
	static ToVDFNode(obj: any, declaredTypeName?: string, saveOptions?: VDFSaveOptions, isGenericParamValue?: boolean): VDFNode;
	static ToVDFNode(obj: any, saveOptions?: VDFSaveOptions, declaredTypeName?: string, isGenericParamValue?: boolean): VDFNode;
	static ToVDFNode(obj: any, declaredTypeName_orSaveOptions?: any, saveOptions_orDeclaredTypeName?: any, isGenericParamValue?: boolean): VDFNode
	{
		var declaredTypeName: string;
		var saveOptions: VDFSaveOptions;
		if (typeof declaredTypeName_orSaveOptions == "string" || saveOptions_orDeclaredTypeName instanceof VDFSaveOptions)
			{declaredTypeName = declaredTypeName_orSaveOptions; saveOptions = saveOptions_orDeclaredTypeName;}
		else
			{declaredTypeName = saveOptions_orDeclaredTypeName; saveOptions = declaredTypeName_orSaveOptions;}
		saveOptions = saveOptions || new VDFSaveOptions();

		var objNode = new VDFNode();
		var objVTypeName = EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetVTypeNameOfObject(obj); // at bottom, enums an integer; but consider it of a distinct type

		if (obj && obj.VDFPreSerialize)
			obj.VDFPreSerialize(saveOptions.message);

		if (obj == null)
			objNode.baseValue = "null";
		else if (VDF.typeExporters_inline[objVTypeName])
			objNode.baseValue = VDF.typeExporters_inline[objVTypeName](obj);
		else if (EnumValue.IsEnum(objVTypeName)) // if enum value (at bottom, an integer; but we can get the nice-name based on type info)
			objNode.baseValue = new EnumValue(objVTypeName, obj).toString();
		else if (objVTypeName == "bool")
			objNode.baseValue = obj.toString().toLowerCase();
		else if (["float", "double", "decimal"].contains(objVTypeName)) // floating-point number
			objNode.baseValue = obj.toString().startsWith("0.") ? obj.toString().substring(1) : obj.toString();
		else if (["char", "byte", "sbyte", "short", "ushort", "int", "uint", "long", "ulong", "string"].contains(objVTypeName))
			objNode.baseValue = obj.toString();
		else if (objVTypeName && objVTypeName.startsWith("List["))
		{
			objNode.isList = true;
			var objAsList = <List<any>>obj;
			for (var i = 0; i < objAsList.length; i++)
			{
				var itemValueNode = VDFSaver.ToVDFNode(objAsList[i], objAsList.itemType, saveOptions, true);
				itemValueNode.isListItem = true;
				if (i > 0)
					itemValueNode.isListItem_nonFirst = true;
				objNode.PushItem(itemValueNode);
			}
		}
		else if (objVTypeName && objVTypeName.startsWith("Dictionary["))
		{
			objNode.isDictionary = true;
			var objAsDictionary = <Dictionary<any, any>>obj;
			for (var i in objAsDictionary.keys)
				objNode.SetProperty(VDFSaver.ToVDFNode(objAsDictionary.keys[i], objAsDictionary.keyType, saveOptions, true).AsString, VDFSaver.ToVDFNode(objAsDictionary.Get(objAsDictionary.keys[i]), objAsDictionary.valueType, saveOptions, true));
		}
		else if (typeof obj == "object") //obj.GetTypeName() == "Object") // an object, with properties
		{
			var isAnonymousType = obj.constructor == (<any>{}).constructor || obj.constructor == object; // if true anonymous object, or if VDF-anonymous-object
			var typeInfo = obj.GetType()["typeInfo"] || (isAnonymousType ? new VDFTypeInfo(true) : new VDFTypeInfo()); // if not specified: if anon type, include all props, otherwise, use default values
			var popOutGroupsAdded = 0;

			// special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
			var oldObj = obj;
			obj = {};
			for (var propName in typeInfo.propInfoByName)
				obj[propName] = null; // first, clear each declared prop to a null value, to ensure that the code below can process each declared property
			for (var propName in oldObj) // now add in the actual data, for any that are attached to the actual instance
				obj[propName] = oldObj[propName];

			for (var propName in obj)
			{
				if (typeof obj[propName] == "function")
					continue;
				
				var propInfo: VDFPropInfo = typeInfo.propInfoByName[propName] || new VDFPropInfo("object"); // if prop-info not specified, consider its declared-type to be 'object'
				var include = typeInfo.props_includeL1;
				include = propInfo.includeL2 != null ? propInfo.includeL2 : include;
				if (!include)
					continue;

				var propValue = obj[propName];
				if (propInfo.IsXValueEmpty(propValue) && !propInfo.writeEmptyValue)
					continue;
				
				var propValueNode = VDFSaver.ToVDFNode(propValue, !isAnonymousType ? propInfo.propVTypeName : "object", saveOptions); // if obj is an anonymous type, considers its props' declared-types to be 'object'
				if (propInfo.popDataOutOfLine)
				{
					if (propValue != null) // just assume that ">null" should go inline; there's almost always no point in popping it out
					{
						for (var i in propValueNode.items)
							propValueNode.items[i].popOutToOwnLine = true;
						if (popOutGroupsAdded > 0 && propValueNode.items.length > 0)
							propValueNode.items[0].isFirstItemOfNonFirstPopOutGroup = true;
						propValueNode.InsertItem(0, new VDFNode("#")); // add in-line marker, indicating that items are popped-out
					}
					popOutGroupsAdded++;
				}
				objNode.SetProperty(propName, propValueNode);
			}
		}

		// do type-marking at the end, since it depends quite a bit on the actual data (since the data determines how much can be inferred, and how much needs to be specified)
		var markType = saveOptions.typeMarking == VDFTypeMarking.AssemblyExternalNoCollapse;
		markType = markType || (saveOptions.typeMarking == VDFTypeMarking.AssemblyExternal && obj instanceof List && objNode.items.length == 1); // if list with only one item (i.e. indistinguishable from base-prop)
		markType = markType || (saveOptions.typeMarking == VDFTypeMarking.AssemblyExternal && obj instanceof Dictionary); // if dictionary (i.e. indistinguishable from prop-set)
		markType = markType || (saveOptions.typeMarking == VDFTypeMarking.AssemblyExternal && !isGenericParamValue); // we're a non-generics-based value (i.e. we have no value-default-type specified)
		markType = markType || ([VDFTypeMarking.Assembly, VDFTypeMarking.AssemblyExternal].contains(saveOptions.typeMarking) && (obj == null || objVTypeName != declaredTypeName)); // if actual type is *derived* from the declared type, we must mark type, even if in the same Assembly
		objNode.metadata_type = markType ? objVTypeName : null;
		if (saveOptions.typeMarking != VDFTypeMarking.AssemblyExternalNoCollapse)
		{
			var collapseMap = {"string": null, "null": "", "bool": "", "int": "", "float": "", "List[object]": "", "Dictionary[object,object]": ""};
			if (objNode.metadata_type != null && collapseMap[objNode.metadata_type] !== undefined)
				objNode.metadata_type = collapseMap[objNode.metadata_type];
			// if List of generic-params-without-generic-params, or Dictionary, chop out name and just include generic-params
			if (objNode.metadata_type != null && ((objNode.metadata_type.startsWith("List[") && !objNode.metadata_type.substring(5).contains("[")) || objNode.metadata_type.startsWith("Dictionary[")))
				objNode.metadata_type = objNode.metadata_type.startsWith("List[") ? objNode.metadata_type.substring(5, objNode.metadata_type.length - 1) : objNode.metadata_type.substring(11, objNode.metadata_type.length - 1);
		}

		return objNode;
	}
}