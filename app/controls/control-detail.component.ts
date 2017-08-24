import { Component, OnInit } from '@angular/core';
import {Control} from "../shared/Control";
import {DataService} from "../data.service";
import {MenuService} from "../layout/menu.service";
import {Router, ActivatedRoute} from '@angular/router';
import {IndexedDataSet} from "../shared/DCDataModel";
import {RecordEditorService} from "../data-editor/record-editor.service";
import {ActionTrigger} from "../shared/ActionTrigger";

@Component({

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
                            [field]="control.fieldDefinitions[1]"
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
                                       *ngFor="let option of control.ownFields[2].options">
                                {{option.name}}
                            </md-option>                            
                        </md-select>
                        <md-select [placeholder]="'Control Type'"
                            [(ngModel)]="control.control_type"
                            name="control_type">
                            <md-option [value]="option.value"
                                       *ngFor="let option of control.ownFields[3].options">
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
            <md-tab [label]="triggerLabel()">
                <md-list>
                    <div class="action-subhead">
                        <h3 md-subheader>Rules triggered by this control</h3>
                        <button md-icon-button 
                                (click)="addTrigger($event)"
                                color="primary"
                                tooltip="Add action">
                            <md-icon>add</md-icon>
                        </button>
                    </div>
                    <ng-template ngFor let-actionTrigger [ngForOf]="triggeredList()">
                        <md-list-item>
                            <h3 md-line class="triggered-detail">
                                {{actionTrigger.action_control.endpoint.name}}
                                :&nbsp;
                                {{actionTrigger.action_control.name}}
                            </h3>
                            <div md-line>
                                {{actionTrigger.valueDescription}}
                            </div>
                            <button md-icon-button (click)="editWatcherRule($event, actionTrigger)">
                                <md-icon>create</md-icon>
                            </button>
                        </md-list-item>
                    </ng-template>
                    <div class="action-subhead">
                        <h3 md-subheader>Rules modifying this control</h3>
                        <button md-icon-button
                                (click)="addAction($event)"
                                color="primary"
                                tooltip="Add action">
                            <md-icon>add</md-icon>
                        </button>
                    </div>
                    <ng-template ngFor let-actionTrigger [ngForOf]="actionList()">
                        <md-list-item>
                            <h3 md-line class="triggered-detail">
                                {{actionTrigger.trigger_control.endpoint.name}}
                                :&nbsp;
                                {{actionTrigger.trigger_control.name}}
                            </h3>
                            <div md-line>
                                {{actionTrigger.valueDescription}}
                            </div>
                            <button md-icon-button (click)="editWatcherRule($event, actionTrigger)">
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
        .action-subhead {
            display: flex;
            flex-direction: row;
        }
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
    actionTriggers : IndexedDataSet<ActionTrigger>;
    constructor(private route : ActivatedRoute,
                private ds: DataService,
                private recordService: RecordEditorService,
                private menu : MenuService,) { }

    ngOnInit() {
        this.actionTriggers = this.ds.getTable(ActionTrigger.tableStr) as IndexedDataSet<ActionTrigger>;
        this.route.data.subscribe((data: { control: Control }) => {
            this.menu.currentTopLevel = MenuService.TOPLEVEL_DEVICES;
            this.control = data.control;
            console.log(`control ${this.control.id} loaded`);
            if (this.control) {
                this.menu.pageTitle = this.control.name;
                this.menu.parentName = this.control.endpoint.name;
                this.menu.parentRoute = ['devices', this.control.endpoint.id];
            }
            //this.watcherRules = this.control.referenced[ActionTrigger.tableStr] as IndexedDataSet<ActionTrigger>;
        });
    }

    actionList() {
        if (this.actionTriggers) {
            return Object.keys(this.actionTriggers)
                .map(id => this.actionTriggers[id])
                .filter(rule => { return rule.action_control_id == this.control.id});
        }
        return [];
    }

    /**
     * Add a new ActionTrigger, with this control as the action_control
     */

    addAction($event) {
        this.recordService.addRecord($event, ActionTrigger.tableStr,
            {
                action_control: this.control,
                enabled: true
            });
    }

    /**
     * Add a new ActionTrigger, with this control as the trigger_control
     * @param update
     */

    addTrigger($event) {
        this.recordService.addRecord($event, ActionTrigger.tableStr,
            {
                trigger_control: this.control,
                enabled: true
            });
    }

    controlUpdated(update) {
        this.control[update.name] = update.value;
    }

    editWatcherRule($event, actionTrigger) {
        this.recordService.editRecord($event, actionTrigger.id, actionTrigger.table);
    }

    openRecordEditor($event) {
        this.recordService.editRecord($event, this.control.id, this.control.table);
    }

    triggeredList() {
        if (this.actionTriggers) {
            return Object.keys(this.actionTriggers)
                .map(id => this.actionTriggers[id])
                .filter(rule => { return rule.trigger_control_id == this.control.id});
        }
        return [];
    }



    triggerLabel() {
        let ruleCount = this.actionList().length + this.triggeredList().length;


        return `Action Triggers (${ruleCount})`;
    }
}