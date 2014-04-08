var V = new function()
{
	/*function AddClosureFunctionsToX(newHolder)
	 {
	 var names = arguments.callee.caller.toString().matches(/function\s*([\w\d]+)\s*\(/g);
	 for (var name in names.strings())
	 try { newHolder[name] = eval(name); } catch(e) {}
	 }
	 AddClosureFunctionsToX(this);*/

	this.CloneObject = function(obj) { return $.extend({}, obj); }; //deep: JSON.parse(JSON.stringify(obj));
	this.CloneArray = function(array) { return Array.prototype.slice.call(array, 0); }; //array.slice(0); //deep: JSON.parse(JSON.stringify(array));
	this.IsEqual = function(a, b)
	{
		function _equals(a, b) { return JSON.stringify(a) === JSON.stringify($.extend(true, {}, a, b)); }
		return _equals(a, b) && _equals(b, a);
	};

	this.CallXAtDepthY = function(func, depth)
	{
		var currentCallPackage = function() { func(); };
		for (var i = 1; i < depth; i++)
			currentCallPackage = function() { currentCallPackage(); };
		currentCallPackage();
	};

	this.FormatString = function(str /*params:*/)
	{
		var result = str;
		for (var i = 0; i < arguments.length - 1; i++)
		{
			var reg = new RegExp("\\{" + i + "\\}", "gm");
			result = result.replace(reg, arguments[i + 1]);
		}
		return result;
	};
	this.CapitalizeWordsInX = function(str)
	{
		var result = str.replace(/(^|\W)(\w)/g, function(match) { return match.toUpperCase(); });
		var lowercaseWords = // words that are always lowercase (in titles)
			[
				"a", "aboard", "about", "above", "across", "after", "against", "along", "alongside", "amid", "amidst", "among", "amongst", "an", "and", "around", "as", "aside", "astride", "at", "atop",
				"before", "behind", "below", "beneath", "beside", "besides", "between", "beyond", "but", "by", "despite", "during", "except",
				"for", "from", "given", "in", "inside", "into", "minus", "notwithstanding", "of", "off", "on", "onto", "opposite", "or", "out", "over",
				"per", "plus", "regarding", "sans", "since", "than", "through", "throughout", "till", "toward", "towards",
				"under", "underneath", "unlike", "until", "unto", "upon", "versus", "via", "with", "within", "without", "yet"
			];
		lowercaseWords.pushAll(["to"]); // words that are overwhelmingly lowercase
		result = result.replace(new RegExp("(\\s)(" + lowercaseWords.join("|") + ")(\\s|$)", "gi"), function(match) { return match.toLowerCase(); }); // case-insensitive, search-and-make-lowercase call
		return result;
	}
	this.Multiline = function(functionWithInCommentMultiline) { return functionWithInCommentMultiline.toString().replace(/^[^\/]+\/\*!?/, '').replace(/\*\/[^\/]+$/, ''); };

	this.StableSort = function(array, compare) // needed for Chrome
	{
		var array2 = array.map(function(obj, index) { return { index: index, obj: obj } });
		array2.sort(function(a, b)
		{
			var r = compare(a.obj, b.obj);
			return r != 0 ? r : V.Compare(a.index, b.index);
		});
		return array2.map(function(pack) { return pack.obj; });
	};
	this.Compare = function(a, b) { return a < b ? -1 : (a > b ? 1 : 0); };

	this.GetAbsolutePath = function(path)
	{
		var a = $("<a>").attr("href", path);
		return a[0].protocol + "//" + a[0].host + a[0].pathname + a[0].search + a[0].hash;
	};

	this.GetScreenCenter = function() { return $("#screenCenter").offset(); };
	this.GetScreenWidth = function() { return $("body").width(); }
	this.GetScreenHeight = function() { return $("body").height(); }

	this.ShowLoadingScreen = function(message)
	{
		if (window.loadingScreen == null)
		{
			LoadPanelAsOverlay("Loading", function()
			{
				loadingScreen.Show(message);
			});
		}
		else
			loadingScreen.Show(message);
	};
	this.HideLoadingScreen = function(message) { loadingScreen.Hide(); };

	this.GetContentHeight = function(content)
	{
		var holder = $("<div style='position: absolute; left: -1000; top: -1000; width: 1000; height: 1000; overflow: hidden;'>").appendTo("body");
		var contentClone = content.clone();
		holder.append(contentClone);
		var height = contentClone.outerHeight();
		holder.remove();
		return height;
	};

	this.GetObjectsWithKey_AsMap = function(keyToFind, /*;optional:*/ rootObj, maxDepth, currentDepth)
	{
		rootObj = rootObj || window;
		maxDepth = maxDepth != null ? maxDepth : 10;
		currentDepth = currentDepth != null ? currentDepth : 0;

		var result = {};
		for (var key in rootObj)
			if (key == keyToFind)
				result[key] = "FOUND_HERE";
			else if (rootObj[key] instanceof Object && currentDepth < maxDepth && rootObj[key] != window)
			{
				var matchingDescendantMap = V.GetObjectsWithKey_AsMap(keyToFind, rootObj[key], maxDepth, currentDepth + 1);
				if (matchingDescendantMap)
					result[key] = matchingDescendantMap;
			}
		return result.Keys().length ? result : null;
	};

	this.GetDescendants = function(rootObj, /*;optional:*/ matchFunc, keyMatchFunc, maxCount, maxDepth, currentDepth, parentObjects)
	{
		matchFunc = matchFunc || function(child) { return child instanceof Object; };
		keyMatchFunc = keyMatchFunc || function(child) { return true; };
		maxCount = maxCount || Number.MAX_VALUE;
		maxDepth = maxDepth != null ? maxDepth : Number.MAX_VALUE;
		currentDepth = currentDepth != null ? currentDepth : 0;
		parentObjects = parentObjects || [];

		var result = [];
		for (var key in rootObj)
		{
			var child = rootObj[key];
			if (!keyMatchFunc(key) || parentObjects.contains(child)) // no loop-backs
				continue;

			if (matchFunc(child) && result.length < maxCount)
				result.push(child);
			if (result.length < maxCount && child != rootObj && currentDepth < maxDepth)
			{
				var matchingDescendants = V.GetDescendants(child, matchFunc, keyMatchFunc, maxCount, maxDepth, currentDepth + 1, parentObjects.concat([child]));
				for (var i in matchingDescendants)
					if (result.length < maxCount)
						result.push(matchingDescendants[i]);
			}
		}
		return result;
	};
};