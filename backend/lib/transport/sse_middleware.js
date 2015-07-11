
var SSEEndpoint = require('./sse_endpoint.js');

// TODO: breaking conneciton from both sides


/**
 * HTTP server middleware to handle 'text/event-stream'
 * @param {Boolean} opts.cors [default: false]; true - enable CORS 
 */
function SSEMiddleware() {
  this._opts = {
    cors: false
  };

  this._connectionHandlers = [];
};

/**
 * @param {String} key
 * @param {*} value
 * @returns {SSEMiddleware}
 */
SSEMiddleware.prototype.config = function(key, value) {
  this._opts[key] = value;
  return (this);
};

/**
 * @param {Function(SSEEndpoint)} handler
 */
SSEMiddleware.prototype.onConnection = function(handler) {
  this._connectionHandlers.push(handler);
};

/**
 * If req.headers.accept is 'text/event-stream'
 *   handles request
 *   returns true
 * else
 *   no action
 *   returns false
 *
 * @param {IncommingMessage} req
 * @param {ServerResponse} res
 * @return {Boolean}
 */
SSEMiddleware.prototype.handle = function(req, res) {
  if (req.headers.accept !== 'text/event-stream') return (false);

  this._establishConnection(res);
  this._fireOnConnection(new SSEEndpoint(res));

  return (true);
};


/**
 * @param {SSEEndpoint} endpoint
 */
SSEMiddleware.prototype._fireOnConnection = function(endpoint) {
  var handlers = this._connectionHandlers;
  for (var i=0; i<handlers.length; i++) {
    handlers[i].apply(this, [ endpoint ]);
  }
};

/**
 * @param {ServerResponse} res
 */
SSEMiddleware.prototype._establishConnection = function(res) {
  var headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
  };

  if (this._opts.cors) headers['Access-Control-Allow-Origin'] = '*'; // ISSUE: may not work in FireFox
  res.writeHead(200, headers);  
}


module.exports = SSEMiddleware;
