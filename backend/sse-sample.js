var PORT = 11001;

var http = require('http');
var SSEMiddleware = require('./lib/transport/sse_middleware.js');

var sseMiddleware = new SSEMiddleware();

sseMiddleware
  .config('cors', true)
  .onConnection(function(endpoint) {
    var i=0;

    function sending() {
      endpoint.send({ i: i++, text: 'a b\n\nc' });
      setTimeout(sending, 1000);
    }

    sending();
  });

http.createServer(function(req, res) {
  
  // handle text/event-stream
  if (sseMiddleware.handle(req, res)) return;

  // other middleware
  // ...
}).listen(PORT);

console.log('[listen] port', PORT)

// 
// Browsesr test snippet:
//   var eSource = new EventSource('http://localhost:11001/');
//   eSource.onerror = function() { console.log('[error]', arguments); };
//   eSource.onopen = function() { console.log('[open]', arguments); }; 
//   eSource.onmessage = function(e) { console.log('[msg]', e.data, arguments); };")
//
