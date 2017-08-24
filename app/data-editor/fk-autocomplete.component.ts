import {Component, Input, Output, OnInit, EventEmitter, ViewChild} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {MdMenuTrigger} from '@angular/material';
import {IndexedDataSet} from "../shared/DCDataModel";
import {DCSerializable, IDCFieldDefinition} from "../shared/DCSerializable";
import {DataService} from "../data.service";

@Component({
    selector: 'fk-autocomplete',
    template: `
<md-input-container>
    <input mdInput
            #fkauto
           [placeholder]="field.label"
           [(ngModel)]="inputText"
           (focus)="openAcMenu()"
           (blur)="focusLost()"
           [name]="field.name"
           [mdTooltip]="field.tooltip">
</md-input-container>

<div class="ac-menu" [style.visibility]="menuVisibility" #acmenu>
    <md-list>
        <a md-list-item
            *ngFor="let fkobj of matches; trackBy: trackById"
            (click)="selectItem(fkobj)">
         {{fkobj.fkSelectName()}}
        </a>
    </md-list>
</div>
`,
    //language=CSS
    styles: [`        
.ac-menu { 
    position: absolute;
    z-index: 1002;
    background-color: white;
    box-shadow: 0 3px 1px -2px rgba(0,0,0,.2), 0 2px 2px 0 rgba(0,0,0,.14), 0 1px 5px 0 rgba(0,0,0,.12);
    cursor: pointer;
    max-height: 300px;
    overflow-y: auto;
}

input {
    min-width: 300px;
}
`]
})
export class FkAutocompleteComponent implements OnInit
{
    @Input()object : DCSerializable;
    @Input()field : IDCFieldDefinition;

    @Output() onUpdate = new EventEmitter<any>();

    menuVisibility = "hidden";
    _inputText = '';
    dataTable : IndexedDataSet<DCSerializable>;
    objProp; // The property name of object which holds the foreign object
    selectedItem : DCSerializable;
    matches : DCSerializable[];

    constructor(private dataService: DataService) {}

    ngOnInit() {
        // Find the foreign key definition on the object
        let fkDef;
        for (let fk of this.object.foreignKeys) {
            if (fk.fkIdProp == this.field.name) {
                fkDef = fk;
            }
        }

        if (! fkDef) {
            console.error(`Invalid fk field provided to FkAutocomplete: ${this.field.name}`);
            return;
        }

        this.dataTable = this.dataService.getTable(fkDef.fkTable);
        this.objProp = fkDef.fkObjProp;
        if (this.object[this.objProp]) {
            this.selectedItem = this.object[this.objProp];
            this._inputText = this.selectedItem.fkSelectName();
        }
    }

    get inputText() {
        return this._inputText;
    }

    set inputText(value) {
        this._inputText = value;
        this.matches = this.getMatches();
    }

    focusLost() {
        // This timeout is necessary because otherwise the click event from selecting
        // an item never fires
        setTimeout(() => { this.closeAcMenu()}, 300);
    }

    getMatches() {
        let matches = [];
        let stLower = this.inputText.toLowerCase();
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

        // If input is an exact match, update underlying field
        if (matches[0] && this.inputText == matches[0].fkSelectName()) {
            if (! matches[0].equals(this.selectedItem)) {
                this.selectedItem = matches[0];
                this.selectedUpdated();
            }
        }


        return matches;
    }

    openAcMenu() {
        this.menuVisibility = "visible";
        this.matches = this.getMatches();
    }

    closeAcMenu() {
        this.menuVisibility = "hidden";
    }

    selectItem(obj) {
        this.selectedItem = obj;
        this.inputText = obj.fkSelectName();
        this.selectedUpdated();
        this.closeAcMenu();
    }

    selectedUpdated() {
        this.onUpdate.emit({value: this.selectedItem, name: this.objProp});
    }

    trackById(idx, obj) {
        return obj._id;
    }

}
