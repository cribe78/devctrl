import { Injectable }             from '@angular/core';
import { Router, Resolve, RouterStateSnapshot,
    ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../data.service';
import {Room} from "../../shared/Room";

@Injectable()
export class RoomResolver implements Resolve<Room> {
    constructor(private ds: DataService, private router: Router) {}
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Room> {
        let name = route.params['name'];

        let roomsPromise = this.ds.getTablePromise(Room.tableStr);

        return roomsPromise.then(loaded => {
            if (loaded) {
                let rooms = this.ds.getTable(Room.tableStr);
                for (let id in rooms) {

                    if (rooms[id].name.toLowerCase() == name.toLowerCase()) {
                        console.log(`RoomResolver resolved ${name}`)
                        return rooms[id];
                    }
                }

                console.log(`RoomResolver: Room ${name} not found`);
            }
            else {
                console.log(`RoomResolver: rooms not loaded`);
                this.router.navigate(['/rooms']);
            }
        });
    }
}