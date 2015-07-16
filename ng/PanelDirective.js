goog.provide('DevCtrl.Panel.Directive');

DevCtrl.Panel.Directive  = ['DataService', function(DataService) {
    return {
        scope: true,
        bindToController : {
            panelObj: '='
        },
        controller: function(DataService) {
            this.fields = this.panelObj.fields;
            this.pcontrols = this.panelObj.referenced.panel_controls;

        },
        controllerAs: 'panel',
        templateUrl: 'ng/panel.html'
    }
}];