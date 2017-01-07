import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../../shared/DCDataModel";
import {DSTableDefinition} from "../data-service-schema";
import {DataService} from "../data.service";
import {DCSerializable} from "../../shared/DCSerializable";
import {RecordEditorService} from "./record-editor.service";
import {MenuService} from "../layout/menu.service";

@Component({
    selector: 'devctrl-table',
    template: `
<div fxLayout="row" fxLayoutAlign="center start" id="devctrl-content-canvas">
    <div fxFlex class="devctrl-card">
        <md-toolbar color="primary">
            <div fxLayout="row">
                <span class="text-title">{{schema.label}}</span>
                <span fxFlex></span>
                <button md-button *devctrlAdminOnly (click)="addRow()">Add</button>
            </div>
        </md-toolbar>
        <md-list>
            <md-list-item>
                <div fxFlex="20">
                    ID
                </div>
                <div *ngFor="let field of schema.fields" 
                       fxFlex
                       class="table-header" 
                       (click)="setSortColumn(field)">
                    {{field.label}}
                </div>
                <div fxFlex="5"></div>
            </md-list-item>
            <md-divider></md-divider>
            <template ngFor let-obj [ngForOf]="sorted()" [ngForTrackBy]="trackById">
                <md-list-item>
                    <div fxFlex="20" class="devctrl-id-text">
                        <span>{{obj._id}}</span>
                    </div>
                    <template ngFor let-field [ngForOf]="schema.fields">
                        <div fxFlex
                             class="md-list-item-text"
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
                    <div fxFlex="5">
                        <button md-button  *devctrlAdminOnly (click)="openRecord($event, obj._id)">
                            <md-icon>edit</md-icon>
                        </button>
                    </div>
                </md-list-item>
                <md-divider></md-divider>
            </template>
        </md-list>

        <button md-button *devctrlAdminOnly (click)="addRow()">Add</button> 
    </div>
 </div>
`,
    styles: [`
.md-list-item {
    display: flex;
    flex-direction: row;
    width: 100%;
}
`]
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
                private ms: MenuService,
                private recordService : RecordEditorService) {}

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.tableName = params['name'];
            this.data = this.dataService.getTable(this.tableName);
            this.dataArray = this.dataService.sortedArray(this.tableName);
            this.schema = this.dataService.getSchema(this.tableName);
            this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");

            this.ms.pageTitle = this.tableName;
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

