
var delegate = require('../miniframe.js').delegate;

function nop() {};

/**
 * @extends AbstractTransportFacade
 */
function HybridChannel() {
  var that = this;

  this._onMessageHandlersBuffer = [];
  this._onDisconnectedHandlersBuffer = [];

  this._outgoingEndpoint = { send: nop };
  this._incommingEndpoint = { 
    onMessage: function(handler) {
      that._onMessageHandlersBuffer.push(handler);
    },
    onDisconnected: function(handler) {
      that._onDisconnectedHandlersBuffer.push(handler);
    }
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

  for (var i=0; i<this._onDisconnectedHandlersBuffer.length; i++) {
    this._incommingEndpoint.onDisconnected(this._onDisconnectedHandlersBuffer[i]);
  }
  delete this._onDisconnectedHandlersBuffer;
};

module.exports = HybridChannel;
