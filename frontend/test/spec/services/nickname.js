'use strict';

describe('Service: nickname', function () {

  // load the service's module
  beforeEach(module('frontendApp'));

  // instantiate service
  var nickname;
  beforeEach(inject(function (_nickname_) {
    nickname = _nickname_;
  }));

  it('should do something', function () {
    expect(!!nickname).toBe(true);
  });

});
