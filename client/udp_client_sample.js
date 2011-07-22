var dgram = require('dgram'),
    sys = require('sys');

function sendMessage(data) {
  var message = new Buffer(JSON.stringify(data));
  var client = dgram.createSocket("udp4");
  client.send(message, 0, message.length, 8000, "localhost");
  client.close();
}

setInterval(function() {
  var ip = Math.round(Math.random()*255);
  for (var j = 0; j < 3; j++)
    ip += '.' + Math.round(Math.random()*255);

  sys.puts(ip);
   var msg = {
    "ip" : ip,
    "timestamp" : new Date(),
    "url_key" : 123,
    "product_id" : 456
   };
  sendMessage(msg);
},1000);
