goog.provide("DevCtrl.EnumEditor.Ctrl");


DevCtrl.EnumEditor.Ctrl = ['$mdDialog', 'DataService',
    function($mdDialog, DataService) {
        var self = this;
        this.enums = DataService.getTable("enums");
        this.enumVals = DataService.getTable("enum_vals");

        this.newEnumValue = DataService.getNewRowRef("enum_vals");
        this.isAddingEnum = false;

        this.title = function() {
            if (angular.isString(self.options.title)) {
                return self.options.title;
            }

            return "Edit " + self.myEnum.fields.name + " values";
        };

        this.isEnumSelectable = function() {
            return angular.isObject(self.enumRefRecord);
        };


        this.updateEnumValue = function(enumValue) {
            DataService.updateRow(enumValue);
        };

        this.addEnumValue = function() {
            self.newEnumValue.fields.enum_id = self.myEnum.id;
            self.newEnumValue.fields.enabled = 1;
            DataService.addRow(self.newEnumValue);
            self.newEnumValue = DataService.getNewRowRef("enum_vals");
        };

        this.newEnumCallback = function(enumObj) {
            self.enumRefRecord.fields.enum_id = enumObj.id;
            self.updateEnum();
        };

        this.deleteEnumValue = function(enumValue) {
            DataService.deleteRow(enumValue);
        };

        this.updateEnum = function() {
            if (self.enumRefRecord.fields.enum_id == 0) {
                self.isAddingEnum = true;
            }
            else {
                self.myEnum = self.enums.indexed[self.enumRefRecord.fields.enum_id];
                DataService.updateRow(self.enumRefRecord);
            }
        };

        this.addNewEnum = function() {
            self.newEnum = DataService.getNewRowRef("enums");
            self.newEnum.fields.name = self.newEnumName;
            DataService.addRow(self.newEnum, self.newEnumCallback);
            self.newEnumName = '';
            self.isAddingEnum = false;
        };

        if (this.isEnumSelectable) {
            self.myEnum = self.enums.indexed[self.enumRefRecord.fields.enum_id];
        };

        this.close = function() {
            $mdDialog.hide();
        };

    }];