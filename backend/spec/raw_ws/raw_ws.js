
var expect = require('chai').expect;

var rws = require('../../lib/raw_ws/lib.js');

// Snippets for internal tests
//   Sec-WebSocket-Key  dGhlIHNhbXBsZSBub25jZQ==
//   GUID               258EAFA5-E914-47DA-95CA-C5AB0DC85B11
//   SHA-1(wskey+GUID): b37a4f2cc0624f1690f64606cf385945b2bec4ea
//   bse64(SHA1(...)): s3pPLMBiTxaQ9kYGzzhZRbK+xOo=

describe('RawWebsocket', function() {
  it('should parse frame', function() {
    var frame = '818e69c51fe221a0738e06e5688d1ba97bc348e4';
    var expected = 'Hello world!!!';

    var frameBuffer = new Buffer(frame, 'hex');

    var parsed = rws.parseFrame(frameBuffer);
    expect(parsed.payload).equal(expected);
    expect(parsed.opcode).equal(rws.OPCODE_TEXT);
  });

  it('should build frame', function() {
    var payload = 'Hello world!!!';
    var expected = '810e48656c6c6f20776f726c64212121';

    var frameBuffer = rws.buildFrame({ opcode: rws.OPCODE_TEXT, payload: payload });

    expect(frameBuffer.toString('hex')).equal(expected);
  });
});
