"use strict";
class ObjectEditorController {
    constructor() { }
    addItem() {
        if (this.newKey && this.newVal) {
            let tempVal = '';
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
    }
    deleteValue(key) {
        delete this.object[key];
        this.onUpdate({ object: this.object, name: this.name });
    }
    onUpdate(args) { }
    valueType(value) {
        if (angular.isArray(value)) {
            return "array";
        }
        return typeof value;
    }
    updateValue($event, key) {
        let tempVal = '';
        try {
            tempVal = JSON.parse(this.object[key]);
        }
        catch (e) {
            tempVal = this.object[key];
        }
        this.object[key] = tempVal;
    }
}
ObjectEditorController.$inject = [];
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