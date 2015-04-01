
var db = null;
 
 // Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('nightOwl', [
  'ionic', 
  'ngCordova',
  'nightOwl.services.dba', 
  'nightOwl.services.eventManager',
  'nightOwl.controllers.allEventsCtrl', 
  'nightOwl.controllers.eventDetailCtrl',
  'nightOwl.controllers.homeCtrl',
  'nightOwl.controllers.moreCtrl',
  'nightOwl.controllers.myEventsCtrl',
  'nightOwl.controllers.nearbyCtrl',
  'nightOwl.directives.eventRow'])

.run(function($ionicPlatform, $cordovaSQLite, $rootScope, eventManager) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    if (window.cordova) {
      // Copy to the app's document folder
      window.plugins.sqlDB.copy("nightowl.db", function() {
          db = $cordovaSQLite.openDB("nightowl.db");

        // TODO: remove this when we have web service and real data.
        eventManager.testingFormatDates().then(function(result){
          $rootScope.$broadcast('eventManagerUpdated');
        });
      }, function(error) {
        // DB already exists. Ignore the error
        //console.error("There was an error copying the database: " + error);
        db = $cordovaSQLite.openDB("nightowl.db");
        
        // TODO: remove this when we have web service and real data.
        eventManager.testingFormatDates().then(function(result){
          $rootScope.$broadcast('eventManagerUpdated');
        });
      });


    } else {
      // The following code is only executed on the browser. This is code that is only used for testing.
      // Ionic serve syntax
      db = window.openDatabase("nightowl.db", "1.0", "Night Owl", -1);

      // TODO: Data test section. Must be removed when we have web service updates and real data.
      // Create database based on testData.json
      eventManager.testingLoadFromJSON().then(function(result){
        eventManager.testingFormatDates();
        $rootScope.$broadcast('eventManagerUpdated');
      });
      // END TODO
    }

  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Place the tabs always at the bottom, regardless if it's Android.
  $ionicConfigProvider.tabs.position('bottom');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});
