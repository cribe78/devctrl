"use strict";

import * as io from "socket.io-client";
import {Endpoint, EndpointData} from "../shared/Shared";
import { EndpointCommunicator } from "./EndpointCommunicator";

class NControl {
    io: SocketIOClient.Socket;

    static bootstrap() {
        return new NControl();
    }

    constructor() {
    }

    run(config: any) {
        let self = this;
        this.io = io.connect(config.wsUrl);

        this.io.on('connect', function() {
            console.log("websocket client connected");

            self.getEndpointConfig(config);

            //Get endpoint data
            EndpointCommunicator.listCommunicators();

        });

        console.log("testString is " + config.testString );
    }


    getEndpointConfig(config: any) {
        let reqData = {
            table: "control_endpoints",
            params: { _id: config.endpointId }
        };

        this.io.emit('get-data', reqData, function(data) {
            console.log("endpoint data recieved");
            let epData: EndpointData = data.add.control_endpoints[config.endpointId];
            console.log("ep type: " + epData.type);
        });
    }
}

let ncontrol = NControl.bootstrap();
module.exports = ncontrol;
