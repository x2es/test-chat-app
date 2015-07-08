
/**
 * Represents a peer.
 * Provides common interface for different types of transports.
 *
 * @param {AbstractTransportFacade} transport
 */
function Peer(transportFacade) {
  this._transportFacade = transportFacade;
}

accessors(Peer, ['uid']);

delegate(Peer, {
  to: '_transportFacade', 
  methods: ['onDisconnected', 'onMessage', 'send']
});

module.exports = Peer;
