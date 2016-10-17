"use strict";
var CtrlController = (function () {
    function CtrlController(DataService, MenuService) {
        this.DataService = DataService;
        this.MenuService = MenuService;
        this.menu = MenuService;
    }
    CtrlController.$inject = ['DataService', 'MenuService'];
    return CtrlController;
}());
//# sourceMappingURL=control.component.js.map