import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../data.service';
import {Room} from "../shared/Room";
import {Control} from "../shared/Control";

@Injectable()
export class ControlResolver implements Resolve<Control> {
    constructor(private ds: DataService, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Control> {
        let id = route.params['id'];

        let controlsPromise = this.ds.getTablePromise(Control.tableStr);

        return controlsPromise.then(loaded => {
            if (loaded) {
                let controls = this.ds.getTable(Control.tableStr);
                console.log(`ControlResolver resolved ${controls[id].name}`);
                return controls[id];
            }
            else {
                console.log(`ControlsResolver: controls not loaded`);
                this.router.navigate(['/controls']);
            }
        });
    }
}