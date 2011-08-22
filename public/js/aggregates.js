$(function () {

  var today = new Date();
  today.setMilliseconds(0);
  today.setSeconds(0);
  var hourMin = today.getTime() - 3600*1000;
  today.setMinutes(0);
  var  dayMin = today.getTime() - 24*3600*1000;
  today.setHours(0);
  var weekMin = today.getTime() - 7*24*3600*1000;
  

  var baseURL = "//" + siteconfig.report + "/json/";

  var urls = { '#day': [ "slice", dayMin ],
  	       '#hour':[ "minute", hourMin ],
	       '#week':[ "day", weekMin ]
	     };


   function getMetricData(metric,divElem,startTime,endTime)
    {
      $.getJSON(baseURL +  metric + "?callback=?" , function(data) {
         console.log("fetched for metric " + metric + " in " + divElem);
	 var d1 = data.map(function(d,index,array) {
		     return [ d[metric], d.total || 0];
	     });  
	 var options = {
		     bars: { show: true, barWidth: 1, fill: 0.9 },
		     xaxis: { mode:"time", tickLength: 2 , min:startTime , max:endTime, timezone: "browser"},
	     };
	 $.plot($(divElem),[ { 'label':'Visits', 'data': d1 } ],  options);

	 $(divElem).append( '<div align="right"><img src="images/csv.png" width=16 height=16/>'
			 +'<img src="images/js.png" width=16 height=16/></div>');
         });
    }

   for (var k in urls) {
     var endTime = new Date();
     var metric = (urls[k])[0];
     var startTime = (urls[k])[1];
     getMetricData(metric,k,startTime,endTime);
  } 

/*
  $.getJSON("//" + siteconfig.report + "/json/slice?callback=?", function(data) {
    var today = new Date();
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var time = today.getTime();
    var d1 = data.map(function(d,index,array) {
                   return [ d.slice, d.total || 0];
                 });  

    var options = {
        bars: { show: true, barWidth: 1, fill: 0.9 },
        xaxis: { mode:"time", tickLength: 2 , min:(time-24*3600*1000) , max:time, timezone: "browser"},
    };

    $.plot($("#day"),[ { 'label':'Impressions Last Day', 'data': d1 } ],  
           options)
  });

  $.getJSON("//" + siteconfig.report + "/json/minute?callback=?", function(data) {
    var today = new Date();
    today.setSeconds(0);
    today.setMilliseconds(0);
    var time = today.getTime();
    var d1 = data.map(function(d,index,array) {
                   return [ d.minute , d.total || 0];
                 });  
    var options = {
        bars: { show: true, barWidth: 0.6, fill: 0.9 },
        xaxis: { mode:"time", tickLength: 4 , min:(time-3600*1000) , max:time, timezone: "browser"},
    };
    $.plot($("#hour"),[ { 'label':'Impressions Last Hour', 'data': d1 } ],  
           options);
    $('#hour').append('<div align="right"><img src="images/csv.png" width=16 height=16/><img src="images/js.png" width=16 height=16/></div>');
  });

  $.getJSON("//" + siteconfig.report + "/json/day?callback=?", function(data) {
    var today = new Date();
    today.setHours(0);
    today.setMinutes(0);
    today.setSeconds(0);
    today.setMilliseconds(0);
    var time = today.getTime();
    var d1 = data.map(function(d,index,array) {
                   return [ d.day , d.total || 0];
                 });  
    var options = {
        bars: { show: true, barWidth: 0.5, fill: 0.9 },
        xaxis: { mode:"time", tickLength: 1 , min:(time-24*7*3600*1000) , max:time},
    };
    $.plot($("#week"),[ { 'label':'Impressions Last Week', 'data': d1 } ],  
           options)
  });
*/
 
});

