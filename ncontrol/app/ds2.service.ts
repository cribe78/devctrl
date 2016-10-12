import {dataServiceSchema} from "./ng1/data-service-schema";

export class DataService2 {
    schema;

    static $inject = ['$window', '$http', '$mdToast', '$timeout', '$q', 'socket', '$mdDialog', '$location'];

    constructor(private $window,
                private $http,
                private $mdToast,
                private $timeout,
                private $q,
                private socket : SocketService,
                private $mdDialog,
                private $location) {
        this.schema = dataServiceSchema;
    }

    init() {
        console.log("dataService2 initialized");
    }


}