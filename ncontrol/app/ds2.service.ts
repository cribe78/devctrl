export class DataService2 {

    static $inject = ['$q'];

    constructor(private $q) {

    }

    init() {
        console.log("dataService2 initialized");
    }


}