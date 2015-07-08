
var MiniFrame = {};

/**
 * Adds accessors (get,set) to specified Class for specified properties
 *
 * @param {Function} Class
 * @param {Array<String>} properties
 */
MiniFrame.accessors = function(Class, properties) {};

/**
 * Delegates specified methods of Class to corresponding methods of object,
 * stored in property specified by opts.to
 *
 * @param {Function} Class
 * @param {String} opts.to: instance property of Class
 * @param {Array<String>} opts.methods: list of methods
 */
MiniFrame.delegate = function(Class, opts) {};

module.exports = MiniFrame;
