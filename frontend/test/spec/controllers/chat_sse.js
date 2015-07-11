'use strict';

describe('Controller: ChatSseCtrl', function () {

  // load the controller's module
  beforeEach(module('tangoChatApp'));

  var ChatSseCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ChatSseCtrl = $controller('ChatSseCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ChatSseCtrl.awesomeThings.length).toBe(3);
  });
});
