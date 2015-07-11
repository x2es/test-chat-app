
var MessageFactory = require('../message_factory.js');

/**
 * Cares about pairing outgoing and incomming channels of peer
 *
 * On the beginning peer has only one active channel: outgoing over SSE
 * 
 * The server will inform the front-end about peer.uid using outgoing SSE.
 * The front-end should send message through WebSocket with received peer.uid.
 *
 * ChannelsController will pair outgoing SSE with incomming WebSocket 
 * when receives WebSocket message with peer.uid
 *
 * TODO: on SSE/WebSocket error connections should be restored
 * 
 */
function ChannelsController() {

  // peers which awaiting incomming channel
  this._pendingPeers = {};
}

/**
 * Adds peer for managing.
 *
 * @param {Peer} peer
 * @param {HybridChannel} hybridChannel
 */
ChannelsController.prototype.addPeer = function(peer, hybridChannel) {
  this._pendingPeers[peer.getUid()] = { peer: peer, hybridChannel: hybridChannel };
  hybridChannel.send(MessageFactory.pair(peer.getUid()));
};

/**
 * @param {AbstractTransportFacade} ws: wrapped WebSocket
 */
ChannelsController.prototype.addWebSocket = function(ws) {
  (function(ctl, ws) {
    ws.onMessage(function(msg) {
      if (msg.type == undefined || msg.type !== 'pair') {
        return;
      }

      var p = ctl._pendingPeers[msg.peer_uid];
      if (p == undefined) return;

      p.hybridChannel.setIncomming(ws);
      delete ctl._pendingPeers[msg.peer_uid];

      // TODO: send success to peer
      //       peer should not start sending messages before receiving success

      // TODO: off from event
    });
  })(this, ws);
};

module.exports = ChannelsController;
