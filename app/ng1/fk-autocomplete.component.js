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
var FkAutocompleteController = (function () {
    function FkAutocompleteController(dataService) {
        this.dataService = dataService;
        this.searchText = "";
    }
    FkAutocompleteController.prototype.$onInit = function () {
        this.dataTable = this.dataService.getTable(this.table);
        this.label = this.field.label;
        this.selectedItem = this.dataTable[this.selectedItemId];
    };
    FkAutocompleteController.prototype.getMatches = function (searchText) {
        var matches = [];
        var stLower = angular.lowercase(searchText);
        var stLowerParts = stLower.split(' ');
        for (var id in this.dataTable) {
            var item = this.dataTable[id];
            var fkNameLower = angular.lowercase(item.fkSelectName());
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
    FkAutocompleteController.prototype.onUpdate = function (data) { };
    FkAutocompleteController.prototype.selectedUpdated = function () {
        this.onUpdate({ value: this.selectedItem, name: this.objectField });
    };
    return FkAutocompleteController;
}());
FkAutocompleteController.$inject = ['DataService'];
exports.FkAutocompleteComponent = {
    controller: FkAutocompleteController,
    bindings: {
        table: '<',
        field: '<',
        objectField: '<',
        selectedItemId: '<',
        onUpdate: '&'
    },
    template: "\n    \n    <md-autocomplete\n        md-selected-item=\"$ctrl.selectedItem\"\n        md-search-text=\"$ctrl.searchText\"\n        md-items=\"item in $ctrl.getMatches($ctrl.searchText)\"\n        md-item-text=\"item.fkSelectName()\"\n        md-min-length=\"0\"\n        md-floating-label=\"{{$ctrl.label}}\"\n        md-selected-item-change=\"$ctrl.selectedUpdated()\">\n        <span md-highlight-text=\"searchText\">{{item.fkSelectName()}}</span>\n    </md-autocomplete>\n"
};
var FkAutocompleteComponentNg2 = (function (_super) {
    __extends(FkAutocompleteComponentNg2, _super);
    function FkAutocompleteComponentNg2(elementRef, injector) {
        var _this = _super.call(this, 'fkAutocomplete', elementRef, injector) || this;
        _this.onUpdate = new core_1.EventEmitter();
        return _this;
    }
    return FkAutocompleteComponentNg2;
}(static_1.UpgradeComponent));
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponentNg2.prototype, "table", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponentNg2.prototype, "field", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponentNg2.prototype, "objectField", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], FkAutocompleteComponentNg2.prototype, "selectedItemId", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], FkAutocompleteComponentNg2.prototype, "onUpdate", void 0);
FkAutocompleteComponentNg2 = __decorate([
    core_1.Directive({
        selector: 'fk-autocomplete'
    }),
    __metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
], FkAutocompleteComponentNg2);
exports.FkAutocompleteComponentNg2 = FkAutocompleteComponentNg2;
//# sourceMappingURL=fk-autocomplete.component.js.map