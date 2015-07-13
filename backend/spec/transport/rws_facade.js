
var expect = require('chai').expect;
var sinon = require('sinon');

var RWSFacade = require('../../lib/transport/rws_facade.js');

describe('RWSFacade', function() {
  var rws, rwsFacade;

  beforeEach(function() {
    rws = {};
    rwsFacade = null;
  });

  describe('rws accept message', function() {
    var messageHandler;

    beforeEach(function() {
      messageHandler = null;
      rws.onData = function(handler) {
        messageHandler = handler;
      };

      rwsFacade = new RWSFacade(rws);
    });

    it('should trigger MessageHandler', function() {
      var spy = sinon.spy();
      rwsFacade.onMessage(spy);

      expect(messageHandler).to.be.an('function');
      messageHandler.apply(rws, [ { opcode: 1, payload: JSON.stringify({ a: 'sdf' }) } ]);

      expect(spy.calledOnce).ok;
    });

    it('should pass message as Object', function() {
      var spy = sinon.spy();
      rwsFacade.onMessage(spy);

      var msg = { pay: 'load' };
      messageHandler.apply(rws, [ { opcode: 1, payload: JSON.stringify(msg) }  ]);

      expect(spy.calledOnce).ok;
      expect(spy.firstCall.args[0]).deep.equal(msg);
    });
  });

});
