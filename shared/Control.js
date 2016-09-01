/**
 *
 * The Control is the basic unit of the DevCtrl application.  A Control represents and individual setting or value
 * on a device (Endpoint).  The frontend provides an interface for users to view and change the values of controls.
 */
"use strict";
var Control = (function () {
    function Control(data) {
        this.data = data;
    }
    return Control;
}());
exports.Control = Control;
//# sourceMappingURL=Control.js.map