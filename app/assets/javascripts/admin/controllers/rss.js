Admin.controller("RssCtrl", ["$scope", "$routeParams", "$http",
    function($scope, $routeParams, $http) {
        $scope.rss_feed = {};

        $scope.add_feed = function() {
            $http.post('/administration/rss_feeds.json', $scope.rss_feed,
              {responseType: 'application/json'}).
              success(function(data) {
                $scope.success = true;
                $scope.rss_feed.url = "";
              }).
              error(function(data) {
                $scope.error = "Failed to add RSS feed";
              });
        };
    }
]);
