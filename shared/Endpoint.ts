/**
 * Created by chris on 8/17/16.
 */

export enum EndpointStatus {
    Online,
    Disabled,
    Offline,
    Unknown
}


export interface EndpointData {
    _id: string;
    type: string;
    status: EndpointStatus;
    name: string;
}


export class Endpoint {
    _id: string;
    type: string;

    constructor(data: EndpointData) {
        this.type = data.type;
        this._id = data._id
    }



}