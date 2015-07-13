var HTTP_PORT = 12001;

var http = require('http');
var SSEMiddleware = require('./lib/transport/sse_middleware.js');


// logic of chat room
var ChatRoom = require('./lib/chat_room.js');

// client representation for chat room
var Peer = require('./lib/peer.js');

// facade which represents WebSocket channel for peer
// also may be used behing HybridChannel
var RWSFacade = require('./lib/transport/rws_facade.js');

// facade which represents channel for peer
// composites outgoing SSE and incomming WS channels
var HybridChannel = require('./lib/transport/hybrid_channel.js');

// cares about pairing outgoing SSE and incomming WS channels
var ChannelsController = require('./lib/transport/channels_controller.js');

// middleware, which manages SSE connection
var sseMiddleware = new SSEMiddleware();

// middleware of Raw WebSocket
var rwsLib = require('./lib/raw_ws/lib.js');
var RWSMiddleware = require('./lib/raw_ws/middleware.js');

// WebSocket middleware
// var wss = new WSServer({ port: WS_PORT });

var chatRoom = new ChatRoom();

var channelsController = new ChannelsController();

/** SSE middleware **/

// TODO: refactor to: middleware.use(server)...
sseMiddleware
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

// wss.on('connection', function(ws) {
//   channelsController.addWebSocket(new WSFacade(ws));
// });


var server = http.createServer(function(req, res) {
  
  // handle text/event-stream
  if (sseMiddleware.handle(req, res)) return;

  // other middleware
  // ...
});

var rwsMiddleware = new RWSMiddleware();

rwsMiddleware.use(server)
  .onConnection(function(rwsSocket) {
    channelsController.addWebSocket(new RWSFacade(rwsSocket));
  });

server.listen(HTTP_PORT);


console.log('[listen ESS] port', HTTP_PORT);
console.log('[listen WS] port', HTTP_PORT);

