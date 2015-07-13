'use strict';

describe('Service: miniFrame', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var miniFrame;
  beforeEach(inject(function (_miniFrame_) {
    miniFrame = _miniFrame_;
  }));

  it('should do something', function () {
    expect(!!miniFrame).toBe(true);
  });

});
