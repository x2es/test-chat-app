
var expect = require('chai').expect;
var sinon = require('sinon');

var Peer = require('../lib/peer.js');

describe('Peer', function() {
  describe('uid', function() {
    it('should be generated on creation', function() {
      var peer = new Peer();
      expect(peer.getUid()).exist;
    });

    it('should be unique', function() {
      var peer1 = new Peer();
      var peer2 = new Peer();
      expect(peer1.getUid()).not.equal(peer2.getUid());
    });
  });

  describe('connection', function() {
    describe('delegation to transport facade', function() {
      var peer, transport, marker;
      beforeEach(function() {
        marker = 'check me';
        transport = {
          onDisconnected: sinon.spy(),
          onMessage: sinon.spy(),
          send: sinon.spy()
        };
        peer = new Peer(transport);
      });
      it('should delegate onDisconnected', function() {
        peer.onDisconnected(marker);
        expect(transport.onDisconnected.calledOnce).ok;
        expect(transport.onDisconnected.firstCall.args[0]).equal(marker);
      });

      it('should delegate onMessage', function() {
        peer.onMessage(marker);
        expect(transport.onMessage.calledOnce).ok;
        expect(transport.onMessage.firstCall.args[0]).equal(marker);
      });

      it('should delegate send', function() {
        peer.send(marker);
        expect(transport.send.calledOnce).ok;
        expect(transport.send.firstCall.args[0]).equal(marker);
      });
    });
  });

});

