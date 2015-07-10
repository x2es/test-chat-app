'use strict';

/**
 * @ngdoc service
 * @name frontendApp.nickname
 * @description
 * # nickname
 * Generates funny nicknames using syllables set.
 */
angular.module('frontendApp')
  .factory('nickname', function () {
    var syllables = ('chi at om na fi pa tam nik la son dav').split(' ');
    var nameLength = Math.floor(Math.random(2)) + 2;
    var nickname = '';
    for (var i=0; i<nameLength; i++) {
      nickname += syllables[Math.floor(Math.random() * syllables.length)];
    }

    return (nickname.charAt(0).toUpperCase() + nickname.slice(1));
  });
