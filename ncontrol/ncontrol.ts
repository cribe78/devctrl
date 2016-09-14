"use strict";

import * as io from "socket.io-client";
import {
    Endpoint,
    EndpointType,
    DCDataModel
} from "../shared/Shared";

import { EndpointCommunicator } from "./EndpointCommunicator";


interface NControlConfig {
    wsUrl: string;
    testString : string;
    endpointId : string;
}


class NControl {
    io: SocketIOClient.Socket;
    endpoint: Endpoint;
    dataModel: DCDataModel;
    config: NControlConfig;

    static bootstrap() {
        return new NControl();
    }

    constructor() {
        this.dataModel = new DCDataModel();
    }

    run(config: any) {
        let self = this;
        this.config = <NControlConfig>config;
        this.io = io.connect(config.wsUrl);

        this.io.on('connect', function() {
            console.log("websocket client connected");

            //Get endpoint data
            self.getEndpointConfig();

            EndpointCommunicator.listCommunicators();
        });

        console.log("testString is " + config.testString );
    }


    getEndpointConfig() {
        let self = this;
        self.endpoint = self.dataModel.getItem<Endpoint>(self.config.endpointId, Endpoint.tableStr);

        let reqData = self.endpoint.itemRequestData();

        this.io.emit('get-data', reqData, function(data) {
            console.log("endpoint data received");
            self.dataModel.loadData(data);

            self.getEndpointTypeConfig();
        });
    }

    getEndpointTypeConfig() {
        let self = this;

        if (! self.endpoint.dataLoaded) {
            console.log("endpoint data is missing");
            return;
        }

        let epTypeRequestData = self.endpoint.type.itemRequestData();

        this.io.emit('get-data', epTypeRequestData, function(eptData) {
            console.log("endpoint type data received");
            self.dataModel.loadData(eptData);
        })
    }
}

let ncontrol = NControl.bootstrap();
module.exports = ncontrol;
