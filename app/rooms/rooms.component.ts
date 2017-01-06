import {Room} from "../../shared/Room";
import {DataService} from "../data.service";
import { Component, OnInit, Input } from '@angular/core';
import {MenuService} from "../layout/menu.service";
import { Router, ActivatedRoute, Params } from '@angular/router';
import {LayoutService} from "../layout/layout.service";

@Component({
    selector: 'devctrl-rooms',
    template: `
<div fxLayout="row" fxLayoutAlign="center start" id="devctrl-content-canvas">
    <div fxFlex class="devctrl-card">
        <md-grid-list [cols]="cols()"
                      rowHeight="1:1"
                      gutterSize="8px">
            <md-grid-tile *ngFor="let room of list; let i = index;" 
                        [class]="tileClass(i)" 
                        (click)="menu.go(['rooms', room.name])">
                <img fxFill fxFlex [src]="imageUrl(room)" />
            </md-grid-tile>
        </md-grid-list>
    </div>
</div>
`,
    styles: [`
img {

}
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

    tileClass(i) {
        if (RoomsComponent.colorClasses[i]) {
            return RoomsComponent.colorClasses[i];
        }

        return 'gray';
    }
}