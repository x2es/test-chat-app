

/**
 * @field {Id} origin
 * @field {String} body
 */

/**
 * Message factory
 */
function Message() {
  return ({
    // @field {String} id of peer
    origin: '',

    // @field {String} body of message
    body: ''
  });
}

module.exports = Message;
