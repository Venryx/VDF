interface JQuery
{
	VTabView();
}

$.fn.VTabView = function()
{
	var root = $(this);
	var buttonHolder = $(root.children()[0]);
	var boxHolder = $(root.children()[1]);

	buttonHolder.children().click(function(event, ui)
	{
		$(this).siblings().removeClass("active");
		$(this).addClass("active");
		boxHolder.children().removeClass("active");
		$(boxHolder.children()[$(this).index()]).addClass("active");
	});
};