import {Component, Input, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DataService} from "./data.service";
import {MenuService} from "./menu.service";

@Component({
    selector: 'devctrl-config-data',
    template: `
<div layout="column" *ngIf="noActivatedChildren()">
    <md-list>
        <template ngFor let-schema [ngForOf]="schemaArray">
            <a md-list-item (click)="menu.go(['config', schema.name])">
                {{schema.label}}
                <span flex></span>
                <md-icon>chevron_right</md-icon>
            </a>
            <md-divider></md-divider> 
        </template>
    </md-list>
</div>  
`
})
export class ConfigDataComponent implements OnInit
{
    schema;
    schemaArray;

    constructor(private route : ActivatedRoute,
                private menu: MenuService,
                private dataService : DataService) {}

    ngOnInit() {
        this.schema = this.dataService.schema;
        this.schemaArray = Object.keys(this.schema).map((key) => {
            this.schema[key]['name'] = key;
            return this.schema[key];
        });
    }

    noActivatedChildren() {
        let val = this.route.children.length == 0;
        return val;
    }
}