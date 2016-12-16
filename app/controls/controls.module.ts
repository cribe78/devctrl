import {MaterialModule} from "@angular/material";
import {FormsModule} from "@angular/forms";
import {NgModule} from "@angular/core";
import {DataService} from "../data.service";

@NgModule({
    imports:      [
        MaterialModule,
        FormsModule
    ],
    declarations: [

    ],
    entryComponents: [

    ],
    providers:    [
        DataService,
    ],
    //bootstrap:    [ AppComponent ]
})
export class AppModule {
    ngDoBootstrap() {};
}
