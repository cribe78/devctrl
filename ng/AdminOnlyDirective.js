goog.provide('DevCtrl.AdminOnly.Directive');

/**
 * The devctrl-admin-only directive can be applied to elements to remove them from the DOM if admin mode
 * is not enabled
 * @type {*[]}
 */

DevCtrl.AdminOnly.Directive  = ['$compile', 'DataService', function($compile, DataService) {
        return {
            restrict: 'A',
            replace: false,
            terminal: true,
            priority: 1000,
            link: function(scope, element, attrs) {
                element.removeAttr('devctrl-admin-only');
                element.attr('ng-if', 'dataServiceConfig.editEnabled');
                scope.dataServiceConfig = DataService.config;

                $compile(element)(scope);
            }
        }
    }
];