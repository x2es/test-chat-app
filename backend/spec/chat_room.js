
var expect = require('chai').expect;

describe('ChatRoom', function() {
  
  describe('membership', function() {
    it('should invite specified peer');
    it('should dismiss disconnected peer');
  });

  describe('broadcast', function() {
    it('should broadcast message to all other peers');
    it('should not send message to origin');
  });

  describe('incomming message', function() {
    it('should broadcast incomming message');
  });

});
