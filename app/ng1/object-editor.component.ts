import IComponentOptions = angular.IComponentOptions;
import { Directive,
    ElementRef,
    Injector,
    Input,
    Output,
    EventEmitter } from '@angular/core';
import { UpgradeComponent } from '@angular/upgrade/static';

class ObjectEditorController {
    object;
    fname : string;
    newKey;
    newVal;

    static $inject = [];
    constructor() {}


    addItem() {
        if (this.newKey && this.newVal) {
            let tempVal = '';
            try {
                tempVal = JSON.parse(this.newVal);
            }
            catch(e) {
                tempVal = this.newVal;
            }

            if (typeof this.object == 'undefined') {
                this.object = {};
            }

            this.object[this.newKey] = tempVal;
        }

        this.newKey = undefined;
        this.newVal = undefined;
        angular.element(document).find('#oe-new-key').focus();

        this.onUpdate({object: this.object, name: this.fname});
    }

    deleteValue(key) {
        delete this.object[key];
        this.onUpdate({object: this.object, name: this.fname});
    }


    onUpdate(args) {}

    valueType(value) {
        if (angular.isArray(value)) {
            return "array";
        }

        return typeof value;
    }

    updateValue($event, key) {
        let tempVal = '';
        try {
            tempVal = JSON.parse(this.object[key]);
        }
        catch(e) {
            tempVal = this.object[key];
        }

        this.object[key] = tempVal;
    }
}


export let ObjectEditorComponent : IComponentOptions = {
    templateUrl: 'app/ng1/object-editor.html',
    controller: ObjectEditorController,
    bindings: {
        object: '<',
        fname: '<',
        onUpdate: '&'
    }
};

@Directive({
    selector: 'devctrl-object-editor'
})
export class ObjectEditorComponentNg2 extends UpgradeComponent {
    @Input() object;
    @Input() fname;
    @Output() onUpdate = new EventEmitter();

    constructor(elementRef: ElementRef, injector: Injector) {
        super('devctrlObjectEditor', elementRef, injector);
    }
}