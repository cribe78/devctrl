import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }   from './app.component';

import { UpgradeAdapter } from '@angular/upgrade';


@NgModule({
    imports:      [ BrowserModule ],
    declarations: [ AppComponent ],
    providers:    [  ],
    //bootstrap:    [ AppComponent ]
})
export class AppModule { }

