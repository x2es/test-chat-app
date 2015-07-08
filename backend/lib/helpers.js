Helpers = {};

/**
 * @param {Array<*>} arr
 * @param {*} query
 * @param {Function<item, query>:int(-1,0,+1)} comparator
 * @return {int} index in array || -1
 */
Helpers.indexOf = function(arr, query, comparator) {
  for (var i=0; i<arr.length; i++) {
    if (comparator(arr[i], query) === 0) return (i);
  }
  return (-1);
};

module.exports = Helpers;
