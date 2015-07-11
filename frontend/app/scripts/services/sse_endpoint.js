'use strict';

// TODO: DRY with WSEndpoint

/**
 * @constructor
 * @param {EventSource} eSource
 */
function SSEEndpoint(eSource) {
  this._eSource = eSource;
  this._messageHandlers = [];

  this._bindESourceEvents();
}

SSEEndpoint.prototype._bindESourceEvents = function() {
  (function(endpoint, eSource){
    eSource.onmessage = function(e) {
      endpoint._fireMessageHandlers(JSON.parse(e.data));
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
