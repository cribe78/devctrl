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
var material_1 = require("@angular/material");
var data_service_1 = require("./data.service");
var core_1 = require("@angular/core");
var record_component_1 = require("./record.component");
var RecordEditorService = (function () {
    function RecordEditorService(dataService, mdDialog) {
        this.dataService = dataService;
        this.mdDialog = mdDialog;
    }
    RecordEditorService.prototype.editRecord = function ($event, id, tableName, recordDefaults) {
        if (recordDefaults === void 0) { recordDefaults = {}; }
        var record;
        if (id !== "0") {
            record = this.dataService.getRowRef(tableName, id);
        }
        else {
            // Set the name as an empty string, otherwise it will resolve
            // as "unknown [tablename]"
            if (!recordDefaults["name"]) {
                recordDefaults["name"] = '';
            }
            record = this.dataService.getNewRowRef(tableName, recordDefaults);
        }
        var recRef = this.mdDialog.open(record_component_1.RecordComponent);
        recRef.componentInstance.newRow = id == "0";
        recRef.componentInstance.obj = record;
        recRef.componentInstance.schema = this.dataService.getSchema(tableName);
    };
    return RecordEditorService;
}());
RecordEditorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [data_service_1.DataService,
        material_1.MdDialog])
], RecordEditorService);
exports.RecordEditorService = RecordEditorService;
//# sourceMappingURL=record-editor.service.js.map