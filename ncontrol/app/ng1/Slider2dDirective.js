"use strict";
exports.Slider2dDirective = ['DataService', function (DataService) {
        return {
            scope: {
                control: '='
            },
            bindToController: true,
            controller: function (DataService) {
                var self = this;
                var _xValue;
                var _yValue;
                this.xValue = function (val) {
                    if (angular.isDefined(val)) {
                        _xValue = val;
                        self.control.ctrl.fields.value = _xValue + "," + _yValue;
                    }
                    else {
                        this.setXYVals();
                    }
                    return _xValue;
                };
                this.yValue = function (val) {
                    if (angular.isDefined(val)) {
                        _yValue = val;
                        self.control.ctrl.fields.value = _xValue + "," + _yValue;
                    }
                    else {
                        this.setXYVals();
                    }
                    return _yValue;
                };
                this.setXYVals = function () {
                    var xyVals = self.control.ctrl.fields.value.split(",");
                    _xValue = angular.isDefined(xyVals[0]) ? xyVals[0] : 0;
                    _xValue = parseInt(_xValue);
                    _yValue = angular.isDefined(xyVals[1]) ? xyVals[1] : 0;
                    _yValue = parseInt(_yValue);
                };
                this.setXYVals();
                this.updateValue = function () {
                    DataService.updateControlValue(self.control.ctrl);
                };
            },
            controllerAs: 'slider2d',
            templateUrl: 'ng/controls/slider2d-directive.html'
        };
    }];
//# sourceMappingURL=Slider2dDirective.js.map