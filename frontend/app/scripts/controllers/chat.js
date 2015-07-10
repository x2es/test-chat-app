'use strict';

// TODO: optimize using functions like isSystem(), isMe(), getNickname()
//       too many refreshes

/**
 * @ngdoc function
 * @name frontendApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ChatCtrl', function ($scope, serverUrl, webSocketEndpoint, nickname) {
    var endpoint, appealExclude;

    function connectWebSocket() {
      endpoint = webSocketEndpoint.connect(serverUrl);

      endpoint.onError(function(){
        $scope.connection = { $error: { failed: true } };
      });

      endpoint.onMessage(function(msg) {
        $scope.messages.push(msg);
        $scope.$apply();
      });
    }

    function introduce() {
      // TODO: may be implemented as protocol library
      endpoint.send({ type: 'name', body: getNickname() });
    }

    function getNickname() {
      return $scope.nickname || $scope.defaultNickname;
    };

    function initMessageInput() {
      $scope.inp_message = '';
      appealExclude = [ getNickname() ];
    }

    function focusInput() {
      angular.element('.message-input').trigger('focus');
    }

    $scope.defaultNickname = nickname;

    $scope.messages = [
      { from: 'Foo', body: 'Hi all!' },
      { from: 'Bar', body: 'Hi, Foo!' },
      { from: 'Baz', body: 'Hi, Foo, Bar!' }
    ];

    initMessageInput();

    connectWebSocket();
    introduce();

    $scope.send = function() {
      if ($scope.inp_message === '') return;
      var msg = { from: getNickname(), body: $scope.inp_message };
      endpoint.send(msg);
      $scope.messages.push(msg);
      initMessageInput();
    };

    $scope.inputKeypress = function(e) {
      if (e.altKey === true || e.ctrlKey === true || e.metaKey === true || e.shiftKey === true) return;
      if (e.charCode === 13) {
        $scope.send();
        e.preventDefault();
      }
    };

    $scope.appealTo = function(i) {
      var nickname = $scope.messages[i].from;
      if (appealExclude.indexOf(nickname) !== -1) return;
      appealExclude.push(nickname);
      $scope.inp_message += nickname + ', ';
      focusInput();
    };

    $scope.getNickname = getNickname;

    $scope.isSystem = function(message) {
      return (message.origin === 0);
    };

    $scope.isMe = function(message) {
      console.log('isMe');
      return (message.from === getNickname());
    };

    // TODO: maybe it will be filter
    $scope.br = function(text) {
      // TODO: sanitiaze before replacing
      return (text.replace('\n', '<br />'));
    };
  });
