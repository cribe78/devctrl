goog.provide("DevCtrl.Record.Ctrl");

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
            var newRow = DataService.getNewRowRef(self.obj.tableName);
            newRow.fields = self.obj.fields;

            DataService.addRow(newRow, function(newRec) {
                self.obj = newRec;
                if (angular.isDefined(self.obj.fields.name)) {
                    self.obj.fields.name = "";
                }
            });
        };

        this.close = function() {
            DataService.editRecordClose();
        }
    }
];
