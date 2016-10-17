import {DataService} from "../data.service";
class ObjectEditorController {
    object;
    name;
    newKey;
    newValue;

    static $inject = ['DataService'];
    constructor(private DataService: DataService) {}


    addItem() {
        if (this.newKey && this.newValue) {
            this.object[this.newKey] = this.newValue;
        }

        this.newKey = undefined;
        this.newValue = undefined;
        angular.element('#oe-new-key').focus();
    }

    valueType(value) {
        return typeof value;
    }
}


export let ObjectEditorDirective  = [ function() : ng.IDirective {
    return {
        scope: {
            object: '=',
            name: '='
        },
        bindToController: true,
        controller: ObjectEditorController,
        controllerAs: 'obj',
        templateUrl: 'app/ng1/object-editor.html'
    }
}];