'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ChatSseCtrl
 * @description
 * # ChatSseCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  /**
   * @extends ChatCtrl
   */
  .controller('ChatSSECtrl', function ($scope, $controller, ssePort, webSocketEndpoint, sseEndpoint) {
    var endpoint = {};

    var sseUrl = 'http://localhost:' + ssePort + '/';
    var wsUrl = 'ws://localhost:' + ssePort + '/';

    var sseEP = sseEndpoint.connect(sseUrl);
    var wsEP = webSocketEndpoint.connect(wsUrl);
    wsEP.setReady('paired', false);

    // TODO
    sseEP.onOpen(function() {
      $scope.connection = { $error: { failed: false } };
      $scope.$apply();
    });

    sseEP.onError(function(){
      $scope.connection = { $error: { failed: true } };
      $scope.$apply();
    });

    sseEP.onMessage(function(msg) {

      // TODO: care about lifecycle of this event
      if (msg.type != undefined && msg.type === 'pair') {
        wsEP.send(msg, { system: true });
        // TODO: wait success answer before .setReady('paired')
        wsEP.setReady('paired');
        return;
      }

      $scope.messages.push(msg);
      $scope.$apply();
    });


    endpoint.send = wsEP.send.bind(wsEP);

    angular.extend(this, $controller('ChatCtrl', { $scope: $scope, endpoint: endpoint }));
  });
