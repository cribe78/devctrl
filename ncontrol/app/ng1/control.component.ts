import {DataService} from "../data.service";

class CtrlController {
    menu;

    static $inject = ['DataService', 'MenuService'];
    constructor(private DataService : DataService, private MenuService) {
        this.menu = MenuService;
    }



}