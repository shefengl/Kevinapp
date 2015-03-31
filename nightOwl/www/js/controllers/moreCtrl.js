angular.module('nightOwl.controllers.moreCtrl', ['ionic'])


.config(function($stateProvider) {

  $stateProvider.state('tab.more', {
    url: '/more',
    views: {
      'tab-more': {
        templateUrl: 'templates/tab-more.html',
        controller: 'moreCtrl'
      }
    }
  })
})

.controller('moreCtrl', function($scope) {

});