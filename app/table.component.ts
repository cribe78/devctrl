import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {DSTableDefinition} from "./ng1/data-service-schema";
import {DataService} from "./data.service";
import {DCSerializable} from "../shared/DCSerializable";
import {RecordEditorService} from "./record-editor.service";

@Component({
    selector: 'devctrl-table',
    template: `
<div layout="row">
    <span class="text-title">{{schema.label}}</span>
    <span flex></span>
    <button md-button devctrl-admin-only (click)="addRow()">Add</button>
</div>


<md-list>
    <div md-list-item layout="row">
        <div flex="20">
            ID
        </div>
        <div *ngFor="let field of schema.fields" flex class="table-header" (click)="setSortColumn(field)">
            {{field.label}}
        </div>
        <div flex="5"></div>
    </div>
    <md-divider></md-divider>
    <md-list-item ng-repeat-start="(id, row) in data | toArray | orderBy: sortColumn : sortReversed"
                  layout="row">
        <div flex="20" class="devctrl-id-text">
            <span>{{row._id}}</span>
        </div>
        <div class="md-list-item-text"
             ng-repeat="field in schema.fields"
             ng-switch="field.type"
             flex>
            <p ng-switch-when="fk">{{fkDisplayVal(field, row)}}</p>
            <div ng-switch-when="bool">
                <md-checkbox class="md-primary"
                             ng-true-value="1"
                             ng-false-value="0"
                             ng-model="row[field.name]"
                             ng-change="updateRow($event, row)"></md-checkbox>
            </div>
            <p ng-switch-default>{{row[field.name]}}</p>

        </div>
        <div flex="5">
            <button md-button  devctrl-admin-only (click)="openRecord($event, row._id)">
                <md-icon  md-font-set="material-icons">edit</md-icon>
            </button>
        </div>
    </md-list-item>
    <md-divider ng-repeat-end></md-divider>
</md-list>

<button md-button devctrl-admin-only (click)="addRow()">Add</button>    
`
})
export class TableComponent implements OnInit {
    tableName;
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

    updateRow($event, row) {
        this.dataService.updateRow(row);
    };
}

