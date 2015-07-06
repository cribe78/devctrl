goog.provide('DevCtrl.SwitchSet.Directive');

DevCtrl.SwitchSet.Directive  = ['DataService', function(DataService) {
    return {
        scope: true,
        bindToController: {
            control: '='
        },
        controller: function(DataService) {
            var self = this;

            var slaves = {};
            var slaveNames = {};

            this.setAll = function(value) {
                angular.forEach(slaves, function(slave, id) {
                    slave.fields.value = value;
                    DataService.updateControlValue(slave);
                })
            };

            this.slaveControls = function() {
                angular.forEach(self.control.referenced.control_sets, function(cs, csid) {
                    slaveNames[cs.foreign.slave_control_id.id] = cs.fields.name;
                    slaves[cs.foreign.slave_control_id.id] = cs.foreign.slave_control_id;
                });

                return slaves;
            };

            this.slaveName = function(slave) {
                return slaveNames[slave.id];
            };

            this.updateCtrlValue = function(uctrl) {
                DataService.updateControlValue(uctrl);
            };
        },
        controllerAs: 'switchSet',
        templateUrl: 'ng/switch-set.html'
    }
}];
