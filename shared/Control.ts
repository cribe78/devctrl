/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */

import Endpoint from "./Endpoint";

export default class Control {
    name: string;
    id: number;
    endpoint: Endpoint;
    value: any;

}