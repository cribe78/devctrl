import { Endpoint } from "../shared/Shared";
import * as communicators from "./Communicators/Communicators";

export class EndpointCommunicator {

    constructor(public endpoint: Endpoint) {

    }
    static initSubtype(endpoint: Endpoint) {


    }

    static listCommunicators() {
        //for (let comm in communicators ) {
            //console.log("Comm: " + comm);
        //}


    }
}