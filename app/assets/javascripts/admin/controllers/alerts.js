Admin.controller("AlertsCtrl", ["$scope", "$timeout", "$window", "Alerts",
    function($scope, $timeout, $window, Alerts) {
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

        // Display errors from params. Use the Alerts service, even though the
        // mesg and status $scope variables are ultimately set in this
        // controller, because of the $watch on alerts.mesg(), above, which
        // resets $scope.mesg and $scope.status on page load.
        if ($window.notice) {
            Alerts.warning($window.notice);
        }
        else if ($window.error) {
            Alerts.danger($window.error);
        }
    }
]);
