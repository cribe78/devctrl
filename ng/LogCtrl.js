goog.provide('DevCtrl.Log.Ctrl');

DevCtrl.Log.Ctrl = ['DataService',
    function(DataService) {
        this.applog = DataService.dataModel.applog;
    }
];

DevCtrl.Log.Resolve = {
    loadLog: ['DataService', function(DataService) {
        return DataService.getLog();
    }]
};