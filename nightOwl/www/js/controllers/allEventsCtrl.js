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


  function groupEvents(groupingFunction){
    $scope.groupedEvents = {};
    var group;
    for(var i = 0; i < $scope.events.length; i++) {
      group = groupingFunction($scope.events[i]);
      if(!$scope.groupedEvents[group]) $scope.groupedEvents[group] = [];
      $scope.groupedEvents[group].push ( $scope.events[i] );
    }
  }

  $scope.groupEventsByDate = function() {
    $scope.grouping = "Date";

    function formatDate(date) {
      var dateString = new Date(date).toDateString();
      var split = dateString.split(" ");
      switch (split[0]) {
        case "Mon": split[0] = "MONDAY"; break;
        case "Tue": split[0] = "TUESDAY"; break;
        case "Wed": split[0] = "WEDNESDAY"; break;
        case "Thu": split[0] = "THURSDAY"; break;
        case "Fri": split[0] = "FRIDAY"; break;
        case "Sat": split[0] = "SATURDAY"; break;
        case "Sun": split[0] = "SUNDAY"; break;
      }

      return split[0] + ", " + split[1] + " " + split[2];
    }

    groupEvents(function(ev){
      return formatDate(ev.startDate);//new Date(ev.startDate).toDateString();
    });
  }

  $scope.groupEventsAlphabetically = function() {
    $scope.grouping = "Alphabetical";
    groupEvents(function(ev){
      return ev.name.substring(0,1).toUpperCase();
    });
  }

  function getEvents() {
    eventManager.getEvents().then(function(events){

      $scope.events = events;
      $scope.months = iterateMonths(events);
      
      $scope.groupEventsByDate();

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

  // Be sure to call this when first loading this.
  getEvents();

  // Click month event
  $scope.gotoList = function(id){
    $location.hash(id);
    $ionicScrollDelegate.anchorScroll();
  }

  // Filter modal
  $scope.currentFilter = "";
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
  $scope.selectFilter = function(filter) {
    // Do animation?
    var prefix = '';
    $scope.currentFilter = filter;

    // Create style
    switch (filter) {
      case 'Movies': prefix = 'movie'; break;
      case 'Music': prefix = 'music'; break;
      case 'Festival': prefix = 'festival'; break;
      case 'Theater': prefix = 'theater'; break;
      case 'Dancing': prefix = 'dance'; break;
      case 'Family Fun': prefix = 'family'; break;
    }
    $scope.filterStyleFont = prefix + "Font";
    $scope.filterStyleBg = prefix + "Bg";
  };
});