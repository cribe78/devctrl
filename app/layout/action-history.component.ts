import { OnInit, Component } from '@angular/core';
import {DataService} from "../data.service";

@Component({
    moduleId: module.id,
    selector: 'devctrl-action-history',
    template: `
<div class="devctrl-card history-card">
    <md-toolbar color="primary">
        <span class="text-subhead">Log</span>
    </md-toolbar>
    <md-list>
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

`]
})
export class ActionHistoryComponent implements OnInit {
    constructor(private ds : DataService) { }

    ngOnInit() { }
}