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

    //TODO: present object values more smarterly
    static template = `
<div layout="row">
    <span class="text-title">{{$ctrl.schema.label}}</span>
    <span flex></span>
    <md-button devctrl-admin-only ng-click="$ctrl.addRow()">Add</md-button>
</div>


<md-list>
    <md-list-item layout="row">
        <div flex="20">
            ID
        </div>
        <div ng-repeat="field in $ctrl.schema.fields" flex class="table-header" ng-click="$ctrl.setSortColumn(field)">
            {{field.label}}
        </div>
        <div flex="5"></div>
    </md-list-item>
    <md-divider></md-divider>
    <md-list-item ng-repeat-start="(id, row) in $ctrl.data | toArray | orderBy: $ctrl.sortColumn : $ctrl.sortReversed"
                  layout="row">
        <div flex="20" class="devctrl-id-text">
            <span>{{row._id}}</span>
        </div>
        <div class="md-list-item-text"
             ng-repeat="field in $ctrl.schema.fields"
             ng-switch="field.type"
             flex>
            <p ng-switch-when="fk">{{$ctrl.fkDisplayVal(field, row)}}</p>
            <div ng-switch-when="bool">
                <md-checkbox class="md-primary"
                             ng-true-value="1"
                             ng-false-value="0"
                             ng-model="row[field.name]"
                             ng-change="$ctrl.updateRow($event, row)"></md-checkbox>
            </div>
            <p ng-switch-default>{{row[field.name]}}</p>

        </div>
        <div flex="5">
            <md-button  devctrl-admin-only ng-click="$ctrl.openRecord($event, row._id)">
                <md-icon  md-font-set="material-icons">edit</md-icon>
            </md-button>
        </div>
    </md-list-item>
    <md-divider ng-repeat-end></md-divider>
</md-list>

<md-button devctrl-admin-only ng-click="$ctrl.addRow()">Add</md-button>
`
}
