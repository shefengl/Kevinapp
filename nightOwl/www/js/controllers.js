angular.module('nightOwl.controllers', ['ionic'])

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
  EventManager.getEventsByDate(today, function(events) {
    $scope.eventsToday = events;
  });
  EventManager.getEventsByDate(tomorrow, function(events) {
    $scope.eventsTomorrow = events;
  });
  EventManager.getEventsByDate(today, function(events) {
    $scope.eventsDayAfter = dayAfter;
  });

  // Set announcements
  EventManager.getAnnouncements(function(announcements){
    $scope.announcements = announcements;
  });
})

.controller('AlleventsCtrl', function($scope, $stateParams, $location, $ionicScrollDelegate, $ionicModal, EventManager) {
	EventManager.getEvents(function(events){

    $scope.events = {};
    $scope.months = iterateMonths(events);

    // Create autodividers for events
    var date;

    for(var i = 0; i < events.length; i++) {
      date = new Date(events[i].startDate).toDateString();

      if(!$scope.events[date]) $scope.events[date] = [];

      $scope.events[date].push ( events[i] );
    }

    // Create a months array with names and dates
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
  });


  // Click month event
  $scope.gotoList = function(id){
    $location.hash(id);
    $ionicScrollDelegate.anchorScroll();
  }

  // Filter modal
  $ionicModal.fromTemplateUrl('templates/modal-filter.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openFilterModal = function() {
    $scope.modal.show();
  };
  $scope.closeFilterModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
})

.controller('MyeventsCtrl', function($scope,$stateParams, $ionicModal,  EventManager) {
	EventManager.getFavoriteEvents(function(favoriteevents){
		$scope.isEditMode = $stateParams.isEditMode;
    	$scope.favoriteevents = {};
		// Create autodividers for events
    	var date;

    	for(var i = 0; i < favoriteevents.length; i++) {
      		date = new Date(favoriteevents[i].startDate).toDateString();
      		if(!$scope.favoriteevents[date]) $scope.favoriteevents[date] = [];
				$scope.favoriteevents[date].push ( favoriteevents[i] );
    	}
  	});
	
	$scope.checkedEvents = {};
	$scope.checkedNum = 0;
	
	$scope.setEditMode = function(editmode){
		$scope.isEditMode = editmode;
	};
	$scope.removeCheckedEvents = function(){
		EventManager.getEvents(function(events){
			for(var i = 0; i < events.length; i++) {
    	  		if($scope.checkedEvents[events[i].id])
				{
					EventManager.removeEventFromFavorites(events[i],function(){});
					$scope.checkedEvents[events[i].id] = false;
					$scope.checkedNum --;
				}
			}
  		});
		EventManager.getFavoriteEvents(function(favoriteevents){
			$scope.isEditMode = $stateParams.isEditMode;
    		$scope.favoriteevents = {};
			// Create autodividers for events
    		var date;

    		for(var i = 0; i < favoriteevents.length; i++) {
      			date = new Date(favoriteevents[i].startDate).toDateString();
      			if(!$scope.favoriteevents[date]) $scope.favoriteevents[date] = [];
				$scope.favoriteevents[date].push ( favoriteevents[i] );
    		}
  		});
	};
	
	$scope.clickonbox = function(eventid){
		if($scope.checkedEvents[eventid] == true)
		{
			$scope.checkedEvents[eventid] = false;
			$scope.checkedNum --;
		}else
		{
			$scope.checkedEvents[eventid] = true;
			$scope.checkedNum ++;
		}
	};
	// Filter modal
  $ionicModal.fromTemplateUrl('templates/modal-filter.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(filermodal) {
    $scope.filermodal = filermodal;
  });
  $scope.openFilterModal = function() {
    $scope.filermodal.show();
  };
  $scope.closeFilterModal = function() {
    $scope.filermodal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.filermodal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  
  
})

.controller('MoreCtrl', function($scope) {

})

.controller('EventDetailCtrl', function($scope, $stateParams, $ionicHistory,$ionicModal, EventManager) {
  EventManager.getEvent($stateParams.eventId, function(event){
    $scope.event = event;
    EventManager.getEventPark(event, function(park) {
      $scope.park = park;
    });
  });
  $scope.goBack = function() {
    $ionicHistory.goBack();
  };
  
  // Filter modal
  $ionicModal.fromTemplateUrl('templates/modal-addtomyevent.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(myeventsmodal) {
    $scope.myeventsmodal = myeventsmodal;
  });
  $scope.openMyEventsModal = function(event) {
	EventManager.addEventToFavorites(event,function(){});
    $scope.myeventsmodal.show();
  };
  $scope.closeMyEventsModal = function() {
    $scope.myeventsmodal.hide();
  };
  $scope.isFavoriteEvent = function(event){
	return EventManager.isFavoriteEvent(event,function(){});
  };
  $scope.removeMyEvent = function(event) {
	EventManager.removeEventFromFavorites(event,function(){});
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