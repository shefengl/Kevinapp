angular.module('nightOwl.controllers.homeCtrl', ['ionic'])

.config(function($stateProvider) {
  $stateProvider.state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/tab-home.html',
        controller: 'homeCtrl'
      }
    }
  })
})

.controller('homeCtrl', function($scope, eventManager) {

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  function getEvents() {

    var today = new Date();
    var tomorrow = addDays(today, 1);
    var dayAfter = addDays(today, 2);

    // Set event variables
    eventManager.getEventsByDate(today).then(function(events) {
      $scope.eventsToday = events;
    });
    eventManager.getEventsByDate(tomorrow).then(function(events) {
      $scope.eventsTomorrow = events;
    });
    eventManager.getEventsByDate(dayAfter).then(function(events) {
      $scope.eventsDayAfter = events;
    });

    // Set announcements
    eventManager.getAnnouncements().then(function(announcements){
      $scope.announcements = announcements;
    });
  }

  getEvents();

  $scope.$on('eventManagerUpdated', function(ev) {
    getEvents();
  });


});