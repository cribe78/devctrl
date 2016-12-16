"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var static_1 = require("@angular/upgrade/static");
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
        this.onUpdate({ object: this.object, name: this.fname });
    };
    ObjectEditorController.prototype.deleteValue = function (key) {
        delete this.object[key];
        this.onUpdate({ object: this.object, name: this.fname });
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
    return ObjectEditorController;
}());
ObjectEditorController.$inject = [];
exports.ObjectEditorComponent = {
    templateUrl: 'app/ng1/object-editor.html',
    controller: ObjectEditorController,
    bindings: {
        object: '<',
        fname: '<',
        onUpdate: '&'
    }
};
var ObjectEditorComponentNg2 = (function (_super) {
    __extends(ObjectEditorComponentNg2, _super);
    function ObjectEditorComponentNg2(elementRef, injector) {
        var _this = _super.call(this, 'devctrlObjectEditor', elementRef, injector) || this;
        _this.onUpdate = new core_1.EventEmitter();
        return _this;
    }
    return ObjectEditorComponentNg2;
}(static_1.UpgradeComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ObjectEditorComponentNg2.prototype, "object", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ObjectEditorComponentNg2.prototype, "fname", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ObjectEditorComponentNg2.prototype, "onUpdate", void 0);
ObjectEditorComponentNg2 = __decorate([
    core_1.Directive({
        selector: 'devctrl-object-editor'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], ObjectEditorComponentNg2);
exports.ObjectEditorComponentNg2 = ObjectEditorComponentNg2;
//# sourceMappingURL=object-editor.component.js.map