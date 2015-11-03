goog.provide('DevCtrl.Toolbar.Directive');

DevCtrl.Toolbar.Directive  = ['$mdMedia', '$state', 'MenuService', 'DataService', function($mdMedia, $state, MenuService, DataService) {
    return {
        scope: true,
        bindToController : {
            title: '='
        },
        controller: function($state, MenuService, DataService) {
            var self = this;
            this.menu = MenuService;
            this.user = DataService.dataModel.user;
            this.config = DataService.config;
            this.$mdMedia = $mdMedia;

            this.pageTitle = function() {
                if (angular.isDefined(self.title)) {
                    return self.title;
                }

                return $state.current.title || $state.params.name;
            };

            this.adminLogin = function() {
                DataService.getAdminAuth(true);
            };


            this.revokeAdmin = function() {
                DataService.revokeAdminAuth();
            };

            this.toggleSidenav = function(menuId) {
                $mdSidenav(menuId).toggle();
            };

            this.updateConfig = function() {
                DataService.updateConfig();
            };

        },
        transclude: true,
        controllerAs: 'toolbar',
        templateUrl: 'ng/toolbar.html'
    }
}];