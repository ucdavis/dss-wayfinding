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
}).factory("Alerts", function() {
    var data = {
        mesg: '',
        status: ''
    };

    /*
     * showAlert
     *
     *   A setter for mesg and status. Used with partials for defaults with
     *   bootstrap alert styles. See danger, success, and warning, below.
    */
    var showAlert = function(message, status) {
        data.mesg = message;
        data.status = status;
    };

    var danger = _.partial(showAlert, _, "alert-danger");
    var success = _.partial(showAlert, _, "alert-success");
    var warning = _.partial(showAlert, _, "alert-warning");

    var clear = function() {
        showAlert("", "");
    };

    return {
        danger: danger,
        success: success,
        warning: warning,
        clear: clear,
        mesg: function() { return data.mesg },
        status: function() { return data.status }
    };
}).factory("QRLink", function($resource) {

    // Takes room IDs, will generate URLs that correspond to the 'qr' view in directory_objects
    // The qr view will take the ID's, do the necessary parsing, and provide the
    //      view with the necessary QR image for a <img>
    // Avoid any issues of passing a full url to qr encode
    return {

        getOriginQR: function(originID) {
            return '/directory_objects/qr/' + originID;
        },
        getOriginAndDestinationQR: function(originID, destinationID) {
            return '/directory_objects/qr/' + originID + '/end/' + destinationID;
        }
    }
}).factory("PlacardLink", function($resource) {
  // Takes either a person's ID or a department's ID and generates a link
  // for the appropriate route

  return {
    getPersonPlacardURL: function(personID) {
      return '/directory_objects/personPlacard/' + personID;
    },
    getDepartmentPlacardsURL: function(departmentID) {
      return 'directory_objects/departmentPlacards/' + departmentID;
    }
  }
});
