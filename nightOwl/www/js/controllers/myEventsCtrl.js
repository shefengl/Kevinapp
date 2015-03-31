angular.module('nightOwl.controllers.myEventsCtrl', ['ionic'])

.config(function($stateProvider) {
  $stateProvider.state('tab.myevents', {
    url: '/myevents/:isEditMode',
    views: {
      'tab-myevents': {
        templateUrl: 'templates/tab-myevents.html',
        controller: 'myEventsCtrl'
      }
    }
  })
})

.controller('myEventsCtrl', function($scope, $stateParams, $ionicModal, eventManager) {
   
    
    eventManager.getFavoriteEvents().then(function(favoriteevents){
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
		eventManager.getEvents().then(function(events){
			for(var i = 0; i < events.length; i++) {
    	  		if($scope.checkedEvents[events[i].id])
				{
					eventManager.removeEventFromFavorites(events[i]).then(function(){});
					$scope.checkedEvents[events[i].id] = false;
					$scope.checkedNum --;
				}
			}
  		});
		eventManager.getFavoriteEvents().then(function(favoriteevents){
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

  
  
    
});