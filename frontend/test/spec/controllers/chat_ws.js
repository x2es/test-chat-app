'use strict';

describe('Controller: ChatWsCtrl', function () {

  // load the controller's module
  beforeEach(module('frontendApp'));

  var ChatWsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChatWsCtrl = $controller('ChatWsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChatWsCtrl.awesomeThings.length).toBe(3);
  });
});
