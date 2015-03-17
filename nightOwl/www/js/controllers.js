angular.module('nightOwl.controllers', [])

.controller('NearbyCtrl', function($scope) {})
.controller('HomeCtrl', function($scope, EventManager) {

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  var today = new Date();
  var tomorrow = addDays(today, 1);
  var dayAfter = addDays(today, 2);

  // Set event variables
	$scope.eventsToday = EventManager.getEventsByDate(today);
	$scope.eventsTomorrow = EventManager.getEventsByDate(tomorrow);
	$scope.eventsDayAfter = EventManager.getEventsByDate(dayAfter);

  // Set announcements
  $scope.announcements = EventManager.getAnnouncements();
})

.controller('AlleventsCtrl', function($scope, EventManager) {
	var events = EventManager.getAllEvents();

  $scope.events = {};
  $scope.months = iterateMonths(events);//['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  // Create autodividers for events
  var date;

  for(var i = 0; i < events.length; i++) {
    date = new Date(events[i].startDate).toDateString();

    if(!$scope.events[date]) $scope.events[date] = [];

    $scope.events[date].push ( events[i] );
  }

  function iterateMonths(events) {
    var months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    var res = [];
    for (var i = 0; i < months.length; i++) {
      res[i] = {};
      res[i].name = months[i];
      res[i].date = months[i];

      for (var j = 0; j < events.length; j++) {
        var d = new Date(events[j].startDate);
        if (d.getMonth() == i) {
          res[i].date = d.toDateString();
          break;
        }
      }
    }
    return res;
  }
})

.controller('MyeventsCtrl', function($scope) {

})

.controller('MoreCtrl', function($scope) {

});
