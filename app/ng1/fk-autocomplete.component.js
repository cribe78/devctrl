"use strict";
class FkAutocompleteController {
    constructor(dataService) {
        this.dataService = dataService;
        this.searchText = "";
    }
    $onInit() {
        this.dataTable = this.dataService.getTable(this.table);
        this.label = this.field.label;
        this.selectedItem = this.dataTable[this.selectedItemId];
    }
    getMatches(searchText) {
        let matches = [];
        let stLower = angular.lowercase(searchText);
        let stLowerParts = stLower.split(' ');
        for (let id in this.dataTable) {
            let item = this.dataTable[id];
            let fkNameLower = angular.lowercase(item.fkSelectName());
            let matched = true;
            for (let part of stLowerParts) {
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
    }
    onUpdate(data) { }
    selectedUpdated() {
        this.onUpdate({ value: this.selectedItem, name: this.objectField });
    }
}
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
    template: `
    
    <md-autocomplete
        md-selected-item="$ctrl.selectedItem"
        md-search-text="$ctrl.searchText"
        md-items="item in $ctrl.getMatches($ctrl.searchText)"
        md-item-text="item.fkSelectName()"
        md-min-length="0"
        md-floating-label="{{$ctrl.label}}"
        md-selected-item-change="$ctrl.selectedUpdated()">
        <span md-highlight-text="searchText">{{item.fkSelectName()}}</span>
    </md-autocomplete>
`
};
//# sourceMappingURL=fk-autocomplete.component.js.map