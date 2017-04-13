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
var DCSerializable_1 = require("shared/DCSerializable");
var data_service_1 = require("../data.service");
var material_1 = require("@angular/material");
var RecordComponent = (function () {
    function RecordComponent(dataService, dialogRef) {
        this.dataService = dataService;
        this.dialogRef = dialogRef;
        this.editStack = [];
        this.trackById = DCSerializable_1.DCSerializable.trackById;
    }
    RecordComponent.prototype.addRow = function () {
        this.dataService.addRow(this.obj, function () { });
        this.close(true);
    };
    RecordComponent.prototype.deleteRow = function () {
        this.dataService.deleteRow(this.obj);
        this.close(true);
    };
    RecordComponent.prototype.editOtherRow = function (row) {
        this.editStack.push(this.obj);
        this.obj = row;
        this.schema = this.dataService.getSchema(row.table);
    };
    RecordComponent.prototype.fkName = function (prop) {
        if (this.obj[prop]) {
            return this.obj[prop].name;
        }
        return 'unknown';
    };
    RecordComponent.prototype.updateRow = function () {
        this.dataService.updateRow(this.obj);
        this.close(true);
    };
    RecordComponent.prototype.cloneRow = function () {
        var _this = this;
        var newValues = this.obj.getDataObject();
        newValues['name'] = "";
        var newRow = this.dataService.getNewRowRef(this.obj.table, newValues);
        this.dataService.addRow(newRow, function (newRec) {
            _this.obj = newRec;
        });
    };
    RecordComponent.prototype.close = function (popStack) {
        if (popStack && this.editStack.length > 0) {
            this.obj = this.editStack.pop();
            this.schema = this.dataService.getSchema(this.obj.table);
        }
        else {
            this.dialogRef.close();
        }
    };
    RecordComponent.prototype.objectUpdated = function (update) {
        this.obj[update.name] = update.value;
    };
    RecordComponent.prototype.referencedTables = function () {
        return Object.keys(this.obj.referenced);
    };
    RecordComponent.prototype.referencedArray = function (table) {
        var _this = this;
        return Object.keys(this.obj.referenced[table]).map(function (id) { return _this.obj.referenced[table][id]; });
    };
    RecordComponent.prototype.trackByName = function (index, field) {
        return field.name;
    };
    return RecordComponent;
}());
RecordComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'devctrl-record',
        templateUrl: 'record.html',
        //language=CSS
        styles: ["\n        .field-container {\n            flex: 1 1;\n        }\n        \n        .form-container {\n            display: flex;\n            flex-direction: column;\n            flex: 1 1;\n        }\n        \n        .record-container {\n            display: flex;\n            flex-direction: column;\n        }    \n    "]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService,
        material_1.MdDialogRef])
], RecordComponent);
exports.RecordComponent = RecordComponent;
//# sourceMappingURL=record.component.js.map