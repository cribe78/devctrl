"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var ObjectEditorComponent = (function () {
    function ObjectEditorComponent() {
        this.onUpdate = new core_1.EventEmitter();
    }
    ObjectEditorComponent.prototype.addItem = function () {
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
        //angular.element(document).find('#oe-new-key').focus();
        this.onUpdate.emit({ value: this.object, name: this.fname });
    };
    ObjectEditorComponent.prototype.deleteValue = function (key) {
        delete this.object[key];
        this.onUpdate.emit({ object: this.object, name: this.fname });
    };
    ObjectEditorComponent.prototype.keys = function () {
        return Object.keys(this.object);
    };
    ObjectEditorComponent.prototype.keyPath = function (key) {
        var path = this.fname;
        if (key) {
            path = path + "." + key;
        }
        if (this.pathPrefix) {
            path = this.pathPrefix + "." + path;
        }
        return path;
    };
    ObjectEditorComponent.prototype.newKeyPlaceholder = function () {
        var path = this.keyPath('');
        return "New " + path + " key";
    };
    ObjectEditorComponent.prototype.valueType = function (value) {
        if (Array.isArray(value)) {
            return "array";
        }
        return typeof value;
    };
    ObjectEditorComponent.prototype.updateValue = function ($event, key) {
        var tempVal = '';
        try {
            tempVal = JSON.parse(this.object[key]);
        }
        catch (e) {
            tempVal = this.object[key];
        }
        this.object[key] = tempVal;
    };
    ObjectEditorComponent.prototype.updateItem = function () {
        this.onUpdate.emit({ value: this.object, name: this.fname });
    };
    return ObjectEditorComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ObjectEditorComponent.prototype, "object", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ObjectEditorComponent.prototype, "fname", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ObjectEditorComponent.prototype, "pathPrefix", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ObjectEditorComponent.prototype, "onUpdate", void 0);
ObjectEditorComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-object-editor',
        template: "\n<div>\n    <span class=\"text-menu\">\n        {{keyPath()}}\n    </span>\n    <div style=\"margin-left: 24px;\">\n        <template ngFor let-key [ngForOf]=\"keys()\">\n            <div class=\"prop-row\" *ngIf=\"valueType(object[key]) != 'object'\">\n                <md-input-container>\n                    <input mdInput \n                            [placeholder]=\"keyPath(key)\" \n                            [(ngModel)]=\"object[key]\" \n                            (change)=\"updateValue($event, key)\">\n                </md-input-container>  \n                <button type=\"button\" md-icon-button (click)=\"deleteValue(key)\">\n                    <md-icon>delete</md-icon>\n                </button>\n            </div>\n            <devctrl-object-editor *ngIf=\"valueType(object[key]) == 'object'\"\n                            [object]=\"object[key]\"\n                            [fname]=\"key\"\n                            [pathPrefix]=\"keyPath()\"\n                            (onUpdate)=\"updateItem($event)\">\n            </devctrl-object-editor>\n        </template>\n        <div class=\"new-prop-row\">\n            <md-input-container>\n                <input mdInput [placeholder]=\"newKeyPlaceholder()\" [(ngModel)]=\"newKey\" name=\"new-key\">\n            </md-input-container>\n            <md-input-container>\n                <input mdInput placeholder=\"Value\" [(ngModel)]=\"newVal\" name=\"new-val\">\n            </md-input-container>\n            <button md-icon-button\n                    type=\"button\" \n                    (click)=\"addItem()\"\n                    color=\"primary\">\n                <md-icon>add</md-icon>\n            </button>\n        </div>\n    </div>\n</div>    \n",
        //language=CSS
        styles: ["\n        devctrl-object-editor {\n            flex: 1 1;\n        }\n        \n        .new-prop-row {\n            display: flex;\n            flex-direction: row;\n        }\n        \n        .prop-row {\n            display: flex;\n            flex-direction: row;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [])
], ObjectEditorComponent);
exports.ObjectEditorComponent = ObjectEditorComponent;
//# sourceMappingURL=object-editor.component.js.map