Admin.controller("PeopleCtrl", ["$scope", "$routeParams", "People", "Rooms",
    "Departments", "Alerts",
    function($scope, $routeParams, People, Rooms, Departments, Alerts) {
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

        $scope.remove = function(person) {
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
