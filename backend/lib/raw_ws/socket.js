
var lg = require('../dev/debug.js').lg;

var MiniFrame = require('../miniframe.js');

var rwsLib = require('./lib.js');

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
   * @param {Function(RawWSFrame)} frame
   */
  'data',

  /**
   * @param {Function(String)} message
   */
  'message',

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
        var frame = rwsLib.parseFrame(buffer);
      } catch (e) {
        rwsSocket._fireUnsupported(e);
        return;
      }

      lg('rwsSocket._fireData()');
      rwsSocket._fireData(frame);

      if (frame.opcode == rwsLib.OPCODE_TEXT) rwsSocket._fireMessage(frame.payload);

    });
  })(this);

}

/**
 * @message {String} str
 */
RawWSSocket.prototype.send = function(message) {
  var frame = rwsLib.buildFrame({ opcode: rwsLib.OPCODE_TEXT, payload: message });
  this._socket.write(frame);
}

module.exports = RawWSSocket;
