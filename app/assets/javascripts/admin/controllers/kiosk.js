Admin.controller("KioskCtrl", ["$scope", "$http",
    function($scope, $http) {
        $scope.setLocation = function() {
            $http.post('/administration/origin.json', { origin: $scope.origin });
        };
    }
]);
