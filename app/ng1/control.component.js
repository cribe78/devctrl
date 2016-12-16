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
var Control_1 = require("../../shared/Control");
var WatcherRule_1 = require("../../shared/WatcherRule");
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var CtrlController = (function () {
    function CtrlController(dataService, menuService, recordService) {
        this.dataService = dataService;
        this.menuService = menuService;
        this.recordService = recordService;
        this.menu = menuService;
    }
    CtrlController.prototype.$onInit = function () {
        this.panelContext = !!this.panelControl;
        if (this.panelContext) {
            this.ctrl = this.panelControl.control;
        }
        else {
            this.ctrl = this.dataService.getRowRef(Control_1.Control.tableStr, this.controlId);
        }
        this.appConfig = this.dataService.config;
        this.type = this.ctrl.usertype;
    };
    Object.defineProperty(CtrlController.prototype, "name", {
        get: function () {
            if (this.panelContext && this.panelControl.name) {
                return this.panelControl.name;
            }
            return this.ctrl.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CtrlController.prototype, "value", {
        get: function () {
            return this.ctrl.value;
        },
        set: function (val) {
            this.ctrl.value = val;
        },
        enumerable: true,
        configurable: true
    });
    CtrlController.prototype.addWatcherRule = function ($event) {
        this.recordService.editRecord($event, '0', WatcherRule_1.WatcherRule.tableStr, { watched_control_id: this.ctrl._id });
    };
    CtrlController.prototype.config = function (key) {
        if (angular.isObject(this.ctrl.config) && this.ctrl.config[key]) {
            return this.ctrl.config[key];
        }
        return '';
    };
    CtrlController.prototype.editControl = function ($event) {
        this.recordService.editRecord($event, this.ctrl._id, this.ctrl.table);
    };
    CtrlController.prototype.editOptions = function ($event) {
        // Not currently implemented, enums removed from application
        if (this.ctrl.option_set) {
            this.recordService.editRecord($event, this.ctrl.option_set_id, this.ctrl.option_set.table);
        }
        else {
            this.recordService.editRecord($event, this.ctrl._id, this.ctrl.table);
        }
    };
    CtrlController.prototype.editPanelControl = function ($event) {
        this.recordService.editRecord($event, this.panelControl._id, this.panelControl.table);
    };
    CtrlController.prototype.intConfig = function (key) {
        if (this.config(key)) {
            return parseInt(this.config(key));
        }
        return 0;
    };
    CtrlController.prototype.normalizedValue = function () {
        // Normalize a numeric value to a scale of 0 - 100
        var rawVal = this.ctrl.value;
        var max = this.intConfig('max');
        var min = this.intConfig('min');
        rawVal = rawVal < min ? min : rawVal;
        rawVal = rawVal > max ? max : rawVal;
        var normVal = (rawVal + (0 - min)) * (max - min) / (100 - 0);
        return normVal;
    };
    CtrlController.prototype.selectMenuItem = function (val) {
        this.setValue(val);
    };
    CtrlController.prototype.selectOptions = function () {
        if (this.ctrl.option_set) {
            return this.ctrl.option_set.options;
        }
        return !!this.ctrl.config.options ? this.ctrl.config.options : {};
    };
    CtrlController.prototype.setValue = function (val) {
        this.ctrl.value = val;
        this.updateValue(val);
    };
    CtrlController.prototype.selectValueName = function () {
        var opts = this.selectOptions();
        var value = this.ctrl.value;
        for (var val in opts) {
            if (val == value) {
                return opts[val];
            }
        }
        return value;
    };
    CtrlController.prototype.showLog = function ($event) {
        this.dataService.showControlLog($event, this.ctrl);
    };
    CtrlController.prototype.updateValue = function (val) {
        this.dataService.updateControlValue(this.ctrl);
    };
    return CtrlController;
}());
CtrlController.$inject = ['DataService', 'MenuService', 'RecordEditorService'];
exports.ControlComponent = {
    templateUrl: 'app/ng1/ctrl.html',
    controller: CtrlController,
    bindings: {
        panelControl: '<',
        controlId: '<'
    }
};
var ControlComponentNg2 = (function (_super) {
    __extends(ControlComponentNg2, _super);
    function ControlComponentNg2(elementRef, injector) {
        return _super.call(this, 'ctrl', elementRef, injector) || this;
    }
    return ControlComponentNg2;
}(static_1.UpgradeComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ControlComponentNg2.prototype, "controlId", void 0);
ControlComponentNg2 = __decorate([
    core_1.Directive({
        selector: 'ctrl'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], ControlComponentNg2);
exports.ControlComponentNg2 = ControlComponentNg2;
//# sourceMappingURL=control.component.js.map