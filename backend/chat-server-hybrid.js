var SSE_WS_PORT = 12001;
var WS_PORT     = 12002;

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
var wssOut = new WSServer({ server: server });

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

wssOut.on('connection', function(ws) {
  channelsController.addWebSocket(new WSFacade(ws));
});

server.listen(SSE_WS_PORT);

wssBoth = new WSServer({ port: WS_PORT });

wssBoth.on('connection', function(ws) {
  chatRoom.invite(new Peer(new WSFacade(ws)));
});

console.log('[listen SSE+WS] port', SSE_WS_PORT);
console.log('[listen WS] port', WS_PORT);

