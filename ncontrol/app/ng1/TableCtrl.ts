export let TableCtrl = ['$scope', '$stateParams',  'DataService',
    function($scope, $stateParams, DataService) {
        var self = this;

        this.tableName = $stateParams.name;
        this.data = DataService.getTable(this.tableName);
        this.schema = DataService.getSchema(this.tableName);
        this.newRow = { table: this.tableName };

        DataService.messenger.emit('status-update', {
           message: "table " + this.tableName + " loaded"
        });

        this.sortColumn = 'id';
        this.sortReversed = false;

        this.setSortColumn = function(field) {
          if ( 'fields.' + field.name === this.sortColumn ) {
              this.sortReversed = !this.sortReversed;
          }  else {
              this.sortColumn = 'fields.' + field.name;
              this.sortReversed = false;
          }
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

        this.addRow = function($event) {
            DataService.editRecord($event, '0', self.tableName);
        };

        this.openRecord = function($event, id) {
            DataService.editRecord($event, id, self.tableName);
        };

        this.updateRow = function($event, row) {
            DataService.updateRow(row);
        };

    }
];

export let TableResolve = {
    tableName: ['$stateParams', function ($stateParams) {
        return $stateParams.table;
    }]
};