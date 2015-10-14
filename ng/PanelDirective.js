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
                        panelId: this.panelObj.id
                    },
                    controller: DevCtrl.PanelControlSelector.Ctrl,
                    controllerAs: 'selector',
                    bindToController: true,
                    templateUrl: 'ng/panel-control-selector.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false
                });
            };

            this.editPanel = function($event) {
                DataService.editRecord($event, this.panelObj.id, this.panelObj.tableName);
            };

            this.setAllSwitches = function(val) {
                angular.forEach(this.pcontrols, function(pcontrol) {
                    var control = pcontrol.foreign.controls;

                    if (control.fields.usertype == 'switch') {
                        control.fields.value = val;
                        DataService.updateControlValue(control);
                    }
                });
            }

        },
        controllerAs: 'panel',
        templateUrl: 'ng/panel.html'
    }
}];