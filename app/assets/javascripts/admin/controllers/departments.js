Admin.controller("DepartmentsCtrl", ["$scope", "$routeParams", "Departments",
    "Rooms", "Alerts", "$timeout",
    function($scope, $routeParams, Departments, Rooms, Alerts, $timeout) {
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

        // Set to various $timeout promises to allow canceling the $timeout (for
        // $scope.remove function)
        $scope.alerts = Alerts;
        $scope.timer = null;

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

        // Fake department delete. Sets a timeout of three seconds so the user
        // has time to reconsider. Might be able to refactor this stuff into a
        // service some day (code shared with people controller).
        $scope.remove = function(department) {
            // The ng-click here calls functions in the Alerts controller
            Alerts.success("Deleting department... <a href='#' ng-click='alerts.warning(\"Canceling delete...\"); $event.preventDefault();'>Undo</a>");

            $scope.$watch('alerts.mesg()', function() {
                if ($scope.alerts.mesg() === "Canceling delete...") {
                    $timeout.cancel($scope.timer);
                    Alerts.clear();
                }
            });

            $scope.timer = $timeout(function() {
                $scope.actuallyRemove(department)
            }, 3000);
        };

        // Actually deletes a department when called.
        $scope.actuallyRemove = function(department) {
           department.$delete({id: department.id}, {},
             function(data) {
               $scope.departments.splice(department.idx, 1);
               $scope.newDepartment();
               Alerts.success("Department deleted successfully!");
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
