'use strict';

/**
 * @constructor
 * @param {WebSocket} ws
 */
function WSEndpoint(ws) {
  this._ws = ws;
  this._queue = [];
  this._messageHandlers = [];
  this._errorHandlers = [];

  this._bindWSEvents();

  // (function(endpoint, ws) {
  //   ws.onerror = function() {
  //     endpoint._fireErrorHandlers();
  //   };

  //   ws.onopen = function() {
  //     endpoint.setReady();
  //     endpoint.flush();
  //   };

  //   ws.onmessage = function(e) {
  //     endpoint._fireMessageHandlers(JSON.parse(e.data));
  //   }
  // })(this, this._ws);
}

WSEndpoint.prototype._bindWSEvents = function() {
  (function(endpoint, ws) {
    ws.onerror = function() {
      endpoint._fireErrorHandlers();
    };

    ws.onopen = function() {
      endpoint.setReady();
      endpoint.flush();
    };

    ws.onmessage = function(e) {
      endpoint._fireMessageHandlers(JSON.parse(e.data));
    }
  })(this, this._ws);
}

WSEndpoint.prototype.setReady = function() {
  this._ready = true;
};

WSEndpoint.prototype.isReady = function() {
  return (this._ready === true);
};

/**
 * @param {Function(msg)} handler
 */
WSEndpoint.prototype.onMessage = function(handler) {
  this._messageHandlers.push(handler);
}

WSEndpoint.prototype.onError = function(handler) {
  this._errorHandlers.push(handler);
}

/**
 * @param {Object} msg
 */
WSEndpoint.prototype._fireMessageHandlers = function(msg) {
  var handlers = this._messageHandlers;
  for (var i=0; i<handlers.length; i++) {
    handlers[i].apply(this, [msg]);
  }
}

WSEndpoint.prototype._fireErrorHandlers = function() {
  var handlers = this._errorHandlers;
  for (var i=0; i<handlers.length; i++) {
    handlers[i].apply(this);
  }
}

/**
 * @param {Object} obj
 */
WSEndpoint.prototype.send = function(obj) {
  this._queue.push(JSON.stringify(obj));
  this.flush();
};

WSEndpoint.prototype.flush = function() {
  if (!this.isReady()) return;
  while (this._queue.length > 0) this._ws.send(this._queue.shift());
}


/**
 * @constructor
 */
function WSEndpointFactory() {}

/**
 * @param {String} websocket url
 * @return {WSEndpoint}
 */
WSEndpointFactory.prototype.connect = function(url) {
  var wsEndpoint = new WSEndpoint(new WebSocket(url));
  return (wsEndpoint);
};

/**
 * @ngdoc service
 * @name frontendApp.webSocketEndpoint
 * @description
 * # webSocketEndpoint
 * Factory in the frontendApp.
 */
angular.module('frontendApp')
  .service('webSocketEndpoint', WSEndpointFactory);
