
var lg = require('../dev/debug.js').lg;

/**
 * Adapt Raw WebSocket API to application conventions.
 * Represents peer's endpoint over Raw WebSocket instance.
 *
 * @extends AbstractTransportFacade
 */
function RWSFacade(rwsTransport) {
  this._rwsTransport = rwsTransport;
}

/**
 * Disconnection handler
 *
 * @param {DisconnectHandler} handler
 */
RWSFacade.prototype.onDisconnected = function(handler) {
  lg('[RWSFacade#onDisconnected] not implemented');
  // this._rwsTransport.on('close', handler);
};

/**
 * @param {MessageHandler} handler
 */
RWSFacade.prototype.onMessage = function(handler) {
  this._rwsTransport.onMessage(function(message) {
    handler.apply(this._rwsTransport, [ JSON.parse(message) ]);
  });
};

/**
 * @param {Message} message
 */
RWSFacade.prototype.send = function(message) {
  this._rwsTransport.send(JSON.stringify(message));
};

module.exports = RWSFacade;

