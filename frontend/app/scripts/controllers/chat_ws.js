'use strict';

/**
 * @ngdoc function
 * @name frontendApp.controller:ChatWSCtrl
 * @description
 * # ChatWsCtrl
 * Controller of the frontendApp
 */
angular.module('frontendApp')
  .controller('ChatWSCtrl', function ($scope, $controller, wsPort, webSocketEndpoint) {
    var endpoint;

    var wsUrl = 'ws://localhost:' + wsPort + '/';

    // TODO: DRY
    function connectWebSocket() {
      endpoint = webSocketEndpoint.connect(wsUrl);

      endpoint.onError(function(){
        $scope.connection = { $error: { failed: true } };
        $scope.$apply();
      });

      endpoint.onOpen(function() {
        $scope.connection = { $error: { failed: false } };
        $scope.$apply();
      });

      endpoint.onClose(function(){
        $scope.connection = { $error: { failed: true } };
        $scope.$apply();
      });

      endpoint.onMessage(function(msg) {
        $scope.messages.push(msg);
        $scope.$apply();
      });
    }

    connectWebSocket();

    angular.extend(this, $controller('ChatCtrl', { $scope: $scope, endpoint: endpoint }));
  });
