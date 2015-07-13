'use strict';

// TODO: DRY with WSEndpoint

(function(angular) {

  /**
   * @constructor
   * @param {EventSource} eSource
   */
  function SSEEndpoint(eSource) {
    this._eSource = eSource;
    this._bindESourceEvents();
  }

  MiniFrame.events(SSEEndpoint, [

    'open', 

    /**
     * @param {error} error
     */
    'error', 

    /**
     * @param {Message} message
     */
    'message'
  ]);

  SSEEndpoint.prototype._bindESourceEvents = function() {
    (function(endpoint, eSource){
      eSource.onmessage = function(e) {
        endpoint._fireMessage(JSON.parse(e.data));
      }

      eSource.onerror = function(e) {
        endpoint._fireError(e);
      }

      eSource.onopen = function() {
        endpoint._fireOpen();
      }

    })(this, this._eSource);
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

})(angular);

