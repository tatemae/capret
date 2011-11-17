if(!Hummingbird) { var Hummingbird = {}; }

Hummingbird.Tabular = {};

Hummingbird.Tabular.init = function() {
	// Setup CSV download
	var statsCsvUrl = '//' + siteconfig.report + '/json/tabular_csv';	
	$('#download-csv').attr('href', statsCsvUrl);

	// Display stats
	var statsJsonUrl = '//' + siteconfig.report + '/json/tabular_json?callback=?';
	$.getJSON(statsJsonUrl, function(data){
	  var rowTemplate = $(".row_template");
	  $.each(data, function(index, item){
	  	var row = rowTemplate.clone();
	    row.find('td.date').text(item.timestamp);
			row.find('td.ip').text(item.ip);
			row.find('td.ua').text(item.ua);			
			row.find('td.referrer').text(item.ref);
			row.find('td.location').text(item.u);
			row.find('td.text-copied').text(item.txt);			
			row.find('td.text-length').text(item.l);
			row.find('td.text-modified').text(item.lmod);
			row.find('td.text-copied-on').text(item.ct);			
	    row.appendTo('#tabular-data');
	  });
	});
};