import {PanelControlSelectorCtrl} from "./PanelControlSelectorCtrl";
import {PanelControl} from "../../shared/PanelControl";

export let PanelDirective  = ['$mdDialog', 'MenuService', 'DataService', function($mdDialog, MenuService, DataService) : ng.IDirective {
    return {
        scope: true,
        bindToController : {
            panelObj: '='
        },
        controller: function($mdDialog, MenuService, DataService) {
            var self = this;
            this.fields = this.panelObj.fields;
            this.menu = MenuService;

            this.addControl = function($event) {
                DataService.editRecord($event, "0", PanelControl.tableStr, { panel_id: this.panelObj._id});
                /**
                $mdDialog.show({
                    targetEvent: $event,
                    locals: {
                        panelId: this.panelObj._id
                    },
                    controller: PanelControlSelectorCtrl,
                    controllerAs: 'selector',
                    bindToController: true,
                    templateUrl: 'app/ng1/panel-control-selector.html',
                    clickOutsideToClose: true,
                    hasBackdrop : false
                });
                 **/
            };

            this.editPanel = function($event) {
                DataService.editRecord($event, this.panelObj._id, this.panelObj.table);
            };

            this.setAllSwitches = function(val) {
                angular.forEach(self.panelObj.referenced.panel_controls, function(pcontrol) {
                    var control = pcontrol.foreign.controls;

                    if (control.fields.usertype == 'switch') {
                        control.fields.value = val;
                        DataService.updateControlValue(control);
                    }
                });
            };

            this.getRoomEndpoints = function(grouping) {
                var roomEndpoints = {};
                var ignoreGrouping = ! angular.isDefined(grouping);
                var room = self.panelObj.foreign.rooms;
                var panels = room.referenced.panels;

                angular.forEach(panels, function(panel, panelId) {
                    if (ignoreGrouping || panel.fields.grouping == grouping) {
                        var panelControls = panel.referenced.panel_controls;
                        angular.forEach(panelControls, function(panelControl, panelControlId) {
                            var endpoint = panelControl.foreign.controls.foreign.endpoints;
                            if (! angular.isDefined(roomEndpoints[endpoint.id])) {
                                roomEndpoints[endpoint.id] = endpoint;
                            }
                        });
                    }
                });

                return roomEndpoints;
            };

        },
        controllerAs: 'panel',
        templateUrl: 'app/ng1/panel.html'
    }
}];