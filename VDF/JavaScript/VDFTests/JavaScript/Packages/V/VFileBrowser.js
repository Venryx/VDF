VFileBrowser = function(options)
{
	var self = this;

	// setup
	// ==================

	var root = $("<div class='VFileBrowser' style='display: none;'>").appendTo($("body"));
	if (options.title)
		root.attr("title", options.title);

	var style = $("<style>.selectedNodeBox { background: rgba(255,255,255,.3) !important; } .selectedNodeBox .selectHighlight { opacity: .75 !important; }</style>").appendTo(root);

	var div = $("<div style='position: absolute; left: 0; right: 0; top: 0; bottom: 0;'>").appendTo(root);

	var topBar = $("<div style='height: 28; border: solid #555; border-width: 0 0 2px 0;'>").appendTo(div);
	var topBarDiv = $("<div class='borderBox' style='float: left; width: 100%;'>").appendTo(topBar); //padding-right: 150;
	var pathNodes = $("<div/>").appendTo(topBarDiv);
	//var topBarDiv2 = $("<div style='position: absolute; top: 0; right: 0;'>").appendTo(topBar);
	//var search = $("<input type='text' style='margin-top: 2; margin-right: 2; width: 150; opacity: .75;'/>").appendTo(topBarDiv2);

	var bottomBar = $("<div style='position: absolute; top: 28; bottom: 0; left: 0; right: 0;'>").appendTo(div);
	var nodes = $("<div style='height: 100%; background: rgba(0,0,0,.3);'/>").appendTo(bottomBar);

	var open = false;
	root.dialog(
	{
		autoOpen: false,
		resizable: true,
		minWidth: 400,
		width: 600,
		minHeight: 300,
		height: 400,
		modal: true,
		buttons:
		{
			OK: function()
			{
				self.Close(true);
			},
			Cancel: function()
			{
				self.Close(false);
			}
		},
		beforeClose: function(event, ui)
		{
			if (open) // if called by close button
				self.Close(false);
		}
	});

	// process rootFolderNode data
	options.rootFolderNode.path = "";
	options.rootFolderNode.name = "";
	var foldersLeftToProcess = [options.rootFolderNode];
	while (foldersLeftToProcess.length)
	{
		var currentFolder = foldersLeftToProcess.splice(0, 1)[0];
		for (var name in currentFolder.folders)
		{
			var folder = currentFolder.folders[name];
			folder.path = currentFolder.path ? (currentFolder.path + "/" + name) : name;
			folder.name = name;
			foldersLeftToProcess.push(folder);
		}
		for (var name in currentFolder.files)
		{
			var file = currentFolder.files[name];
			file.path = currentFolder.path ? (currentFolder.path + "/" + name) : name;
			file.name = name;
		}
	}

	// ui setup
	// ==================

	nodes.mousedown(function(event, ui)
	{
		if(event.target != this)
			return;

		$(".selectedNodeBox").removeClass("selectedNodeBox");
	});
	nodes.on("mousedown", "> div", function(event, ui)
	{
		SelectNodeBox($(this));
	});
	nodes.on_doubleClick("> div", function(event, ui)
	{
		var node = this.node;
		var isFolder = node.folders;
		if (isFolder)
			LoadFolder(node.path);
	});

	// variables: live
	// ==================

	var liveFolder;

	// methods: live
	// ==================

	function SelectNodeBox(box)
	{
		$(".selectedNodeBox").removeClass("selectedNodeBox");
		box.addClass("selectedNodeBox");
	}

	function GetNode(path)
	{
		var parts = path.split("/");
		var currentFolderNode = options.rootFolderNode;
		for (var i = 0; i < parts.length && currentFolderNode && parts[i].length; i++)
			currentFolderNode = currentFolderNode.folders[parts[i]] || currentFolderNode.files[parts[i]];
		return currentFolderNode;
	}

	function CreatePathNodeBox(path, name)
	{
		var div = $("<div class='button' style='display: inline-block; vertical-align: middle;'/>");
		div[0].path = path;

		var isRoot = !name;
		if (isRoot)
			div.addClass("button-icon").css({width: 26, height: 26, backgroundImage: "url(../Images/Buttons/Home.png)", backgroundSize: 26});
		else
			div.css("margin-left", 3);

		div.html(name);
		div.click(function(event, ui)
		{
			LoadFolder(div[0].path);
		});

		return div;
	}
	function CreateNodeBox(node)
	{
		var box = $("<div style='position: relative; display: inline-block; width: 70; height: 70; margin: 5; background: rgba(255, 255, 255, .05); border-radius: 10px; border: 1px solid transparent;'>");
		box[0].node = node;

		var isFolder = node.folders;
		if (isFolder)
		{
			var div = $("<div style='width: 100%; height: 100%;'/>").appendTo(box);

			box.attr("style", box.attr("style").replace("background: rgba(255, 255, 255, .05);", "background: none !important;"))
			var img = $("<img class='selectHighlight' style='position: absolute; left: -1; top: -1; width: 70; height: 80; border-radius: 10px; border: 1px solid transparent; opacity: .5;' src='../Images/Folder2.png'/>").appendTo(div);

			var div2 = $("<div style='display: table-cell; text-align: center; vertical-align: bottom; padding: 2; width: 70; height: 70; cursor: default; position: relative; z-index: 1;'/>").appendTo(div);
			var div3 = $("<div style='width: 66; white-space: pre-line; word-wrap: break-word; font-size: 12;'>").appendTo(div2);
			if (node.name != "")
				div3.html(node.name);
		}
		else
		{
			var div = $("<div style='width: 100%;'/>").appendTo(box);

			var img = $("<img style='position: absolute; left: -1; top: -1; width: 70; height: 70; border-radius: 10px; border: 1px solid transparent; opacity: .75; display: none;'/>").appendTo(div);
			var filePath = designer.GetLivePackFolder_UI() + node.path;
			var fileExtension = filePath.match(/\.([^.]+)$/)[1];
			if (["jpg", "bmp", "png"].contains(fileExtension))
				$.get(filePath).done(function()
				{
					img.css("display", "").attr("src", filePath);
				});

			var div2 = $("<div style='display: table-cell; text-align: center; vertical-align: bottom; padding: 2; width: 70; height: 70; cursor: default; position: relative; z-index: 1;'/>").appendTo(div);
			var div3 = $("<div style='width: 66; white-space: pre-line; word-wrap: break-word; font-size: 12;'>").appendTo(div2);
			if (node.name != "")
				div3.html(node.name);
		}

		return box;
	}

	function LoadFolder(folder)
	{
		var folderNode = GetNode(folder);
		if (!folderNode) // non-existent folder
		{
			folder = "";
			folderNode = options.rootFolderNode;
		}

		pathNodes.html("");
		CreatePathNodeBox("", "").appendTo(pathNodes);

		var pathFolderNames = folder.split("/").filter(function() { return this.length; });
		var fullPath = "";
		for (var name in pathFolderNames.strings())
		{
			fullPath += (fullPath.length > 0 ? "/" : "") + name ;
			var folderNodeBox = CreatePathNodeBox(fullPath, name);
			pathNodes.append(folderNodeBox);
		}

		var foldersAndFiles = folderNode.folders.CopyXChildrenToClone(folderNode.files);
		nodes.html("");
		for (var name in foldersAndFiles)
		{
			var node = foldersAndFiles[name];
			var box = CreateNodeBox(node);
			nodes.append(box);
		}
	}

	function GetSelectedNode() { return GetSelectedNodeBox() ? GetSelectedNodeBox()[0].node : null; }
	function GetSelectedNodeBox() { return $(".selectedNodeBox").length ? $(".selectedNodeBox") : null; }

	// startup
	// ==================

	// if liveFolder doesn't exist, reset liveFolder and liveNode
	if (!GetNode(options.liveFolder))
	{
		options.liveFolder = "";
		options.liveNode = null;
	}
	LoadFolder(options.liveFolder);
	nodes.children().each(function()
	{
		if (this.node.name == options.liveNode)
			SelectNodeBox($(this));
	});

	this.GetRoot = function()
	{
		return root;
	};
	this.Open = function()
	{
		open = true;
		root.css("display", "");
		root.dialog("open");
	};
	this.Close = function(success)
	{
		if (options.preClose && options.preClose(success) === false)
			return;
		open = false;
		root.dialog("close");
		root.remove();
	};
	this.GetSelectedPath = function()
	{
		var result = null;

		var selectedNodeBox = GetSelectedNodeBox();
		if (selectedNodeBox && (!selectedNodeBox[0].node.folders || options.acceptFolders !== false))
			result = GetSelectedNode().path;

		return result;
	};
};