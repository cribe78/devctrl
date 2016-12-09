"use strict";
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
//# sourceMappingURL=fk-autocomplete.component.js.map