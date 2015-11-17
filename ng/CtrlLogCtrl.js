goog.provide("DevCtrl.CtrlLog.Ctrl");

DevCtrl.CtrlLog.Ctrl = ['DataService',
    function(DataService) {
        var self = this;

        this.logs = this.ctrl.referenced.control_log;
    }
];