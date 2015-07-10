'use strict';

describe('Service: webSocketEndpoint', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var webSocketEndpoint;
  beforeEach(inject(function (_webSocketEndpoint_) {
    webSocketEndpoint = _webSocketEndpoint_;
  }));

  it('should do something', function () {
    expect(!!webSocketEndpoint).toBe(true);
  });

});
