angular.module('nightOwl.controllers.eventDetailCtrl', ['ionic'])

// Config block contains the state declaration
.config(function($stateProvider) {

  $stateProvider.state('tab.event-all', {
    url: '/event-all/:eventId',
    views: {
      'tab-allevents': {
        templateUrl: 'templates/event-detail.html',
        controller: 'eventDetailCtrl'
      }
    }
  })

  .state('tab.event-home', {
    url: '/event-home/:eventId',
    views: {
      'tab-home': {
        templateUrl: 'templates/event-detail.html',
        controller: 'eventDetailCtrl'
      }
    }
  });
})

// Controller block binds app logic in Event Manager to $scope
.controller('eventDetailCtrl', function($scope, $stateParams, $ionicHistory,$ionicModal, eventManager) {
  eventManager.getEvent($stateParams.eventId).then( function(event){
    $scope.event = event;
    eventManager.getEventPark(event).then(function(park) {
      $scope.park = park;
    });
    eventManager.getEventShowtimes(event).then(function(showtime){
        $scope.showtime=showtime;
    });
  });
  
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
    
  // Filter modal
  $ionicModal.fromTemplateUrl('templates/modal-savetoevent.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(myeventsmodal) {
    $scope.myeventsmodal = myeventsmodal;
  });
  $scope.openMyEventsModal = function(event) {
	eventManager.addEventToFavorites(event).then(function(){});
    $scope.myeventsmodal.show();
  };
  $scope.closeMyEventsModal = function() {
    $scope.myeventsmodal.hide();
  };
  $scope.isFavoriteEvent = function(event){
	return eventManager.isFavoriteEvent(event,function(){});
  };
  $scope.removeMyEvent = function(event) {
	eventManager.removeEventFromFavorites(event).then(function(){});
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.myeventsmodal.remove();
  });
  
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
});