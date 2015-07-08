
/**
 * @extends AbstractTransportFacade
 */
function WSFacade(wsTransport) {
  this._wsTransport = wsTransport;
}

/**
 * Disconnection handler
 *
 * @param {DisconnectHandler} handler
 */
WSFacade.prototype.onDisconnected = function(handler) {
  this._wsTransport.on('close', handler);
};

/**
 * @param {MessageHandler} handler
 */
WSFacade.prototype.onMessage = function(handler) {
  this._wsTransport.on('message', function(messageSerial) {
    handler.apply(this._wsTransport, [ JSON.parse(messageSerial) ]);
  });
};

/**
 * @param {Message} message
 */
WSFacade.prototype.send = function(message) {
  this._wsTransport.send(JSON.stringify(message));
};

module.exports = WSFacade;
