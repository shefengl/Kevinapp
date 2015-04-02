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
            
       		$scope.isEditMode = $stateParams.isEditMode;

        eventManager.getFavoriteEvents().then(function(favoriteevents){
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
					eventManager.removeEventFromFavorites(events[i]);
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
  
  
    
});