
var delegate = require('../miniframe.js').delegate;

function nop() {};

/**
 * @extends AbstractTransportFacade
 */
function HybridChannel() {
  var that = this;

  this._onMessageHandlersBuffer = [];

  this._outgoingEndpoint = { send: nop };
  this._incommingEndpoint = { 
    onMessage: function(handler) {
      that._onMessageHandlersBuffer.push(handler);
    },
    onDisconnected: nop
  };
}

delegate(HybridChannel, {
  methods: ['send'],
  to: '_outgoingEndpoint'
});

delegate(HybridChannel, {
  methods: ['onMessage', 'onDisconnected'],
  to: '_incommingEndpoint'
});

/**
 * @param {AbstractTransportFacade} endpoint
 */
HybridChannel.prototype.setOutgoing = function(endpoint) {
  this._outgoingEndpoint = endpoint;
};

/**
 * @param {AbstractTransportFacade} endpoint
 */
HybridChannel.prototype.setIncomming = function(endpoint) {
  this._incommingEndpoint = endpoint;

  for (var i=0; i<this._onMessageHandlersBuffer.length; i++) {
    this._incommingEndpoint.onMessage(this._onMessageHandlersBuffer[i]);
  }
  delete this._onMessageHandlersBuffer;
};

module.exports = HybridChannel;
