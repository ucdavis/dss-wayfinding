Admin.controller("SearchLogCtrl", ["$scope", "$routeParams", "$http",
    function($scope, $routeParams, $http) {
        $http.get('/administration/search_terms.json').success(
            function (data) {
                $scope.loaded = true;
                $scope.search_terms = data;
            }
        ).error(
            function(data) {
                $scope.error = "Error retrieving search terms";
            }
        );
    }
]);
