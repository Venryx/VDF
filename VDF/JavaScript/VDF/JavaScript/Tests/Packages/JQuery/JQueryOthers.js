$.fn.on_doubleClick = function(descendentSelector, functionToCall)
{
	$(this).on("click", descendentSelector, function(event)
	{
		this.clicks = (this.clicks ? this.clicks + 1 : 1); // count clicks
		if (this.clicks == 1)
		{
			var self = this;
			this.timer = setTimeout(function()
			{
				self.clicks = 0; // second click delayed too long, reset
			}, 500);
		}
		else
		{
			clearTimeout(this.timer); // cancel delay timer
			this.clicks = 0; // reset
			functionToCall.call(this);
		}
	}).on("dblclick", function(e)
		{
			e.preventDefault(); // cancel system double-click event
		});
}
$.fn.mouseInBounds = function(mouseX,mouseY)
{
	var bounds = $(this).offset();
	bounds.bottom = bounds.top + $(this).outerHeight();
	bounds.right = bounds.left + $(this).outerWidth();
	if ((mouseX >= bounds.left && mouseX <= bounds.right) && (mouseY >= bounds.top && mouseY <= bounds.bottom))
		return true;
	return false;
}