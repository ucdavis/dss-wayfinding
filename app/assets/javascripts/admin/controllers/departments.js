Admin.controller("DepartmentsCtrl", ["$scope", "$routeParams", "Departments", "Rooms", "Alerts",
    function($scope, $routeParams, Departments, Rooms, Alerts) {
        var load_departments = function() {
            Departments.query({},
                function(data) {
                    $scope.loaded = true;
                    $scope.departments = data;
                },
                function(data) {
                    Alerts.danger("Error retrieving departments from server. Please try again later.");
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
                    Alerts.danger("Error retrieving person from server. Please try again later.");
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
              Alerts.success("Department created successfully");
            },
            function (resp) {
              Alerts.danger("Error saving department. " + resp.data.message);
            }
          );
        };

        $scope.update = function(department) {
            var index = department.idx
            department.$update({},
              function (data) {
                department.idx = index;
                $scope.departments[index].name = department.title
                Alerts.success("Department updated successfully!");
              },
              function (resp) {
                Alerts.danger("Error updating department. " + resp.data.message);
              }
            );
        };

        $scope.remove = function(department) {
            department.$delete({id: department.id}, {},
                function(data) {
                    $scope.departments.splice(department.idx, 1);
                    $scope.newDepartment();
                },
                function(resp) {
                    Alerts.danger("Error deleting department. " + resp.data.message);
                }
            );
        };

        // Sets the department to the department specified in the URL, if given.
        if ($routeParams.id) {
            $scope.changeDepartment($routeParams.id);
        }
    }
]);
