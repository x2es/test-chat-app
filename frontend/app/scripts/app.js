'use strict';

/**
 * @ngdoc overview
 * @name frontendApp
 * @description
 * # frontendApp
 *
 * Main module of the application.
 */
angular
  .module('frontendApp', [
    'ngAnimate',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngMessages'
  ])

  .value('sseUrl', 'http://localhost:12001/')
  .value('wsUrl', 'ws://localhost:12001/')

  .config(function ($routeProvider) {
    $routeProvider
      // .when('/about', {
      //   templateUrl: 'views/about.html',
      //   controller: 'AboutCtrl',
      //   controllerAs: 'about'
      // })
      .when('/chat-ws', {
        templateUrl: 'views/chat.html',
        controller: 'ChatWSCtrl',
        controllerAs: 'chatWS'
      })
      .when('/chat-sse', {
        templateUrl: 'views/chat.html',
        controller: 'ChatSSECtrl',
        controllerAs: 'chatSSE'
      })
      .otherwise({
        redirectTo: '/chat-sse'
      });
  });
