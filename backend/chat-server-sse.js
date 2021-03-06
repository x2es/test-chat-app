var HTTP_PORT = 12001;

var http = require('http');
var SSEMiddleware = require('./lib/sse/middleware.js');
var WSServer = require('ws').Server;

// logic of chat room
var ChatRoom = require('./lib/chat_room.js');

// client representation for chat room
var Peer = require('./lib/peer.js');

// facade which represents WebSocket channel for peer
// also may be used behing HybridChannel
var WSFacade = require('./lib/transport/ws_facade.js');

// facade which represents channel for peer
// composites outgoing SSE and incomming WS channels
var HybridChannel = require('./lib/transport/hybrid_channel.js');

// cares about pairing outgoing SSE and incomming WS channels
var ChannelsController = require('./lib/transport/channels_controller.js');

// middleware, which manages SSE connection
var sseMiddleware = new SSEMiddleware();

var chatRoom = new ChatRoom();

var channelsController = new ChannelsController();

/** SSE middleware **/

var server = http.createServer();

// WebSocket middleware
var wss = new WSServer({ server: server });

sseMiddleware.use(server)
  .config('cors', true)
  .onConnection(function(endpoint) {
    // ...
    var hybridChannel = new HybridChannel();
    hybridChannel.setOutgoing(endpoint);      // ESS as outgoing channel
    
    var peer = new Peer(hybridChannel);

    // cares about pairing SSE and WebSocket channels
    channelsController.addPeer(peer, hybridChannel);

    chatRoom.invite(peer);
  });

/** WebSocket middleware **/

wss.on('connection', function(ws) {
  channelsController.addWebSocket(new WSFacade(ws));
});


server.listen(SSE_PORT);

console.log('[listen SSE] port', HTTP_PORT);
console.log('[listen WS] port', HTTP_PORT);

