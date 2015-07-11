
var expect = require('chai').expect;
var sinon = require('sinon');

var ChannelsController = require('../../lib/transport/channels_controller.js');
var HybridChannel = require('../../lib/transport/hybrid_channel.js');
var Peer = require('../../lib/peer.js');
var MessageFactory = require('../../lib/message_factory.js');

describe('ChannelsController', function() {
  function nop() {};

  var channelsController;

  beforeEach(function() {
    channelsController = new ChannelsController();
  });

  describe('[pairing channels]', function() {
    it('should send peer.id to newly connected SSE', function() {
      var sseEndpoint = {
        send: sinon.spy()
      };

      var hybridChannel = new HybridChannel();
      hybridChannel.setOutgoing(sseEndpoint);

      var peer = new Peer(hybridChannel);
      channelsController.addPeer(peer, hybridChannel);

      expect(sseEndpoint.send.calledOnce).ok;
      expect(sseEndpoint.send.firstCall.args[0]).deep.equal(MessageFactory.pair(peer.getUid()));
    });

    describe('[WebSocket type="pair" message]', function() {
      function fakePeer() {
        var hybridChannel = {
          setIncomming: sinon.spy(),
          send: nop
        };
        
        var peer = new Peer(hybridChannel);
        channelsController.addPeer(peer, hybridChannel);

        return ({
          peer: peer,
          hybridChannel: hybridChannel
        });
      }

      var wsOnMessageHandler, ws;

      beforeEach(function() {
        ws = {
          onMessage: function(handler) { wsOnMessageHandler = handler }
        }
      });

      it('should upgrade hybridChannel on receiving type="pair"', function() {
        var p1 = fakePeer();
        var p2 = fakePeer();
        var p3 = fakePeer();

        channelsController.addWebSocket(ws);
        wsOnMessageHandler.apply(ws, [ MessageFactory.pair(p2.peer.getUid()) ]);

        expect(p2.hybridChannel.setIncomming.calledOnce).ok;
        expect(p2.hybridChannel.setIncomming.firstCall.args[0]).equal(ws);

        expect(p1.hybridChannel.setIncomming.callCount).equal(0);
        expect(p3.hybridChannel.setIncomming.callCount).equal(0);
      });

      it('should not upgrade hybridChannel twice', function() {
        var p = fakePeer();

        channelsController.addWebSocket(ws);
        wsOnMessageHandler.apply(ws, [ MessageFactory.pair(p.peer.getUid()) ]);
        wsOnMessageHandler.apply(ws, [ MessageFactory.pair(p.peer.getUid()) ]);

        expect(p.hybridChannel.setIncomming.calledOnce).ok;
      });

      it('should not upgrade hybridChannel on type="!pair"', function() {
        var p = fakePeer();

        channelsController.addWebSocket(ws);
        var msg = MessageFactory.pair(p.peer.getUid());
        msg.type = 'bair';
        wsOnMessageHandler.apply(ws, [ msg ]);

        expect(p.hybridChannel.setIncomming.callCount).equal(0);
      });
    });

  })
});
