goog.provide("DevCtrl.Record.Ctrl");
goog.provide("DevCtrl.Record.Resolve");

DevCtrl.Record.Ctrl = ['DataService',
    function(DataService) {
        this.newRow = this.obj.id === '0';
        this.schema = DataService.getSchema(this.obj.tableName);

        var self = this;

        this.addRow = function() {
            DataService.addRow(self.obj);
            DataService.editRecordClose();
        };

        this.deleteRow = function() {
            DataService.deleteRow(self.obj);
            DataService.editRecordClose();
        };

        this.updateRow = function() {
            DataService.updateRow(self.obj);
            DataService.editRecordClose();
        };

        this.cloneRow = function() {
            var newRow = angular.copy(self.obj);

            DataService.addRow(newRow);
            DataService.editRecordClose();
        };

        this.close = function() {
            DataService.editRecordClose();
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