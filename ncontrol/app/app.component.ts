import { Component } from '@angular/core';
import {DataService} from "./data.service";
import {DCDataModel} from "../shared/DCDataModel";

@Component({
    selector: 'my-app',
    template: '<h1>My First Angular App</h1>',
    providers: [DataService, DCDataModel]
})
export class AppComponent {
    //constructor(private dataService: DataService) {};
}
