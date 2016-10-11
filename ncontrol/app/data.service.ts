import { Injectable } from '@angular/core';
import {DCDataModel} from "../shared/DCDataModel";
import * as io from "socket.io-client";


@Injectable()
export class DataService {
    io: SocketIOClient.Socket;
    tablePromises = {};

    //static $inject = ['$q'];
    constructor(public dataModel: DCDataModel) {
        this.io = io.connect("https://devctrl.dwi.ufl.edu");

        this.io.on('connect', function() {
            console.log("websocket client connected");
        });
    };

    /**

    addRow(row: any, callback:any) {
        console.log("addRow not implemented");
    }

    errorToast(data) {

    }

    // Get MongoDB data from the IO messenger
    getMData(table, params) {
        let reqData = {
            table : table,
            params : params
        };

        let self = this;

        let getMProm =  this.$q( function(resolve, reject) {
            this.io.emit('get-data', reqData, function(data) {
                console.log("data received:" + data);
                self.loadData(data);
                resolve(true);
            });
        });

        return getMProm;
    }

    getTablePromise(table: string) {
        if (angular.isDefined(this.tablePromises[table])) {
            return this.tablePromises[table];
        }

        if (angular.isDefined(table)) {
            this.tablePromises[table] = this.getMData(table, {})
                .then(
                    function() {
                        return this.dataModel[table];
                    },
                    function () {
                        this.errorToast("getMData " + table + " problem");
                    }
                );

            return this.tablePromises[table];
        }
        else {
            console.error("error: attempt to fetch undefined table!");
        }
    }


    loadData(data: any) {

    }


     **/
}