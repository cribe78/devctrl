import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';
import {DataService} from "./data.service";
import { UpgradeAdapter } from '@angular/upgrade';


@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ AppComponent ],
    providers:    [ DataService ],
    //bootstrap:    [ AppComponent ]
})
export class AppModule { }

