import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'devctrl-object-editor',
    template: `
<md-list>
    <h3 md-subheader>
        {{fname}}
    </h3>
    <md-list-item class="md-list-item-text"
                  *ngFor="let key of keys()">
        <div *ngIf="valueType(object[key]) != 'object'">
            <label>{{key}}</label>
            <input  [(ngModel)]="object[key]" (change)="updateValue($event, key)">

        </div>
        <devctrl-object-editor *ngIf="valueType(object[key]) == 'object'"
                                [object]="object[key]"
                                [fname]="key"
                                (onUpdate)="onUpdate(object, name)">
        </devctrl-object-editor>
        <button md-button  class="md-icon-button" (click)="deleteValue(key)">
            <md-icon>delete</md-icon>
        </button>
    </md-list-item>
    <md-list-item>
        <div class="layout-row">
            <div class="form-group">
                <label>{{name}} Key</label>
                <input id="oe-new-key" [(ngModel)]="newKey" name="new-key">
            </div>
            <div class="form-group">
                <label>Value</label>
                <input  [(ngModel)]="newVal" name="new-val">
            </div>
            <button md-button (click)="addItem()">
                Add
            </button>
        </div>
    </md-list-item>

</md-list>    
`
})
export class ObjectEditorComponent
{
    @Input() object;
    @Input() fname;
    newKey;
    newVal;

    constructor() {}


    addItem() {
        if (this.newKey && this.newVal) {
            let tempVal = '';
            try {
                tempVal = JSON.parse(this.newVal);
            }
            catch(e) {
                tempVal = this.newVal;
            }

            if (typeof this.object == 'undefined') {
                this.object = {};
            }

            this.object[this.newKey] = tempVal;
        }

        this.newKey = undefined;
        this.newVal = undefined;
        //angular.element(document).find('#oe-new-key').focus();

        this.onUpdate({object: this.object, name: this.fname});
    }

    deleteValue(key) {
        delete this.object[key];
        this.onUpdate({object: this.object, name: this.fname});
    }

    keys() {
        return Object.keys(this.object);
    }


    @Output() onUpdate(args) {}

    valueType(value) {
        if (Array.isArray(value)) {
            return "array";
        }

        return typeof value;
    }

    updateValue($event, key) {
        let tempVal = '';
        try {
            tempVal = JSON.parse(this.object[key]);
        }
        catch(e) {
            tempVal = this.object[key];
        }

        this.object[key] = tempVal;
    }
}