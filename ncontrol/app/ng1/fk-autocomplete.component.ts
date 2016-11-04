import {DCSerializable} from "../../shared/DCSerializable";
import IComponentOptions = angular.IComponentOptions;
import {DataService} from "../data.service";
import {IndexedDataSet} from "../../shared/DCDataModel";
class FkAutocompleteController {
    selectedItem : DCSerializable;
    selectedItemId : string;
    searchText = "";
    dataTable : IndexedDataSet<DCSerializable>;
    table : string;
    field : any;
    label : string;
    objectField: string;

    static $inject = ['DataService'];
    constructor(private dataService : DataService) {}

    $onInit() {
        this.dataTable = this.dataService.getTable(this.table);
        this.label = this.field.label;
        this.selectedItem = this.dataTable[this.selectedItemId];
    }

    getMatches(searchText) {
        let matches = [];
        let stLower = angular.lowercase(searchText);
        for (let id in this.dataTable) {
            let item : DCSerializable = this.dataTable[id];
            let fkNameLower = angular.lowercase(item.fkSelectName());

            if (fkNameLower.indexOf(stLower) > -1) {
                matches.push(item);
            }
        }

        return matches;
    }

    onUpdate(data) {}

    selectedUpdated() {
        this.onUpdate({value: this.selectedItem, name: this.objectField});
    }


}


export let FkAutocompleteComponent : IComponentOptions = {
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
}