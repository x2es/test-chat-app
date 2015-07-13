
var lg = require('../dev/debug.js').lg;

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
  'data',

  /**
   * @param {Error<Object(code, message)>} error
   */
  'unsupported'
]);

RawWSSocket.prototype._bindSocketEvents = function() {

  (function(rwsSocket) {
    // TODO
    var events = ['end', 'error', 'close'];
    events.forEach(function(ev) {
      rwsSocket._socket.on(ev, function() {
        lg('[socket:' + ev + ']', arguments);
      });
    });

    rwsSocket._socket.on('data', function(buffer) {
      var debugInput = buffer.toString('hex');
      if (debugInput.length > 300) debugInput = debugInput.substr(0, 200) + ' ...';

      lg('[socket:data] hex:', debugInput);
      lg('[socket:data] length:', buffer.length);

      try {
        var frame = rws.parseFrame(buffer);
      } catch (e) {
        rwsSocket._fireUnsupported(e);
        return;
      }

      lg('rwsSocket._fireData()');
      rwsSocket._fireData(frame);

    });
  })(this);

  
}

module.exports = RawWSSocket;
