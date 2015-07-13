'use strict';

// TODO: optimize usage of functions like isSystem(), isMe(), getNickname()
//       too many refreshes

/**
 * @ngdoc function
 * @name frontendApp.controller:ChatCtrl
 * @description
 * # ChatCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ChatCtrl', function ($scope, nickname, endpoint) {
    var appealExclude;

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

    function sendTyping() {
      if ($scope.preventSendingTyping) return;
      console.log('send typing');
      $scope.preventSendingTyping = true;
      setTimeout(function() { $scope.preventSendingTyping = false; }, 3000);    // 3sec - freq limit

      endpoint.send({ from: getNickname(), type: 'typing' });
    }

    var typersTimers = {};
    function removeTyper(name) {
      var i = $scope.typers.indexOf(name);
      if (i === -1) return;
      $scope.typers.splice(i,1);
      $scope.$apply();
    }

    function typingEvent(msg) {
      console.log('typingEvent', msg);
      var typer = msg.from;
      if ($scope.typers.indexOf(msg.from) === -1) {
        $scope.typers.push(typer);
        $scope.$apply();
      }
      var timer = typersTimers[typer];
      if (timer != undefined) clearTimeout(timer);
      timer = setTimeout(function() {
        removeTyper(typer);
        var timer = typersTimers[typer];
        if (timer != undefined) clearTimeout(timer);
      }, 5000);
      typersTimers[typer] = timer;
    }

    $scope.defaultNickname = nickname;

    $scope.noOneTyping = true;
    $scope.typers = [];

    $scope.$watchCollection('typers', function() {
      if ($scope.typers.length === 0) $scope.noOneTyping = true;
      else $scope.noOneTyping = false;
    });

    $scope.messages = [
      { from: getNickname(), body: 'Which difference between #/chat-sse and #/chat-ws?' },
      { from: 'Konstantin Ivanov', body: 'I have implemented two versions of chat-server.\n#/chat-see comunicates with server using two channel: Server-Sent Events for incomming and WebSocket for outgoing data.' },
      { from: 'Konstantin Ivanov', body: '#/chat-ws use WebSocket for sending data in both directions.' },
      { from: getNickname(), body: 'My name is too weird..' },
      { from: 'Konstantin Ivanov', body: 'Just type another one!' },
      { from: 'Konstantin Ivanov', body: 'Hint, you may click on my name to put it into textbox.' },
    ];

    $scope.$watchCollection('messages', function(newValue) {
      if (newValue) { 
        var el = angular.element('.conversation');
        el.scrollTop(el[0].scrollHeight); 
      }
    });

    $scope.incommingMessage = function(msg) {
      if (msg.type === 'typing') {
        typingEvent(msg);
        return;
      }

      $scope.messages.push(msg);
      $scope.$apply();
    };

    initMessageInput();

    introduce();

    $scope.send = function() {
      if ($scope.inp_message === '') return;
      var msg = { from: getNickname(), body: $scope.inp_message };
      endpoint.send(msg);
      $scope.messages.push(msg);
      initMessageInput();
      focusInput();
    };

    $scope.nicknameKeypress = function(e) {
      if (e.charCode === 13) focusInput();
    };

    $scope.inputKeypress = function(e) {
      sendTyping();

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
      return (message.from === getNickname());
    };

    // TODO: maybe it will be filter
    $scope.br = function(text) {
      // TODO: sanitiaze before replacing
      return (text.replace('\n', '<br />'));
    };
  });
