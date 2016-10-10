"use strict";
exports.MenuDirective = ['MenuService', '$state',
    function (MenuService, $state) {
        return {
            scope: true,
            bindToController: {},
            controller: function (MenuService, $state) {
                this.service = MenuService;
            },
            controllerAs: 'menu',
            templateUrl: 'ncontrol/app/ng1/menu.html'
        };
    }
];
//# sourceMappingURL=MenuDirective.js.map