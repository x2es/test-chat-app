
/** NOTE: just interface; not required in code but reffered by @extends **/

/**
 * @param {AbstractTransport} transport
 */
function AbstractTransportFacade(transport) {};

/**
 * Disconnection handler
 *
 * @param {DisconnectHandler} handler
 */
AbstractTransportFacade.prototype.onDisconnected = function(handler) {};

/**
 * @param {MessageHandler} handler
 */
AbstractTransportFacade.prototype.onMessage = function(handler) {};

/**
 * @param {Message} message
 */
AbstractTransportFacade.prototype.send = function(message) {};


module.exports = AbstractTransportFacade;