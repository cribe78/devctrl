"use strict";
exports.LogCtrl = ['DataService',
    function (DataService) {
        this.applog = DataService.dataModel.applog;
    }
];
exports.LogResolve = {
    loadLog: ['DataService', function (DataService) {
            return DataService.getLog();
        }]
};
//# sourceMappingURL=LogCtrl.js.map