Admin.controller("PeopleCtrl", ["$scope", "$routeParams", "People", "Rooms",
    "Departments", "Alerts", "$timeout", "QRLink", "PlacardLink",
    function($scope, $routeParams, People, Rooms, Departments, Alerts, $timeout, QRLink) {
        var load_people = function() {
            People.query({},
                function(data) {
                    $scope.loaded = true;
                    $scope.people = data;
                },
                function() {
                    Alerts.danger("Error retrieving people from server. Please try again later.");
                }
            );
        };

        // Set to various $timeout promises to allow canceling the $timeout (for
        // $scope.remove function)
        $scope.alerts = Alerts;
        $scope.timer = null;

        load_people();

        $scope.rooms = Rooms.query({});
        $scope.departments = Departments.query({});

        /*
         * Changes the room that is displayed in the form.
        */
        $scope.changePerson = function(id, index) {
            People.get(
                {id: id},
                function(data) {
                    $scope.person = data;
                    $scope.person.idx = index;
                    $scope.editing = true;
                    $scope.qrLink = QRLink.getOriginQR(data.room_id); //Potentially problematic with multiplie rooms
                    $scope.placardLink = PlacardLink.getPersonPlacardURL(data.id);
                },
                function () {
                    Alerts.danger("Error retrieving person from server. Please try again later.");
                }
            );
        };

        /*
         * Displays the new person form
        */
        $scope.newPerson = function() {
            $scope.person = null;
            $scope.editing = false;
        };

        $scope.create = function(data) {
            var person = new People(data);
            person.$save(
              function (data) {
                // Could also just add this to $scope.people
                load_people();
                $scope.changePerson(data.id);
                Alerts.success("Person saved successfully!");
              },
              function (resp) {
                Alerts.danger("Error saving person. " + resp.data.message);
              }
            );
        };

        $scope.update = function(person) {
            var index = person.idx
            person.$update({},
              function (data) {
                person.idx = index;
                $scope.people[index].name = person.first + " " + person.last
                Alerts.success(person.first + " " + person.last + "'s information updated successfully!");
              },
              function (resp) {
                Alerts.danger("Error saving person. " + resp.data.message);
              }
            );
        };

        /*
         * $scope.remove
         *
         *   Fake person delete. Sets a timeout of three seconds so that the
         *   user has time to reconsider.
        */

        $scope.remove = function(person) {
            // The ng-click here calls functions in the Alerts controller
            Alerts.success("Deleting person... <a href='#' ng-click='alerts.warning(\"Canceling delete...\"); $event.preventDefault();'>Undo</a>");

            $scope.$watch('alerts.mesg()', function() {
                if ($scope.alerts.mesg() === "Canceling delete...") {
                    $timeout.cancel($scope.timer);
                    Alerts.clear();
                }
            });

            $scope.timer = $timeout(function() {
                $scope.actuallyRemove(person)
            }, 3000);
        };

        $scope.actuallyRemove = function(person) {
            person.$delete({id: person.id}, {},
                function(data) {
                    $scope.people.splice(person.idx, 1);
                    $scope.newPerson();
                    Alerts.success("Person deleted successfully!");
                },
                function(resp) {
                    Alerts.danger("Error deleting person. " + resp.data.message);
                }
            );
        };

        // Sets the person to the person specified in the URL, if given.
        if ($routeParams.id) {
            $scope.changePerson($routeParams.id);
        }
    }
]);
