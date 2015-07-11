'use strict';

describe('Service: sseEndpoint', function () {

  // load the service's module
  beforeEach(module('tangoChatApp'));

  // instantiate service
  var sseEndpoint;
  beforeEach(inject(function (_sseEndpoint_) {
    sseEndpoint = _sseEndpoint_;
  }));

  it('should do something', function () {
    expect(!!sseEndpoint).toBe(true);
  });

});
