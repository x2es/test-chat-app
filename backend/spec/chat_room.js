
var expect = require('chai').expect;
var sinon = require('sinon');

var ChatRoom = require('../lib/chat_room.js');
var Peer = require('../lib/peer.js');

describe('ChatRoom', function() {
  var chatRoom;
  beforeEach(function() {
    chatRoom = new ChatRoom();
  });
  
  describe('membership', function() {

    it('should invite specified peer', function() {
      var nop = function() {};
      var transport = { 
        onDisconnected: nop,
        onMessage: nop
      };

      var peer1 = new Peer(transport);
      var peer2 = new Peer(transport);

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
      var transport = {
        onDisconnected: function(handler) {
          disconnectHandler = handler;
        },
        onMessage: function() {}
      };

      var peer = new Peer(transport);
      chatRoom.invite(peer);
      
      disconnectHandler.apply(transport);

      expect(chatRoom.isMember(peer)).not.ok;

    });
  });

  describe('broadcast', function() {

    var nop = function() {};

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
      var message = { body: 'msg' };
      ep1._newMessageHandler.apply(ep1, [ message ]);

      expect(ep2.send.calledOnce).ok;
      expect(ep3.send.calledOnce).ok;

      expect(ep2.send.firstCall.args[0]).equal(message);
      expect(ep3.send.firstCall.args[0]).equal(message);
    });

    it('should not send message to origin', function() {
      var message = { body: 'msg' };
      ep1._newMessageHandler.apply(ep1, [ message ]);

      expect(ep1.send.callCount).equal(0);
    });
  });

  // NOTE: tested by "broadcast" section
  //       better to test it separately
  // describe('incomming message', function() {
  //   it('should broadcast incomming message');
  // });

});