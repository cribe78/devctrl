import { MdSnackBar, MdDialog } from '@angular/material';
import {DataService} from "../data.service";
import { Injectable, Inject } from "@angular/core";
import {RecordComponent} from "./record.component";

@Injectable()
export class RecordEditorService {
    constructor(private dataService : DataService,
                private mdDialog : MdDialog) {}

    editRecord($event, id: string, tableName: string, recordDefaults = {}) {
        let record;

        if (id !== "0") {
            record = this.dataService.getRowRef(tableName, id);
        }
        else {
            // Set the name as an empty string, otherwise it will resolve
            // as "unknown [tablename]"
            if (! recordDefaults["name"]) {
                recordDefaults["name"] = '';
            }
            record = this.dataService.getNewRowRef(tableName, recordDefaults);
        }

        let recRef = this.mdDialog.open(RecordComponent);
        recRef.componentInstance.newRow = id == "0";
        recRef.componentInstance.obj = record;
        recRef.componentInstance.schema = this.dataService.getSchema(tableName);
    }

    /**
     * Add a record by calling editRecord with an id of '0'
     * @param $event
     * @param string tableName
     * @param recordDefaults
     */

    addRecord($event, tableName : string, recordDefaults = {}) {
        this.editRecord($event, '0', tableName, recordDefaults);
    }
}