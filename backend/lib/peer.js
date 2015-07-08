
var MiniFrame = require('./miniframe.js');
var accessors = MiniFrame.accessors;
var delegate = MiniFrame.delegate;

var peerUid = 0;

/**
 * Represents a peer.
 * Provides common interface for different types of transports.
 *
 * @param {AbstractTransportFacade} transport
 */
function Peer(transportFacade) {
  this._transportFacade = transportFacade;
  this.setUid(peerUid++);
}

accessors(Peer, ['uid']);

delegate(Peer, {
  methods: ['onDisconnected', 'onMessage', 'send'],
  to: '_transportFacade'
});

module.exports = Peer;
