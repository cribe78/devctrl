"use strict";
exports.EnumSelectDirective = ['DataService', function (DataService) {
        return {
            scope: {
                tableName: '=table',
                field: '=',
                selectModel: '='
            },
            bindToController: true,
            controller: function (DataService) {
                this.enums = DataService.getTable('enums');
                this.enumVals = DataService.getTable('enum_vals');
                this.schema = DataService.getSchema(this.tableName);
                this.enumId = function () {
                    var myId = 0;
                    var enumName = this.tableName + "." + this.field.name;
                    angular.forEach(this.enums.indexed, function (obj, id) {
                        if (obj.fields.name == enumName) {
                            myId = id;
                        }
                    });
                    return myId;
                };
                this.options = function () {
                    var eid = this.enumId();
                    var ret = {};
                    if (eid > 0) {
                        ret = this.enums.indexed[eid].referenced['enum_vals'];
                    }
                    return ret;
                };
            },
            controllerAs: 'enumSelect',
            templateUrl: 'ng/enum-select.html'
        };
    }];
//# sourceMappingURL=EnumSelectDirective.js.map