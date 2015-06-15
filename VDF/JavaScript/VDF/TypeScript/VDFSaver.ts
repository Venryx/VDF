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
	static ToVDFNode(obj: any, declaredTypeName?: string, options?: VDFSaveOptions, path?: VDFNodePath, declaredTypeFromParent?: boolean): VDFNode;
	static ToVDFNode(obj: any, declaredTypeName_orOptions?: any, options = new VDFSaveOptions(), path?: VDFNodePath, declaredTypeInParentVDF?: boolean): VDFNode
	{
		if (declaredTypeName_orOptions instanceof VDFSaveOptions)
			return VDFSaver.ToVDFNode(obj, null, declaredTypeName_orOptions);

		var declaredTypeName: string = declaredTypeName_orOptions;

		path = path || new VDFNodePath(new VDFNodePathNode(obj));

		var typeName = obj != null ? (EnumValue.IsEnum(declaredTypeName) ? declaredTypeName : VDF.GetTypeNameOfObject(obj)) : null; // at bottom, enums an integer; but consider it of a distinct type
		var typeGenericArgs = VDF.GetGenericArgumentsOfType(typeName);
		var typeInfo = typeName ? VDFTypeInfo.Get(typeName) : new VDFTypeInfo();

		for (var propName in VDF.GetObjectProps(obj))
			if (obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(a=>a instanceof VDFPreSerialize))
			{
				if (obj[propName](path, options) == VDF.CancelSerialize)
					return VDF.CancelSerialize;
			}

		var result;
		var serializedByCustomMethod = false;
		for (var propName in VDF.GetObjectProps(obj))
			if(obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(a=>a instanceof VDFSerialize))
			{
				var serializeResult = obj[propName](path, options);
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
					var itemNode = VDFSaver.ToVDFNode(objAsList[i], typeGenericArgs[0], options, path.ExtendAsListChild(i, objAsList[i]), true);
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
					var valueNode = VDFSaver.ToVDFNode(objAsDictionary[key], typeGenericArgs[1], options, path.ExtendAsMapChild(key, objAsDictionary[key]), true);
					if (valueNode == VDF.CancelSerialize)
						continue;
					result.SetMapChild(VDFSaver.ToVDFNode(key, typeGenericArgs[0], options, path, true).primitiveValue, valueNode);
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

						var childPath = path.ExtendAsChild(propInfo, propValue);
						var canceled = false;
						for (var propName2 in VDF.GetObjectProps(obj))
							if (obj[propName2] instanceof Function && obj[propName2].tags && obj[propName2].tags.Any(a=>a instanceof VDFPreSerializeProp))
								if (obj[propName2](path, options) == VDF.CancelSerialize)
									canceled = true;
						if (canceled)
							continue;
					
						var propValueNode = VDFSaver.ToVDFNode(propValue, propInfo ? propInfo.typeName : null, options, childPath);
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

		for (var propName in VDF.GetObjectProps(obj))
			if(obj[propName] instanceof Function && obj[propName].tags && obj[propName].tags.Any(a=>a instanceof VDFPostSerialize))
				obj[propName](result, path, options);

		return result;
	}
}