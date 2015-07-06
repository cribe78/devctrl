goog.provide('DevCtrl.FkSelect.Directive');

DevCtrl.FkSelect.Directive = ['DataService', function(DataService) {
    return {
        scope: {
            tableName: '=table',
            field: '=',
            selectModel: '='
        },
        bindToController: true,
        controller: function(DataService) {
            this.options = DataService.getTable(this.tableName);
            this.schema = DataService.getSchema(this.tableName);
        },
        controllerAs: 'fkSelect',
        templateUrl: 'ng/fk-select.html'
    }
}];