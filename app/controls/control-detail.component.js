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
var Control_1 = require("../../shared/Control");
var data_service_1 = require("../data.service");
var menu_service_1 = require("../layout/menu.service");
var router_1 = require("@angular/router");
var record_editor_service_1 = require("../data-editor/record-editor.service");
var WatcherRule_1 = require("../../shared/WatcherRule");
var ControlDetailComponent = (function () {
    function ControlDetailComponent(route, ds, recordService, menu) {
        this.route = route;
        this.ds = ds;
        this.recordService = recordService;
        this.menu = menu;
    }
    ControlDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.schema = this.ds.getSchema(Control_1.Control.tableStr);
        this.watcherRules = this.ds.getTable(WatcherRule_1.WatcherRule.tableStr);
        this.route.data.subscribe(function (data) {
            _this.menu.currentTopLevel = menu_service_1.MenuService.TOPLEVEL_DEVICES;
            _this.control = data.control;
            console.log("control " + _this.control.id + " loaded");
            if (_this.control) {
                _this.menu.pageTitle = _this.control.name;
            }
            //this.watcherRules = this.control.referenced[WatcherRule.tableStr] as IndexedDataSet<WatcherRule>;
        });
    };
    ControlDetailComponent.prototype.controlUpdated = function (update) {
        this.control[update.name] = update.value;
    };
    ControlDetailComponent.prototype.editWatcherRule = function ($event, watcherRule) {
        this.recordService.editRecord($event, watcherRule.id, watcherRule.table);
    };
    ControlDetailComponent.prototype.openRecordEditor = function ($event) {
        this.recordService.editRecord($event, this.control.id, this.control.table);
    };
    ControlDetailComponent.prototype.triggeredList = function () {
        var _this = this;
        if (this.watcherRules) {
            return Object.keys(this.watcherRules)
                .map(function (id) { return _this.watcherRules[id]; })
                .filter(function (rule) { return rule.watched_control_id == _this.control.id; });
        }
        return [];
    };
    return ControlDetailComponent;
}());
ControlDetailComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-ctrl-detail',
        //language=HTML
        template: "\n<div id=\"devctrl-content-canvas\">\n    <div class=\"devctrl-card\">\n        <md-tab-group #tabgroup>\n            <md-tab label=\"Overview\">\n                <md-list>\n                    <h3 md-subheader>Control</h3>\n                    <md-list-item class=\"devctrl-ctrl-list-item\">\n                        <devctrl-ctrl [controlId]=\"control.id\"></devctrl-ctrl>\n                    </md-list-item>\n                </md-list>\n                <h3 class=\"settings-subheader\">\n                    Settings \n                    <button md-icon-button (click)=\"openRecordEditor($event)\"><md-icon>create</md-icon></button>\n                </h3>\n                \n                <form>\n                    <div class=\"settings-container\">\n                        <fk-autocomplete [object]=\"control\"\n                            [field]=\"schema.fields[0]\"\n                            (onUpdate)=\"controlUpdated($event)\">    \n                        </fk-autocomplete>\n                        <md-input-container>\n                            <input mdInput \n                                placeholder=\"Name\"\n                                name=\"name\"\n                                [(ngModel)]=\"control.name\"> \n                        </md-input-container>\n                        <md-input-container>\n                            <input mdInput disabled\n                                placeholder=\"CTID\"\n                                name=\"ctid\"\n                                [(ngModel)]=\"control.ctid\">\n                        </md-input-container>\n                        <md-select [placeholder]=\"'UI Type'\"\n                            [(ngModel)]=\"control.usertype\"\n                            name=\"usertype\">\n                            <md-option [value]=\"option.value\"\n                                       *ngFor=\"let option of schema.fields[3].options\">\n                                {{option.name}}\n                            </md-option>                            \n                        </md-select>\n                        <md-select [placeholder]=\"'Control Type'\"\n                            [(ngModel)]=\"control.control_type\"\n                            name=\"control_type\">\n                            <md-option [value]=\"option.value\"\n                                       *ngFor=\"let option of schema.fields[4].options\">\n                                {{option.name}}\n                            </md-option>                            \n                        </md-select>\n                        <md-checkbox\n                                  [(ngModel)]=\"control.poll\"\n                                  name=\"poll\">\n                            Poll?\n                        </md-checkbox>\n                        <md-input-container>\n                            <input mdInput\n                                placeholder=\"Value\"\n                                name=\"value\"\n                                [(ngModel)]=\"control.value\">\n                        </md-input-container>\n                    </div>        \n                </form>     \n            </md-tab>\n            <md-tab label=\"Watcher Rules\">\n                <md-list>\n                    <h3 md-subheader>Rules triggered by this control</h3>\n                    <ng-template ngFor let-watcherRule [ngForOf]=\"triggeredList()\">\n                        <md-list-item>\n                            <h3 md-line class=\"triggered-detail\">\n                                {{watcherRule.action_control.endpoint.name}}\n                                :&nbsp;\n                                {{watcherRule.action_control.name}}\n                            </h3>\n                            <div md-line>\n                                {{watcherRule.valueDescription}}\n                            </div>\n                            <button md-icon-button (click)=\"editWatcherRule($event, watcherRule)\">\n                                <md-icon>create</md-icon>\n                            </button>\n                        </md-list-item>\n                    </ng-template>\n                </md-list>\n            </md-tab>\n            <md-tab label=\"Log\">\n            </md-tab>\n        </md-tab-group>\n    </div>\n</div>\n    ",
        //language=CSS
        styles: ["\n        .devctrl-card {\n            max-width: 1600px;\n            flex: 1 1;\n        }\n        .settings-container {\n            display: flex;\n            flex-direction: column;\n            padding-right: 16px;\n            padding-left: 16px;\n        }\n        .settings-subheader {\n            display: block;\n            box-sizing: border-box;\n            height: 64px;\n            padding: 16px;\n            margin: 0;\n            font-size: 14px;\n            font-weight: 500;\n            color: rgba(0,0,0,.54);\n        }\n        .triggered-detail {\n            display: flex;\n            flex-direction: row;\n        }\n        .triggered-field {\n            flex: 1 1;\n        }\n        md-select {\n            margin-top: 24px;\n        }\n        md-checkbox {\n            margin-top: 10px;\n            margin-bottom: 10px;\n        }\n    "]
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        data_service_1.DataService,
        record_editor_service_1.RecordEditorService,
        menu_service_1.MenuService])
], ControlDetailComponent);
exports.ControlDetailComponent = ControlDetailComponent;
//# sourceMappingURL=control-detail.component.js.map