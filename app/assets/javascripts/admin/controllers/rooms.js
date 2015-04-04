Admin.controller("RoomsCtrl", ["$scope", "$routeParams", "Rooms",
    function($scope, $routeParams, Rooms) {
        $scope.rooms = Rooms.query({},
            function(data) {
                $scope.loaded = true;
                
            },
            function(data) {
                $scope.error = "Error retrieving rooms from server";
            }
        );

        /*
         * Changes the room that is displayed in the form.
        */
        $scope.changeRoom = function(id) {
            $scope.room = Rooms.get({id: id});
        };

        // Sets the room to the room specified in the URL, if given.
        if ($routeParams.id) {
            $scope.changeRoom($routeParams.id);
        }
    }
]);
