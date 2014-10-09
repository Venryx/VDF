var VMessageBox = new function()
{
	this.defaultCenterTo = null;
	this.ShowMessageBox = function(options) // message, /*;optional:*/ title, modal, onOKCallback, okLabel, centerTo
	{
		options.modal = options.modal != null ? options.modal : true;
		options.okLabel = options.okLabel || "OK";
		options.centerTo = options.centerTo || self.defaultCenterTo;

		var dialogBox = $("<div style='padding: 10 0; cursor: default;'>");
		dialogBox.html(options.message);

		var contentHeight = V.GetContentHeight(dialogBox);
		var dialogOptions =
		{
			autoOpen: false,
			buttons: {},
			close: function(event, ui)
			{
				if (options.onOKCallback)
					options.onOKCallback();
				$(this).remove();
			},
			resizable: false,
			title: options.title,
			modal: options.modal,
			minHeight: contentHeight + 76.5,
			maxHeight: contentHeight + 76.5
		};
		dialogOptions.buttons[options.okLabel] = function() { $(this).dialog("close"); };
		$.extend(dialogOptions, options.dialogOptions);

		dialogBox.dialog(dialogOptions);
		dialogBox.dialog("open");
		if (options.centerTo)
			dialogBox.parent().position({my: 'center', at: 'center', of: options.centerTo});
	};
	this.ShowConfirmationBox = function(options) // message, /*;optional:*/ title, modal, onOKCallback, onCancelCallback, okLabel, cancelLabel, centerTo
	{
		options.modal = options.modal != null ? options.modal : true;
		options.okLabel = options.okLabel || "OK";
		options.cancelLabel = options.cancelLabel || "Cancel";
		options.centerTo = options.centerTo || self.defaultCenterTo;

		var dialogBox = $("<div style='padding: 10 0; cursor: default;'>");
		dialogBox.html(options.message);

		var contentHeight = V.GetContentHeight(dialogBox);
		var dialogOptions =
		{
			autoOpen: false,
			buttons: {},
			close: function(event, ui)
			{
				if (options.onCancelCallback)
					options.onCancelCallback();
				$(this).remove();
			},
			resizable: false,
			title: options.title,
			modal: options.modal,
			minHeight: contentHeight + 76.5,
			maxHeight: contentHeight + 76.5
		};
		dialogOptions.buttons[options.okLabel] = function() { if (options.onOKCallback) options.onOKCallback(); $(this).dialog("close"); }
		dialogOptions.buttons[options.cancelLabel] = function() { $(this).dialog("close"); }
		$.extend(dialogOptions, options.dialogOptions);

		dialogBox.dialog(dialogOptions);
		dialogBox.dialog("open");
		if (options.centerTo)
			dialogBox.parent().position({my: 'center', at: 'center', of: options.centerTo});
	};
	this.ShowTextInputBox = function(options) // label, /*;optional:*/ value, title, modal, onOKCallback, onCancelCallback, okLabel, cancelLabel, centerTo
	{
		options.modal = options.modal != null ? options.modal : true;
		options.okLabel = options.okLabel || "OK";
		options.cancelLabel = options.cancelLabel || "Cancel";
		options.centerTo = options.centerTo || self.defaultCenterTo;

		var dialogBox = $("<div style='padding: 10 0;'>");
		var form = $("<form style='margin: 0; padding: 0;'>").appendTo(dialogBox).attr("onsubmit", "$(this).parent().dialog('option', 'buttons')['OK'].call($(this).parent()[0]); return false;");

		var row = $("<div class='row' style='position: relative;'>").appendTo(form);
		var label = $("<label for='ShowTextInputBox_Value' style='line-height: 22px;'>").appendTo(row).html(options.label);
		var rightSide = $("<div style='position: absolute; top: 0; right: 0;'>").appendTo(row);
		var input = $("<input id='ShowTextInputBox_Value' type='text' style='display: inline-block; width: 100%; margin: 0;'>").appendTo(rightSide).val(options.value);
		$("<div style='clear: both;'>").appendTo(row);

		var contentHeight = V.GetContentHeight(dialogBox);
		var dialogOptions =
		{
			autoOpen: false,
			buttons: {},
			close: function(event, ui)
			{
				if (options.onCancelCallback)
					options.onCancelCallback();
				$(this).remove();
			},
			resizable: true,
			title: options.title,
			modal: options.modal,
			minWidth: 300,
			minHeight: contentHeight + 76.5,
			maxHeight: contentHeight + 76.5
		};
		dialogOptions.buttons[options.okLabel] = function() { if (options.onOKCallback) options.onOKCallback(input.val()); $(this).dialog("close"); }
		dialogOptions.buttons[options.cancelLabel] = function() { $(this).dialog("close"); }
		$.extend(dialogOptions, options.dialogOptions);

		dialogBox.dialog(dialogOptions);
		dialogBox.dialog("open");
		setTimeout(function() { input.focus()[0].setSelectionRange(input.val().length, input.val().length); }, 0); // not exactly sure why just "input.focus();" doesn't work--I guess it needs a microsecond to 'layout' the just-opened controls
		dialogBox.parent().addClass("heightStatic");

		rightSide.css("left", label.width() + 10);

		if (options.centerTo)
			dialogBox.parent().position({my: 'center', at: 'center', of: options.centerTo});
	};
};
//V.ExtendWith(VMessageBox);