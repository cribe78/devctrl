import { platformBrowser } from '@angular/platform-browser';
import {AppModuleNgFactory} from "../aot/ng/app/app.module.ngfactory";


console.log("Running AOT compiled");
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
