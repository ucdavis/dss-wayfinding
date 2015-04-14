Admin.controller("AlertsCtrl", ["$scope", "$timeout", "$window", "Alerts",
    function($scope, $timeout, $window, Alerts) {
        // Display errors from params.
        if ($window.notice) {
            $scope.mesg = $window.notice;
            $scope.status = "alert-warning";
        }
        else if ($window.error) {
            $scope.mesg = $window.error;
            $scope.status = "alert-danger";
        }

        $scope.alerts = Alerts;
        $scope.$watch('alerts.mesg()', function() {
            $scope.mesg = $scope.alerts.mesg();

            // CSS class for the alert box. See the Alerts service.
            $scope.status = $scope.alerts.status();

            $timeout(function() {
                // Calls the clear() function in Alerts, which triggers the
                // $watch function here, which makes things disappear in the
                // view.
                $scope.alerts.clear();
            }, 3000);
        });
    }
]);
