
var debug = true;

var MiniFrame = require('../miniframe.js');

var rws = require('./lib.js');

/**
 * @constructor
 * @param {net.Socket} socket
 */
function RawWSSocket(socket) {
  this._socket = socket;
  this._bindSocketEvents();
}

MiniFrame.events(RawWSSocket, [
  /**
   * @param {RawWSFrame} frame
   */
  'data'
]);

RawWSSocket.prototype._bindSocketEvents = function() {

  (function(rwsSocket) {
    // TODO
    var events = ['end', 'error', 'close'];
    events.forEach(function(ev) {
      rwsSocket._socket.on(ev, function() {
        console.log('[socket:' + ev + ']', arguments);
      });
    });

    rwsSocket._socket.on('data', function(buffer) {
      console.log('[socket:data] hex:', buffer.toString('hex'));
      console.log('[socket:data] length:', buffer.length);

      var frame = rws.parseFrame(buffer);

      if (debug) {
        console.log('frame:', frame);
      }

      rwsSocket._fireData(frame);

    });
  })(this);

  
}

module.exports = RawWSSocket;
