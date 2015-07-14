'use strict';

(function(angular) {

  /**
   * NOTE:  ws object may be specified later
   *        it allows to accomulate outgoing messages queue
   *        before actual socket builded
   *        This feature used for init ws connection on events
   *        in sse connection.
   *
   * @constructor
   * @param {WebSocket} ws [optional]
   */
  function WSEndpoint(ws) {
    this._ws = ws;
    this._queue = [];
    this._queueSys = [];

    this._resetRedyState();
    this.setReady('open', false);

    if (this._ws != undefined) this._bindWSEvents();
  }

  MiniFrame.events(WSEndpoint, [

    'open', 'close', 'error',

    /**
     * @param {Message} message
     */
    'message'
  ]);

  WSEndpoint.prototype._resetRedyState = function() {
    this._readyState = {
      open: false
      // may be extended by outside
    };
  }

  WSEndpoint.prototype.connect = function(url) {
    this._ws = new WebSocket(url);
    this._bindWSEvents();
  };

  WSEndpoint.prototype.close = function() {
    this._ws.close();
    this._resetRedyState();
  }

  WSEndpoint.prototype._bindWSEvents = function() {
    (function(endpoint, ws) {
      ws.onerror = function() {
        endpoint._fireError();
      };

      ws.onopen = function() {
        endpoint.setReady('open');
        endpoint.flush();
      };

      ws.onclose = function() {
        endpoint._fireClose();
      };

      ws.onmessage = function(e) {
        endpoint._fireMessage(JSON.parse(e.data));
      }
    })(this, this._ws);
  }

  /**
   * @param {String} state
   * @param {Boolean} value [optional] [default: true]
   */
  WSEndpoint.prototype.setReady = function(state, value) {
    var v = true;
    if (value === false) v = false;

    this._readyState[state] = v;
    this.flush();
  };

  /**
   * @param {Array<State>} states [default: all] [optional]
   */
  WSEndpoint.prototype.isReady = function(states) {
    var s = states;
    if (s == undefined) s = Object.keys(this._readyState);
    for (var i=0; i<s.length; i++) {
      var state = s[i];
      if (this._readyState[state] !== true) return (false);
    };

    return (true);
  };

  /**
   * @param {Object} obj
   * @param {Boolean} opts.system [default: false] [optional]
   */
  WSEndpoint.prototype.send = function(obj, opts) {
    var o = opts || {};
    var queue = this._queue;
    if (o.system === true) queue = this._queueSys;

    queue.push(JSON.stringify(obj));
    this.flush();
  };

  WSEndpoint.prototype.flush = function() {
    // TODO: DRY
    if (this.isReady()) {
      while (this._queueSys.length > 0) {
        this._ws.send(this._queueSys.shift());
      }
      while (this._queue.length > 0) {
        this._ws.send(this._queue.shift());
      }
      return;
    }

    if (this.isReady(['open'])) {
      while (this._queueSys.length > 0) {
        this._ws.send(this._queueSys.shift());
      }
    }
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
   * @return {WSEndpoint}
   */
  WSEndpointFactory.prototype.build = function() {
    var wsEndpoint = new WSEndpoint();
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
})(angular);
