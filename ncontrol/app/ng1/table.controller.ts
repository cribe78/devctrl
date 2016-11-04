import {DataService} from "../data.service";
import {IndexedDataSet} from "../../shared/DCDataModel";
import {DCSerializable} from "../../shared/DCSerializable";
import {DSTableDefinition} from "./data-service-schema";
export class TableController {
    tableName;
    data : IndexedDataSet<DCSerializable>;
    schema : DSTableDefinition;
    newRow;
    sortColumn = 'id';
    sortReversed = false;

    static $inject = ['$stateParams',  'DataService'];
    constructor(private $stateParams, private dataService: DataService) {}

    $onInit() {
        this.tableName = this.$stateParams.name;
        this.data = this.dataService.getTable(this.tableName);
        this.schema = this.dataService.getSchema(this.tableName);

        this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");
    }

    addRow($event) {
        this.dataService.editRecord($event, '0', this.tableName);
    };

    deleteRow(row : DCSerializable) {
        this.dataService.deleteRow(row);
    }

    fkDisplayVal(field, row: DCSerializable) {
        for (let fkDef of row.foreignKeys) {
            if (fkDef.fkIdProp == field.name ) {
                if (row[fkDef.fkObjProp].name) {
                    return row[fkDef.fkObjProp].name;
                }

                return row[field.name];
            }
        }
    };

    openRecord($event, id) {
        this.dataService.editRecord($event, id, this.tableName);
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
