angular.module('nightOwl.controllers', [])

.controller('NearbyCtrl', function($scope) {})
.controller('HomeCtrl', function($scope, EventManager) {
	//$scope.test = {test: "testing"};
	//$scope.eventsToday = [{id: 1, name: "andy", showtime: "10-11pm", parkName:"parkname"},{id: 2, name: "andy", showtime: "10-11pm", parkName:"parkname"}];
	//$scope.eventsToday = EventManager.getAllEvents(); 

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  var today = new Date();
  var tomorrow = addDays(today, 1);
  var dayAfter = addDays(today, 2);
	$scope.eventsToday = EventManager.getEventsByDate(today);
	$scope.eventsTomorrow = EventManager.getEventsByDate(tomorrow);
	$scope.eventsDayAfter = EventManager.getEventsByDate(dayAfter);
})
.controller('AlleventsCtrl', function($scope) {
	$scope.events = EventManager.getAllEvents();
})
.controller('MyeventsCtrl', function($scope) {})
.controller('MoreCtrl', function($scope) {});
/*
.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
  
});
*/
