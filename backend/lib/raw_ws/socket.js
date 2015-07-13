
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
        console.log('[socket:' + ev + ']', arguments);
      });
    });

    rwsSocket._socket.on('data', function(buffer) {
      var debugInput = buffer.toString('hex');
      if (debugInput.length > 300) debugInput = debugInput.substr(0, 200) + ' ...';

      console.log('[socket:data] hex:', debugInput);
      console.log('[socket:data] length:', buffer.length);

      try {
        var frame = rws.parseFrame(buffer);
      } catch (e) {
        rwsSocket._fireUnsupported(e);
        return;
      }

      // if (debug) {
      //   console.log('frame:', frame);
      // }

      console.log('rwsSocket._fireData()');
      rwsSocket._fireData(frame);

    });
  })(this);

  
}

module.exports = RawWSSocket;
