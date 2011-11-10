var sys = require('sys');

var Tabular = function(db, res){
  if(!this instanceof Tabular) {
    return new Tabular(db, res);
  }
	this.db = db;
  this.res = res;
};

Tabular.prototype = {

	findAll: function(limit, output, callback){
		var db = this.db;
		var _self = this;
		db.collection('metrics', function(err, collection){
			if(err){
				sys.log(JSON.stringify(err, null, 2));
			}

			collection.find({}, { limit:limit, sort:[['minute','desc']] }, function(err, cursor){
				if(err) {
					sys.log(JSON.stringify(err, null, 2));
				}
								
				if(output == 'json'){
					_self.renderJson(cursor, callback);
				} else if(output == 'csv') {
					_self.renderCsv(cursor);
				}				
				
			});
		});
	},
	
	renderJson: function(cursor, callback){		
		cursor.toArray(function(err, items) {
      if(err) {
        sys.log(JSON.stringify(err, null, 2));
      }
			callback(JSON.stringify(items, null, 2));
		});
	},
	
	renderCsv: function(cursor){
		var res = this.res;
		res.header("Content-Type", "text/csv");
		res.header("Content-Disposition", "attachment;filename=stats.csv");
		res.chunkedEncoding = true;
		cursor.each(function(err, item){
			if(err) {
        sys.log(JSON.stringify(err, null, 2));
      } else {
				if(item){
					res.write(item.minute + "\n");
				}
			}			
		});
		res.end('');
	}

};


exports.Tabular = Tabular;