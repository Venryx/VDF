class VDFTypeInfo
{
	static Get(vTypeName: string): VDFTypeInfo { return (window[vTypeName] || {}).typeInfo || new VDFTypeInfo(); }

	props_includeL1: boolean;
	popOutChildren: boolean;
	propInfoByName: Object;
	constructor(props_includeL1?: boolean, popOutChildren?: boolean, propInfoByPropName?: Object)
	{
		this.props_includeL1 = props_includeL1;
		this.popOutChildren = popOutChildren;
		this.propInfoByName = propInfoByPropName || {};
	}
	//SetPropInfo(propName: string, propInfo: VDFPropInfo) { this.propInfoByName[propName] = propInfo; }
}

class VDFPropInfo
{
	propVTypeName: string;
	includeL2: boolean;
	popOutChildren: boolean;
	writeEmptyValue: boolean;
	constructor(propType: string, includeL2: boolean = true, popOutChildren?: boolean, writeEmptyValue: boolean = true)
	{
		this.propVTypeName = propType;
		this.includeL2 = includeL2;
		this.popOutChildren = popOutChildren;
		this.writeEmptyValue = writeEmptyValue;
	}

	IsXValueEmpty(x: any)
	{
		if (x == null) // if null
			return true;
		if (x === false || x === 0) // if struct, and equal to struct's default value
			return true;
		var vTypeName = VDF.GetVTypeNameOfObject(x);
		if (vTypeName && vTypeName.startsWith("List[") && x.length == 0) // if list, and empty
			return true;
		if (vTypeName == "string" && !x.length) // if string, and empty
			return true;
		return false;
	}
}