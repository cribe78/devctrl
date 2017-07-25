import {Room} from "../../shared/Room";
import {DataService} from "../data.service";
import { Component, OnInit, Input } from '@angular/core';
import {MenuService} from "../layout/menu.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {LayoutService} from "../layout/layout.service";

@Component({
    selector: 'devctrl-rooms',
    template: `
<div  id="devctrl-content-canvas">
    <div class="devctrl-card">
        <md-grid-list [cols]="cols()"
                      rowHeight="1:1"
                      gutterSize="8px">
            <md-grid-tile *ngFor="let room of list; let i = index;"     
                        (click)="menu.go(['rooms', room.name])">
                <div class="devctrl-img">
                    <img [src]="imageUrl(room)" />
                </div>
            </md-grid-tile>
        </md-grid-list>
    </div>
</div>
`,
    //language=CSS
    styles: [`   
        .devctrl-card {
            flex: 1 1;
        }
        .devctrl-img {
            flex: 1 1;
        }
        .devctrl-img img {
            width: 100%;
            min-width: 200px;
        }
        md-grid-tile.gray {
            background: #f5f5f5; }
        md-grid-tile.green {
            background: #b9f6ca; }
        md-grid-tile.yellow {
            background: #ffff8d; }
        md-grid-tile.blue {
            background: #84ffff; }
        md-grid-tile.darkBlue {
            background: #80d8ff; }
        md-grid-tile.deepBlue {
            background: #448aff; }
        md-grid-tile.purple {
            background: #b388ff; }
        md-grid-tile.lightPurple {
            background: #8c9eff; }
        md-grid-tile.red {
            background: #ff8a80; }
        md-grid-tile.pink {
            background: #ff80ab; }
`]
})
export class RoomsComponent implements OnInit {
    list : Room[];
    static colorClasses = [
        'yellow', 'red', 'purple', 'green', 'pink', 'darkBlue'
    ];

    constructor(private dataService: DataService,
                private ls: LayoutService,
                private route : ActivatedRoute,
                private menu : MenuService) {
        console.log("rooms component created");
        this.list = this.dataService.sortedArray(Room.tableStr, "name") as Room[];
    }

    ngOnInit() {
        console.log("rooms component initialized");
        this.menu.currentTopLevel = MenuService.TOPLEVEL_ROOMS;
        this.menu.pageTitle = "Locations";
        this.menu.toolbarSelectDisable();
    }

    cols() {
        if (this.ls.desktopWide) {
            return 4;
        }

        return 2;
    }

    imageUrl(room) {
        return `/images/${room.name}.png`;
    }
}