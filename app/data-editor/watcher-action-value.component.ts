import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {Control} from "../shared/Control";
import {ActionTrigger} from "../shared/ActionTrigger";
import {DataService} from "../data.service";

@Component({

    selector: 'devctrl-watcher-action-value',
    template: `
<div class="wav-editor" *ngIf="controlsSelected()">
    <label class="wav-label">Action Value</label>
    <div>
        <md-radio-group [(ngModel)]="valueType">
            <md-radio-button value="value">Fixed value</md-radio-button>
            <md-radio-button value="map">Value Map</md-radio-button>
        </md-radio-group>
        <devctrl-control-value-selector *ngIf="valueType == 'value'"
            [control]="actionControl"
            [placeholder]="Value"
            [(controlValue)]="actionValue.value">
        </devctrl-control-value-selector>
        <div class="map-editor" *ngIf="valueType == 'map'">
            <div class="map-editor-row" *ngFor="let triggerVal of mapKeys()">
                <div class="map-key">
                    <label class="trigger-label">Trigger Value</label>
                    {{triggerControl.selectValueName(triggerVal)}}
                </div>
                <md-icon class="map-forward">forward</md-icon>
                <devctrl-control-value-selector [control]="actionControl"
                    [placeholder]="'Action Value'"
                    [(controlValue)]="actionValue.map[triggerVal]"></devctrl-control-value-selector>
                <button type="button" md-icon-button
                    class="delete-button"
                    (click)="deleteTriggerValue(triggerVal)">
                    <md-icon>delete</md-icon>
                </button>
            </div>
            <div class="map-editor-row">      
                <devctrl-control-value-selector [control]="triggerControl"
                    class="new-trigger"
                    [placeholder]="'New Trigger Value'"
                    [(controlValue)]="newTriggerValue"></devctrl-control-value-selector>
                <button md-icon-button
                    type="button" 
                    (click)="addNewTriggerValue()"
                    color="primary">
                    <md-icon>add</md-icon>
                </button>
            </div>
        </div>
    
    <div *ngIf="! controlsSelected()">
        Please select a watched control and an action control
    </div>
</div>
    `,
    //language=CSS
    styles: [`
        
        .delete-button { 
            margin-top: 6px;    
        }
        
        .new-trigger /deep/ md-select {
            width: 200px;
        }
        .wav-editor {
            display: flex;
            flex-direction: column;
        }
        
        .wav-label {
            font-size: 75%;
            color: rgba(0,0,0,.38);
        }
        
        .trigger-label {
            font-size: 75%;
            color: rgba(0,0,0,.38);
            margin-bottom: 6px;
        }
        
        .map-editor {
            margin-top: 6px;
            margin-bottom: 6px;
            display: flex;
            flex-direction: column;
        }
        
        .map-forward {
            padding-top: 16px;
            padding-left: 12px;
            padding-right: 12px;
            color: rgba(0,0,0,.38);
        }
        
        .map-key {
            display: flex;
            flex-direction: column;
           
        }
        
        devctrl-control-value-selector {
            margin-top: 16px;
        }
        
        div.map-editor-row {
            display: flex;
            flex-direction: row;
            margin-top: 12px;
            margin-left: 12px;
        }
    `]
})
export class WatcherActionValueComponent implements OnInit {
    @Input() actionValue;
    @Input() contextObject : ActionTrigger;
    @Output() onUpdate = new EventEmitter<any>();
    newTriggerValue;

    constructor(private ds : DataService) { }

    ngOnInit() {

    }

    get actionControl() {
        return this.contextObject.action_control;
    }

    get valueType() {
        if ("value" in this.actionValue) {
            return "value";
        }

        return "map";
    }

    set valueType(val) {
        if (val == "value") {
            if (this.actionValue.valueOverridden) {
                this.actionValue.value = this.actionValue.valueOverridden;
            }
            else {
                this.actionValue.value = '';
            }

            return;
        }

        this.actionValue.valueOverridden = this.actionValue.value;
        delete this.actionValue.value;
    }

    get triggerControl() {
        return this.contextObject.trigger_control;
    }

    addNewTriggerValue() {
        if (typeof this.newTriggerValue == 'undefined' || this.newTriggerValue == null) {
            this.ds.errorToast("New trigger value must be defined");
            return;
        }

        if (typeof this.actionValue.map[this.newTriggerValue] !== 'undefined') {
            this.ds.errorToast(`Action value already defined for trigger value ${this.newTriggerValue}`)
            return;
        }

        this.actionValue.map[this.newTriggerValue] = null;
        this.newTriggerValue = null;
    }

    deleteTriggerValue(val) {
        delete this.actionValue.map[val];
    }

    mapKeys() {
        if (this.actionValue.map) {
            return Object.keys(this.actionValue.map);
        }

        return [];
    }

    controlsSelected() {
        return this.actionControl && this.triggerControl;
    }

    trackByValue(idx, obj) {
        return obj.value;
    }
}