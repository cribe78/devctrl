/*
DCDataSet

DCDataSet type objects are used for exchanging data between the various components of the DevCtrl application.
 */

import { EndpointData, EndpointTypeData, ControlData} from "./Shared";


export class DCDataSet {

    constructor(public data: any){

    };

    endpoint(id: string) : EndpointData {
        if (this.data.endpoints && this.data.endpoints[id]) {
            return (<EndpointData>this.data.endpoints[id]);
        }
    }




}