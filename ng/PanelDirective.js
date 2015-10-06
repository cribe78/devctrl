goog.provide('DevCtrl.Panel.Directive');

DevCtrl.Panel.Directive  = ['$mdDialog', 'DataService', function($mdDialog, DataService) {
    return {
        scope: true,
        bindToController : {
            panelObj: '='
        },
        controller: function($mdDialog, DataService) {
            var self = this;
            this.fields = this.panelObj.fields;
            this.pcontrols = this.panelObj.referenced.panel_controls;

            this.appConfig = DataService.config;

            this.addControl = function($event) {
                $mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        obj: ''
                    },
                    controller: DevCtrl.ControlSelector.Ctrl,
                    controllerAs: 'selector',
                    bindToController: true,
                    templateUrl: 'ng/control-selector.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false
                });
            };

        },
        controllerAs: 'panel',
        templateUrl: 'ng/panel.html'
    }
}];