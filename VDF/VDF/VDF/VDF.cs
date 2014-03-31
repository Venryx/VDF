using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;

static class VDF
{
	static Dictionary<Type, Func<object, string>> typeExporters_inline = new Dictionary<Type, Func<object, string>>();
	static Dictionary<Type, Func<string, object>> typeImporters_inline = new Dictionary<Type, Func<string, object>>();
	public static void RegisterTypeExporter_Inline<T>(Func<T, string> exporter) { typeExporters_inline[typeof(T)] = obj=>exporter((T)obj); }
	public static void RegisterTypeImporter_Inline<T>(Func<string, T> importer) { typeImporters_inline[typeof(T)] = str=>importer(str); }

	public static string ToVDF(object obj, bool asInlineData = true, int indentDepth = 0)
	{
		var builder = new StringBuilder();
		var indentedDataLineGroups = new List<string>();

		var type = obj.GetType();
		if (asInlineData)
		{
			if (typeExporters_inline.ContainsKey(type))
				builder.Append(typeExporters_inline[type](obj));
			else if (type == typeof (float) || type == typeof (double))
				builder.Append(obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj);
			else if (type.IsPrimitive || type == typeof(string))
				builder.Append(obj);
			else if (obj is IList)
			{
				var objAsList = (IList)obj;
				int index = 0;
				foreach (object item in objAsList)
				{
					builder.Append(index == 0 ? "" : "|");
					if (type.IsGenericType && item.GetType() != type.GetGenericArguments()[0]) // if List item is of a type *derived* from the List's base type
						builder.AppendFormat("<{0}>", item.GetType().Name);
					builder.Append(ToVDF(item, true, indentDepth));
					index++;
				}
			}
			else
			{
				var typeInfo = VDFTypeInfo.Get(type);
				foreach (string name in typeInfo.propInfoByName.Keys)
				{
					VDFPropInfo propInfo = typeInfo.propInfoByName[name];
					bool include = typeInfo.props_includeL1;
					include = propInfo.includeL2.HasValue ? propInfo.includeL2.Value : include;
					if (!include)
						continue;

					object propValue = propInfo.GetValue(obj);
					if (propInfo.IsXIgnorableValue(propValue))
						continue;

					if (propInfo.inlineData)
						builder.AppendFormat("{0}{{{1}}}", name, ToVDF(propValue, true, indentDepth));
					else
					{
						builder.AppendFormat("{0}{{#}}", name);
						indentedDataLineGroups.Add(ToVDF(propValue, false, indentDepth + 1)); // note; indent depth only increases for an object marked with "indentData:true"
					}
				}
			}
		}
		else
		{
			var indentStringBuilder = new StringBuilder();
			for (int i = 0; i < indentDepth; i++)
				indentStringBuilder.Append("\t");

			if (type == typeof (float) || type == typeof (double))
				builder.Append(indentStringBuilder).Append(obj.ToString().StartsWith("0.") ? obj.ToString().Substring(1) : obj);
			else if (type.IsPrimitive || type == typeof(string))
				builder.Append(indentStringBuilder).Append(obj);
			else if (obj is IList)
			{
				var objAsList = (IList)obj;
				int index = 0;
				foreach (object item in objAsList)
				{
					builder.Append(index == 0 ? "" : "\n").Append(indentStringBuilder);
					if (type.IsGenericType && item.GetType() != type.GetGenericArguments()[0]) // if List item is of a type *derived* from the List's base type
						builder.AppendFormat("<{0}>", item.GetType().Name);
					builder.Append(ToVDF(item, true, indentDepth));
					index++;
				}
			}
			else
			{
				var typeInfo = VDFTypeInfo.Get(type);
				foreach (string name in typeInfo.propInfoByName.Keys)
				{
					VDFPropInfo propInfo = typeInfo.propInfoByName[name];
					bool include = typeInfo.props_includeL1;
					include = propInfo.includeL2.HasValue ? propInfo.includeL2.Value : include;
					if (!include)
						continue;

					object propValue = propInfo.GetValue(obj);
					if (propInfo.IsXIgnorableValue(propValue))
						continue;

					builder.Append(name == typeInfo.propInfoByName.Keys.First() ? "" : "\n").Append(indentStringBuilder);
					if (propInfo.inlineData)
						builder.AppendFormat("{0}{{{1}}}", name, ToVDF(propValue, true, indentDepth));
					else
					{
						builder.AppendFormat("{0}{{#}}", name);
						indentedDataLineGroups.Add(ToVDF(propValue, false, indentDepth + 1)); // note; indent depth only increases for an object marked with "indentData:true"
					}
				}
			}
		}

		foreach (string indentedDataLineGroup in indentedDataLineGroups)
		{
			string finalIndentedDataLineGroup = indentedDataLineGroup;
			if (indentedDataLineGroup != indentedDataLineGroups[0]) // if not the first group, add a hash-char to mark our start
			{
				int firstNonTabCharIndex = -1;
				for (int i = 0; i < indentedDataLineGroup.Length && firstNonTabCharIndex == -1; i++)
					if (indentedDataLineGroup[i] != '\t')
						firstNonTabCharIndex = i;
				finalIndentedDataLineGroup = indentedDataLineGroup.Substring(0, firstNonTabCharIndex) + "#" + indentedDataLineGroup.Substring(firstNonTabCharIndex);
			}
			builder.Append("\n").Append(finalIndentedDataLineGroup); 
		}
		return builder.ToString();
	}
	public static T FromVDF<T>(string vdf)
	{
		return default(T);
	}
}