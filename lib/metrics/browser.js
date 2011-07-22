var fs = require('fs'),
    sys = require('sys');

var BrowserMetric = {
  name: "browser",
  interval: 500,
  initialData: { views: {}, clicks: {} } ,
  ignoreOnEmpty: true,
  canLoad: function() {
    this.browsers = fs.readFileSync(__dirname + '/../../data/browser.csv','utf-8')
		      .split('\n')
		      .map(function(line) { 
			     var arr=line.split('|');
			     return { browser: arr[0], label: arr[1] };
			  });
   return (this.browsers.length > 0);
  },
  incrementCallback: function(view) {
    var ua = view.env.ua;
    var label = this.matchUA(ua);
    this.incrData(this.data.views,label);
    this.incrData(this.minuteData,"views." + label);
  },
  matchUA: function(ua) {
    for (var i = 0; i < this.browsers.length; i++) {
      if (ua.search(this.browsers[i].browser) != -1)
         return this.browsers[i].label;
    }
  },
  incrData: function (data,label) {
    data[label] = (data[label] || 0) + 1;
  }
}

for (var i in BrowserMetric)
  exports[i] = BrowserMetric[i];
