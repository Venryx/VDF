class VDFTypeInfo
{
	props_includeL1: boolean;
	propInfoByPropName: Object;
	constructor(props_includeL1?: boolean, propInfoByPropName?: Object)
	{
		this.props_includeL1 = props_includeL1;
		this.propInfoByPropName = propInfoByPropName || {};
	}
	SetPropInfo(propName: string, propInfo: VDFPropInfo)
	{
		this.propInfoByPropName[propName] = propInfo;
	}
}

class VDFPropInfo
{
	propVTypeName: string;
	includeL2: boolean;
	popDataOutOfLine: boolean;
	writeEmptyValue: boolean;
	constructor(propType: string, includeL2?: boolean, popDataOutOfLine?: boolean, writeEmptyValue: boolean = true)
	{
		this.propVTypeName = propType;
		this.includeL2 = includeL2;
		this.popDataOutOfLine = popDataOutOfLine;
		this.writeEmptyValue = writeEmptyValue;
	}

	IsXValueEmpty(x: any)
	{
		if (x == null) // if null
			return true;
		if (x === false || x === 0) // if struct, and equal to struct's default value
			return true;
		if (VDF.GetVTypeNameOfObject(x).startsWith("List[") && x.length == 0) // if list, and empty
			return true;
		return false;
	}
}