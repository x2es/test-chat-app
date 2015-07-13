
var PORT = process.argv[2] || 11001;

var lg = require('./lib/dev/debug.js').lg;

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
        lg('onData/frame.payload.length:', Buffer.byteLength(frame.payload), 'utf8');
        var frameOut = rws.buildFrame(frame);
        // TODO
        rwsSocket._socket.write(frameOut);

        var debugOut = frameOut.toString('hex');
        if (debugOut.length > 300) debugOut = debugOut.substr(0, 200) + ' ...';
        lg('sended back:', debugOut);
        lg('-----------')

      } else if (frame.opcode === 8) {
        var frameOut = rws.buildFrame({ opcode: 8, code: 1000, message: '' });
        rwsSocket._socket.end(frameOut);
      }
    })
    .onUnsupported(function(e) {
      var frame = rws.buildFrame({ opcode: 8, code: e.code, message: e.message });
      rwsSocket._socket.end(frame);
    });
  });

srv.listen(PORT);

console.log('echo server with raw_ws')
console.log('  [http]', PORT);
