angular.module('nightOwl.services', [])

.factory('EventManager', function() {
  // TODO: This array should not be initialized here.
  var events = [
    { 
      id: 1,
      name: 'THE PRINCESS BRIDE',
      categories: ['Movies'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 1,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    },
    { 
      id: 2,
      name: 'GOSPEL FEST PARTNERSHIP',
      categories: ['Festival'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 2,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    },
    { 
      id: 3,
      name: 'SPORTS INSTRUCTION AND FUNDAMENTALS',
      categories: ['Festival'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 1,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    },
    { 
      id: 4,
      name: 'SPORTS INSTRUCTION AND FUNDAMENTALS',
      categories: ['Festival'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 4,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    },
    { 
      id: 5,
      name: 'KIDSMOBILE',
      categories: ['Family Fun'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 4,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    },
    { 
      id: 6,
      name: 'TOO MUCH LIGHT MAKES THE',
      categories: ['Theater'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 4,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    },
    { 
      id: 7,
      name: 'MUSIC FESTIVAL EVENTS',
      categories: ['Festival'],
      description: '',
      specialBackgroundUrl: '',
      trailerUrl: '',
      parkId: 4,
      startDate: '2015-03-13T18:21:00.511Z',
      endDate: '2015-03-13T18:22:30.511Z',
      underwrittenDescription: '',
      status: 'default'
    }
  ];

  // TODO: This array should not be initialized here.
  var parks = [
    {
      id: 1,
      name: 'Jonquill Park',
      address: 'Jonquil Playlot Park, 1001 W Wrightwood Ave, Chicago, IL 60614',
      latitude:  41.9285508,
      longitude:-87.6546109,
      radius: 1,
      region: 'north',
      polylines: [],
      phoneNumber: '+1 312-742-7816'
    },

    {
      id: 2,
      name: 'Fuller Park',
      address: '',
      latitude:  41.9285508,
      longitude:-87.6546109,
      radius: 1,
      region: 'north',
      polylines: [],
      phoneNumber: ''
    },

    {
      id: 3,
      name: 'Cornell Square Park',
      address: '1809 W 50th St, Chicago, IL 60609',
      latitude:  41.802087,
      longitude:-87.671366,
      radius: 1,
      region: 'north',
      polylines: [],
      phoneNumber: '+1 312-747-6097'
    },

    {
      id: 4,
      name: 'Union Park',
      address: '1501 W Randolph St, Chicago, IL 60607',
      latitude:  41.9285508,
      longitude:-87.6546109,
      radius: 1,
      region: 'north',
      polylines: [],
      phoneNumber: '+1 312-746-5494'
    }
  ];

  var favoriteEvents = [];

  var announcements = [
    {
      id: 1,
      eventId: 1,
      type: 'TimeChanged',
      newLocation: null,
      oldLocation: null,
      newTime: '2015-03-13T18:21:00.511Z',
      oldTime: '2015-03-13T18:21:00.511Z'
    }
  ];

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
  
  return {
    getAllEvents: function() {
      return events;
    },
    getEvent: function(eventId) {
      for (var i = 0; i < events.length; i++) {
        if (events[i].id == eventId) {
          return events[i];
        }
      }
      return null;
    },
    getEventsByDate: function(date) {
      date.setHours(0,0,0,0);
      var result = events.filter(
        function (event) {
          var eventDate = new Date(event.startDate);
          eventDate.setHours(0,0,0,0);
          return (eventDate.getTime() == date.getTime());
        }
      );
      return result;
    },
    getEventsByCategory: function(category) {
      var result = events.filter(
        function (event) {
          return (event.categories.indexOf(category) != -1);
        }
      );
      return result;
    },
    getEventsByPark: function(parkId) {
      var result = events.filter (
        function (event) {
          return (event.parkId == parkId);
        }
      );
      return result;
    },
    getEventShowtimes: function(event) {
      var result = events.filter (
        function (ev) {
          return (event.name == ev.name && event.id != ev.id);
        }
      );
      return result;
    },
    addEventToFavorites: function(event) {
      var index = favoriteEvents.indexOf(event);
      if (index == -1) {
        favoriteEvents.push(event);
      }
    },
    removeEventFromFavorites: function(event) {
      var index = favoriteEvents.indexOf(event);
      if (index != -1) {
        favoriteEvents.splice(index, 1);
      }
    },
    getFavoriteEvents: function () {
      return favoriteEvents;
    },
    getAnnouncements: function() {
      return announcements;
    },
    getParks: function() {
      return parks;
    },
    getParksInRegion: function(region) {
      var result = parks.filter(
        function (park) {
          return park.region == region;
        }
      );
      return result;
    },
    getEventPark: function(event) {
      for (var i = 0; i < parks.length; i++) {
        if (event.parkId == parks[i].id) {
          return parks[i];
        }
      }
      return null;
    },
    checkForUpdates: function() {
      // TODO: Create this function
    }
  };
});