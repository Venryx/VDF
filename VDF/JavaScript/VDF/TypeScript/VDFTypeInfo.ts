class VDFTypeInfo
{
	static Get(typeName: string): VDFTypeInfo
	{
		if (VDF.GetIsTypeAnonymous(typeName))
			return new VDFTypeInfo(null, true);
		return (window[typeName] || {}).typeInfo || new VDFTypeInfo();
	}

	propInfoByName: any;
	props_includeL1: boolean;
	popOutChildrenL1: boolean;
	constructor(propInfoByName?: any, props_includeL1?: boolean, popOutChildrenL1?: boolean)
	{
		this.propInfoByName = propInfoByName || {};
		this.props_includeL1 = props_includeL1;
		this.popOutChildrenL1 = popOutChildrenL1;
	}
	//SetPropInfo(propName: string, propInfo: VDFPropInfo) { this.propInfoByName[propName] = propInfo; }
}

class VDFPropInfo
{
	propTypeName: string;
	includeL2: boolean;
	popOutChildrenL2: boolean;
	writeDefaultValue: boolean;
	constructor(propType: string, includeL2: boolean = true, popOutChildrenL2: boolean = false, writeDefaultValue: boolean = true)
	{
		this.propTypeName = propType;
		this.includeL2 = includeL2;
		this.popOutChildrenL2 = popOutChildrenL2;
		this.writeDefaultValue = writeDefaultValue;
	}

	IsXValueTheDefault(x: any)
	{
		if (x == null) // if null
			return true;
		if (x === false || x === 0) // if struct, and equal to struct's default value
			return true;
		/*var typeName = VDF.GetTypeNameOfObject(x);
		if (typeName && typeName.startsWith("List(") && x.length == 0) // if list, and empty
			return true;
		if (typeName == "string" && !x.length) // if string, and empty
			return true;*/
		return false;
	}
}