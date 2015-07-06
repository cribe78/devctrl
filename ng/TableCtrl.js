goog.provide("DevCtrl.Table.Ctrl");
goog.provide("DevCtrl.Table.Resolve");

DevCtrl.Table.Ctrl = ['$scope', '$stateParams', '$mdDialog', 'DataService',
    function($scope, $stateParams, $mdDialog, DataService) {
        this.tableName = $stateParams.table;
        this.data = DataService.getTable(this.tableName);
        this.schema = DataService.getSchema(this.tableName);
        this.newRow = { table: this.tableName };

        DataService.messenger.emit('status-update', {
           message: "table " + this.tableName + " loaded"
        });

        this.addRow = function() {
            DataService.addRow(this.newRow);
        };

        this.deleteRow = function(row) {
            row.table = this.tableName;
            DataService.deleteRow(row);
        };

        this.fkDisplayVal = function(field, row) {
            var fkTable = this.schema.foreign_keys[field.name];
            var fkSchema = DataService.getSchema(fkTable);

            if (! angular.isDefined(row.foreign[field.name])) {
                return '';
            }

            var foreign = row.foreign[field.name];

            if (foreign == null) {
                return 'NULL';
            }

            var val = foreign.id;
            if (angular.isDefined(foreign.fields[fkSchema.fk_name])) {
                val = foreign.fields[fkSchema.fk_name];
            }

            return val;
        };

        var self = this;

        this.openRecord = function($event, id) {
            $mdDialog.show({
                targetEvent: $event,
                locals: {
                    id: id,
                    table: self
                },
                controller: DevCtrl.Record.Ctrl,
                controllerAs: 'record',
                bindToController: true,
                templateUrl: 'ng/record.html',
                clickOutsideToClose: true,
                hasBackdrop : false
            });
        }

        this.closeRecord = function() {
            $mdDialog.hide();
        }
    }
];

DevCtrl.Table.Resolve = {
    tableName: ['$stateParams', function ($stateParams) {
        return $stateParams.table;
    }]
};