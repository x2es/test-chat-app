
/**
 * @extends AbstractTransportFacade
 */
function WSFacade(wsTransport) {}

/**
 * Disconnection handler
 *
 * @param {DisconnectHandler} handler
 */
WSFacade.prototype.onDisconnected = function(handler) {};

/**
 * @param {MessageHandler} handler
 */
WSFacade.prototype.onMessage = function(handler) {};

/**
 * @param {Message} message
 */
WSFacade.prototype.send = function(message) {};

module.exports = WSFacade;
