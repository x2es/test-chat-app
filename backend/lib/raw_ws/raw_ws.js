
// TODO: debug stuff
var debug = true;

var crypto = require('crypto');

var RawWebSocket = {};

var WS_GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';

var MASK_FIN      = 0x80;   // 1000 0000
var MASK_OPCODE   = 0x0F;   // 0000 1111

var MASK_MASK_FL  = 0x80;   // 1000 0000
var MASK_LEN      = 0x7F;   // 0111 1111

var LEN_7   = 0;
var LEN_16  = 2;
var LEN_64  = 8;

var FINAL_FRAGMENT  = 1
var OPCODE_TEXT     = 1;

RawWebSocket.OPCODE_TEXT = OPCODE_TEXT;


/**
 * @param {String} data
 * @return {String}
 */
function sha1(data) {

  // https://nodejs.org/api/crypto.html#crypto_crypto_createhash_algorithm
  var sha1hash = crypto.createHash('sha1');
  sha1hash.write(data);

  // TODO: digest is not best way, and legacy
  return(sha1hash.digest('hex'));
};

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


/**
 * @param {String} key: Sec-WebSocket-Accept value
 */
RawWebSocket.handshakeKey = function handshakeKey(key) {
  var hk0 = sha1(key + WS_GUID);
  return (new Buffer(hk0, 'hex').toString('base64'));
};

/**
 * @param {Buffer} buffer
 * @return {String}
 */
RawWebSocket.parseFrame = function parseFrame(buffer) {

  var frame = {};

  var bi = new BufferIterator(buffer);
  var buf = bi.readUIntBE(1);
  
  var fin = (buf & MASK_FIN) >> 7;
  // TODO: fail on fin == 0: unsupported
  var opcode = buf & MASK_OPCODE;   // 1: text; 2: bin; 0: continue; 8: connection close
  // TODO: fail on unsupported opcode
  // TODO: fail on RSVx == 1: error

  frame.opcode = opcode;

  buf = bi.readUIntBE(1);

  var maskFl = (buf & MASK_MASK_FL) >> 7;
  var len = (buf & MASK_LEN);

  if (debug) {
    console.log('fin: %d; opcode: %d', fin, opcode);
    console.log('mask: %d; len: %d', maskFl, len);
  }

  if (len === 0) return ('');

  if (len === 126) {
    // TODO: read next 16bit for length
  }
  else if (len === 127) {
    // TODO: read next 64bit for length
    // TODO: most significant bit MUST be 0
  }

  var mask;
  if (maskFl === 1) {
    // TODO: may be array
    mask = new Buffer(4);

    bi.copy(mask, 4);
  }
  else {
    // TODO: fail on mask = 0: server should mask
  }

  // TODO: read extension data

  var payloadBuffer = new Buffer(len);

  bi.copy(payloadBuffer);

  if (maskFl === 1) {
    // TODO: unmask
    
    // T[i] = O[i] xor M[i mod 4]
    // O[i] = T[i] xor M[i mod 4]

    for (var i=0; i<len; i++) {
      bufByte = payloadBuffer.readUIntBE(i,1);
      maskByte = mask.readUIntBE(i % 4, 1);

      payloadBuffer.writeUIntBE(bufByte ^ maskByte, i, 1);
    }
  }

  return ({
    opcode: opcode,
    payload: payloadBuffer.toString('utf8')
  });
}

/**
 * @param {String} string
 * @return {Buffer}
 */
RawWebSocket.buildFrame = function buildFrame(string) {
  // calc buffer size

  var extensionLength = 0;      // not implemented
  var MASK_PAYLOAD = 0;        // on server always false

  var lengthRange = LEN_7;

  var payloadLength = Buffer.byteLength(string, 'utf8');

  var payloadLengthFragment = payloadLength;

  if (payloadLength > 125) {
    if (payloadLength > 65535) {
      lengthRange = LEN_64;
      payloadLengthFragment = 127;
    }
    else {
      lengthRange = LEN_16;
      payloadLengthFragment = 126;
    }
  }

  var frameLength = 2 + lengthRange;

  if (MASK_PAYLOAD === 1) frameLength += 4;

  frameLength += payloadLength;

  var frameBuffer = new Buffer(frameLength);

  var fin     = FINAL_FRAGMENT;
  var opcode  = OPCODE_TEXT;
  var maskFl  = MASK_PAYLOAD;



  var buf = (fin << 7) | (opcode);

  var bi = new BufferIterator(frameBuffer);
  bi.writeUIntBE(buf, 1);

  bi.writeUIntBE(payloadLengthFragment, 1);

  if (lengthRange != LEN_7) {
    bi.writeUIntBE(payloadLength, lengthRange);
  }

  if (MASK_PAYLOAD === 1) {
    // NOTE: no mask here in server implementation
  }

  bi.write(string);

  return frameBuffer;
}

module.exports = RawWebSocket;
