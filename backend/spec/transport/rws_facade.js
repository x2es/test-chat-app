
var expect = require('chai').expect;
var sinon = require('sinon');

var RWSFacade = require('../../lib/transport/rws_facade.js');

describe('RWSFacade', function() {
  var rws, rwsFacade;

  beforeEach(function() {
    rws = {};
    rwsFacade = null;
  });

  describe.skip('rws disconnected', function() {
    var disconnectHandler;

    beforeEach(function() {
      disconnectHandler = null;
      rws.on = function(eventName, handler) {
        if (eventName === 'close') disconnectHandler = handler;
      };

      rwsFacade = new RWSFacade(rws);
    });

    it('should trigger DisconnectHandler', function() {
      var spy = sinon.spy();
      rwsFacade.onDisconnected(spy);

      expect(disconnectHandler).to.be.an('function');
      disconnectHandler.apply(rws);

      expect(spy.calledOnce).ok;
    });
  });

  describe('rws accept message', function() {
    var messageHandler;

    beforeEach(function() {
      messageHandler = null;
      rws.onMessage = function(handler) {
        messageHandler = handler;
      };

      rwsFacade = new RWSFacade(rws);
    });

    it('should trigger MessageHandler', function() {
      var spy = sinon.spy();
      rwsFacade.onMessage(spy);

      expect(messageHandler).to.be.an('function');
      messageHandler.apply(rws, [ JSON.stringify({ a: 'sdf' }) ]);

      expect(spy.calledOnce).ok;
    });

    it('should pass message as Object', function() {
      var spy = sinon.spy();
      rwsFacade.onMessage(spy);

      var msg = { pay: 'load' };
      messageHandler.apply(rws, [ JSON.stringify(msg) ]);

      expect(spy.calledOnce).ok;
      expect(spy.firstCall.args[0]).deep.equal(msg);
    });
  });

  describe('sending message to rws', function() {
    beforeEach(function() {
      rws.send = sinon.spy();
      rwsFacade = new RWSFacade(rws);
    });

    it('should call rws.send', function() {
      rwsFacade.send({});
      expect(rws.send.calledOnce).ok;
    });

    it('should pass message as serialized json', function() {
      var msg = { pay: 'load' };
      rwsFacade.send(msg);
      expect(rws.send.firstCall.args[0]).equal(JSON.stringify(msg));
    });
  });
});
