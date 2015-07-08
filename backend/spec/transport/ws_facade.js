
var expect = require('chai').expect;
var sinon = require('sinon');

var WSFacade = require('../../lib/transport/ws_facade.js');

describe('WSFacade', function() {
  var ws, wsFacade;

  beforeEach(function() {
    ws = {};
    wsFacade = null;
  });

  describe('ws disconnected', function() {
    var disconnectHandler;

    beforeEach(function() {
      disconnectHandler = null;
      ws.on = function(eventName, handler) {
        if (eventName === 'close') disconnectHandler = handler;
      };

      wsFacade = new WSFacade(ws);
    });

    it('should trigger DisconnectHandler', function() {
      var spy = sinon.spy();
      wsFacade.onDisconnected(spy);

      expect(disconnectHandler).to.be.an('function');
      disconnectHandler.apply(ws);

      expect(spy.calledOnce).ok;
    });
  });

  describe('ws accept message', function() {
    var messageHandler;

    beforeEach(function() {
      messageHandler = null;
      ws.on = function(eventName, handler) {
        if (eventName === 'message') messageHandler = handler;
      };

      wsFacade = new WSFacade(ws);
    });

    it('should trigger MessageHandler', function() {
      var spy = sinon.spy();
      wsFacade.onMessage(spy);

      expect(messageHandler).to.be.an('function');
      messageHandler.apply(ws, ['{}']);

      expect(spy.calledOnce).ok;
    });

    it('should pass message as Object', function() {
      var spy = sinon.spy();
      wsFacade.onMessage(spy);

      var msg = { pay: 'load' };
      messageHandler.apply(ws, [ JSON.stringify(msg) ]);

      expect(spy.calledOnce).ok;
      expect(spy.firstCall.args[0]).deep.equal(msg);
    });
  });

  describe('sending message to ws', function() {
    beforeEach(function() {
      ws.send = sinon.spy();
      wsFacade = new WSFacade(ws);
    });

    it('should call ws.send', function() {
      wsFacade.send({});
      expect(ws.send.calledOnce).ok;
    });

    it('should pass message as serialized json', function() {
      var msg = { pay: 'load' };
      wsFacade.send(msg);
      expect(ws.send.firstCall.args[0]).equal(JSON.stringify(msg));
    });
  });
});
