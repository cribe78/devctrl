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
var WatcherRule_1 = require("../../shared/WatcherRule");
var data_service_1 = require("../data.service");
var WatcherActionValueComponent = (function () {
    function WatcherActionValueComponent(ds) {
        this.ds = ds;
        this.onUpdate = new core_1.EventEmitter();
    }
    WatcherActionValueComponent.prototype.ngOnInit = function () {
    };
    Object.defineProperty(WatcherActionValueComponent.prototype, "actionControl", {
        get: function () {
            return this.contextObject.action_control;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WatcherActionValueComponent.prototype, "valueType", {
        get: function () {
            if ("value" in this.actionValue) {
                return "value";
            }
            return "map";
        },
        set: function (val) {
            if (val == "value") {
                if (this.actionValue.valueOverridden) {
                    this.actionValue.value = this.actionValue.valueOverridden;
                }
                else {
                    this.actionValue.value = '';
                }
                return;
            }
            this.actionValue.valueOverridden = this.actionValue.value;
            delete this.actionValue.value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WatcherActionValueComponent.prototype, "triggerControl", {
        get: function () {
            return this.contextObject.watched_control;
        },
        enumerable: true,
        configurable: true
    });
    WatcherActionValueComponent.prototype.addNewTriggerValue = function () {
        if (typeof this.newTriggerValue == 'undefined' || this.newTriggerValue == null) {
            this.ds.errorToast("New trigger value must be defined");
            return;
        }
        if (typeof this.actionValue.map[this.newTriggerValue] !== 'undefined') {
            this.ds.errorToast("Action value already defined for trigger value " + this.newTriggerValue);
            return;
        }
        this.actionValue.map[this.newTriggerValue] = null;
        this.newTriggerValue = null;
    };
    WatcherActionValueComponent.prototype.deleteTriggerValue = function (val) {
        delete this.actionValue.map[val];
    };
    WatcherActionValueComponent.prototype.mapKeys = function () {
        if (this.actionValue.map) {
            return Object.keys(this.actionValue.map);
        }
        return [];
    };
    WatcherActionValueComponent.prototype.controlsSelected = function () {
        return this.actionControl && this.triggerControl;
    };
    WatcherActionValueComponent.prototype.trackByValue = function (idx, obj) {
        return obj.value;
    };
    return WatcherActionValueComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], WatcherActionValueComponent.prototype, "actionValue", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", WatcherRule_1.WatcherRule)
], WatcherActionValueComponent.prototype, "contextObject", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], WatcherActionValueComponent.prototype, "onUpdate", void 0);
WatcherActionValueComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-watcher-action-value',
        template: "\n<div class=\"wav-editor\">\n    <label class=\"wav-label\">Action Value</label>\n    <div *ngIf=\"controlsSelected()\">\n        <md-radio-group [(ngModel)]=\"valueType\">\n            <md-radio-button value=\"value\">Fixed value</md-radio-button>\n            <md-radio-button value=\"map\">Value Map</md-radio-button>\n        </md-radio-group>\n        <devctrl-control-value-selector *ngIf=\"valueType == 'value'\"\n            [control]=\"actionControl\"\n            [placeholder]=\"Value\"\n            [(controlValue)]=\"actionValue.value\">\n        </devctrl-control-value-selector>\n        <div class=\"map-editor\" *ngIf=\"valueType == 'map'\">\n            <div class=\"map-editor-row\">\n               \n            </div>\n            <div class=\"map-editor-row\" *ngFor=\"let triggerVal of mapKeys()\">\n                <div class=\"map-key\">\n                    <label class=\"trigger-label\">Trigger Value</label>\n                    {{triggerControl.selectValueName(triggerVal)}}\n                </div>\n                <md-icon class=\"map-forward\">forward</md-icon>\n                <devctrl-control-value-selector [control]=\"actionControl\"\n                    [placeholder]=\"'Action Value'\"\n                    [(controlValue)]=\"actionValue.map[triggerVal]\"></devctrl-control-value-selector>\n                <button type=\"button\" md-icon-button\n                    class=\"delete-button\"\n                    (click)=\"deleteTriggerValue(triggerVal)\">\n                    <md-icon>delete</md-icon>\n                </button>\n            </div>\n            <div class=\"map-editor-row\">      \n                <devctrl-control-value-selector [control]=\"triggerControl\"\n                    class=\"new-trigger\"\n                    [placeholder]=\"'New Trigger Value'\"\n                    [(controlValue)]=\"newTriggerValue\"></devctrl-control-value-selector>\n                <button md-icon-button\n                    type=\"button\" \n                    (click)=\"addNewTriggerValue()\"\n                    color=\"primary\">\n                    <md-icon>add</md-icon>\n                </button>\n            </div>\n        </div>\n    \n    <div *ngIf=\"! controlsSelected()\">\n        Please select a watched control and an action control\n    </div>\n</div>\n    ",
        //language=CSS
        styles: ["\n        \n        .delete-button { \n            margin-top: 6px;    \n        }\n        \n        .new-trigger /deep/ md-select {\n            width: 200px;\n        }\n        .wav-editor {\n            display: flex;\n            flex-direction: column;\n        }\n        \n        .wav-label {\n            font-size: 75%;\n            color: rgba(0,0,0,.38);\n        }\n        \n        .trigger-label {\n            font-size: 75%;\n            color: rgba(0,0,0,.38);\n            margin-bottom: 6px;\n        }\n        \n        .map-editor {\n            margin-top: 6px;\n            margin-bottom: 6px;\n            display: flex;\n            flex-direction: column;\n        }\n        \n        .map-forward {\n            padding-top: 16px;\n            padding-left: 12px;\n            padding-right: 12px;\n            color: rgba(0,0,0,.38);\n        }\n        \n        .map-key {\n            display: flex;\n            flex-direction: column;\n           \n        }\n        \n        devctrl-control-value-selector {\n            margin-top: 16px;\n        }\n        \n        div.map-editor-row {\n            display: flex;\n            flex-direction: row;\n            margin-top: 12px;\n            margin-left: 12px;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService])
], WatcherActionValueComponent);
exports.WatcherActionValueComponent = WatcherActionValueComponent;
//# sourceMappingURL=watcher-action-value.component.js.map