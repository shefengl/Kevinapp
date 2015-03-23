angular.module('nightOwl.services', [])

.factory('EventManager', function($http) {

  var cachedEvents = false;
  var events = [];
  var parks = [];
  var favoriteEvents = [];
  var announcements = [];

  function getData(callback) {
    if (cachedEvents){
      callback();
    } else {
      $http.get('js/testData.json').success(function(data) {
        events = data.events;
        parks = data.parks;
        announcements = data.announcements;

        function formatAMPM(date) {
          var hours = date.getHours();
          var minutes = date.getMinutes();
          var ampm = hours >= 12 ? 'pm': 'am';
          hours = hours % 12;
          hours = hours ? hours: 12; // the hour '0' should be '12'
          minutes = minutes < 10 ? '0'+minutes: minutes;
          var strTime = hours + ':' + minutes + ' ' + ampm;
          return strTime;
        }
        
        function addDays(date, days) {
          var result = new Date(date);
          result.setDate(date.getDate() + days);
          return result;
        }

        // Prepare useful data on events
        for (var i = 0; i < events.length; i++) {
          // TODO(andi): Remove this when moving to a real database. TESTING PURPOSES ONLY
          var date = new Date();
          if (i > 2) {
            date = addDays(date, 1);
            if (i > 4) {
              date = addDays(date, 1);
            }
          }
          date.setHours(9,0,0,0);
          events[i].startDate = date.toISOString();

          date.setHours(9,30,0,0);
          events[i].endDate = date.toISOString();

          // Assign park name, for convenience
          for (var j = 0; j < parks.length; j++) {
            if (events[i].parkId == parks[j].id) {
              events[i].parkName = parks[j].name;
              break;
            }
          }

          // Assign showtime for convenience purposes
          var startDate = new Date(events[i].startDate);
          var endDate = new Date(events[i].endDate);
          events[i].showtime = formatAMPM(startDate) + '-' + formatAMPM(endDate);
        }
		
		// Prepare useful data on announcements
		for (var i = 0; i < announcements.length; i++) {
		  // TODO(andi): Remove this when moving to a real database. TESTING PURPOSES ONLY
		  var date = new Date();
		  if (i > 2) {
			date = addDays(date, 1);
			if (i > 4) {
			  date = addDays(date, 1);
			}
		  }
		  date.setHours(9,0,0,0);
		  var oldStartDate = date.toISOString();
		
		  date.setHours(9,30,0,0);
		  var oldEndDate = date.toISOString();
		  
		  date.setHours(14,0,0,0);
		  var newStartDate = date.toISOString();
		
		  date.setHours(14,30,0,0);
		  var newEndDate = date.toISOString();
		  
		  // Assign event name, for convenience
		  for (var j = 0; j < events.length; j++) {
			if (announcements[i].eventId == events[j].id) {
			  announcements[i].eventName = events[j].name;
			  announcements[i].category= events[j].category;
			  break;
			}
		  }
		  
		  // Assign park name, for convenience
		  for (var j = 0; j < parks.length; j++) {
			if (announcements[i].oldParkId == parks[j].id) {
			  announcements[i].oldLocation = parks[j].name;
			}else if (announcements[i].newParkId == parks[j].id) {
			  announcements[i].newLocation = parks[j].name;
			}
		  }
		  
		  // Assign showtime for convenience purposes
		  announcements[i].oldShowTime = formatAMPM(new Date(oldStartDate)) + '-' + formatAMPM(new Date(oldEndDate));
		  announcements[i].newShowTime = formatAMPM(new Date(newStartDate)) + '-' + formatAMPM(new Date(newEndDate));
		}
		
		
		
        cachedEvents = true;
        callback();
      });
    }
  }
  
  return {
    getEvents: function(callback) {
      getData(function() {
        callback(events);
      });
    },
    getEvent: function(eventId, callback) {
      getData(function() {
        var result = null;
        for (var i = 0; i < events.length; i++) {
          if (events[i].id == eventId) {
            result = events[i];
            break;
          }
        }
        callback(result);
      });
    },
    getEventsByDate: function(date, callback) {
      getData(function() {
        date.setHours(0,0,0,0);
        var result = events.filter(
          function (event) {
            var eventDate = new Date(event.startDate);
            eventDate.setHours(0,0,0,0);
            return (eventDate.getTime() == date.getTime());
          }
        );
        callback(result);
      });
      
    },
    getEventsByCategory: function(category, callback) {
      getData(function(){
        var result = events.filter(
          function (event) {
            return (event.categories.indexOf(category) != -1);
          }
        );
        callback(result);
      });
    },
    getEventsByPark: function(parkId, callback) {
      getData(function(){
        var result = events.filter (
          function (event) {
            return (event.parkId == parkId);
          }
        );
        callback(result);
      });
    },
    getEventShowtimes: function(event, callback) {
      getData(function(){
        var result = events.filter (
          function (ev) {
            return (event.name == ev.name && event.id != ev.id);
          }
        );
        callback(result);
      });
    },
    addEventToFavorites: function(event, callback) {
      getData(function(){
        var index = favoriteEvents.indexOf(event);
        if (index == -1) {
          favoriteEvents.push(event);
        }
        callback();
      });
    },
    removeEventFromFavorites: function(event, callback) {
      getData(function(){
        var index = favoriteEvents.indexOf(event);
        if (index != -1) {
          favoriteEvents.splice(index, 1);
        }
        callback();
      });
    },
    getFavoriteEvents: function (callback) {
      getData(function(){
        callback(favoriteEvents);
      });
    },
    getAnnouncements: function(callback) {
      getData(function(){
        callback(announcements);
      });
    },
    getParks: function(callback) {
      getData(function(){
        callback(parks);
      });
    },
    getParksInRegion: function(region, callback) {
      getData(function(){
        var result = parks.filter(
          function (park) {
            return park.region == region;
          }
        );
        callback(result);
      });
    },
    getEventPark: function(event, callback) {
      getData(function(){
        var result = null;
        for (var i = 0; i < parks.length; i++) {
          if (event.parkId == parks[i].id) {
            result = parks[i];
            break;
          }
        }
        callback(result);
      });
    },
    checkForUpdates: function(callback) {
      // TODO: Create this function
      callback();
    }
  };
});