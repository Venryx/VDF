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
	static Get(type_orTypeName: any): VDFTypeInfo
	{
		//var type = type_orTypeName instanceof Function ? type_orTypeName : window[type_orTypeName];
		var typeName = type_orTypeName instanceof Function ? type_orTypeName.name : type_orTypeName;

		var typeNameBase = typeName.Contains("(") ? typeName.substr(0, typeName.indexOf("(")) : typeName;
		if (VDF.GetIsTypeAnonymous(typeNameBase))
		{
			var result = new VDFTypeInfo();
			result.typeTag = new VDFType(VDF.PropRegex_Any);
			return result;
		}

		var typeBase = window[typeNameBase];
		if (typeBase && typeBase.typeInfo == null)
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

			typeBase.typeInfo = result;
		}

		return typeBase && typeBase.typeInfo;
	}

	props = {};
	tags: any[];
	typeTag: VDFType;

	GetProp(propName: string): VDFPropInfo
	{
		if (!(propName in this.props))
			this.props[propName] = new VDFPropInfo(propName, null, [], null);
		return this.props[propName];
	}
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
	name: string;
	typeName: string;
	tags: any[];
	propTag: VDFProp;
	constructor(propName: string, propTypeName: string, tags: any[], propTag: VDFProp)
	{
		this.name = propName;
		this.typeName = propTypeName;
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

class VDFPreSerializeProp {}

class VDFPreSerialize {}
class VDFSerialize {}
class VDFPostSerialize {}
class VDFPreDeserialize {}
class VDFDeserialize
{
	fromParent: boolean;
	constructor(fromParent = false) { this.fromParent = fromParent; }
}
class VDFPostDeserialize {}
/*class VDFMethodInfo
{
	tags: any[];
	constructor(tags: any[]) { this.tags = tags; }
}*/