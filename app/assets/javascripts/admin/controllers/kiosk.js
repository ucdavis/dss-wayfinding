Admin.controller("KioskCtrl", ["$scope", "$http", "Alerts",
    function($scope, $http, Alerts) {
        $scope.setLocation = function() {
            $http.post('/administration/origin.json', { origin: $scope.origin })
              .success(function(data) {
                Alerts.success(data.notice)
              })
              .error(function(data) {
                Alerts.danger(data.notice)
              });
        };
    }
]);
