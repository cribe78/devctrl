import {Room} from "../shared/Room";
import {IndexedDataSet} from "../shared/DCDataModel";
import {DataService} from "./data.service";
import { Component, OnInit, Input } from '@angular/core';
import {MenuService} from "./menu.service";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'devctrl-rooms',
    template: `
<md-grid-list [hidden]="menu.routeUrl[0] == 'reoms'"
              cols="1"
              md-cols-gt-lg="3"
              rowHeight="1:1"
              md-gutter="8px">
    <md-grid-tile *ngFor="let room of list" 
                class="lightPurple" 
                (click)="menu.go(['rooms', room.name])">
        <img height=280 width=280 [src]="imageUrl(room)" />
    </md-grid-tile>
</md-grid-list>
`
})
export class RoomsComponent implements OnInit {
    list : Room[];

    static $inject = ['DataService'];
    constructor(private dataService: DataService,
                private route : ActivatedRoute,
                private menu : MenuService) {
        console.log("rooms component created");
        this.list = this.dataService.sortedArray(Room.tableStr, "name") as Room[];
    }

    ngOnInit() {
        console.log("rooms component initialized");
    }

    imageUrl(room) {
        return `/images/${room.name}.png`;
    }
}