import {Injectable} from "@angular/core";
import {MenuService} from "./menu.service";
import {MediaService} from "./media.service";

@Injectable()
export class LayoutService {
    constructor(private mds: MediaService) {}

    get mobile() {
        return this.mds.lt('md');
    }

    get desktop() {
        return ! this.mobile;
    }
}
