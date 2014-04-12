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
	popOutItemsToOwnLines: boolean;
	ignoreEmptyValue: boolean;
	constructor(propType: string, includeL2?: boolean, popOutItemsToOwnLines?: boolean, ignoreEmptyValue?: boolean)
	{
		this.propVTypeName = propType;
		this.includeL2 = includeL2;
		this.popOutItemsToOwnLines = popOutItemsToOwnLines;
		this.ignoreEmptyValue = ignoreEmptyValue;
	}

	IsXIgnorableValue(x: any)
	{
		if (this.ignoreEmptyValue && VDF.GetVTypeNameOfObject(x).startsWith("List[") && x.length == 0)
			return true;
		if (x === false || x === 0) // if equal to type's default value
			return true;
		return x == null;
	}
}