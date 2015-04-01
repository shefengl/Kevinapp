angular.module('nightOwl.directives.eventRow', ['ionic'])


.directive('eventRow', function() {
  return {
    restrict: 'E',
    require: '^event,^tabname',
    scope: {
      event: '=',
      tabname: '='
    },
    templateUrl: 'templates/event-row.html'
  };
});