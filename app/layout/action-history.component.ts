import { OnInit, Component } from '@angular/core';
import {DataService} from "../data.service";

@Component({
    moduleId: module.id,
    selector: 'devctrl-action-history',
    template: `
<div class="spacer" [class.closed]="closed">&nbsp;</div>
<div class="devctrl-card history-card" [class.closed]="closed">
    <md-toolbar color="primary">
        <span class="text-subhead">Log</span>
        <button md-icon-button (click)="toggle()">
            <md-icon class="expand-icon">expand_more</md-icon>
        </button>
    </md-toolbar>
    <md-list class="log-list">
        <md-list-item *ngFor="let action of ds.logs;">
            <p md-line class="message">{{action.name}}</p>
            <p md-line class="ts">{{action.timestamp | date:'medium'}}</p>
        </md-list-item>
        <md-list-item *ngIf="ds.logs.length == 0">
            <p md-line>Action log is empty</p>
        </md-list-item>
    </md-list>  
</div>
    `,
    styles: [`
    
.spacer.closed {
    flex: 1 1;
}
    
.history-card {
    width: 600px; 
}

.history-card.closed {
    flex: 0 0;
    width: 90px;
}

:host {
    max-width: 700px;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}

.expand-icon {
    transform: rotate(270deg);
}

.closed .expand-icon {
    transform: rotate(90deg);
}


.history-card.closed .log-list {
    visibility: hidden;
    height: 0px;
}

`]
})
export class ActionHistoryComponent implements OnInit {
    _open;

    constructor(private ds : DataService) { }

    ngOnInit() { }

    get closed() {
        return !this._open;
    }

    toggle() {
        this._open = ! this._open;
    }

}