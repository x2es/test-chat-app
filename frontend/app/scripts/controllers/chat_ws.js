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

    function connectionError() {
      $scope.connection = { $error: { failed_ws: true } };
      $scope.$apply();
    }

    endpoint = webSocketEndpoint.connect(wsUrl);

    endpoint.onError(connectionError);
    endpoint.onClose(connectionError);

    endpoint.onOpen(function() {
      $scope.connection = { $error: { failed_ws: false } };
      $scope.$apply();
    });

    endpoint.onMessage(function(msg) {
      $scope.messages.push(msg);
      $scope.$apply();
    });


    angular.extend(this, $controller('ChatCtrl', { $scope: $scope, endpoint: endpoint }));
  });
