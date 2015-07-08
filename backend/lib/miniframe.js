
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

module.exports = MiniFrame;
