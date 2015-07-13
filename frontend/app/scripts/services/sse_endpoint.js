'use strict';

// TODO: DRY with WSEndpoint

/**
 * @constructor
 * @param {EventSource} eSource
 */
function SSEEndpoint(eSource) {
  this._eSource = eSource;
  this._messageHandlers = [];
  this._errorsHandlers = [];
  this._openHandlers = [];

  this._bindESourceEvents();
}

SSEEndpoint.prototype._bindESourceEvents = function() {
  (function(endpoint, eSource){
    eSource.onmessage = function(e) {
      endpoint._fireMessageHandlers(JSON.parse(e.data));
    }

    eSource.onerror = function(e) {
      endpoint._fireErrorHandlers(e);
    }

    eSource.onopen = function() {
      endpoint._fireOpenHandlers();
    }

  })(this, this._eSource);
};

/**
 * @param {Function(Message)} handler
 */
SSEEndpoint.prototype.onMessage = function(handler) {
  this._messageHandlers.push(handler);
};

/**
 * @param {Message} msg
 */
SSEEndpoint.prototype._fireMessageHandlers = function(msg) {
  var handlers = this._messageHandlers;
  for (var i=0; i<handlers.length; i++) {
    handlers[i].apply(this, [msg]);
  }
};

/**
 * @param {Function(error)} handler
 */
SSEEndpoint.prototype.onError = function(handler) {
  this._errorsHandlers.push(handler);
};

/**
 * @param {error} msg
 */
SSEEndpoint.prototype._fireErrorHandlers = function(error) {
  var handlers = this._errorsHandlers;
  for (var i=0; i<handlers.length; i++) {
    handlers[i].apply(this, [error]);
  }
};

/**
 * @param {Function()} handler
 */
SSEEndpoint.prototype.onOpen = function(handler) {
  this._openHandlers.push(handler);
};

SSEEndpoint.prototype._fireOpenHandlers = function() {
  var handlers = this._openHandlers;
  for (var i=0; i<handlers.length; i++) {
    handlers[i].apply(this, []);
  }
};

/**
 * @constructor
 */
function SSEEndpointFactory() {}

/**
 * @param {String} url
 */
SSEEndpointFactory.prototype.connect = function(url) {
  var sseEndpoint = new SSEEndpoint(new EventSource(url));
  return (sseEndpoint);
}

/**
 * @ngdoc service
 * @name frontendApp.sseEndpoint
 * @description
 * # sseEndpoint
 * Service in the frontendApp.
 */
angular.module('frontendApp')
  .service('sseEndpoint', SSEEndpointFactory);
