
var PORT = 12002;

var WSServer = require('ws').Server;
var ChatRoom = require('./lib/chat_room.js');
var WSFacade = require('./lib/transport/ws_facade.js');
var Peer = require('./lib/peer.js');

var wss = new WSServer({ port: PORT });

var chatRoom = new ChatRoom();

wss.on('connection', function(ws) {
  chatRoom.invite(new Peer(new WSFacade(ws)));
});

console.log('listen on port:', PORT);
