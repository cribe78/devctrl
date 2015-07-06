goog.provide("DevCtrl.Record.Ctrl");
goog.provide("DevCtrl.Record.Resolve");

DevCtrl.Record.Ctrl = ['DataService',
    function(DataService) {
        this.obj = this.table.data.indexed[this.id];
        this.schema = this.table.schema;

        var self = this;

        this.deleteRow = function() {
            DataService.deleteRow(self.obj);
            this.table.closeRecord();
        };

        this.updateRow = function() {
            DataService.updateRow(self.obj);
            this.table.closeRecord();
        }

        this.cloneRow = function() {
            var newRow = angular.copy(self.obj.fields);
            newRow.table = self.obj.tableName;

            DataService.addRow(newRow);
            this.table.closeRecord();
        }

        this.close = function() {
            this.table.closeRecord();
        }
    }
];

DevCtrl.Record.Resolve = {
    loadTable : ['tableName', 'DataService',
        function(tableName, DataService) {
            return DataService.getTablePromise(tableName);
        }
    ]
}