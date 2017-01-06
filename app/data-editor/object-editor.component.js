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
        this.onUpdate.emit({ object: this.object, name: this.fname });
    };
    ObjectEditorComponent.prototype.deleteValue = function (key) {
        delete this.object[key];
        this.onUpdate.emit({ object: this.object, name: this.fname });
    };
    ObjectEditorComponent.prototype.keys = function () {
        return Object.keys(this.object);
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
        this.onUpdate.emit({ object: this.object, name: this.fname });
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
    core_1.Output(),
    __metadata("design:type", Object)
], ObjectEditorComponent.prototype, "onUpdate", void 0);
ObjectEditorComponent = __decorate([
    core_1.Component({
        selector: 'devctrl-object-editor',
        template: "\n<md-list>\n    <h3 md-subheader>\n        {{fname}}\n    </h3>\n    <md-list-item class=\"md-list-item-text\"\n                  *ngFor=\"let key of keys()\">\n        <div *ngIf=\"valueType(object[key]) != 'object'\">\n            <label>{{key}}</label>\n            <input  [(ngModel)]=\"object[key]\" (change)=\"updateValue($event, key)\">\n\n        </div>\n        <devctrl-object-editor *ngIf=\"valueType(object[key]) == 'object'\"\n                                [object]=\"object[key]\"\n                                [fname]=\"key\"\n                                (onUpdate)=\"updateItem($event)\">\n        </devctrl-object-editor>\n        <button md-button  class=\"md-icon-button\" (click)=\"deleteValue(key)\">\n            <md-icon>delete</md-icon>\n        </button>\n    </md-list-item>\n    <md-list-item>\n        <div class=\"layout-row\">\n            <div class=\"form-group\">\n                <label>{{name}} Key</label>\n                <input id=\"oe-new-key\" [(ngModel)]=\"newKey\" name=\"new-key\">\n            </div>\n            <div class=\"form-group\">\n                <label>Value</label>\n                <input  [(ngModel)]=\"newVal\" name=\"new-val\">\n            </div>\n            <button md-button (click)=\"addItem()\">\n                Add\n            </button>\n        </div>\n    </md-list-item>\n\n</md-list>    \n"
    }),
    __metadata("design:paramtypes", [])
], ObjectEditorComponent);
exports.ObjectEditorComponent = ObjectEditorComponent;
//# sourceMappingURL=object-editor.component.js.map