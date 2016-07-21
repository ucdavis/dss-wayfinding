Admin.controller("NavigationCtrl", ["$scope", "$location",
    function($scope, $location) {
        $scope.location = function() {
            return $location.path();
        };
        $scope.isActive = function(location) {
            return location === $location.path();
        };
    }
]);

