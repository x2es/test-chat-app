
var debug = true;

var MiniFrame = require('../miniframe.js');

var rws = require('./raw_ws.js');
var RawWSSocket = require('./socket.js');

/**
 * @constructor
 */
function RawWSMiddleware () {}

MiniFrame.events(RawWSMiddleware, [
  /**
   * @param {RawWSSocket} rwsSocket
   */
  'connection'
]);

/**
 * @param {http.Server} server
 * @return {RawWSMiddleware}
 */
RawWSMiddleware.prototype.use = function(server) {

  // TODO
  (function(middleware, server) {
    var events = ['clientError', 'close'];
    events.forEach(function(ev) {
      server.on(ev, function() {
        console.log('[srv:' + ev + ']', arguments);
      });
    });


    server.on('upgrade', function(req, socket, head) {
      socket.write(rws.buildHandshakeHeaders(req.headers['sec-websocket-key']));
      // TODO: handshake failed
      
      var rwsSocket = new RawWSSocket(socket);
      middleware._fireConnection(rwsSocket);
    });
  })(this, server);


  return this;
}

module.exports = RawWSMiddleware;
