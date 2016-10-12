export let ObjectEditorDirective  = [ function() : ng.IDirective {
    return {
        scope: {
            object: '='
        },
        bindToController: true,
        controller: function() {
            var self = this;

            if (! angular.isDefined(this.object) || this.object == null || angular.isArray(this.object)) {
                this.object = {};
            }

            this.addItem = function(key, value) {
                if (angular.isDefined(this.newKey) && angular.isDefined(this.newVal)) {
                    this.object[this.newKey] = this.newVal;
                }

                this.newKey = undefined;
                this.newVal = undefined;

                angular.element('#oe-new-key').focus();
            }
        },
        controllerAs: 'obj',
        templateUrl: 'app/ng1/object-editor.html'
    }
}];