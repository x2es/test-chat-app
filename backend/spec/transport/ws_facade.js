
var expect = require('chai').expect;

describe('WSFacade', function() {
  describe('ws disconnected', function() {
    it('should trigger DisconnectHandler');
  });

  describe('ws accept message', function() {
    it('should trigger MessageHandler');
    it('should pass message as Object');
  });

  describe('sending message to ws', function() {
    it('should call ws.send');
    it('should pass message as serialized json');
  });
});
