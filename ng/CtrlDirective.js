goog.provide('DevCtrl.Ctrl.Directive');

DevCtrl.Ctrl.Directive  = ['DataService', function(DataService) {
    return {
        scope: {
            panelControl: '=',
            controlId: '='
        },
        bindToController: true,
        controller: function(DataService) {
            if (angular.isDefined(this.panelControl)) {
                this.ctrl = this.panelControl.foreign.controls;
                this.name = this.panelControl.fields.name;
            }
            else {
                this.ctrl = DataService.getTable('controls').indexed[this.controlId];
                this.name = this.ctrl.fields.name;
            }
            this.template = this.ctrl.foreign['control_templates'];

            this.type = this.template.fields.usertype;

            this.enums = DataService.getTable('enums');
            this.enumVals = DataService.getTable('enum_vals');

            var self = this;

            this.normalizedValue = function() {
                // Normalize a numeric value to a scale of 0 - 100
                var rawVal = self.ctrl.fields.value;
                var max = self.template.fields.max;
                var min = self.template.fields.min;

                rawVal = rawVal < min ? min : rawVal;
                rawVal = rawVal > max ? max : rawVal;

                var normVal = (rawVal + ( 0 - min )) * ( max - min ) / ( 100 - 0);

                return normVal;
            };


            this.updateValue = function() {
                DataService.updateControlValue(self.ctrl);
            };

            this.selectMenuItem = function(val) {
                self.ctrl.fields.value = val;
                self.updateValue();
            };

            this.selectOptions = function() {
                var eid = self.ctrl.fields.enum_id;

                var ret = {};
                if (eid > 0) {
                    ret = self.enums.indexed[eid].referenced.enum_vals;
                }

                return ret;
            }
        },
        controllerAs: 'ctrl',
        templateUrl: 'ng/ctrl.html'
    }
}];