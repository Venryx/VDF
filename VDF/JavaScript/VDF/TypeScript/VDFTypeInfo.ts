class VDFTypeInfo
{
	static Get(typeName: string): VDFTypeInfo
	{
		if (VDF.GetIsTypeAnonymous(typeName))
			return new VDFTypeInfo(null, VDF.PropRegex_Any);

		var result = new VDFTypeInfo(null, null, null);
		result.props = null;
		var currentTypeName = typeName;
		while (window[currentTypeName]) //true)
		{
			if (window[currentTypeName].typeInfo)
				for (var key in window[currentTypeName].typeInfo)
					if (result[key] == null)
						result[key] = window[currentTypeName].typeInfo[key];

			if (window[currentTypeName].prototype && window[currentTypeName].prototype.__proto__) // if has base-type
				currentTypeName = window[currentTypeName].prototype.__proto__.constructor.name; // set current-type-name to base-type's name
			else
				break;
		}
		result.props = result.props || {};
		return result;
	}

	props: any;
	propIncludeRegexL1: string;
	childPopOutL1: boolean;
	constructor(props?: any, propIncludeRegexL1?: string, childPopOutL1?: boolean)
	{
		this.props = props || {};
		this.propIncludeRegexL1 = propIncludeRegexL1;
		this.childPopOutL1 = childPopOutL1;
	}
	//SetPropInfo(propName: string, propInfo: VDFPropInfo) { this.propInfoByName[propName] = propInfo; }
}

class VDFPropInfo
{
	propTypeName: string;
	includeL2: boolean;
	popOutL2: boolean;
	writeDefaultValue: boolean;

	constructor(propType: string, includeL2?: boolean, popOutL2?: boolean, writeDefaultValue: boolean = true)
	{
		this.propTypeName = propType;
		this.includeL2 = includeL2;
		this.popOutL2 = popOutL2;
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