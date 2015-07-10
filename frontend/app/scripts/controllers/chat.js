'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ChatCtrl', function ($scope) {
    $scope.nickname = 'Opolusy';

    var appealExclude;

    function initMessageInput() {
      $scope.inp_message = '';
      appealExclude = [];
    }

    initMessageInput();

    $scope.messages = [
      { from: 'Foo', body: 'Hi all!' },
      { from: 'Bar', body: 'Hi, Foo!' },
      { from: 'Baz', body: 'Hi, Foo, Bar!' }
    ];

    $scope.send = function() {
      $scope.messages.push({ from: $scope.nickname, body: $scope.inp_message });
      initMessageInput();
    };

    $scope.appealTo = function(i) {
      var nickname = $scope.messages[i].from;
      if (appealExclude.indexOf(nickname) !== -1) return;
      appealExclude.push(nickname);
      $scope.inp_message += nickname + ', ';
    };

    $scope.isSystem = function(message) {
      return (message.origin === 0);
    };

    $scope.tmp_systemMessage = function() {
      $scope.messages.push({ origin: 0, body: $scope.inp_sysMessage });
      $scope.inp_sysMessage = '';
    }
  });
