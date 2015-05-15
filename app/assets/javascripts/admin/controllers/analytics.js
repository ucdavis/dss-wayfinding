Admin.controller("AnalyticsCtrl", ["$scope", "$http",
    function($scope, $http) {
        // Interval to sum over (e.g., every day, every month, etc.)
        $scope.group = "day";
        $scope.groups = [ "day", "week", "month", "year" ];

        // Start and end dates for analytics
        $scope.startDate = new Date();
        $scope.endDate = new Date();
        $scope.startDate.setMonth($scope.endDate.getMonth() - 1)

        // Whether or not to display analytics for all time
        $scope.general = false;

        // Calendar options
        $scope.startOpened = false;
        $scope.endOpened = false;
        
        $scope.dateOptions = {
          formatYear: 'yyyy',
          startingDay: 0,
          showWeeks: false
        };

        $scope.format = "MMMM dd, yyyy";

        $scope.open = function(opened, e) {
          e.preventDefault();
          e.stopPropagation();

          $scope[opened] = true
        };
        // END Calendar options

        // Clears $scope.startDate and $scope.endDate, so the web app asks for
        // data for all time.
        $scope.allTime = function() {
          $scope.general = true;
          $scope.loaded = false;
          $scope.getAnalytics();
        };

        $scope.notAllTime = function() {
          $scope.general = false;
          $scope.loaded = false;
          $scope.getAnalytics();
        };

        $scope.isKiosk = function(value) {
          return value.kiosk || false;
        };

        /*
         * $scope.nonKiosk
         *
         * Returns the number of devices that are not kiosks.
        */
        $scope.nonKiosk = function(data) {
          if (!data)
            return false;

          return _.filter(
            data.devices,
            function(val) {
              return val.kiosk === false;
            }
          ).length;
        };

        /*
         * $scope.visitsByDevice
         *
         * Returns an array of arrays representing periods and numbers of
         * visitors in each period for a given device (specified with device_id).
        */
        $scope.visitsByDevice = function(device_id) {
          var visitors = $scope.data.visitors;

          // Top-level items in the visitors array are periods
          return _.map(visitors, function(period) {
            // Number of visitors for given device in given period
            var visits = _.find(period.devices, function(device) {
                return device ? device_id === device.device_id : false;
            })
            visits = visits ? visits.visitors : 0;
            return {
              // Name of the period (e.g., 2015-04-20T00:00:00)
              period: period.date,
              visitors: visits
            };
          });
        };

        // Returns things like "Week of", "Month of", etc.
        $scope.periodOf = function(group) {
          if (group === "day") 
            return "";

          return group.capitalize() + " of";
        };

        // Returns appropriate date formats to use with periodOf
        $scope.periodFormat = function(group) {
          switch(group) {
            case 'day':
              return 'mediumDate';
            break;
            case 'week':
              return 'mediumDate';
            break;
            case 'month':
              return 'MMMM, yyyy';
            break;
            case 'year':
              return 'yyyy';
            break;
          }
        };

        // Sums up visits for each period across all devices
        var visitsByPeriod = function(data) {
          if (!data)
            return [];

          return test = _.map(data.visitors, function(period) {
            var visits = _.reduce(period.devices, function(memo, device) {
              return memo + device.visitors;
            }, 0);

            return { period: period.date, visitors: visits };
          });
        };

        // Sums up visits across all periods for a given array (period)
        $scope.sumUp = function(periods) {
          return _.reduce(periods, function(memo, period) {
            return memo + period.visitors;
          }, 0);
        };

        /*
         * $scope.breakdown
         *
         * Sets visitsByPeriod scope variable to visits by period for a given
         * device, to allow user to see visits by period (e.g., day, month,
         * etc.) for a given device.
        */
        $scope.breakdown = function(device) {
          $scope.visitsByPeriod = $scope.visitsByDevice(device.id);
          $scope.deviceModifier = "for Kiosk at Room " + device.room.room_number;
        };

        // Opposite of breakdown
        $scope.unbreakdown = function() {
          $scope.visitsByPeriod = visitsByPeriod($scope.data);
          delete($scope.deviceModifier);
        };

        $scope.getAnalytics = function() {
            if (!$scope.general) {
              var startDate = $scope.startDate;
              var endDate = $scope.endDate;
            }

            $http.get('/administration/analytics.json', {
                  params: {
                    start: startDate,
                    end: endDate,
                    group: $scope.group
                  }
            }).success(
                function (data) {
                    $scope.loaded = true;
                    $scope.data = data;
                    $scope.visitsByPeriod = visitsByPeriod($scope.data);
                }
            ).error(
                function(data) {
                    $scope.error = "Error retrieving search terms";
                }
            );
        };

        $scope.getAnalytics();

        // Watch start, end, and group dates to get analytics when things change
        comparer = function(newVal, oldVal) {
          if (newVal !== oldVal) {
            $scope.loaded = false;
            $scope.getAnalytics();
          }
        };
        $scope.$watch('group', comparer);
        $scope.$watch('startDate', comparer);
        $scope.$watch('endDate', comparer);

        /*
         * String helper functions (used only in this controller, or they could
         * go in a service).
         *
         * capitalize: Capitalizes the first letter of a given string.
         *   source: http://stackoverflow.com/questions/1026069/capitalize-the-first-letter-of-string-in-javascript
         *
         * adverbize: Adds -ly to the end of given string, except if it ends in
         * -y, in which case it removes the -y and adds -ily.
        */
        String.prototype.capitalize = function() {
           return this.charAt(0).toUpperCase() + this.slice(1);
        };

        String.prototype.adverbize = function() {
          if (this.length === 0)
            return "";

          if (this.charAt(this.length - 1).toLowerCase() === "y")
            return this.substring(0, this.length - 1) + "ily";

          return this + "ly";
        };
    }
]);
