var adminServices = angular.module("adminServices", ["ngResource"]);
adminServices.factory('Rooms', function($resource) {
    return $resource("/rooms/:id.json", {id: '@id'}, {
        update: { method: "PUT" }
    });
});
