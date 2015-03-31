angular.module('nightOwl.controllers.allEventsCtrl', ['ionic'])


.config(function($stateProvider) {

  $stateProvider.state('tab.allevents', {
    url: '/allevents',
    views: {
      'tab-allevents': {
        templateUrl: 'templates/tab-allevents.html',
        controller: 'allEventsCtrl'
      }
    }
  })
})

.controller('allEventsCtrl', function($scope, $stateParams, $location, $ionicScrollDelegate, $ionicModal, eventManager) {

  function getEvents() {
    eventManager.getEvents().then(function(events){ 
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
  }

  $scope.$on('eventManagerUpdated', function(ev) {
    getEvents();
  });

  // Be sure to call thi
  getEvents();
    

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
});