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

/**
 * @constructor
 */
function BufferIterator(buffer) {
  this._buffer = buffer;
  this._offset = 0;
}

BufferIterator.prototype.readUIntBE = function(length) {
  var res = this._buffer.readUIntBE(this._offset, length);
  this._offset += length;
  return res;
};

BufferIterator.prototype.writeUIntBE = function(val, length) {
  this._buffer.writeUIntBE(val, this._offset, length);
  this._offset += length;
};

BufferIterator.prototype.write = function(string) {
  this._buffer.write(string, this._offset);
  var length = this._buffer.length - this._offset;
  this._offset += length;
};

/**
 * @param {Buffer} target
 * @param {int} length [optional]
 */
BufferIterator.prototype.copy = function(target, length) {
  var end;
  var l = length;
  if (l != undefined) end = this._offset + l;
  else {
    // TODO: check it tomorrow
    l = this._buffer.length - this._offset;
  }
  var res = this._buffer.copy(target, 0, this._offset, end);
  this._offset += l;
};


Helpers.BufferIterator = BufferIterator;

module.exports = Helpers;
