import {IDirective} from "@angular/upgrade/src/angular_js";
export let MenuDirective = ['MenuService', '$state',
    function(MenuService, $state) : ng.IDirective {
        return {
            scope: true,
            bindToController: {},
            controller: function(MenuService, $state) {
                this.service = MenuService;
            },
            controllerAs: 'menu',
            templateUrl: 'app/ng1/menu.html'
        }
    }
];