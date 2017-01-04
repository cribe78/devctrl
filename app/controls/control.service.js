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
var data_service_1 = require("../data.service");
var record_editor_service_1 = require("data-editor/record-editor.service");
var Control_1 = require("shared/Control");
var WatcherRule_1 = require("shared/WatcherRule");
var ControlService = (function () {
    function ControlService(dataService, recordService) {
        this.dataService = dataService;
        this.recordService = recordService;
        this.panelContext = false;
    }
    Object.defineProperty(ControlService.prototype, "panelControl", {
        get: function () {
            return this._panelControl;
        },
        set: function (pc) {
            this.panelContext = true;
            this._panelControl = pc;
            this._control = pc.control;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlService.prototype, "control", {
        get: function () {
            return this._control;
        },
        set: function (val) {
            this._control = val;
            if (this._panelControl && this._panelControl.control_id != val._id) {
                this._panelControl = undefined;
                this.panelContext = false;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlService.prototype, "controlId", {
        get: function () {
            return this._control._id;
        },
        set: function (id) {
            this.control = this.dataService.getRowRef(Control_1.Control.tableStr, id);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlService.prototype, "type", {
        get: function () {
            return this._control.usertype;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlService.prototype, "name", {
        get: function () {
            if (this.panelContext && this._panelControl.name) {
                return this._panelControl.name;
            }
            return this._control.name;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ControlService.prototype, "value", {
        get: function () {
            return this._control.value;
        },
        set: function (val) {
            this._control.value = val;
        },
        enumerable: true,
        configurable: true
    });
    ControlService.prototype.addWatcherRule = function ($event) {
        this.recordService.editRecord($event, '0', WatcherRule_1.WatcherRule.tableStr, { watched_control_id: this.control._id });
    };
    ControlService.prototype.config = function (key) {
        if (typeof this.control.config == 'object' && this.control.config[key]) {
            return this.control.config[key];
        }
        return '';
    };
    ControlService.prototype.editControl = function ($event) {
        this.recordService.editRecord($event, this.control._id, this.control.table);
    };
    ControlService.prototype.editOptions = function ($event) {
        if (this.control.option_set) {
            this.recordService.editRecord($event, this.control.option_set_id, this.control.option_set.table);
        }
        else {
            this.recordService.editRecord($event, this.control._id, this.control.table);
        }
    };
    ControlService.prototype.editPanelControl = function ($event) {
        this.recordService.editRecord($event, this.panelControl._id, this.panelControl.table);
    };
    ControlService.prototype.intConfig = function (key) {
        if (this.config(key)) {
            return parseInt(this.config(key));
        }
        return 0;
    };
    ControlService.prototype.normalizedValue = function () {
        // Normalize a numeric value to a scale of 0 - 100
        var rawVal = this.control.value;
        var max = this.intConfig('max');
        var min = this.intConfig('min');
        rawVal = rawVal < min ? min : rawVal;
        rawVal = rawVal > max ? max : rawVal;
        var normVal = (rawVal + (0 - min)) * (max - min) / (100 - 0);
        return normVal;
    };
    ControlService.prototype.selectMenuItem = function (val) {
        this.setValue(val);
    };
    ControlService.prototype.selectOptions = function () {
        var options;
        if (this.control.option_set && this.control.option_set.options) {
            options = this.control.option_set.options;
        }
        else {
            options = !!this.control.config.options ? this.control.config.options : {};
        }
        return options;
    };
    ControlService.prototype.selectOptionsArray = function () {
        var options = this.selectOptions();
        var optionsArray = Object.keys(options).map(function (value) {
            return { name: options[value], value: value };
        });
        return optionsArray;
    };
    ControlService.prototype.setValue = function (val) {
        this.value = val;
        this.updateValue(val);
    };
    ControlService.prototype.selectValueName = function () {
        var opts = this.selectOptions();
        var value = '' + this.value;
        if (opts[value]) {
            return opts[value];
        }
        return value;
    };
    ControlService.prototype.showLog = function ($event) {
        this.dataService.showControlLog($event, this.control);
    };
    ControlService.prototype.trackByValue = function (idx, obj) {
        return obj.value;
    };
    ControlService.prototype.updateValue = function (val) {
        this.dataService.updateControlValue(this.control);
    };
    return ControlService;
}());
ControlService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService,
        record_editor_service_1.RecordEditorService])
], ControlService);
exports.ControlService = ControlService;
//# sourceMappingURL=control.service.js.map