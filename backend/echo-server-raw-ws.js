
// TODO: debug stuff
var debug = true;

var PORT = process.argv[2] || 11001;

var http = require('http');

var rws = require('./lib/raw_ws/lib.js');
var RWSMiddleware = require('./lib/raw_ws/middleware.js');

var srv = http.createServer();

var rwsMiddleware = new RWSMiddleware();
rwsMiddleware
  .use(srv)
  .onConnection(function(rwsSocket) {
    rwsSocket.onData(function(frame) {
      if (frame.opcode === 1) {
        var frameOut = rws.buildFrame(frame);
        // TODO
        rwsSocket._socket.write(frameOut);

        if (debug) {
          console.log('sended back:', frameOut.toString('hex'));
          console.log('-----------')
        }

      } else if (frame.opcode === 8) {
        var frameOut = rws.buildFrame({ opcode: 8, code: 1000, message: '' });
        rwsSocket._socket.end(frameOut);
      }
    });
  });

srv.listen(PORT);

console.log('echo server with raw_ws')
console.log('  [http]', PORT);
