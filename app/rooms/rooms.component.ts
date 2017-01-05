import {Room} from "../../shared/Room";
import {DataService} from "../data.service";
import { Component, OnInit, Input } from '@angular/core';
import {MenuService} from "../layout/menu.service";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
    selector: 'devctrl-rooms',
    template: `
<md-grid-list cols="1"
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

    constructor(private dataService: DataService,
                private route : ActivatedRoute,
                private menu : MenuService) {
        console.log("rooms component created");
        this.list = this.dataService.sortedArray(Room.tableStr, "name") as Room[];
    }

    ngOnInit() {
        console.log("rooms component initialized");
        this.menu.currentTopLevel = MenuService.TOPLEVEL_ROOMS;

    }

    imageUrl(room) {
        return `/images/${room.name}.png`;
    }
}