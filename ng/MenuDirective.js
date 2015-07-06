goog.provide('DevCtrl.Menu.Directive');

DevCtrl.Menu.Directive = function() {
    return {
        scope: true,
        bindToController: {
            items: '='
        },
        controller: function() {
        },
        controllerAs: 'menu',
        templateUrl: 'ng/menu.html'
    }
};