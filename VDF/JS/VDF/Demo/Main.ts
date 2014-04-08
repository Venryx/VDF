module Main
{
	// methods
	// ==================

	// startup
	// ==================
	
	$(() =>
	{
		$("#tabs").VTabView();

		$("#makeOutputA").click((event, ui) =>
		{
			var testWorld =
			{
			};

			// serialize it, and save it to file
			var vdf:string = VDF.Serialize(testWorld, new VDFSaveOptions()); //, null, null, namespaceAliasesByName, typeAliasesByType, true));
			$("#outputA").html(vdf);
		});
		$("#makeOutputB").click((event, ui) =>
		{
		});
	});
}