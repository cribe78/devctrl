"use strict";
var ObjectEditorController = (function () {
    function ObjectEditorController() {
    }
    ObjectEditorController.prototype.addItem = function () {
        if (this.newKey && this.newVal) {
            var tempVal = '';
            try {
                tempVal = JSON.parse(this.newVal);
            }
            catch (e) {
                tempVal = this.newVal;
            }
            if (typeof this.object == 'undefined') {
                this.object = {};
            }
            this.object[this.newKey] = tempVal;
        }
        this.newKey = undefined;
        this.newVal = undefined;
        angular.element(document).find('#oe-new-key').focus();
        this.onUpdate({ object: this.object, name: this.name });
    };
    ObjectEditorController.prototype.deleteValue = function (key) {
        delete this.object[key];
        this.onUpdate({ object: this.object, name: this.name });
    };
    ObjectEditorController.prototype.onUpdate = function (args) { };
    ObjectEditorController.prototype.valueType = function (value) {
        if (angular.isArray(value)) {
            return "array";
        }
        return typeof value;
    };
    ObjectEditorController.prototype.updateValue = function ($event, key) {
        var tempVal = '';
        try {
            tempVal = JSON.parse(this.object[key]);
        }
        catch (e) {
            tempVal = this.object[key];
        }
        this.object[key] = tempVal;
    };
    ObjectEditorController.$inject = [];
    return ObjectEditorController;
}());
exports.ObjectEditorComponent = {
    templateUrl: 'app/ng1/object-editor.html',
    controller: ObjectEditorController,
    bindings: {
        object: '<',
        name: '<',
        onUpdate: '&'
    }
};
//# sourceMappingURL=object-editor.component.js.map