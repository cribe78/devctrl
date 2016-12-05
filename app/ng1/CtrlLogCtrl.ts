import {DataService} from "../data.service";
export let CtrlLogCtrl = ['DataService',
    function(DataService: DataService) {
        var self = this;

        this.logs = this.ctrl.referenced.control_log;

        this.close = function() {
            DataService.dialogClose();
        };
    }
];