import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "shared/DCDataModel";
import {DSTableDefinition} from "./data-service-schema";
import {DataService} from "./data.service";
import {DCSerializable} from "shared/DCSerializable";
import {RecordEditorService} from "data-editor/record-editor.service";

@Component({
    selector: 'devctrl-table',
    template: `
<div layout="row">
    <span class="text-title">{{schema.label}}</span>
    <span flex></span>
    <button md-button devctrl-admin-only (click)="addRow()">Add</button>
</div>


<md-list>
    <md-list-item class="layout-row">
        <div class="flex-20">
            ID
        </div>
        <div *ngFor="let field of schema.fields" class="flex table-header" (click)="setSortColumn(field)">
            {{field.label}}
        </div>
        <div flex="5"></div>
    </md-list-item>
    <md-divider></md-divider>
    <template ngFor let-obj [ngForOf]="sorted()" [ngForTrackBy]="trackById">
        <md-list-item class="layout-row">
            <div class="flex-20 devctrl-id-text">
                <span>{{obj._id}}</span>
            </div>
            <template ngFor let-field [ngForOf]="schema.fields">
                <div class="flex md-list-item-text"
                     [ngSwitch]="field.type">
                    <p *ngSwitchCase="fk">{{fkDisplayVal(field, obj)}}</p>
                    <div *ngSwitchCase="bool">
                        <md-checkbox class="md-primary"
                                     [ngModel]="obj[field.name]">
                                     
                        </md-checkbox>
                    </div>
                    <p *ngSwitchDefault>{{obj[field.name]}}</p>
        
                </div>
            </template>
            <div class="flex-5">
                <button md-button  *devctrlAdminOnly (click)="openRecord($event, obj._id)">
                    <md-icon>edit</md-icon>
                </button>
            </div>
        </md-list-item>
        <md-divider></md-divider>
    </template>
</md-list>

<button md-button *devctrlAdminOnly (click)="addRow()">Add</button>    
`
})
export class TableComponent implements OnInit {
    @Input()tableName;
    data : IndexedDataSet<DCSerializable>;
    schema : DSTableDefinition;
    newRow;
    sortColumn = 'id';
    sortReversed = false;
    dataArray;
    
    
    constructor(private route : ActivatedRoute,
                private dataService: DataService,
                private recordService : RecordEditorService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.tableName = params['name'];
            this.data = this.dataService.getTable(this.tableName);
            this.dataArray = this.dataService.sortedArray(this.tableName);
            this.schema = this.dataService.getSchema(this.tableName);
            this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");
        });
    }

    addRow($event) {
        this.recordService.editRecord($event, '0', this.tableName);
    };

    deleteRow(row : DCSerializable) {
        this.dataService.deleteRow(row);
    }

    fkDisplayVal(field, row: DCSerializable) {
        for (let fkDef of row.foreignKeys) {
            if (fkDef.fkIdProp == field.name ) {
                if (row[fkDef.fkObjProp] && row[fkDef.fkObjProp].name) {
                    return row[fkDef.fkObjProp].name;
                }

                if (row[field.name]) {
                    return row[field.name];
                }

                return "unknown object " + field._id;
            }
        }
    }



    openRecord($event, id) {
        this.recordService.editRecord($event, id, this.tableName);
    };

    setSortColumn(field) {
        if ( 'fields.' + field.name === this.sortColumn ) {
            this.sortReversed = !this.sortReversed;
        }
        else {
            this.sortColumn = 'fields.' + field.name;
            this.sortReversed = false;
        }
    }

    sorted() {
        return this.dataService.sortedArray(this.tableName, "name");
    }

    trackById = DCSerializable.trackById;

    updateRow($event, row) {
        this.dataService.updateRow(row);
    };
}

