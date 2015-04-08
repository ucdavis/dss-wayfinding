Admin.controller("PeopleCtrl", ["$scope", "$routeParams", "People", "Rooms",
    "Departments",
    function($scope, $routeParams, People, Rooms, Departments) {
        var load_people = function() {
            People.query({},
                function(data) {
                    $scope.loaded = true;
                    $scope.people = data;
                },
                function(data) {
                    $scope.error = "Error retrieving people from server";
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
                    console.log($scope.person);
                    $scope.editing = true;
                },
                function (data) {
                    $scope.error = "Error retrieving person from server";
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
                load_people();
                $scope.changePerson(data.id);
              },
              function () {
                $scope.error = "Error saving person";
              }
            );
        };

        $scope.update = function(person) {
            var index = person.idx
            person.$update({},
              function (data) {
                person.idx = index;
                $scope.people[index].name = person.first + " " + person.last
              },
              function () {
                $scope.error = "Error saving person";
              }
            );
        };

        $scope.remove = function(person) {
            person.$delete({id: person.id}, {},
                function(data) {
                    $scope.people.splice(person.idx, 1);
                    $scope.newPerson();
                },
                function() {
                    $scope.error = "Error deleting person";
                }
            );
        };

        // Sets the room to the room specified in the URL, if given.
        if ($routeParams.id) {
            $scope.changePerson($routeParams.id);
        }
    }
]);
