Admin.controller("DepartmentsCtrl", ["$scope", "$routeParams", "Departments", "Rooms",
    function($scope, $routeParams, Departments, Rooms) {
        var load_departments = function() {
            Departments.query({},
                function(data) {
                    $scope.loaded = true;
                    $scope.departments = data;
                },
                function(data) {
                    $scope.error = "Error retrieving departments from server";
                }
            );
        }

        load_departments();
        $scope.rooms = Rooms.query({});

        /*
         * Changes the department that is displayed in the form.
        */
        $scope.changeDepartment = function(id, index) {
            Departments.get(
                {id: id},
                function (data) {
                    $scope.department = data;
                    $scope.department.idx = index;
                    $scope.editing = true;
                },
                function (data) {
                    $scope.error = "Error retrieving person from server";
                }
            );
        };

        $scope.newDepartment = function() {
          $scope.department = null;
          $scope.editing = false;
        };

        $scope.create = function(data) {
          var department = new Departments(data);
          department.$save(
            function (data) {
              load_departments();
              $scope.changeDepartment(data.id);
            },
            function () {
              $scope.error = "Error saving department";
            }
          );
        };

        $scope.update = function(department) {
            var index = department.idx
            department.$update({},
              function (data) {
                department.idx = index;
                $scope.departments[index].name = department.title
              },
              function () {
                $scope.error = "Error saving person";
              }
            );
        };

        $scope.remove = function(department) {
            department.$delete({id: department.id}, {},
                function(data) {
                    $scope.departments.splice(department.idx, 1);
                    $scope.newDepartment();
                },
                function() {
                    $scope.error = "Error deleting department";
                }
            );
        };

        // Sets the department to the department specified in the URL, if given.
        if ($routeParams.id) {
            $scope.changeDepartment($routeParams.id);
        }
    }
]);
