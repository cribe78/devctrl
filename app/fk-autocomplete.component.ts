import {Component, Input, Output, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {DCSerializable} from "../shared/DCSerializable";
import {DataService} from "./data.service";

@Component({
    selector: 'fk-autocomplete',
    template: `
    Totally incomplete
`
})
export class FkAutocompleteComponent implements OnInit
{
    @Input()table;
    @Input()field;
    @Input()objectField;
    @Input()selectedItemId;

    dataTable : IndexedDataSet<DCSerializable>;
    selectedItem : DCSerializable;
    label : string;

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.dataTable = this.dataService.getTable(this.table);
        this.label = this.field.label;
        this.selectedItem = this.dataTable[this.selectedItemId];
    }

    getMatches(searchText) {
        let matches = [];
        let stLower = searchText.toLowerCase();
        let stLowerParts = stLower.split(' ');
        for (let id in this.dataTable) {
            let item : DCSerializable = this.dataTable[id];
            let fkNameLower = item.fkSelectName().toLowerCase();

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

    @Output()onUpdate(data) {}

    selectedUpdated() {
        this.onUpdate({value: this.selectedItem, name: this.objectField});
    }

}


let originalTemplate = `
    <md-autocomplete
        md-selected-item="$ctrl.selectedItem"
        md-search-text="$ctrl.searchText"
        md-items="item in $ctrl.getMatches($ctrl.searchText)"
        md-item-text="item.fkSelectName()"
        md-min-length="0"
        md-floating-label="{{$ctrl.label}}"
        md-selected-item-change="$ctrl.selectedUpdated()">
        <span md-highlight-text="searchText">{{item.fkSelectName()}}</span>
    </md-autocomplete>`;