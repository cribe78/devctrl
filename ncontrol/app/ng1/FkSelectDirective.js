"use strict";
exports.FkSelectDirective = ['DataService', function (DataService) {
        return {
            scope: {
                tableName: '=table',
                field: '=',
                selectModel: '=',
                fkOnChange: '=',
                addNewOption: '='
            },
            bindToController: true,
            controller: function (DataService) {
                var self = this;
                this.options = DataService.getTable(this.tableName);
                this.schema = DataService.getSchema(this.tableName);
                this.updateValue = function () {
                    if (angular.isFunction(self.fkOnChange)) {
                        self.fkOnChange();
                    }
                };
            },
            controllerAs: 'fkSelect',
            templateUrl: 'ng/fk-select.html'
        };
    }];
//# sourceMappingURL=FkSelectDirective.js.map