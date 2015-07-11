

/**
 * @field {Id} origin
 *   @val 0: system
 * @field {string} type
 *   @val 'name'
 *   @val 'pair'
 * @field {String} body
 */

/**
 * Message factory
 */
var MessageFactory = {};

/**
 * @param {String} from: name of sender
 * @param {String} body: message
 */
MessageFactory.chat = function(from, body) {
  return({ from: from, body: body });
}

/**
 * @param {int|String} peerUid
 */
MessageFactory.pair = function(peerUid) {
  return ({ type: 'pair', peer_uid: peerUid });
};

/**
 * @param {String} name
 */
MessageFactory.name = function(name) {
  return ({ type: 'name', body: name });
}

// TODO: review message origin concept
// TODO: refactor type="name" to type="join"
// TODO: use this factory in frontend
/**
 * @param {String} body
 */
MessageFactory.system = function(body) {
  return ({ origin: 0, body: body });
}

module.exports = MessageFactory;
