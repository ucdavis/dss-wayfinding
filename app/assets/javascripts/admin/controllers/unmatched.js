Admin.controller("UnmatchedCtrl", ["$scope", "$routeParams", "$http",
    function($scope, $routeParams, $http) {
        $http.get('/administration/unmatched.json').success(
            function (data) {
                $scope.loaded = true;
                $scope.unmatched_queries = data;
            }
        ).error(
            function(data) {
                $scope.error = "Error retrieving search terms";
            }
        );
    }
]);
