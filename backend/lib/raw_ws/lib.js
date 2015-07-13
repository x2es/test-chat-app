
var lg = require('../dev/debug.js').lg;

var crypto = require('crypto');
var BufferIterator = require('../helpers.js').BufferIterator;

// TODO: this is amibgous name
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
var OPCODE_CLOSE    = 8;

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


/**
 * @param {String} key: Sec-WebSocket-Accept value
 */
RawWebSocket.handshakeKey = function handshakeKey(key) {
  var hk0 = sha1(key + WS_GUID);
  return (new Buffer(hk0, 'hex').toString('base64'));
};

/**
 * @param {String} secWebsocketKey: is http header['Sec-WebSocket-Key']
 */
RawWebSocket.buildHandshakeHeaders = function(secWebSocketKey) {
  return ('HTTP/1.1 101 Web Socket Protocol Handshake\r\n'
           + 'Upgrade: WebSocket\r\n'
           + 'Connection: Upgrade\r\n'
           + 'Sec-WebSocket-Accept: ' + RawWebSocket.handshakeKey(secWebSocketKey) + '\r\n'
           + '\r\n'
  );
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

  if (fin === 0) throw new Error({ code: 1003, message: 'RawWebSocket#parseFrame() FIN=0 unsupported!' });

  // TODO: fail on fin == 0: unsupported
  var opcode = buf & MASK_OPCODE;   // 1: text; 2: bin; 0: continue; 8: connection close
  // TODO: fail on unsupported opcode
  // TODO: fail on RSVx == 1: error

  frame.opcode = opcode;

  buf = bi.readUIntBE(1);

  var maskFl = (buf & MASK_MASK_FL) >> 7;
  var len = (buf & MASK_LEN);

  lg('fin: %d; opcode: %d', fin, opcode);
  lg('mask: %d; len: %d (buf: %d)', maskFl, len, buf);

  var payloadLength = len;

  // TODO
  if (len === 0) return ({ opcode: opcode, payload: '' });

  if (len === 126) {
    payloadLength = bi.readUIntBE(2);
  }
  else if (len === 127) {
    payloadLength = bi.readUIntBE(8);
    // TODO: most significant bit MUST be 0
  }

  lg('[in] payloadLength:', payloadLength);

  var mask;
  if (maskFl === 1) {
    // TODO: may be array
    mask = new Buffer(4);

    bi.copy(mask, 4);

    lg('[in] mask:', mask.toString('hex'));
  }
  else {
    // TODO: fail on mask = 0: client should mask
  }

  // TODO: read extension data

  var payloadBuffer = new Buffer(payloadLength);

  lg('[in] payload offset:', bi._offset);
  lg('[in:empty] payloadBuffer.length: %d, Buffer.byteLength(payloadBuffer): %d', payloadBuffer.length, Buffer.byteLength(payloadBuffer.toString('utf8')));

  bi.copy(payloadBuffer, payloadLength);

  lg('[in:masked] payloadBuffer.length: %d, Buffer.byteLength(payloadBuffer): %d', payloadBuffer.length, Buffer.byteLength(payloadBuffer.toString('utf8')));

  if (maskFl === 1) {
    // TODO: unmask
    
    // T[i] = O[i] xor M[i mod 4]
    // O[i] = T[i] xor M[i mod 4]

    for (var i=0; i<payloadLength; i++) {
      bufByte = payloadBuffer.readUIntBE(i,1);
      maskByte = mask.readUIntBE(i % 4, 1);

      payloadBuffer.writeUIntBE(bufByte ^ maskByte, i, 1);
    }
  }

  lg('[in:unmasked] payloadBuffer.length: %d, Buffer.byteLength(payloadBuffer): %d', payloadBuffer.length, Buffer.byteLength(payloadBuffer.toString('utf8')));

  var frame = {
    opcode: opcode
  };

  switch (opcode) {
    case OPCODE_TEXT:
      frame.payload = payloadBuffer.toString('utf8');
      break;

    case OPCODE_CLOSE:
      var payloadBufferIterator = new BufferIterator(payloadBuffer);
      frame.code = payloadBuffer.readUIntBE(2);
      if (payloadBuffer.length > 2)
        frame.message = payloadBuffer.toString('utf8');
      else
        frame.message = '';
      break;

    default:
      frame.error = 'opcode unsupported';
  }

  return frame;
};

/**
 * TODO: define DataFrame
 * @param {DataFrame} frame
 * @return {Buffer}
 */
RawWebSocket.buildFrame = function buildFrame(frame) {
  // calc buffer size

  var extensionLength = 0;      // not implemented
  var MASK_PAYLOAD = 0;        // on server always false

  var lengthRange = LEN_7;

  var payloadLength;
  switch (frame.opcode) {
    case OPCODE_TEXT:
      payloadLength = Buffer.byteLength(frame.payload, 'utf8');
      break;
    case OPCODE_CLOSE:
      payloadLength = 2 + Buffer.byteLength(frame.message);
      break
    default:
      throw new Error('[RawWebSocket.buildFrame()] unsupported opcode: ' + frame.opcode);
  }

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

  lg('[out] payloadLength: %d; B.2: %d', payloadLength, payloadLengthFragment);

  if (MASK_PAYLOAD === 1) frameLength += 4;

  frameLength += payloadLength;

  var frameBuffer = new Buffer(frameLength);

  var fin     = FINAL_FRAGMENT;
  var opcode  = frame.opcode;
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

  switch (frame.opcode) {
    case OPCODE_TEXT:
      bi.write(frame.payload);
      break;
    case OPCODE_CLOSE:
      bi.writeUIntBE(frame.code, 2);
      bi.write(frame.message);
      break;
  }

  return frameBuffer;
};

module.exports = RawWebSocket;
