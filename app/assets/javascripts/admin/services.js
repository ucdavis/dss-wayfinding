var adminServices = angular.module("adminServices", ["ngResource"]);
adminServices.factory('Rooms', function($resource) {
    return $resource("/rooms/:id.json", {id: '@id'}, {
        update: { method: "PUT" }
    });
}).factory('People', function($resource) {
    return $resource("/people/:id.json", {id: '@id'}, {
        update: { method: "PUT" }
    });
}).factory("Departments", function($resource) {
    return $resource("/departments/:id.json", {id: '@id'}, {
        update: { method: "PUT" }
    });
});
