
var MessageFactory = require('./message_factory.js');
var Helpers = require('./helpers.js');

var SYSTEM = 0;   // origin for system

function peerComparator(item, query) {
  if (item.getUid() === query.getUid()) return (0);
  return (-1);
}

function ChatRoom() {
  this._peers = [];
}

/**
 * Connects specified peer to chat room
 *
 * @param {Peer} peer
 */
ChatRoom.prototype.invite = function (peer) {
  this._peers.push(peer);

  (function(chatRoom, peer) {
    peer.onDisconnected(function() {
      chatRoom._dismiss(peer);
    });

    peer.onMessage(function(msg) {
      msg.origin = peer.getUid();

      // TODO: make massage router
      if (msg.type != undefined) {
        if (msg.type === 'name') {
          peer.send(MessageFactory.system('Welcome!'));
          chatRoom.broadcast(MessageFactory.system(msg.body + ' have joined!'), { exclude: [ msg.origin ] });
        } 
        return;
      }

      chatRoom.broadcast(msg, { exclude: [ msg.origin ] });
    });
  })(this, peer);
};

/**
 * Checks if peer is member of chat room
 *
 * @param {Peer} peer
 * @return {Boolean}
 */
ChatRoom.prototype.isMember = function(peer) {
  var peerIndex = Helpers.indexOf(this._peers, peer, peerComparator);
  if (peerIndex === -1) return (false);
  return (true);
};

/**
 * Broadcasts messages to all connected peers
 * except origin
 *
 * @param {Message} message
 * @param {Array<int>} opts.exclude
 */
ChatRoom.prototype.broadcast = function (message, opts) {
  var o = opts || {};
  var exclude = o.exclude || [];

  var peers = this._peers;
  for (var i=0; i<peers.length; i++) {
    var peer = peers[i];
    if (exclude.indexOf(peer.getUid()) !== -1) continue;
    peer.send(message);
  }
};

/**
 * Dismiss specified peer
 *
 * @param {Peer} peer
 */
ChatRoom.prototype._dismiss = function(peer) {
  var peerIndex = Helpers.indexOf(this._peers, peer, peerComparator);

  if (peerIndex < 0) return;
  this._peers.splice(peerIndex, 1);
};

module.exports = ChatRoom;
