"use strict";
var ObjectEditorController = (function () {
    function ObjectEditorController(DataService) {
        this.DataService = DataService;
    }
    ObjectEditorController.prototype.addItem = function () {
        if (this.newKey && this.newValue) {
            this.object[this.newKey] = this.newValue;
        }
        this.newKey = undefined;
        this.newValue = undefined;
        angular.element('#oe-new-key').focus();
    };
    ObjectEditorController.prototype.valueType = function (value) {
        return typeof value;
    };
    ObjectEditorController.$inject = ['DataService'];
    return ObjectEditorController;
}());
exports.ObjectEditorDirective = [function () {
        return {
            scope: {
                object: '=',
                name: '='
            },
            bindToController: true,
            controller: ObjectEditorController,
            controllerAs: 'obj',
            templateUrl: 'app/ng1/object-editor.html'
        };
    }];
//# sourceMappingURL=ObjectEditorDirective.js.map