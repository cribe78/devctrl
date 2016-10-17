import {DataService} from "../data.service";
export let CtrlDirective  = ['DataService', 'MenuService', function(DataService, MenuService) : angular.IDirective {
    return {
        scope: {
            panelControl: '=',
            controlId: '='
        },
        bindToController: true,
        controller: function(DataService: DataService, MenuService) {
            this.menu = MenuService;

            this.panelContext = angular.isDefined(this.panelControl);
            if (this.panelContext) {
                this.ctrl = this.panelControl.foreign.controls;
                this.name = this.panelControl.fields.name;
            }
            else {
                this.ctrl = DataService.getTable('controls').indexed[this.controlId];
                this.name = this.ctrl.fields.name;
            }

            this.ctrlName = function() {
                if (this.panelContext && this.panelControl.fields.name !== '') {
                    return this.panelControl.fields.name;
                }
                else {
                    return this.ctrl.fields.name;
                }
            };


            this.config = function(key) {
                if (angular.isObject(this.ctrl.fields.config) && angular.isDefined(this.ctrl.fields.config[key])) {
                    return this.ctrl.fields.config[key];
                }
            };

            this.intConfig = function(key) {
                var strConfig = self.config(key);

                return parseInt(strConfig);
            };

            this.appConfig = DataService.config;
            this.type = this.ctrl.fields.usertype;

            var self = this;

            this.normalizedValue = function() {
                // Normalize a numeric value to a scale of 0 - 100
                var rawVal = self.ctrl.fields.value;
                var max = self.intConfig('max');
                var min = self.intConfig('min');

                rawVal = rawVal < min ? min : rawVal;
                rawVal = rawVal > max ? max : rawVal;

                var normVal = (rawVal + ( 0 - min )) * ( max - min ) / ( 100 - 0);

                return normVal;
            };


            this.updateValue = function(val) {
                DataService.updateControlValue(self.ctrl);
            };

            this.editOptions = function($event) {
                DataService.editEnum($event, null, self.ctrl, {
                    title: "Edit " + self.name + " options"
                });
            };



            this.selectMenuItem = function(val) {
                self.ctrl.fields.value = val;
                self.updateValue();
            };

            this.selectOptions = function() {
                if (angular.isDefined(self.ctrl.fields.config.options)) {
                    return self.ctrl.fields.config.options;
                }

                return {};
            };

            this.selectValueName = function() {
                var opts = self.selectOptions();
                var value = self.ctrl.fields.value;

                var ret = '';
                angular.forEach(opts, function(optObj) {
                        if (optObj.fields.value == value) {
                            ret = optObj.fields.name;
                        }
                });

                return ret;
            };

            this.showLog = function($event) {
                DataService.showControlLog($event, self.ctrl);
            };


            this.editPanelControl = function($event) {
                DataService.editRecord($event, self.panelControl.id, 'panel_controls');
            };

            this.editControl = function($event) {
                DataService.editRecord($event, self.ctrl.id, 'controls');
            };

        },
        controllerAs: 'ctrl',
        templateUrl: 'app/ng1/ctrl.html'
    }
}];