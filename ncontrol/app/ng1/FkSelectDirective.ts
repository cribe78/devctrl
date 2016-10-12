export let FkSelectDirective = ['DataService', function(DataService) : ng.IDirective {
    return {
        scope: {
            tableName: '=table',
            field: '=',
            selectModel: '=',
            fkOnChange: '=',
            addNewOption: '='
        },
        bindToController: true,
        controller: function(DataService) {
            var self = this;
            this.options = DataService.getTable(this.tableName);
            this.schema = DataService.getSchema(this.tableName);

            this.updateValue = function() {
                if (angular.isFunction(self.fkOnChange)) {
                    self.fkOnChange();
                }
            }
        },
        controllerAs: 'fkSelect',
        templateUrl: 'app/ng1/fk-select.html'
    }
}];