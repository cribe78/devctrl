export let LogCtrl = ['DataService',
    function(DataService) {
        this.applog = DataService.dataModel.applog;
    }
];

export let LogResolve = {
    loadLog: ['DataService', function(DataService) {
        return DataService.getLog();
    }]
};