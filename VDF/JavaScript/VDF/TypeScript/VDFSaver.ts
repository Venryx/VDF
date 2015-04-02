enum VDFTypeMarking
{
	None,
	Internal,
	External,
	ExternalNoCollapse // maybe temp
}
class VDFSaveOptions
{
	message: any;
	typeMarking: VDFTypeMarking;

	// for JSON compatibility
	useMetadata: boolean;
	useChildPopOut: boolean;
	useStringKeys: boolean;
	useNumberTrimming: boolean; // e.g. trims 0.123 to .123
	useCommaSeparators: boolean; // currently only applies to non-popped-out children

	constructor(initializerObj?: any, message?: any, typeMarking = VDFTypeMarking.Internal,
		useMetadata = true, useChildPopOut = true, useStringKeys = false, useNumberTrimming = true, useCommaSeparators = false)
	{
		this.message = message;
		this.typeMarking = typeMarking;
		this.useMetadata = useMetadata;
		this.useChildPopOut = useChildPopOut;
		this.useStringKeys = useStringKeys;
		this.useNumberTrimming = useNumberTrimming;
		this.useCommaSeparators = useCommaSeparators;

		if (initializerObj)
			for (var key in initializerObj)
				this[key] = initializerObj[key];
	}

	ForJSON(): VDFSaveOptions // helper function for JSON compatibility
	{
		this.useMetadata = false;
		this.useChildPopOut = false;
		this.useStringKeys = true;
		this.useNumberTrimming = false;
		this.useCommaSeparators = true;
		return this;
	}
}

class VDFSaver
{
	static ToVDFNode(obj: any, options?: VDFSaveOptions): VDFNode;
	static ToVDFNode(obj: any, declaredTypeName?: string, options?: VDFSaveOptions, prop?: string, declaredTypeFromParent?: boolean): VDFNode;
	static ToVDFNode(obj: any, declaredTypeName_orOptions?: any, options = new VDFSaveOptions(), prop?: string, declaredTypeInParentVDF?: boolean): VDFNode
	{
		if (declaredTypeName_orOptions instanceof VDFSaveOptions)
			return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;

		var node = new VDFNode();
		var typeName = obj != null ? (EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetTypeNameOfObject(obj)) : null; // at bottom, enums an integer; but consider it of a distinct type
		var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
		var typeInfo = VDFTypeInfo.Get(typeName);

		if (obj && obj.VDFPreSerialize)
			obj.VDFPreSerialize(prop, options);

		if (obj && obj.VDFSerialize)
			node = obj.VDFSerialize(prop, options);
		else if (obj == null)
			node.primitiveValue = null;
		else if (VDF.GetIsTypePrimitive(typeName))
			node.primitiveValue = obj;
		else if (EnumValue.IsEnum(typeName)) // helper exporter for enums (at bottom, TypeScript enums are numbers; but we can get the nice-name based on type info)
			node.primitiveValue = new EnumValue(typeName, obj).toString();
		else if (typeName && typeName.startsWith("List("))
		{
			node.isList = true;
			var objAsList = <List<any>>obj;
			for (var i = 0; i < objAsList.length; i++)
				node.AddListChild(VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, prop, true));
		}
		else if (typeName && typeName.startsWith("Dictionary("))
		{
			node.isMap = true;
			var objAsDictionary = <Dictionary<any, any>>obj;
			for (var key in objAsDictionary.Keys)
				node.SetMapChild(VDFSaver.ToVDFNode(key, typeGenericArgs[0], options, prop, true).primitiveValue, VDFSaver.ToVDFNode(objAsDictionary[key], typeGenericArgs[1], options, prop, true));
		}
		else // if an object, with properties
		{
			node.isMap = true;

			// special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
			var oldObj = obj;
			obj = {};
			for (var propName in typeInfo.props)
				obj[propName] = null; // first, clear each declared prop to a null value, to ensure that the code below can process each declared property
			for (var propName in oldObj) // now add in the actual data, for any that are attached to the actual instance
				obj[propName] = oldObj[propName];

			for (var propName in obj)
				try
				{
					var propInfo: VDFPropInfo = typeInfo.props[propName]; // || new VDFPropInfo("object"); // if prop-info not specified, consider its declared-type to be 'object'
					var include = typeInfo.propIncludeRegexL1 != null ? new RegExp(typeInfo.propIncludeRegexL1).test(propName) : false;
					include = propInfo && propInfo.includeL2 != null ? propInfo.includeL2 : include;
					if (!include)
						continue;

					var propValue = obj[propName];
					if (propInfo && propInfo.IsXValueTheDefault(propValue) && !propInfo.writeDefaultValue)
						continue;
					
					var propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.propTypeName : null, options);
					propValueNode.childPopOut = options.useChildPopOut && (propInfo && propInfo.popOutL2 != null ? propInfo.popOutL2 : propValueNode.childPopOut);
					node.SetMapChild(propName, propValueNode);
				}
				catch (ex) { throw new Error(ex.message + "\n==================\nRethrownAs) " + ("Error saving property '" + propName + "'.") + "\n"); }
		}

		if (declaredTypeName == null)
			if (node.isList || node.listChildren.Count > 0)
				declaredTypeName = "List(object)";
			else if (node.isMap || node.mapChildren.Count > 0)
				declaredTypeName = "Dictionary(object object)";
			else
				declaredTypeName = "object";
		if (options.useMetadata && typeName != null && !VDF.GetIsTypeAnonymous(typeName) &&
		(
			(options.typeMarking == VDFTypeMarking.Internal && !VDF.GetIsTypePrimitive(typeName) && typeName != declaredTypeName) ||
			(options.typeMarking == VDFTypeMarking.External && !VDF.GetIsTypePrimitive(typeName) && (typeName != declaredTypeName || !declaredTypeInParentVDF)) ||
			options.typeMarking == VDFTypeMarking.ExternalNoCollapse
		))
			node.metadata = typeName;

		if (options.useChildPopOut && typeInfo != null && typeInfo.childPopOutL1)
			node.childPopOut = true;

		if (obj && obj.VDFPostSerialize)
			obj.VDFPostSerialize(prop, options);

		return node;
	}
}