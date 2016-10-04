import { Injectable } from '@angular/core';
import {DCDataModel} from "../shared/DCDataModel";
import * as io from "socket.io-client";


@Injectable()
export class DataService {
    io: SocketIOClient.Socket;

    constructor(public dataModel: DCDataModel) {
        this.io = io.connect("https://devctrl.dwi.ufl.edu");

        this.io.on('connect', function() {
            console.log("websocket client connected");
        });
    };

    addRow(row: any, callback:any) {
        console.log("addRow not implemented");
    }





}