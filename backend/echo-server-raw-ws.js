
// TODO: debug stuff
var debug = true;

var PORT = process.argv[2] || 11001;

var http = require('http');

var rws = require('./lib/raw_ws/raw_ws.js');

var srv = http.createServer();

srv.on('clientError', function() {
  console.log('[srv:clientError]', arguments);
});

srv.on('close', function() {
  console.log('[srv:close]', arguments);
});


srv.on('upgrade', function(req, socket, head) {
  var events = ['end', 'error', 'close'];
  events.forEach(function(ev) {
    socket.on(ev, function() {
      console.log('[socket:' + ev + ']', arguments);
    });
  });

  socket.on('data', function(buffer) {
    console.log('[socket:data] hex:', buffer.toString('hex'));
    console.log('[socket:data] length:', buffer.length);

    var frame = rws.parseFrame(buffer);

    if (debug) {
      console.log('frame:', frame);
    }

    if (frame.opcode == 1) {
      var frameOut = rws.buildFrame(frame.payload);
      socket.write(frameOut);

      if (debug) {
        console.log('sended back:', frameOut.toString('hex'));
      }

    } else {
      console.log('TODO: close connection');
    }
  });

  socket.write('HTTP/1.1 101 Web Socket Protocol Handshake\r\n' +
               'Upgrade: WebSocket\r\n' +
               'Connection: Upgrade\r\n' +
               'Sec-WebSocket-Accept: ' + rws.handshakeKey(req.headers['sec-websocket-key']) + '\r\n' +
               '\r\n');

});

srv.listen(PORT);

console.log('echo server with raw_ws.js')
console.log('  [http]', PORT);
