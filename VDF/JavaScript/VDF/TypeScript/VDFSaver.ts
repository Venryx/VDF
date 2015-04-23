enum VDFTypeMarking
{
	None,
	Internal,
	External,
	ExternalNoCollapse // maybe temp
}
class VDFSaveOptions
{
	messages: any[];
	typeMarking: VDFTypeMarking;

	// for JSON compatibility
	useMetadata: boolean;
	useChildPopOut: boolean;
	useStringKeys: boolean;
	useNumberTrimming: boolean; // e.g. trims 0.123 to .123
	useCommaSeparators: boolean; // currently only applies to non-popped-out children

	constructor(initializerObj?: any, messages?: any[], typeMarking = VDFTypeMarking.Internal,
		useMetadata = true, useChildPopOut = true, useStringKeys = false, useNumberTrimming = true, useCommaSeparators = false)
	{
		this.messages = messages || [];
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
	static ToVDFNode(obj: any, declaredTypeName?: string, options?: VDFSaveOptions, parent?: any, prop?: VDFPropInfo, declaredTypeFromParent?: boolean): VDFNode;
	static ToVDFNode(obj: any, declaredTypeName_orOptions?: any, options = new VDFSaveOptions(), parent?: any, prop?: VDFPropInfo, declaredTypeInParentVDF?: boolean): VDFNode
	{
		if (declaredTypeName_orOptions instanceof VDFSaveOptions)
			return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;

		var typeName = obj != null ? (EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetTypeNameOfObject(obj)) : null; // at bottom, enums an integer; but consider it of a distinct type
		var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
		var typeInfo = typeName && VDFTypeInfo.Get(typeName);

		if (obj && obj.VDFPreSerialize)
			obj.VDFPreSerialize(parent, prop, options);

		var result;
		var serializedByCustomMethod = false;
		if (obj && obj.VDFSerialize)
		{
			var serializeResult = obj.VDFSerialize(parent, prop, options);
			if (serializeResult == VDF.CancelSerialize)
				return serializeResult;
			if (serializeResult != VDF.NoActionTaken)
			{
				result = serializeResult;
				serializedByCustomMethod = true;
			}
		}

		if (!serializedByCustomMethod)
		{
			result = new VDFNode();
			if (obj == null) {} //result.primitiveValue = null;
			else if (VDF.GetIsTypePrimitive(typeName))
				result.primitiveValue = obj;
			else if (EnumValue.IsEnum(typeName)) // helper exporter for enums (at bottom, TypeScript enums are numbers; but we can get the nice-name based on type info)
				result.primitiveValue = new EnumValue(typeName, obj).toString();
			else if (typeName && typeName.startsWith("List("))
			{
				result.isList = true;
				var objAsList = <List<any>>obj;
				for (var i = 0; i < objAsList.length; i++)
				{
					var itemNode = VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, parent, prop, true);
					if (itemNode == VDF.CancelSerialize)
						continue;
					result.AddListChild(itemNode);
				}
			}
			else if (typeName && typeName.startsWith("Dictionary("))
			{
				result.isMap = true;
				var objAsDictionary = <Dictionary<any, any>>obj;
				for (var key in objAsDictionary.Keys)
				{
					var valueNode = VDFSaver.ToVDFNode(objAsDictionary[key], typeGenericArgs[1], options, parent, prop, true);
					if (valueNode == VDF.CancelSerialize)
						continue;
					result.SetMapChild(VDFSaver.ToVDFNode(key, typeGenericArgs[0], options, parent, prop, true).primitiveValue, valueNode);
				}
			}
			else // if an object, with properties
			{
				result.isMap = true;

				// special fix; we need to write something for each declared prop (of those included anyway), so insert empty props for those not even existent on the instance
				for (var propName in typeInfo.props)
				{
					if (!(propName in obj))
						obj[propName] = null;
				}

				for (var propName in obj)
					try
					{
						var propInfo: VDFPropInfo = typeInfo.props[propName]; // || new VDFPropInfo("object"); // if prop-info not specified, consider its declared-type to be 'object'
						var include = typeInfo.typeTag != null && typeInfo.typeTag.propIncludeRegexL1 != null ? new RegExp(typeInfo.typeTag.propIncludeRegexL1).test(propName) : false;
						include = propInfo && propInfo.propTag && propInfo.propTag.includeL2 != null ? propInfo.propTag.includeL2 : include;
						if (!include)
							continue;

						var propValue = obj[propName];
						if (propInfo && propInfo.IsXValueTheDefault(propValue) && propInfo.propTag && propInfo.propTag.writeDefaultValue == false)
							continue;
					
						var propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.propTypeName : null, options, obj, propInfo);
						if (propValueNode == VDF.CancelSerialize)
							continue;
						propValueNode.childPopOut = options.useChildPopOut && (propInfo && propInfo.propTag && propInfo.propTag.popOutL2 != null ? propInfo.propTag.popOutL2 : propValueNode.childPopOut);
						result.SetMapChild(propName, propValueNode);
					}
					catch (ex) { ex.message += "\n==================\nRethrownAs) " + ("Error saving property '" + propName + "'.") + "\n"; throw ex; }
			}
		}

		if (declaredTypeName == null)
			if (result.isList || result.listChildren.Count > 0)
				declaredTypeName = "List(object)";
			else if (result.isMap || result.mapChildren.Count > 0)
				declaredTypeName = "Dictionary(object object)";
			else
				declaredTypeName = "object";
		if (options.useMetadata && typeName != null && !VDF.GetIsTypeAnonymous(typeName) &&
		(
			(options.typeMarking == VDFTypeMarking.Internal && !VDF.GetIsTypePrimitive(typeName) && typeName != declaredTypeName) ||
			(options.typeMarking == VDFTypeMarking.External && !VDF.GetIsTypePrimitive(typeName) && (typeName != declaredTypeName || !declaredTypeInParentVDF)) ||
			options.typeMarking == VDFTypeMarking.ExternalNoCollapse
		))
			result.metadata = typeName;

		if (options.useChildPopOut && typeInfo && typeInfo.typeTag && typeInfo.typeTag.popOutL1)
			result.childPopOut = true;

		if (obj && obj.VDFPostSerialize)
			obj.VDFPostSerialize(parent, prop, options);

		return result;
	}
}