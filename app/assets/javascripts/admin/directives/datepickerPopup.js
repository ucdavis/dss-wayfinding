/*
 * Directive: datepickerPopup
 * 
 * Fix for a bug in Angular 1.3. See http://stackoverflow.com/questions/25742445/angularjs-1-3-datepicker-initial-format-is-incorrect
 * for more details. Code copy-pasted from stackoverflow.
*/

Admin.directive('datepickerPopup', function (dateFilter, datepickerPopupConfig) {
    return {
        restrict: 'A',
        priority: 1,
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            var dateFormat = attr.datepickerPopup || datepickerPopupConfig.datepickerPopup;
            ngModel.$formatters.push(function (value) {
                return dateFilter(value, dateFormat);
            });
        }
    };
});
