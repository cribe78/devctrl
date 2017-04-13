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
var DCSerializable_1 = require("../../shared/DCSerializable");
var data_service_1 = require("../data.service");
var FkAutocompleteComponent = (function () {
    function FkAutocompleteComponent(dataService) {
        this.dataService = dataService;
        this.onUpdate = new core_1.EventEmitter();
        this.menuVisibility = "hidden";
        this.inputText = '';
    }
    FkAutocompleteComponent.prototype.ngOnInit = function () {
        // Find the foreign key definition on the object
        var fkDef;
        for (var _i = 0, _a = this.object.foreignKeys; _i < _a.length; _i++) {
            var fk = _a[_i];
            if (fk.fkIdProp == this.field.name) {
                fkDef = fk;
            }
        }
        if (!fkDef) {
            console.error("Invalid fk field provided to FkAutocomplete: " + this.field.name);
            return;
        }
        this.dataTable = this.dataService.getTable(fkDef.fkTable);
        this.objProp = fkDef.fkObjProp;
        if (this.object[this.objProp]) {
            this.selectedItem = this.object[this.objProp];
            this.inputText = this.selectedItem.fkSelectName();
        }
    };
    FkAutocompleteComponent.prototype.focusLost = function () {
        var _this = this;
        // This timeout is necessary because otherwise the click event from selecting
        // an item never fires
        setTimeout(function () { _this.closeAcMenu(); }, 300);
    };
    FkAutocompleteComponent.prototype.getMatches = function () {
        var matches = [];
        var stLower = this.inputText.toLowerCase();
        var stLowerParts = stLower.split(' ');
        for (var id in this.dataTable) {
            var item = this.dataTable[id];
            var fkNameLower = item.fkSelectName().toLowerCase();
            var matched = true;
            for (var _i = 0, stLowerParts_1 = stLowerParts; _i < stLowerParts_1.length; _i++) {
                var part = stLowerParts_1[_i];
                if (fkNameLower.indexOf(part) == -1) {
                    matched = false;
                    break;
                }
            }
            if (matched) {
                matches.push(item);
            }
        }
        // If input is an exact match, update underlying field
        if (matches[0] && this.inputText == matches[0].fkSelectName()) {
            if (!matches[0].equals(this.selectedItem)) {
                this.selectedItem = matches[0];
                this.selectedUpdated();
            }
        }
        return matches;
    };
    FkAutocompleteComponent.prototype.openAcMenu = function () {
        this.menuVisibility = "visible";
    };
    FkAutocompleteComponent.prototype.closeAcMenu = function () {
        this.menuVisibility = "hidden";
    };
    FkAutocompleteComponent.prototype.selectItem = function (obj) {
        this.selectedItem = obj;
        this.inputText = obj.fkSelectName();
        this.selectedUpdated();
        this.closeAcMenu();
    };
    FkAutocompleteComponent.prototype.selectedUpdated = function () {
        this.onUpdate.emit({ value: this.selectedItem, name: this.objProp });
    };
    FkAutocompleteComponent.prototype.trackById = function (idx, obj) {
        return obj._id;
    };
    return FkAutocompleteComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", DCSerializable_1.DCSerializable)
], FkAutocompleteComponent.prototype, "object", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponent.prototype, "field", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FkAutocompleteComponent.prototype, "onUpdate", void 0);
FkAutocompleteComponent = __decorate([
    core_1.Component({
        selector: 'fk-autocomplete',
        template: "\n<md-input-container>\n    <input mdInput\n            #fkauto\n           [placeholder]=\"field.label\"\n           [(ngModel)]=\"inputText\"\n           (focus)=\"openAcMenu()\"\n           (blur)=\"focusLost()\"\n           [name]=\"field.name\" >\n</md-input-container>\n\n<div class=\"ac-menu\" [style.visibility]=\"menuVisibility\" #acmenu>\n    <md-list>\n        <a md-list-item\n            *ngFor=\"let fkobj of getMatches(); trackBy: trackById\"\n            (click)=\"selectItem(fkobj)\">\n         {{fkobj.fkSelectName()}}\n        </a>\n    </md-list>\n</div>\n",
        styles: ["\n.ac-menu { \n    position: absolute;\n    z-index: 1002;\n    background-color: white;\n    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);\n    cursor: pointer;\n    max-height: 300px;\n    overflow-y: auto;\n}\n\ninput {\n    min-width: 300px;\n}\n"]
    }),
    __metadata("design:paramtypes", [data_service_1.DataService])
], FkAutocompleteComponent);
exports.FkAutocompleteComponent = FkAutocompleteComponent;
//# sourceMappingURL=fk-autocomplete.component.js.map