var sys = require('sys'),
  Metric = require('metric').Metric,
  TimeBucketers = require('aggregates').TimeBucketers;

var Weekly = {};

Weekly.reducer = function(obj, prev) {
  if(obj.name == 'all_views') {
    prev.total += obj.data.total; prev.cartAdds += obj.data.cartAdds;
  } else {
    if(!prev.sales) { prev.sales = {}; }

    for(var saleKey in obj.data.sales) {
      prev.sales[saleKey] = (prev.sales[saleKey] || 0) + obj.data.sales[saleKey];
    }
  }
};

Weekly.findBySlice = function(db,callback) {
  Weekly.find(db,'slice',TimeBucketers.closestDayFor, 24*3600, callback);
};

Weekly.findByDay = function(db,callback) {
  Weekly.find(db,'day',TimeBucketers.closestDayFor, 24*7*3600, callback);
};

Weekly.findByMinute = function(db,callback) {
  Weekly.find(db,'minute',TimeBucketers.closestMinuteFor, 3600, callback);
};

Weekly.findByHour = function(db,callback) {
  Weekly.find(db,'hour',TimeBucketers.closestHourFor, 24*3600, callback);
};

Weekly.find = function(db, key, roundingFunc ,range, callback) {
  db.collection('metrics', function(err, collection) {
    if(err) {
      sys.log(JSON.stringify(err, null, 2));
     }

    var timeMarker = roundingFunc((new Date()).getTime()) - range*1000;
    sys.log((new Date(timeMarker)).toString());
    var query = {},orderby = {};
    query[key] = { "$gte": new Date(timeMarker) };
    orderby[key] = -1;
    var result = collection.find({ $query: query , $orderby : orderby } , function(err, cursor) {
      if(err) {
         sys.log(JSON.stringify(err, null, 2));
      }

      cursor.toArray(function(err, items) {
        if(err) {
          sys.log(JSON.stringify(err, null, 2));
        }

      // Turn the sales hash into an array, for sorting
      for(var i = 0; i < items.length; i++) {
        var item = items[i];

      item[key] = item[key].getTime();
      delete item._id;

      Metric.allMetrics(function(metric) {
         if(metric.aggregateCallback) { metric.aggregateCallback(item); }
       });
      }
      callback(JSON.stringify(items, null, 2));
      });
     });
    });
};

exports.findBy = { 
		   'day': Weekly.findByDay,
		   'hour': Weekly.findByHour,
		   'minute': Weekly.findByMinute,
		   'slice': Weekly.findBySlice
                 };
