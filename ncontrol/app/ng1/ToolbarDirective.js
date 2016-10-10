"use strict";
exports.ToolbarDirective = ['$mdMedia', '$state', 'MenuService', 'DataService',
    function ($mdMedia, $state, MenuService, DataService) {
        return {
            scope: true,
            bindToController: {
                title: '='
            },
            controller: function ($state, MenuService, DataService) {
                var self = this;
                this.menu = MenuService;
                this.session = DataService.userSession;
                this.config = DataService.config;
                this.$mdMedia = $mdMedia;
                this.showAdminLogin = function () {
                    // Show Admin login option if not currently admin authorized
                    return !DataService.isAdminAuthorized();
                };
                this.pageTitle = function () {
                    if (angular.isDefined(self.title)) {
                        return self.title;
                    }
                    return $state.current.title || $state.params.name;
                };
                this.adminLogin = function () {
                    DataService.doAdminLogon();
                };
                this.editClient = function ($event) {
                    DataService.editRecord($event, self.user.client_id, "clients");
                };
                this.revokeAdmin = function () {
                    DataService.revokeAdminAuth();
                };
                this.updateConfig = function () {
                    DataService.updateConfig();
                };
            },
            controllerAs: 'toolbar',
            templateUrl: 'ng/toolbar.html'
        };
    }];
//# sourceMappingURL=ToolbarDirective.js.map