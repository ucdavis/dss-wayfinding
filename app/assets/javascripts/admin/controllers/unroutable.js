Admin.controller("UnroutableCtrl", ["$scope", "$http",
    function($scope, $http) {
        $http.get('/administration/unroutable.json').success(
            function (data) {
                $scope.loaded = true;
                $scope.unroutable = data;
            }
        ).error(
            function(data) {
                $scope.error = "Error retrieving unroutable data";
            }
        );
    }
]);
