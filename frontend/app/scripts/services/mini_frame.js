'use strict';


var MiniFrame = {};

function createSetter(propName) {
  return (function(val) { this['_' + propName] = val; });
}

function createGetter(propName) {
  return (function() { return (this['_' + propName]); });
}

/**
 * Adds accessors (get,set) to specified Class for specified properties
 * 
 * Example:
 *   accessors(Peer, ['uid']);
 *
 * @param {Function} Class
 * @param {Array<String>} properties
 */
MiniFrame.accessors = function(Class, properties) {
  for (var i=0; i<properties.length; i++) {
    var prop = properties[i];
    var suffix = prop.charAt(0).toUpperCase() + prop.slice(1);
    Class.prototype['get' + suffix] = createGetter(prop);
    Class.prototype['set' + suffix] = createSetter(prop);
  }
};

/**
 * Delegates specified methods of Class to corresponding methods of object,
 * stored in property specified by opts.to
 *
 * Example:
 *   delegate(Peer, {
 *     methods: ['onDisconnected', 'onMessage', 'send']
 *     to: '_transportFacade', 
 *   });
 *
 * @param {Function} Class
 * @param {Array<String>} opts.methods: list of methods
 * @param {String} opts.to: instance property of Class
 */
MiniFrame.delegate = function(Class, opts) {
  var methods = opts.methods;
  var to = opts.to;
  for (var i=0; i<methods.length; i++) {
    var method = methods[i];
    
    (function(Class, method, to) {
      Class.prototype[method] = function() {
        var target = this[to];
        var args = Array.prototype.slice.call(arguments);
        target[method].apply(target, args);
      };
    })(Class, method, to);
  }
};


/**
 * @param {Function} Class
 * @param {Array<String>} events
 */
MiniFrame.events = function(Class, events) {

  events.forEach(function(ev) {
    var evCap = ev.charAt(0).toUpperCase() + ev.slice(1);
    var onName = 'on' + evCap;
    var fireName = '_fire' + evCap;

    Class.prototype[onName] = function(handler) {
      if (this._evHandlers == undefined) this._evHandlers = {};
      if (this._evHandlers[ev] == undefined) this._evHandlers[ev] = [];

      this._evHandlers[ev].push(handler);

      return this;    // chainable
    }

    Class.prototype[fireName] = function() {
      if (this._evHandlers == undefined) return;
      if (this._evHandlers[ev] == undefined) return;

      var args = Array.prototype.slice.call(arguments);

      var handlers = this._evHandlers[ev];
      for (var i=0; i<handlers.length; i++) {
        var handler = handlers[i];
        handler.apply(this, args);
      }
    }
  });

};


/**
 * @ngdoc service
 * @name frontendApp.miniFrame
 * @description
 * # miniFrame
 * Factory in the frontendApp.
 */
// angular.module('frontendApp').factory('miniFrame', function () { return MiniFrame; });
