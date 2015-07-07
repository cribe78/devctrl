goog.provide('DevCtrl.Menu.Directive');

DevCtrl.Menu.Directive = ['MenuService', '$state',
    function(MenuService, $state) {
        return {
            scope: true,
            bindToController: {},
            controller: function(MenuService, $state) {
                this.service = MenuService;
            },
            controllerAs: 'menu',
            templateUrl: 'ng/menu.html'
        }
    }
];