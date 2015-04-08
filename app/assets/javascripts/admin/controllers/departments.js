Admin.controller("DepartmentsCtrl", ["$scope", "$routeParams", "Departments",
    function($scope, $routeParams, Departments) {
        Departments.query({},
            function(data) {
                $scope.loaded = true;
                $scope.departments = data;
            },
            function(data) {
                $scope.error = "Error retrieving departments from server";
            }
        );

        /*
         * Changes the department that is displayed in the form.
        */
        $scope.changeDepartment = function(id) {
            Departments.get({id: id}, function(data) { $scope.department = data; });
        };

        $scope.update = function(departments) {
            departments.$update();
        };

        // Sets the room to the room specified in the URL, if given.
        if ($routeParams.id) {
            $scope.changeDepartment($routeParams.id);
        }
    }
]);
