class VDFTypeInfo
{
	props_includeL1: boolean;
	propInfoByPropName: Map<string, VDFPropInfo> = new Map<string, VDFPropInfo>();
	constructor(props_includeL1?: boolean)
	{
		this.props_includeL1 = props_includeL1;
	}
	SetPropInfo(propName: string, propInfo: VDFPropInfo)
	{
		this.propInfoByPropName.set(propName, propInfo);
	}
}

class VDFPropInfo
{
	propType: string;
	includeL2: boolean;
	popOutItemsToOwnLines: boolean;
	ignoreEmptyValue: boolean;
	constructor(propType: string, includeL2?: boolean, popOutItemsToOwnLines?: boolean, ignoreEmptyValue?: boolean)
	{
		this.propType = propType;
		this.includeL2 = includeL2;
		this.popOutItemsToOwnLines = popOutItemsToOwnLines;
		this.ignoreEmptyValue = ignoreEmptyValue;
	}

	IsXIgnorableValue(x: any)
	{
		if (this.ignoreEmptyValue && x.GetTypeName() == "Array" && x.length == 0)
			return true;
		if (x === false || x === 0) // if equal to type's default value
			return true;
		return x == null;
	}
}