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
    eventManager.getEventShowtimes(event).then(function(showtimes){
        $scope.showtimes=showtimes;
    });
    $scope.date=new Date(event.startDate).toDateString();

    $scope.isFavoriteEvent=function(event){
      eventManager.isFavoriteEvent(event);
    };
  
    $scope.removeMyEvent = function(event) {
	eventManager.removeEventFromFavorites(event);
    //event.isFavorite='false';
  };
    var prefix = '';

    // Create style
    switch (event.category) {
      case 'Movies': prefix = 'movie'; break;
      case 'Music': prefix = 'music'; break;
      case 'Festival': prefix = 'festival'; break;
      case 'Theater': prefix = 'theater'; break;
      case 'Dancing': prefix = 'dance'; break;
      case 'Family Fun': prefix = 'family'; break;
    }
    $scope.filterStyleFont = prefix + "Font";
    $scope.filterStyleBg = prefix + "Bg";

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
	eventManager.addEventToFavorites(event);
    //event.isFavorite='true';
    $scope.myeventsmodal.show();
  };
  $scope.closeMyEventsModal = function() {
    $scope.myeventsmodal.hide();
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