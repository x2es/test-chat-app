
var Helpers = require('./helpers.js');

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
      chatRoom.broadcast(msg);
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
 */
ChatRoom.prototype.broadcast = function (message) {
  var origin = message.origin;
  var peers = this._peers;
  for (var i=0; i<peers.length; i++) {
    var peer = peers[i];
    if (origin === peer.getUid()) continue;
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
