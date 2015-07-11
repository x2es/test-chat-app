
var expect = require('chai').expect;
var sinon = require('sinon');

var HybridChannel = require('../../lib/transport/hybrid_channel.js');

describe('HybridChannel', function() {
  it('should buffer event-handlers while no incomming endpoint', function() {
    var hybridChannel = new HybridChannel();

    var handler1 = 'h1';
    var handler2 = 'h2';
    var handler3 = 'h3';

    hybridChannel.onMessage(handler1);
    hybridChannel.onMessage(handler2);
    hybridChannel.onMessage(handler3);

    var endpoint = {
      onMessage: sinon.spy()
    };

    hybridChannel.setIncomming(endpoint);

    expect(endpoint.onMessage.callCount).equal(3);
    expect(endpoint.onMessage.getCall(0).args[0]).equal(handler1);
    expect(endpoint.onMessage.getCall(1).args[0]).equal(handler2);
    expect(endpoint.onMessage.getCall(2).args[0]).equal(handler3);

  });
});
