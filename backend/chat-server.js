
var PORT = 14545;

var WSServer = require('ws').Server;

var wss = new WSServer({ port: PORT });

var insp = require('util').inspect;

wss.on('connection', function(ws) {
  debugger;
  console.log('ws connection', insp(ws));
  // ws.on('message', function() {
  //   console.log('ws message', JSON.parse(arguments[0]), arguments); 
  // });
});

console.log('listen on port:', PORT);
