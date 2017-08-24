import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {DataService} from "../data.service";
import {DCSerializable, IDCFieldDefinition, IDCTableDefinition} from "../shared/DCSerializable";
import {RecordEditorService} from "./record-editor.service";
import {MenuService} from "../layout/menu.service";

@Component({
    selector: 'devctrl-table',
    template: `
<div id="devctrl-content-canvas">
    <div class="devctrl-card">
        <md-toolbar color="primary">
            <div class="devctrl-toolbar-tools">
                <span class="text-title">{{schema.label}}</span>
                <span class="devctrl-spacer"></span>
                <button md-button *devctrlAdminOnly (click)="addRow()">Add</button>
            </div>
        </md-toolbar>
        <md-list>
            <md-list-item>
                <div class="flex1">
                    ID
                </div>
                <div *ngFor="let field of schema.fields" 
                       class="table-header flex1" 
                       (click)="setSortColumn(field)">
                    {{field.label}}
                </div>
                <div class="flexPoint5"></div>
            </md-list-item>
            <md-divider></md-divider>
            <ng-template ngFor let-obj [ngForOf]="sorted()" [ngForTrackBy]="trackById">
                <md-list-item>
                    <div class="devctrl-id-text flex1">
                        <span>{{obj._id}}</span>
                    </div>
                    <ng-template ngFor let-field [ngForOf]="schema.fields">
                        <div class="flex1"
                             [ngSwitch]="field.type">
                            <p *ngSwitchCase="'fk'">{{fkDisplayVal(field, obj)}}</p>
                            <div *ngSwitchCase="'unbool'">   
                                <md-checkbox color="primary"
                                             [ngModel]="obj[field.name]">
                                             Check
                                </md-checkbox>
                            </div>
                            <p *ngSwitchDefault>{{obj[field.name]}}</p>
                        </div>
                    </ng-template>
                    <div class="flexPoint5">
                        <button md-button  *devctrlAdminOnly (click)="openRecord($event, obj._id)">
                            <md-icon>edit</md-icon>
                        </button>
                    </div>
                </md-list-item>
                <md-divider></md-divider>
            </ng-template>
        </md-list>

        <button md-button *devctrlAdminOnly (click)="addRow()">Add</button> 
    </div>
 </div>
`,
    //language=CSS
    styles: [`
        .devctrl-card {
            flex: 1 1;
        }
        
        .devctrl-id-text span {
            text-overflow: ellipsis;
        }
        
        .flex2 {
            flex: 2 2;
        }
        
        .flex1 {
            flex: 1 1 100px;
        }
        
        .flexPoint5 {
            flex: .5 .5;
        }
        
        md-list-item .table-header {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }
`]
})
export class TableComponent implements OnInit {
    @Input()tableName;
    data : IndexedDataSet<DCSerializable>;
    public schema : IDCTableDefinition;
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
            this.schema = this.dataService.schema[this.tableName];
            this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");

            this.ms.pageTitle = this.schema.label;
            this.ms.parentName = "";
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

                if (row[field.name]) {
                    return "unknown object " + row[field.name];
                }
            }
        }

        return '';
    }



    openRecord($event, id) {
        this.recordService.editRecord($event, id, this.tableName);
    };

    setSortColumn(field : IDCFieldDefinition) {
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

