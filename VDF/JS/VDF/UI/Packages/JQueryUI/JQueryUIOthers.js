$.prototype.slider_old = $.prototype.slider;
$.prototype.slider = function()
{
	var result = $.prototype.slider_old.apply(this, arguments);
	this.find(".ui-slider-handle").unbind("keydown"); // disable keyboard actions
	return result;
}

// disable tab view "arrow keys to switch tab" feature (by default, anyway)
$.widget("ui.tabs", $.ui.tabs,
{
	options:
	{
		keyboard: true
	},
	_tabKeydown: function(e)
	{
		if(this.options.keyboard)
			this._super('_tabKeydown');
		else
			return false;
	}
});