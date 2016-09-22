"use strict";

import * as io from "socket.io-client";
import {
    Endpoint,
    ControlTemplate,
    DCDataModel
} from "../shared/Shared";

import { EndpointCommunicator } from "./EndpointCommunicator";
import {IDCDataRequest} from "../shared/DCSerializable";
import * as debugMod from "debug"; // see https://www.npmjs.com/package/debug

let debug = debugMod('ncontrol');


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
    communicator: EndpointCommunicator;
    syncControlTemplatesPassNumber: number = 0;

    static bootstrap() {
        return new NControl();
    }

    constructor() {
        this.dataModel = new DCDataModel();
        this.dataModel.debug = debugMod("dataModel");
    }

    run(config: any) {
        let self = this;
        this.config = <NControlConfig>config;
        this.io = io.connect(config.wsUrl);

        this.io.on('connect', function() {
            debug("websocket client connected");

            //Get endpoint data
            self.getEndpointConfig();

            EndpointCommunicator.listCommunicators();
        });

        debug("testString is " + config.testString );
    }


    getControlTemplates() {
        let reqData = {
            table: ControlTemplate.tableStr,
            params: {
                endpoint_id: this.endpoint._id
            }
        };

        this.getData(reqData, this.launchCommunicator);
    }

    private addData(reqData: any, then: () => void) {
        var self = this;
        this.io.emit('add-data', reqData, function(data) {
            if ( data.error ) {
                debug("add-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }

            then.call(self);  // If the callback doesn't belong to this class, this could get weird
        });
    }

    private getData(reqData: IDCDataRequest, then: () => void ) {
        var self = this;
        this.io.emit('get-data', reqData, function(data) {
            if ( data.error ) {
                debug("get-data error: " + data.error);
            }
            else {
                self.dataModel.loadData(data);
            }

            then.call(self);  // If the callback doesn't belong to this class, this could get weird
        });
    }

    getEndpointConfig() {
        let self = this;
        self.endpoint = self.dataModel.getItem<Endpoint>(self.config.endpointId, Endpoint.tableStr);

        let reqData = self.endpoint.itemRequestData();

        self.getData(reqData, self.getEndpointTypeConfig);
    }

    getEndpointTypeConfig() {
        if (! this.endpoint.dataLoaded) {
            debug("endpoint data is missing");
            return;
        }

        this.getData(this.endpoint.type.itemRequestData(), this.getControlTemplates);
    }

    launchCommunicator() {
        if (! this.endpoint.type.dataLoaded) {
            debug("endpointType data is missing");
        }

        let commClass =  this.endpoint.type.communicatorClass;
        let requirePath = "./Communicators/" + commClass;

        this.communicator = require(requirePath);

        this.communicator.setConfig({ endpoint: this.endpoint});

        this.syncControlTemplates();

        this.communicator.connect();
    }

    syncControlTemplates() {
        this.syncControlTemplatesPassNumber++;

        if (this.syncControlTemplatesPassNumber > 2) {
            throw new Error("failed to sync control templates");
        }

        // Get ControlTemplates from communicator
        let controlTemplates = this.communicator.getControlTemplates();

        let newTemplates = [];
        let ctByCtid = {};


        for (let id in this.dataModel.control_templates) {
            let ct = this.dataModel.control_templates[id];
            ctByCtid[ct.ctid] = ct;
        }

        // Match communicator control templates to server control templates by ctid
        for (let ctid in controlTemplates) {
            if (! ctByCtid[ctid]) {
                newTemplates.push(controlTemplates[ctid]);
            }
        }

        // newTemplates is an array of templates to create
        // Create new ControlTemplates on server
        if (newTemplates.length > 0) {
            debug("adding new controls");
            this.addData({ control_templates: newTemplates}, this.syncControlTemplates);

            return;
        }

        debug("controlTemplates successfully synced!");

        // Pass completed ControlTemplate set to communicator
        this.communicator.setTemplates(this.dataModel.control_templates);
    }
}

let ncontrol = NControl.bootstrap();
module.exports = ncontrol;
