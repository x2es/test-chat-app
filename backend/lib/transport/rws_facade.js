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
 * @param {MessageHandler} handler
 */
RWSFacade.prototype.onMessage = function(handler) {
  this._rwsTransport.onData(function(frame) {
    
    // TODO: use lib constant
    if (frame.opcode !== 1) return;

    handler.apply(this._rwsTransport, [ JSON.parse(frame.payload) ]);
  });
};

module.exports = RWSFacade;

