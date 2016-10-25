"use strict";

import * as io from "socket.io-client";
import {DCDataModel} from "./shared/DCDataModel";
import {IDCDataRequest, IDCDataUpdate} from "./shared/DCSerializable";
import * as debugMod from "debug"; // see https://www.npmjs.com/package/debug
import {Control} from "./shared/Control";
import {ControlUpdateData} from "./shared/ControlUpdate";
import {Endpoint, EndpointStatus} from "./shared/Endpoint";

let debug = debugMod('ncontrol');


let watchConfig = {

}


class Watcher {
    config: any;
    dataModel: DCDataModel;
    io : SocketIOClient.Socket;

    constructor() {
        this.dataModel = new DCDataModel();
        this.dataModel.debug = debugMod("dataModel");
    }
    static bootstrap() {
        return new Watcher();
    }

    run(config: any) {
        this.config = config;

        this.io = io.connect(config.wsUrl);

        this.io.on('connect', function() {
            debug("websocket client connected");

        });

        this.io.on('control-data', (data) => {
            this.dataModel.loadData(data);
        });

        this.io.on('control-updates', (data) => {
            this.handleControlUpdates(data);
        });
    }


    handleControlUpdates(data: ControlUpdateData[]) {

    }
}