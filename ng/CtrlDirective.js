goog.provide('DevCtrl.Ctrl.Directive');

DevCtrl.Ctrl.Directive  = ['DataService', function(DataService) {
    return {
        scope: {
            panelControl: '='
        },
        bindToController: true,
        controller: function(DataService) {
            this.ctrl = this.panelControl.foreign.controls;
            this.template = this.ctrl.foreign['control_templates'];
            this.name = this.panelControl.fields.name;
            this.type = this.template.fields.usertype;

            this.enums = DataService.getTable('enums');
            this.enumVals = DataService.getTable('enum_vals');

            var self = this;

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