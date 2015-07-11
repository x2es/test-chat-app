var ESS_PORT = 12001;
var WS_PORT = 12002;

var http = require('http');
var SSEMiddleware = require('./lib/transport/sse_middleware.js');
var WSServer = require('ws').Server;

var sseMiddleware = new SSEMiddleware();

sseMiddleware
  .config('cors', true)
  .onConnection(function(endpoint) {
    // ...
  });

http.createServer(function(req, res) {
  
  // handle text/event-stream
  if (sseMiddleware.handle(req, res)) return;

  // other middleware
  // ...
}).listen(PORT);

console.log('[listen] port', PORT)

// sseMidleware.onConnection(function(endpoint) {
//   chatRoom.invite(
//     new Peer(
//       new HybridFacade(
//         new WebSocketFacade(??),    // incomming
//         new SSEFacade(endpoint)     // outgoing
//       )
//     )
//   );
// });

