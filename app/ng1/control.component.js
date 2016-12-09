"use strict";
var Control_1 = require("../../shared/Control");
var WatcherRule_1 = require("../../shared/WatcherRule");
var CtrlController = (function () {
    function CtrlController(dataService, menuService) {
        this.dataService = dataService;
        this.menuService = menuService;
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
        this.dataService.editRecord($event, '0', WatcherRule_1.WatcherRule.tableStr, { watched_control_id: this.ctrl._id });
    };
    CtrlController.prototype.config = function (key) {
        if (angular.isObject(this.ctrl.config) && this.ctrl.config[key]) {
            return this.ctrl.config[key];
        }
        return '';
    };
    CtrlController.prototype.editControl = function ($event) {
        this.dataService.editRecord($event, this.ctrl._id, this.ctrl.table);
    };
    CtrlController.prototype.editOptions = function ($event) {
        // Not currently implemented, enums removed from application
        if (this.ctrl.option_set) {
            this.dataService.editRecord($event, this.ctrl.option_set_id, this.ctrl.option_set.table);
        }
        else {
            this.dataService.editRecord($event, this.ctrl._id, this.ctrl.table);
        }
    };
    CtrlController.prototype.editPanelControl = function ($event) {
        this.dataService.editRecord($event, this.panelControl._id, this.panelControl.table);
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
CtrlController.$inject = ['DataService', 'MenuService'];
exports.ControlComponent = {
    templateUrl: 'app/ng1/ctrl.html',
    controller: CtrlController,
    bindings: {
        panelControl: '<',
        controlId: '<'
    }
};
//# sourceMappingURL=control.component.js.map