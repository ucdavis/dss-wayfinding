/*
 * Directive: compile (attribute)
 * 
 *  Accepts HTML string from a model and compiles it for inserting into the
 *  given element, so directives from the HTML string work.
 *
 *  Copy-pasted from: https://docs.angularjs.org/api/ng/service/$compile
 *
 *  Usage example:
 *    In a partial:
 *       <span compile="something"></span>
 *
 *    In the corresponding controller:
 *       $scope.apples = function() { console.log("apples"); };
 *       $scope.something = "<a ng-click='apples'>Apples</a>"
*/

Admin.directive("compile", function($compile) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            scope.$watch(
                function(scope) {
                    return scope.$eval(attrs.compile);
                },
                function(value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                }
            );
        }
    };
});
