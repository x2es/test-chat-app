
function ChatRoom() {}

/**
 * Connects specified peer to chat room
 *
 * @param {Peer} peer
 */
ChatRoom.prototype.invite = function (peer) {};

/**
 * Checks if peer is member of chat room
 *
 * @param {Peer} peer
 */
ChatRoom.prototype.isMember = function(peer) {};

/**
 * Broadcasts messages to all connected peers
 * except origin
 *
 * @param {Message} message
 */
ChatRoom.prototype.broadcast = function (message) {};

module.exports = ChatRoom;
