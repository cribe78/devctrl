import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../data.service';
import {Room} from "../../shared/Room";
import {Endpoint} from "../../shared/Endpoint";

@Injectable()
export class EndpointResolver implements Resolve<Endpoint> {
    constructor(private ds: DataService, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Endpoint> {
        let id = route.params['id'];

        let endpointsPromise = this.ds.getTablePromise(Endpoint.tableStr);

        return endpointsPromise.then(loaded => {
            if (loaded) {
                let endpoints = this.ds.getTable(Endpoint.tableStr);
                console.log(`EndpointResolver resolved ${endpoints[id].name}`);
                return endpoints[id];
            }
            else {
                console.log(`EndpointResolver: endpoints not loaded`);
                this.router.navigate(['/endpoints']);
            }
        });
    }
}