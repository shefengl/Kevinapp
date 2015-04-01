angular.module('nightOwl.services.eventManager', [])

.factory('eventManager', function($cordovaSQLite, $q, $http, dba) {

  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
  }

  function formatAMPM(date, addSuffix) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = addSuffix? (hours >= 12 ? 'pm': 'am') : '';
    hours = hours % 12;
    hours = hours ? hours: 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes: minutes;
    var strTime = hours + ':'+ minutes  + ampm;
    return strTime;
  }

  function getShowtime(startDate, endDate) {
      var startDate = new Date(startDate);
      var endDate = new Date(endDate);
      return formatAMPM(startDate, false) + '-'  + formatAMPM(endDate, true);
  }

  function formatEvent(event) {
    event.showtime = getShowtime(event.startDate, event.endDate);
    return event;
  }

  function formatEventList(events) {
    for (var i = 0; i < events.length; i++) {
      formatEvent(events[i]);
    }
    return events;
  }

  function formatAnnouncementList(announcements){

    for (var i = 0; i < announcements.length; i++) {
      announcements[i].oldShowTime = getShowtime(announcements[i].oldStartTime, announcements[i].oldEndTime);
      if (announcements[i].newStartTime != '')
        announcements[i].newShowTime = getShowtime(announcements[i].newStartTime, announcements[i].newEndTime);
      else
        announcements[i].newShowTime = '';
    }
    return announcements;
  }

  return {
    getEvents: function() {
      return dba.query("SELECT * FROM eventView").then(function(result){
        return formatEventList(dba.getAll(result));
      });
    },
    getEvent: function(eventId) {
      return dba.query("SELECT * FROM eventView WHERE ID = (?)", [eventId]).then(function(result){
        return formatEvent(dba.getById(result));
      });
    },
    getEventsByDate: function(date) {
      date.setHours(0,0,0,0);
      var datePlusOne = addDays(date, 1);

      return dba.query("SELECT * FROM eventView WHERE STARTDATE > (?) AND STARTDATE < (?)", [date.toISOString(), datePlusOne.toISOString()]).then(function(result){
        return formatEventList(dba.getAll(result));
      });
    },
    getEventsByCategory: function(category) {
      return dba.query("SELECT * FROM eventView WHERE CATEGORY = (?)", [category]).then(function(result){
        return formatEventList(dba.getAll(result));
      });
    },
    getEventsByPark: function(parkId) {
      return dba.query("SELECT * FROM eventView WHERE PARKID = (?)", [parkId]).then(function(result){
        return formatEventList(dba.getAll(result));
      });
    },
    getEventShowtimes: function(event) {
      return dba.query("SELECT * FROM eventView WHERE ID != (?) AND NAME = (?)", [event.id, event.name]).then(function(result){
        return formatEventList(dba.getAll(result));
      });
    },
    addEventToFavorites: function(event) {
      return dba.query("UPDATE EVENT SET ISFAVORITE = 1 WHERE ID = (?)", [event.id]);
    },
    removeEventFromFavorites: function(event) {
      return dba.query("UPDATE EVENT SET ISFAVORITE = 0 WHERE ID = (?)", [event.id]);
    },
    getFavoriteEvents: function (callback) {
      return dba.query("SELECT * FROM EventView WHERE ISFAVORITE = 1").then(function(result){
        return dba.getAll(result);
      });
    },
      
    isFavoriteEvent: function (event) {
      return dba.query("SELECT ISFAVORITE FROM EventView WHERE ID = (?)", [event.id]).then(function(result){
        if (result == 1)
			return true;
		else
			return false;
      });
    },  
    getAnnouncements: function(callback) {
      return dba.query("SELECT * FROM AnnouncementView").then(function(result){
        return formatAnnouncementList(dba.getAll(result));
      });
    },
    getParks: function(callback) {
      return dba.query("SELECT * FROM PARK").then(function(result){
        return dba.getAll(result);
      });
    },
    getParksInRegion: function(region) {
      return dba.query("SELECT * FROM PARK WHERE REGION = (?)", [region]).then(function(result){
        return dba.getAll(result);
      });
    },
    getEventPark: function(event) {
      return dba.query("SELECT * FROM PARK WHERE ID = (?)", [event.parkId]).then(function(result){
        return dba.getById(result);
      });
    },
    checkForUpdates: function() {
      // TODO: Create this function
      //http://cpd-nightowl.appspot.com/api/getAllData
      //http://cpd-nightowl.appspot.com/api/getUpdatedData?lastUpdate=201509
    },
    //-----------------------------
    // TODO: Remove the following functions. These functions have been created just to deliver a seemless development between
    // iOS and Android prepopulated databases and websql needing to be loaded via loading the app.
    //-----------------------------
    testingLoadFromJSON: function() {
      var q = $q.defer();
      $http.get('js/testData.json').success(function(data) {
        db.transaction(function (tx) {
          tx.executeSql("DROP TABLE IF EXISTS announcement");
          tx.executeSql("DROP TABLE IF EXISTS event");
          tx.executeSql("DROP TABLE IF EXISTS park");
          tx.executeSql("DROP VIEW IF EXISTS EventView");
          tx.executeSql("DROP VIEW IF EXISTS AnnouncementView");
          tx.executeSql("CREATE TABLE IF NOT EXISTS park (id integer primary key, name text, address text, latitude text, longitude text, radius integer, polylines text, phoneNumber text, region text)");
          tx.executeSql("CREATE TABLE IF NOT EXISTS event (id integer primary key, name text, description text, category text, specialBackgroundUrl text, trailerUrl text, parkId integer, startDate text, endDate text, underwrittenDescription text, status text, rating text, closedCaptions integer, performedBy text, isFavorite integer)");
          tx.executeSql("CREATE TABLE IF NOT EXISTS announcement (id integer primary key, eventId integer, type text, newLocation text, oldLocation text, newStartTime text, oldStartTime text, newEndTime text, oldEndTime text)");
          tx.executeSql("CREATE VIEW EventView AS SELECT e.id, e.name, e.description, e.category, e.specialBackgroundUrl, e.trailerUrl, e.parkId, e.startDate, e.endDate, e.underwrittenDescription, e.status, e.rating, e.closedCaptions, e.isFavorite, p.name AS parkName FROM EVENT e, PARK p WHERE e.parkId = p.id");
          tx.executeSql("CREATE VIEW AnnouncementView AS SELECT a.id, a.eventId, a.type, a.newLocation, a.oldLocation, a.newStartTime, a.oldStartTime, a.newEndTime, a.oldEndTime, e.name AS eventName, e.category, e.rating FROM Announcement a, Event e WHERE e.id = a.eventId");
          
          // Insert collection
          for (var i = 0; i < data.parks.length; i++) {
            var p = data.parks[i];
            tx.executeSql("INSERT INTO park(id, name, address, latitude, longitude, radius, polylines, phoneNumber, region) VALUES (?,?,?,?,?,?,?,?,?)",
              [p.id, p.name, p.address, p.latitude, p.longitude, p.radius, p.polylines, p.phoneNumber, p.region]);
          }
          for (var i = 0; i < data.events.length; i++) {
            var e = data.events[i];
            tx.executeSql("INSERT INTO event(id, name, description, category, specialBackgroundUrl, trailerUrl, parkId, startDate, endDate, underwrittenDescription, status, rating, closedCaptions, performedBy, isFavorite) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              [e.id, e.name, e.description, e.category, e.specialBackgroundUrl, e.trailerUrl, e.parkId, e.startDate, e.endDate, e.underwrittenDescription, e.status, e.rating, e.closedCaptions, e.performedBy, e.isFavorite]);
          }
          for (var i = 0; i < data.announcements.length; i++) {
            var a = data.announcements[i]; 
            tx.executeSql("INSERT INTO announcement(id, eventId, type, newLocation, oldLocation, newStartTime, oldStartTime, newEndTime, oldEndTime) VALUES (?,?,?,?,?,?,?,?,?)",
              [a.id, a.eventId, a.type, a.newLocation, a.oldLocation, a.newStartTime, a.oldStartTime, a.newEndTime, a.oldEndTime]);
          }

          q.resolve({});
        }, function (transaction, error) {
          console.log(transaction, error);
          q.reject(error);
        });
      });
      return q.promise;
    },
    testingFormatDates: function() {

      var q = $q.defer();
      function startAndEndDates(date) {
        date.setHours(9,0,0,0);
        var start = date.toISOString();
        date.setHours(9,30,0,0);
        var end = date.toISOString();
        return [start, end];
      }

      var today = new Date();
      var tomorrow = addDays(today, 1);
      var dayAfter = addDays(today, 2);

      var se1 = startAndEndDates(today);
      var se2 = startAndEndDates(tomorrow);
      var se3 = startAndEndDates(dayAfter);

      // Update event dates
      db.transaction(function(tx){
        tx.executeSql("UPDATE event SET startDate=(?), endDate=(?) WHERE id <= (?)",[se1[0],se1[1], 3]);
        tx.executeSql("UPDATE event SET startDate=(?), endDate=(?) WHERE id > (?) AND id <= (?)",[se2[0],se2[1], 3, 5]);
        tx.executeSql("UPDATE event SET startDate=(?), endDate=(?) WHERE id > (?)",[se3[0], se3[1], 5], function(tx, result) {
          q.resolve(result);
        });
      }, function(transaction, error){
        console.log(transaction, error);
        q.reject(error);
      });
      return q.promise;
    }
  };
});