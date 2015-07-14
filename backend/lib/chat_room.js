
var MessageFactory = require('./message_factory.js');
var Helpers = require('./helpers.js');

var SYSTEM = 0;   // origin for system

function peerComparator(item, query) {
  if (item.getUid() === query.getUid()) return (0);
  return (-1);
}

function ChatRoom() {
  this._peers = [];
  this._namesOnPeers = {};
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
      chatRoom.broadcast(MessageFactory.system(chatRoom._namesOnPeers[peer.getUid()] + ' has left!'));
    });

    peer.onMessage(function(msg) {
      // TODO: make massage router
      if (msg.type != undefined && msg.type !== 'typing') {
        if (msg.type === 'name') {
          chatRoom._namesOnPeers[peer.getUid()] = msg.body;
          peer.send(MessageFactory.system('Welcome!'));
          chatRoom.broadcast(MessageFactory.system(msg.body + ' have joined!'), { exclude: [ peer.getUid() ] });
        } 
        return;
      }

      var oldName = chatRoom._namesOnPeers[peer.getUid()];
      if (oldName != undefined && msg.from != undefined && oldName !== msg.from) {
        chatRoom._namesOnPeers[peer.getUid()] = msg.from;
        chatRoom.broadcast(MessageFactory.system(oldName + ' have changed name to ' + msg.from), { exclude: [ peer.getUid() ] });
      }
      chatRoom.broadcast(msg, { exclude: [ peer.getUid() ] });
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
