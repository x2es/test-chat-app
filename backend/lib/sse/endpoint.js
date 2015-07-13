
/**
 * Implements only outgoing interface of AbstractTransportFacade
 *
 * @extends AbstractTransportFacade
 * @param {ServerResponse} res
 */
function SSEEndpoint(res) {
  this._res = res;
}

/**
 * @param {Object} msg
 */
SSEEndpoint.prototype.send = function(msg) {
  // TODO: id, event
  // TODO: \n\n escaping issue
  this._res.write('data: ' + JSON.stringify(msg) + '\n\n');
};

module.exports = SSEEndpoint;
