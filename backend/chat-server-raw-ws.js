
var PORT = 12002;

var ChatRoom = require('./lib/chat_room.js');
var RWSFacade = require('./lib/transport/rws_facade.js');
var Peer = require('./lib/peer.js');

var http = require('http');

// middleware of Raw WebSocket
var RWSMiddleware = require('./lib/raw_ws/middleware.js');
var rwsMiddleware = new RWSMiddleware();

var chatRoom = new ChatRoom();

var server = http.createServer();

rwsMiddleware.use(server)
  .onConnection(function(rwsSocket) {
    chatRoom.invite(new Peer(new RWSFacade(rwsSocket)));
  });

server.listen(PORT);

console.log('listen on port:', PORT);

