import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {DSTableDefinition} from "./ng1/data-service-schema";
import {DataService} from "./data.service";
import {DCSerializable} from "../shared/DCSerializable";
import {RecordEditorService} from "./record-editor.service";

@Component({
    selector: 'devctrl-table-wrapper',
    template: `
    <devctrl-table [tableName]="tableName"></devctrl-table>
`
})
export class TableWrapperComponent implements OnInit {
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
}

