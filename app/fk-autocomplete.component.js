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
var data_service_1 = require("./data.service");
var FkAutocompleteComponent = (function () {
    function FkAutocompleteComponent(dataService) {
        this.dataService = dataService;
    }
    FkAutocompleteComponent.prototype.ngOnInit = function () {
        this.dataTable = this.dataService.getTable(this.table);
        this.label = this.field.label;
        this.selectedItem = this.dataTable[this.selectedItemId];
    };
    FkAutocompleteComponent.prototype.getMatches = function (searchText) {
        var matches = [];
        var stLower = searchText.toLowerCase();
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
        return matches;
    };
    FkAutocompleteComponent.prototype.onUpdate = function (data) { };
    FkAutocompleteComponent.prototype.selectedUpdated = function () {
        this.onUpdate({ value: this.selectedItem, name: this.objectField });
    };
    return FkAutocompleteComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponent.prototype, "table", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponent.prototype, "field", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponent.prototype, "objectField", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponent.prototype, "selectedItemId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], FkAutocompleteComponent.prototype, "onUpdate", null);
FkAutocompleteComponent = __decorate([
    core_1.Component({
        selector: 'fk-autocomplete',
        template: "\n    Totally incomplete\n"
    }),
    __metadata("design:paramtypes", [data_service_1.DataService])
], FkAutocompleteComponent);
exports.FkAutocompleteComponent = FkAutocompleteComponent;
var originalTemplate = "\n    <md-autocomplete\n        md-selected-item=\"$ctrl.selectedItem\"\n        md-search-text=\"$ctrl.searchText\"\n        md-items=\"item in $ctrl.getMatches($ctrl.searchText)\"\n        md-item-text=\"item.fkSelectName()\"\n        md-min-length=\"0\"\n        md-floating-label=\"{{$ctrl.label}}\"\n        md-selected-item-change=\"$ctrl.selectedUpdated()\">\n        <span md-highlight-text=\"searchText\">{{item.fkSelectName()}}</span>\n    </md-autocomplete>";
//# sourceMappingURL=fk-autocomplete.component.js.map