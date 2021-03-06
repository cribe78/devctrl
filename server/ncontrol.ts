"use strict";

import * as io from "socket.io-client";
import {DCDataModel, IndexedDataSet} from "../app/shared/DCDataModel";
import { EndpointCommunicator } from "../Communicators/EndpointCommunicator";
import {IDCDataRequest, IDCDataUpdate} from "../app/shared/DCSerializable";
import {Control} from "../app/shared/Control";
import {ControlUpdateData} from "../app/shared/ControlUpdate";
import {Endpoint, EndpointData, EndpointStatus} from "../app/shared/Endpoint";

let debug = console.log;

interface NControlConfig {
    wsUrl: string;
    testString : string;
    endpointId : string;
}


class NControl {
    io: SocketIOClient.Socket;
    endpoint: Endpoint;
    oldEndpoint: Endpoint;
    dataModel: DCDataModel;
    controls: IndexedDataSet<Control>;
    config: NControlConfig;
    communicator: EndpointCommunicator;
    syncControlsPassNumber: number = 0;

    static bootstrap() {
        return new NControl();
    }

    constructor() {
        this.dataModel = new DCDataModel();
        this.dataModel.debug = console.log;
        this.controls = this.dataModel.tables[Control.tableStr] as IndexedDataSet<Control>;
    }

    run(config: any) {
        let self = this;
        this.config = <NControlConfig>config;
        debug(`connecting to ${config.wsUrl}${config.ioPath}`);
        let connectOpts = {
            transports: ['websocket'],
            path : config.ioPath
        };

        connectOpts['extraHeaders'] = { 'ncontrol-auth-id' : config.authId }

        this.io = io.connect(config.wsUrl, connectOpts);

        this.io.on('connect', function() {
            debug("websocket client connected");

            //Get endpoint data
            self.getEndpointConfig();
            self.registerEndpoint();
        });

        this.io.on('connect_error', (err) => {
            debug(`io connection error: ${err}`);
        });

        this.io.on('reconnect', () => {
            this.registerEndpoint();
            if (this.endpoint) {
                this.pushEndpointStatusUpdate(this.endpoint.status);
            }
        });

        this.io.on('error', function(obj) {
            debug(`websocket connection error: ${obj}`);
        });

        this.io.on('control-data', data => {
            self.oldEndpoint = new Endpoint(self.endpoint._id, <EndpointData>(self.endpoint.getDataObject()));

            // Discard control data not related to this endpoint
            if (data.add && data.add.controls) {
                let deleteIds = [];
                for (let id in data.add.controls) {
                    if (data.add.controls[id].endpoint_id !== self.endpoint._id) {
                        deleteIds.push(id);
                    }
                }

                for (let id of deleteIds) {
                    delete data.add.controls[id];
                }
            }

            self.dataModel.loadData(data);
            self.checkData();
        });

        this.io.on('control-updates', function(data) {
            self.handleControlUpdates(data);
        });

        debug("testString is " + config.testString );
    }

    checkData() {
        // Check endpoint for configuration changes
        if (this.oldEndpoint.enabled != this.endpoint.enabled) {
            if (this.endpoint.enabled) {
                debug("Endpoint enabled. Connecting");
                this.communicator.connect();
            }
            else {
                debug("Endpoint disabled.  Disconnecting");
                this.communicator.disconnect();
            }
        }
        else if (this.oldEndpoint.ip != this.endpoint.ip ||
                this.oldEndpoint.port != this.endpoint.port ) {
            debug("ip/port change. resetting communicator");
            this.communicator.disconnect();
            this.communicator.connect();
        }
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
        self.endpoint = self.dataModel.getItem(self.config.endpointId, Endpoint.tableStr) as Endpoint;

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
            let control = this.dataModel.getItem(update.control_id, Control.tableStr) as Control;

            if (control.endpoint_id && control.endpoint_id == this.endpoint._id
            && update.status == "requested") {
                debug(`control update: ${ control.name } : ${ update.value }`);

                if (control.control_type == Control.CONTROL_TYPE_ECHO) {
                    // Just update the value and kick it back to the messenger
                    // This is a "dummy" command that can be used to trigger other
                    // actions

                    this.pushControlUpdate(control, update.value);
                    return;
                }

                this.communicator.handleControlUpdateRequest(update);
            }
        }
    }

    launchCommunicator() {
        let self = this;
        if (! this.endpoint.type.dataLoaded) {
            debug("endpointType data is missing");
        }

        if (! this.communicator) {
            let commClass = this.endpoint.type.communicatorClass;
            let requirePath = "../Communicators/" + commClass;

            debug(`instantiating communicator ${requirePath}`);

            this.communicator = require(requirePath);

            if (typeof this.communicator.setConfig !== 'function') {
                debug("it doesn't look like you have your communicator class exported properly");
            }

            this.communicator.setConfig({
                endpoint: this.endpoint,
                controlUpdateCallback: function (control, value) {
                    self.pushControlUpdate(control, value);
                },
                statusUpdateCallback: function (status) {
                    self.pushEndpointStatusUpdate(status);
                }
            });
        }

        this.syncControls();

        if (this.endpoint.enabled) {
            if (! this.communicator.connected) {
                this.communicator.connect();
            }
            else {
                debug("communicator already connected");
            }
        }
        else {
            debug("endpoint not enabled, not connecting");
        }
    }

    pushControlUpdate(control: Control, value: any) {
        let update : ControlUpdateData = {
            _id : this.guid(),
            name: control.name + " update",
            control_id: control._id,
            value: value,
            type: "device",
            status: "observed",
            source: this.endpoint._id,
            ephemeral: control.ephemeral
        };

        this.io.emit('control-updates', [update]);
    }

    pushEndpointStatusUpdate(status: EndpointStatus) {
        this.endpoint.status = status;
        let update : IDCDataUpdate = {
            table: Endpoint.tableStr,
            _id: this.endpoint._id,
            "set" : { status: status }
        };

        this.updateData(update, () => {});
    }

    registerEndpoint() {
        //TODO: multiple register messages are being sent on reconnect
        this.io.emit('register-endpoint', { endpoint_id : this.config.endpointId});
    }

    syncControls() {
        this.syncControlsPassNumber++;

        if (this.syncControlsPassNumber > 2) {
            throw new Error("failed to sync control templates");
        }

        // Don't do this part twice
        if (this.syncControlsPassNumber == 1) {
            // Get ControlTemplates from communicator
            let controlTemplates = this.communicator.getControlTemplates();

            let newControls = [];
            let controlsByCtid = {};

            for (let id in this.controls) {
                let ct = this.controls[id];
                controlsByCtid[ct.ctid] = ct;
            }

            // Match communicator control templates to server control templates by ctid
            for (let ctid in controlTemplates) {
                if (! controlsByCtid[ctid]) {
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
        }

        debug("controls successfully synced!");

        // Pass completed ControlTemplate set to communicator
        this.communicator.setTemplates(<IndexedDataSet<Control>>this.dataModel.tables[Control.tableStr]);
    }

}

let ncontrol = NControl.bootstrap();
module.exports = ncontrol;
