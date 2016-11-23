import {Room} from "../../shared/Room";
import {IndexedDataSet} from "../../shared/DCDataModel";
import {DataService} from "../data.service";
export class RoomsController {
    list : IndexedDataSet<Room>;


    static $inject = ['DataService'];
    constructor(private dataService: DataService) {}

    $onInit() {
        this.list = <IndexedDataSet<Room>>this.dataService.getTable(Room.tableStr);
    }

    hideToast() {
        this.dataService.hideToast();
    }

    imageUrl(room) {
        return `/images/${room.name}.png`;
    }
}