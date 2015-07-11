
// TODO: refactor for reuse mocks

var expect = require('chai').expect;
var sinon = require('sinon');

var ChatRoom = require('../lib/chat_room.js');
var Peer = require('../lib/peer.js');
var MessageFactory = require('../lib/message_factory.js');

describe('ChatRoom', function() {
  var nop = function() {};

  var chatRoom;
  beforeEach(function() {
    chatRoom = new ChatRoom();
  });
  
  describe('membership', function() {

    it('should invite specified peer', function() {
      var nop = function() {};
      var endpoint = { 
        onDisconnected: nop,
        onMessage: nop
      };

      var peer1 = new Peer(endpoint);
      var peer2 = new Peer(endpoint);

      expect(chatRoom.isMember(peer1)).equal(false, 'case 0.1');
      expect(chatRoom.isMember(peer2)).equal(false, 'case 0.2');

      chatRoom.invite(peer1);
      expect(chatRoom.isMember(peer1)).equal(true, 'case 1.1');
      expect(chatRoom.isMember(peer2)).equal(false, 'case 1.2');

      chatRoom.invite(peer2);
      expect(chatRoom.isMember(peer1)).equal(true, 'case 2.1');
      expect(chatRoom.isMember(peer2)).equal(true, 'case 1.2');
    });

    it('should dismiss disconnected peer', function() {
      var disconnectHandler = null;
      var endpoint = {
        onDisconnected: function(handler) {
          disconnectHandler = handler;
        },
        onMessage: function() {}
      };

      var peer = new Peer(endpoint);
      chatRoom.invite(peer);
      
      disconnectHandler.apply(endpoint);

      expect(chatRoom.isMember(peer)).not.ok;

    });
  });

  describe('broadcast', function() {

    var tmpCnt = 0;

    function mockEndPoint() {
      return({
        onDisconnected: nop,
        onMessage: function(handler) {
          this._newMessageHandler = handler;
        },
        send: sinon.spy()
      });
    }

    var peer1, peer2, peer3, ep1, ep2, ep3;

    beforeEach(function() {
      ep1 = mockEndPoint();
      ep2 = mockEndPoint();
      ep3 = mockEndPoint();
      peer1 = new Peer(ep1);
      peer2 = new Peer(ep2);
      peer3 = new Peer(ep3);

      chatRoom.invite(peer1);
      chatRoom.invite(peer2);
      chatRoom.invite(peer3);

    });

    it('should broadcast message to all other peers', function() {
      var message = { some: 'msg' };
      ep1._newMessageHandler.apply(ep1, [ message ]);

      expect(ep2.send.calledOnce).ok;
      expect(ep3.send.calledOnce).ok;

      expect(ep2.send.firstCall.args[0]).equal(message);
      expect(ep3.send.firstCall.args[0]).equal(message);
    });

    it('should not send message to origin', function() {
      var message = { some: 'msg' };
      ep1._newMessageHandler.apply(ep1, [ message ]);

      expect(ep1.send.callCount).equal(0);
    });

    it('should not send message to exclueded peers', function() {
      chatRoom.broadcast({ some: 'msg' }, { exclude: [ peer2.getUid() ] });
      expect(ep2.send.callCount).equal(0);
    });
  });

  describe('incomming message', function() {
    var peer, onMessageHandler;

    beforeEach(function() {
      peer = {
        getUid: function() { return (1212) },
        onDisconnected: nop,
        onMessage: function(handler) {
          onMessageHandler = handler;
        },
        send: sinon.spy()
      }
      chatRoom.invite(peer);

      sinon.stub(chatRoom, 'broadcast');
    });

    describe('when .type field specified', function() {
      it('should not broadcast messages by default', function() {
        onMessageHandler.apply(peer, [ { body: 'abc', type: 'xyz' } ]);
        expect(chatRoom.broadcast.callCount).equal(0);
      });

      describe('="name"', function() {
        it('should broadcast name introducion for type="name"', function() {
          onMessageHandler.apply(peer, [ MessageFactory.name('John') ]);
          expect(chatRoom.broadcast.calledOnce).ok;
          var msg = chatRoom.broadcast.firstCall.args[0];
          expect(msg.origin).equal(0);
          expect(msg.body).contains('John');
        });

        it('should not send message to origin', function() {
          onMessageHandler.apply(peer, [ MessageFactory.name('John') ]);
          var exclude = chatRoom.broadcast.firstCall.args[1].exclude;
          console.log(exclude);
          expect(exclude).to.contain(peer.getUid());
        });

        it('should send welcome to peer', function() {
          onMessageHandler.apply(peer, [ MessageFactory.name('John') ]);
          expect(peer.send.calledOnce).ok;
          expect(peer.send.firstCall.args[0].body).include('Welcome');
        });

      });

    });

  });
});
