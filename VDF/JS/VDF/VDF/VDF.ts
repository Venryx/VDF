module VDF
{
	function LoadJSFile(path: string)
	{
		var script = document.createElement('script');
		script.setAttribute("src", path);
		$("head")[0].appendChild(script);
	}
	LoadJSFile("../VDF/VDFExtensions.js");
	LoadJSFile("../VDF/VDFTypeInfo.js");
	LoadJSFile("../VDF/VDFNode.js");
	LoadJSFile("../VDF/VDFSaver.js");
	LoadJSFile("../VDF/VDFLoader.js");
	LoadJSFile("../VDF/VDFTokenParser.js");

	export function Serialize(obj: any, saveOptions?: VDFSaveOptions): string
	{
		return VDFSaver.ToVDFNode(obj, saveOptions).ToString();
	}
	/*export function Deserialize<T>(vdf: string, loadOptions?: VDFLoadOptions): string
	{
		return VDFLoader.ToVDFNode(vdf, loadOptions).ToObject<T>(options);
	}*/
}