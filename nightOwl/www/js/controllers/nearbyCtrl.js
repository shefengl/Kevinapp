angular.module('nightOwl.controllers.nearbyCtrl', [])


.config(function($stateProvider) {

  $stateProvider.state('tab.nearby', {
    url: '/nearby',
    views: {
      'tab-nearby': {
        templateUrl: 'templates/tab-nearby.html',
        controller: 'nearbyCtrl'
      }
    }
  })
})

.controller('nearbyCtrl', function($scope) {

});