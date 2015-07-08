
var MiniFrame = require('./miniframe.js');
var accessors = MiniFrame.accessors;
var delegate = MiniFrame.delegate;

var peerUid = 0;

/**
 * Represents a peer.
 * Provides common interface for different types of transports.
 *
 * NOTE: 'endpoint' in several cases may be named as 'transport'
 *
 * @param {AbstractTransportFacade} endpoint
 */
function Peer(endpoint) {
  this._endpoint = endpoint;
  this.setUid(peerUid++);
}

accessors(Peer, ['uid']);

delegate(Peer, {
  methods: ['onDisconnected', 'onMessage', 'send'],
  to: '_endpoint'
});

module.exports = Peer;
