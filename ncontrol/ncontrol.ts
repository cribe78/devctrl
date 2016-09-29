"use strict";

import * as io from "socket.io-client";
import {
    Endpoint,
    DCDataModel
} from "../shared/Shared";

import { EndpointCommunicator } from "./EndpointCommunicator";
import {IDCDataRequest, IDCDataUpdate} from "../shared/DCSerializable";
import * as debugMod from "debug";
import {Control} from "../shared/Control";
import {ControlUpdateData} from "../shared/ControlUpdate"; // see https://www.npmjs.com/package/debug

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
    syncControlsPassNumber: number = 0;

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

        this.io.on('control-data', function(data) {
            self.dataModel.loadData(data);
        });

        this.io.on('control-updates', function(data) {
            self.handleControlUpdates(data);
        });

        debug("testString is " + config.testString );
    }


    getControls() {
        let reqData = {
            table: Control.tableStr,
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

    private updateData(reqData: IDCDataUpdate, then: () => void ) {
        var self = this;
        this.io.emit('update-data', reqData, function(data) {
            if ( data.error ) {
                debug("update-data error: " + data.error);
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

        this.getData(this.endpoint.type.itemRequestData(), this.getControls);
    }

    guid() : string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    }

    handleControlUpdates(data: ControlUpdateData[]) {
        for (let update of data) {
            if (this.dataModel.controls[update.control_id]) {
                let control = this.dataModel.controls[update.control_id];

                if (control.endpoint_id && control.endpoint_id == this.endpoint._id
                && update.status == "requested") {
                    debug(`control update: ${ control.name } : ${ update.value }`);
                    this.communicator.handleControlUpdateRequest(update);
                }
            }
        }
    }

    launchCommunicator() {
        let self = this;
        if (! this.endpoint.type.dataLoaded) {
            debug("endpointType data is missing");
        }

        let commClass =  this.endpoint.type.communicatorClass;
        let requirePath = "./Communicators/" + commClass;

        this.communicator = require(requirePath);

        this.communicator.setConfig({
            endpoint: this.endpoint,
            controlUpdateCallback: function(control, value) {
                self.pushControlUpdate(control, value);
            },
            statusUpdateCallback: function(status) {
                self.pushEndpointStatusUpdate(status);
            }
        });

        this.syncControls();

        this.communicator.connect();
    }

    pushControlUpdate(control: Control, value: any) {
        let update : ControlUpdateData = {
            _id : this.guid(),
            control_id: control._id,
            value: value,
            type: "device",
            status: "observed",
            source: this.endpoint._id
        };

        this.io.emit('control-updates', [update]);
    }

    pushEndpointStatusUpdate(status: string) {
        let update : IDCDataUpdate = {
            table: Endpoint.tableStr,
            _id: this.endpoint._id,
            "set" : { status: status }
        };

        this.updateData(update, () => {});
    }

    syncControls() {
        this.syncControlsPassNumber++;

        if (this.syncControlsPassNumber > 2) {
            throw new Error("failed to sync control templates");
        }

        // Get ControlTemplates from communicator
        let controlTemplates = this.communicator.getControlTemplates();

        let newControls = [];
        let ctByCtid = {};


        for (let id in this.dataModel.controls) {
            let ct = this.dataModel.controls[id];
            ctByCtid[ct.ctid] = ct;
        }

        // Match communicator control templates to server control templates by ctid
        for (let ctid in controlTemplates) {
            if (! ctByCtid[ctid]) {
                newControls.push(controlTemplates[ctid].getDataObject());
            }
        }

        // newControls is an array of templates to create
        // Create new ControlTemplates on server
        if (newControls.length > 0) {
            debug("adding new controls");
            this.addData({ controls: newControls}, this.syncControls);

            return;
        }

        debug("controls successfully synced!");

        // Pass completed ControlTemplate set to communicator
        this.communicator.setTemplates(this.dataModel.controls);
    }

}

let ncontrol = NControl.bootstrap();
module.exports = ncontrol;
