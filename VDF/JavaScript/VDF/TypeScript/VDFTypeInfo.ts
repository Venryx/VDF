class VDFType
{
	propIncludeRegexL1: string;
	popOutL1: boolean;
	constructor(propIncludeRegexL1?: string, popOutL1?: boolean)
	{
		this.propIncludeRegexL1 = propIncludeRegexL1;
		this.popOutL1 = popOutL1;
	}

	AddDataOf(typeTag: VDFType)
	{
		if (typeTag.propIncludeRegexL1 != null)
			this.propIncludeRegexL1 = typeTag.propIncludeRegexL1;
		if (typeTag.popOutL1 != null)
			this.popOutL1 = typeTag.popOutL1;
	}
}
class VDFTypeInfo
{
	static Get(typeName: string): VDFTypeInfo
	{
		var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
		if (VDF.GetIsTypeAnonymous(typeNameBase))
		{
			var result = new VDFTypeInfo();
			result.typeTag = new VDFType(VDF.PropRegex_Any);
			return result;
		}

		if (window[typeNameBase] && window[typeNameBase].typeInfo == null)
		{
			var result = new VDFTypeInfo();
			result.typeTag = new VDFType();

			/*var typeTag = new VDFType();
			var currentTypeName = typeNameBase;
			while (window[currentTypeName]) //true)
			{
				if (window[currentTypeName].typeInfo.typeTag)
					for (var key in window[currentTypeName].typeInfo.typeTag)
						if (typeTag[key] == null)
							typeTag[key] = window[currentTypeName].typeInfo.typeTag[key];

				if (window[currentTypeName].prototype && window[currentTypeName].prototype.__proto__) // if has base-type
					currentTypeName = window[currentTypeName].prototype.__proto__.constructor.name; // set current-type-name to base-type's name
				else
					break;
			}
			result.typeTag = typeTag;*/

			var currentType = typeNameBase;
			while (currentType != null)
			{
				var typeTag2 = (window[currentType].typeInfo || {}).typeTag;
				for (var key in typeTag2)
					if (result.typeTag[key] == null)
						result.typeTag[key] = typeTag2[key];
				currentType = window[currentType].prototype && window[currentType].prototype.__proto__ && window[currentType].prototype.__proto__.constructor.name;
			}

			window[typeNameBase].typeInfo = result;
		}

		return window[typeNameBase] && window[typeNameBase].typeInfo;
	}

	props = {};
	tags: any[];
	typeTag: VDFType;
}

class VDFProp
{
	includeL2: boolean;
	writeDefaultValue: boolean;
	popOutL2: boolean;
	constructor(includeL2 = true, writeDefaultValue = true, popOutL2?: boolean)
	{
		this.includeL2 = includeL2;
		this.writeDefaultValue = writeDefaultValue;
		this.popOutL2 = popOutL2;
	}
}
class VDFPropInfo
{
	propName: string;
	propTypeName: string;
	tags: any[];
	propTag: VDFProp;
	constructor(propName: string, propType: string, tags: any[], propTag: VDFProp)
	{
		this.propName = propName;
		this.propTypeName = propType;
		this.tags = tags;
		this.propTag = propTag;
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

class VDFMethodInfo
{
	tags: any[];
	constructor(tags: any[]) { this.tags = tags; }
}