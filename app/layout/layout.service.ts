import {Injectable} from "@angular/core";
import {MenuService} from "./menu.service";
import {MediaService} from "./media.service";

@Injectable()
export class LayoutService {
    static menuWidth = 270;
    static wide = 1500;

    constructor(private mds: MediaService,
                private mns: MenuService) {}

    get mobile() {
        return this.mds.lt('md');
    }

    get desktop() {
        return ! this.mobile;
    }

    get desktopWide() {
        let testWidth = LayoutService.wide;
        if (this.mns.isSidenavOpen()) {
            testWidth += LayoutService.menuWidth;
        }

        return this.mds.widerThan(testWidth);
    }
}
