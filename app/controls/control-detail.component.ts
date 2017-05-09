import { Component, OnInit } from '@angular/core';
import {Control} from "../../shared/Control";
import {DataService} from "../data.service";
import {MenuService} from "../layout/menu.service";
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../../shared/DCDataModel";
import {DSTableDefinition} from "../data-service-schema";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {WatcherRule} from "../../shared/WatcherRule";

@Component({
    moduleId: module.id,
    selector: 'devctrl-ctrl-detail',
    //language=HTML
    template: `
<div id="devctrl-content-canvas">
    <div class="devctrl-card">
        <md-tab-group #tabgroup>
            <md-tab label="Overview">
                <md-list>
                    <h3 md-subheader>Control</h3>
                    <md-list-item class="devctrl-ctrl-list-item">
                        <devctrl-ctrl [controlId]="control.id"></devctrl-ctrl>
                    </md-list-item>
                </md-list>
                <h3 class="settings-subheader">
                    Settings 
                    <button md-icon-button (click)="openRecordEditor($event)"><md-icon>create</md-icon></button>
                </h3>
                
                <form>
                    <div class="settings-container">
                        <fk-autocomplete [object]="control"
                            [field]="schema.fields[0]"
                            (onUpdate)="controlUpdated($event)">    
                        </fk-autocomplete>
                        <md-input-container>
                            <input mdInput 
                                placeholder="Name"
                                name="name"
                                [(ngModel)]="control.name"> 
                        </md-input-container>
                        <md-input-container>
                            <input mdInput disabled
                                placeholder="CTID"
                                name="ctid"
                                [(ngModel)]="control.ctid">
                        </md-input-container>
                        <md-select [placeholder]="'UI Type'"
                            [(ngModel)]="control.usertype"
                            name="usertype">
                            <md-option [value]="option.value"
                                       *ngFor="let option of schema.fields[3].options">
                                {{option.name}}
                            </md-option>                            
                        </md-select>
                        <md-select [placeholder]="'Control Type'"
                            [(ngModel)]="control.control_type"
                            name="control_type">
                            <md-option [value]="option.value"
                                       *ngFor="let option of schema.fields[4].options">
                                {{option.name}}
                            </md-option>                            
                        </md-select>
                        <md-checkbox
                                  [(ngModel)]="control.poll"
                                  name="poll">
                            Poll?
                        </md-checkbox>
                        <md-input-container>
                            <input mdInput
                                placeholder="Value"
                                name="value"
                                [(ngModel)]="control.value">
                        </md-input-container>
                    </div>        
                </form>     
            </md-tab>
            <md-tab label="Watcher Rules">
                <md-list>
                    <h3 md-subheader>Rules triggered by this control</h3>
                    <ng-template ngFor let-watcherRule [ngForOf]="triggeredList()">
                        <md-list-item>
                            <h3 md-line class="triggered-detail">
                                {{watcherRule.action_control.endpoint.name}}
                                :&nbsp;
                                {{watcherRule.action_control.name}}
                            </h3>
                            <div md-line>
                                {{watcherRule.valueDescription}}
                            </div>
                            <button md-icon-button (click)="editWatcherRule($event, watcherRule)">
                                <md-icon>create</md-icon>
                            </button>
                        </md-list-item>
                    </ng-template>
                </md-list>
            </md-tab>
            <md-tab label="Log">
            </md-tab>
        </md-tab-group>
    </div>
</div>
    `,
    //language=CSS
    styles: [`
        .devctrl-card {
            max-width: 1600px;
            flex: 1 1;
        }
        .settings-container {
            display: flex;
            flex-direction: column;
            padding-right: 16px;
            padding-left: 16px;
        }
        .settings-subheader {
            display: block;
            box-sizing: border-box;
            height: 64px;
            padding: 16px;
            margin: 0;
            font-size: 14px;
            font-weight: 500;
            color: rgba(0,0,0,.54);
        }
        .triggered-detail {
            display: flex;
            flex-direction: row;
        }
        .triggered-field {
            flex: 1 1;
        }
        md-select {
            margin-top: 24px;
        }
        md-checkbox {
            margin-top: 10px;
            margin-bottom: 10px;
        }
    `]
})
export class ControlDetailComponent implements OnInit {
    control : Control;
    schema : DSTableDefinition;
    watcherRules : IndexedDataSet<WatcherRule>;
    constructor(private route : ActivatedRoute,
                private ds: DataService,
                private recordService: RecordEditorService,
                private menu : MenuService,) { }

    ngOnInit() {
        this.schema = this.ds.getSchema(Control.tableStr);
        this.watcherRules = this.ds.getTable(WatcherRule.tableStr) as IndexedDataSet<WatcherRule>;
        this.route.data.subscribe((data: { control: Control }) => {
            this.menu.currentTopLevel = MenuService.TOPLEVEL_DEVICES;
            this.control = data.control;
            console.log(`control ${this.control.id} loaded`);
            if (this.control) {
                this.menu.pageTitle = this.control.name;
            }
            //this.watcherRules = this.control.referenced[WatcherRule.tableStr] as IndexedDataSet<WatcherRule>;
        });
    }

    controlUpdated(update) {
        this.control[update.name] = update.value;
    }

    editWatcherRule($event, watcherRule) {
        this.recordService.editRecord($event, watcherRule.id, watcherRule.table);
    }

    openRecordEditor($event) {
        this.recordService.editRecord($event, this.control.id, this.control.table);
    }

    triggeredList() {
        if (this.watcherRules) {
            return Object.keys(this.watcherRules)
                .map(id => this.watcherRules[id])
                .filter(rule => { return rule.watched_control_id == this.control.id});
        }
        return [];
    }
}