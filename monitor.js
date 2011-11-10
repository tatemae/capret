var sys = require('sys'),
    express = require('express'),
		Tabular = require('tabular').Tabular,
    weekly = require('weekly');

var app = express.createServer();

app.configure(function(){
  app.set('root', __dirname);
  app.set('db', db);
});

app.get('/json/:id', function(req,res){
	
	var json_callback = function(data) {
    res.header("Content-Type", "text/javascript");
    if (req.query.callback)
       data = req.query.callback + '(' + data + ');';
    res.send(data);
  };
	
	if(req.params.id == 'tabular_csv'){
		var tabular = new Tabular(app.settings['db'], res);
		var limit = 10000000;
		tabular.findAll(limit, 'csv');
	} else if(req.params.id == 'tabular_json') {
		var tabular = new Tabular(app.settings['db'], res);
		var limit = 1000;
		tabular.findAll(limit, 'json', json_callback);		
	} else {
	  var datacallback = weekly.findBy[req.params.id];
		datacallback(app.settings['db'], json_callback);
	}
	
});

setInterval(weekly.summarize,1000*3600,app.settings['db']);

app.listen(8888);
