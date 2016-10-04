"use strict";
exports.CtrlLogCtrl = ['DataService',
    function (DataService) {
        var self = this;
        this.logs = this.ctrl.referenced.control_log;
        this.close = function () {
            DataService.dialogClose();
        };
    }
];
//# sourceMappingURL=CtrlLogCtrl.js.map