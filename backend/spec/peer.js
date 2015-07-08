
var expect = require('chai').expect;

describe('Peer', function() {
  describe('uid', function() {
    it('should be generated on creation');
    it('should be unique');
  });

  describe('connection', function() {
    describe('delegation to transport facade', function() {
      it('should delegate onDisconnected');
      it('should delegate onMessage');
      it('should delegate send');
    });
  });

});

