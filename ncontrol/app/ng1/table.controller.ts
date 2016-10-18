import {DataService} from "../data.service";
import {IndexedDataSet} from "../../shared/DCDataModel";
import {DCSerializable} from "../../shared/DCSerializable";
export class TableController {
    tableName;
    data : IndexedDataSet<DCSerializable>;
    schema;
    newRow;
    listed = [];
    sortColumn = 'id';
    sortReversed = false;

    static $inject = ['$stateParams',  'DataService'];
    constructor(private $stateParams, private dataService: DataService) {}

    $onInit() {
        this.tableName = this.$stateParams.name;
        this.data = this.dataService.getTable(this.tableName);
        this.schema = this.dataService.getSchema(this.tableName);

        this.dataService.publishStatusUpdate("table " + this.tableName + " loaded");

        this.listData();
    }

    addRow($event) {
        this.dataService.editRecord($event, '0', this.tableName);
        this.listData();
    };

    deleteRow(row : DCSerializable) {
        this.dataService.deleteRow(row);
        this.listData();
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

    listData() {
        this.listed.length = 0;
        for (let id in this.data) {
            this.listed.push(this.data[id]);
        }
    }

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
