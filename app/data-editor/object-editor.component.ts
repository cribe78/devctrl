import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
    selector: 'devctrl-object-editor',
    template: `
<div>
    <span class="text-menu">
        {{keyPath()}}
    </span>
    <div style="margin-left: 24px;">
        <ng-template ngFor let-key [ngForOf]="keys()">
            <div class="prop-row" *ngIf="valueType(object[key]) != 'object'">
                <md-input-container>
                    <input mdInput 
                            [placeholder]="keyPath(key)" 
                            [(ngModel)]="object[key]" 
                            (change)="updateValue($event, key)">
                </md-input-container>  
                <button type="button" md-icon-button (click)="deleteValue(key)">
                    <md-icon>delete</md-icon>
                </button>
            </div>
            <devctrl-object-editor *ngIf="valueType(object[key]) == 'object'"
                            [object]="object[key]"
                            [fname]="key"
                            [pathPrefix]="keyPath()"
                            (onUpdate)="updateItem($event)">
            </devctrl-object-editor>
        </ng-template>
        <div class="new-prop-row">
            <md-input-container>
                <input mdInput [placeholder]="newKeyPlaceholder()" [(ngModel)]="newKey" name="new-key">
            </md-input-container>
            <md-input-container>
                <input mdInput placeholder="Value" [(ngModel)]="newVal" name="new-val">
            </md-input-container>
            <button md-icon-button
                    type="button" 
                    (click)="addItem()"
                    color="primary">
                <md-icon>add</md-icon>
            </button>
        </div>
    </div>
</div>    
`,
    //language=CSS
    styles: [`
        devctrl-object-editor {
            flex: 1 1;
        }
        
        .new-prop-row {
            display: flex;
            flex-direction: row;
        }
        
        .prop-row {
            display: flex;
            flex-direction: row;
        }
    `]
})
export class ObjectEditorComponent
{
    @Input() object;
    @Input() fname;
    @Input() pathPrefix;
    @Output() onUpdate = new EventEmitter<any>();
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

        this.onUpdate.emit({value: this.object, name: this.fname});
    }

    deleteValue(key) {
        delete this.object[key];
        this.onUpdate.emit({value: this.object, name: this.fname});
    }

    keys() {
        return Object.keys(this.object);
    }

    keyPath(key = "") {
        let path = this.fname;

        if (key) {
            path = `${path}.${key}`;
        }

        if (this.pathPrefix) {
            path = `${this.pathPrefix}.${path}`;
        }

        return path;
    }

    newKeyPlaceholder() {
        let path = this.keyPath('');
        return `New ${path} key`;
    }

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

    updateItem() {
        this.onUpdate.emit({value: this.object, name: this.fname});
    }
}