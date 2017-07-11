"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Control_1 = require("../shared/Control");
var Endpoint_1 = require("../shared/Endpoint");
var OptionSet_1 = require("../shared/OptionSet");
var nameField = {
    name: "name",
    type: "string",
    label: "Name"
};
exports.dataServiceSchema = {
    endpoints: {
        "foreign_keys": {
            "endpoint_type_id": "endpoint_types"
        },
        label: "Endpoints",
        fields: [
            nameField,
            {
                "name": "endpoint_type_id",
                "type": "fk",
                "label": "Endpoint Type"
            },
            {
                "name": "ip",
                "type": "string",
                "label": "Address"
            },
            {
                "name": "port",
                "type": "int",
                "label": "Port"
            },
            {
                "name": "config",
                "type": "object",
                "label": "Device Specific Config"
            },
            {
                "name": "commLogOptions",
                type: "string",
                label: "Ncontrol Log Options"
            },
            {
                "name": "status",
                "type": "string",
                "label": "Status",
                "input_disabled": true
            },
            {
                "name": "enabled",
                "type": "bool",
                "label": "Enabled?"
            }
        ]
    },
    /**
    control_log: {
        "db": "mongo",
        "pk": "_id",
        "label": "Control Log",
        "foreign_keys": {
            "control_id": "controls",
        },
        "fields": [
            {
                "name": "control_id",
                "type": "fk",
                "label": "Control"
            },
            {
                "name": "client_id",
                "type": "string",
                "label": "Client"
            },
            {
                "name": "new_value",
                "type": "string",
                "label": "New Value"
            },
            {
                "name": "old_value",
                "type": "string",
                "label": "Old Value"
            },
            {
                "name": "ts",
                "type": "ts",
                "label": "Timestamp"
            }
        ]
    },
     **/
    controls: {
        "label": "Controls",
        foreign_keys: {
            "endpoint_id": Endpoint_1.Endpoint.tableStr,
            "option_set_id": OptionSet_1.OptionSet.tableStr
        },
        fields: [
            {
                "name": "endpoint_id",
                "type": "fk",
                "label": "Endpoint"
            },
            {
                "name": "ctid",
                "type": "string",
                "label": "CTID"
            },
            nameField,
            {
                name: "usertype",
                type: "select-static",
                label: "UI Type",
                options: [
                    { name: "button", value: Control_1.Control.USERTYPE_BUTTON },
                    { name: "button set", value: Control_1.Control.USERTYPE_BUTTON_SET },
                    { name: "Hyperlink", value: Control_1.Control.USERTYPE_HYPERLINK },
                    { name: "Image", value: Control_1.Control.USERTYPE_IMAGE },
                    { name: "F32 Multibutton", value: Control_1.Control.USERTYPE_F32_MULTIBUTTON },
                    { name: "Level Meter", value: Control_1.Control.USERTYPE_LEVEL },
                    { name: "Text (readonly)", value: Control_1.Control.USERTYPE_READONLY },
                    { name: "Select", value: Control_1.Control.USERTYPE_SELECT },
                    { name: "Select (readonly)", value: Control_1.Control.USERTYPE_SELECT_READONLY },
                    { name: "Slider", value: Control_1.Control.USERTYPE_SLIDER },
                    { name: "2D Slider", value: Control_1.Control.USERTYPE_SLIDER_2D },
                    { name: "Switch", value: Control_1.Control.USERTYPE_SWITCH }
                ]
            },
            {
                "name": "control_type",
                "type": "select-static",
                "label": "Control Type",
                options: [
                    { name: "boolean", value: Control_1.Control.CONTROL_TYPE_BOOLEAN },
                    { name: "echo", value: Control_1.Control.CONTROL_TYPE_ECHO },
                    { name: "int", value: Control_1.Control.CONTROL_TYPE_INT },
                    { name: "range", value: Control_1.Control.CONTROL_TYPE_RANGE },
                    { name: "string", value: Control_1.Control.CONTROL_TYPE_STRING },
                    { name: "xy", value: Control_1.Control.CONTROL_TYPE_XY }
                ]
            },
            {
                "name": "poll",
                "type": "bool",
                "label": "Poll?"
            },
            {
                "name": "config",
                "type": "object",
                "label": "Default Config"
            },
            {
                name: "option_set_id",
                type: "fk",
                label: "Option Set"
            },
            {
                "name": "value",
                "type": "string",
                "label": "Value"
            }
        ]
    },
    endpoint_types: {
        "label": "Endpoint Types",
        "fields": [
            nameField,
            {
                "name": "communicatorClass",
                "type": "string",
                "label": "Communicator Class"
            }
        ]
    },
    option_sets: {
        label: "Option Sets",
        fields: [
            nameField,
            {
                name: "options",
                type: "object",
                label: "Options"
            }
        ]
    },
    panels: {
        "foreign_keys": {
            "room_id": "rooms"
        },
        "label": "Panels",
        "fields": [
            nameField,
            {
                "name": "room_id",
                "type": "fk",
                "label": "Room"
            },
            {
                "name": "grouping",
                "type": "string",
                "label": "Subgroup"
            },
            {
                name: "type",
                type: "select-static",
                label: "Type",
                options: [
                    { name: "List", value: "list" },
                    { name: "Switch Group", value: "switch-group" },
                    { name: "Horizontal", value: "horizontal" }
                ]
            },
            {
                "name": "panel_index",
                "type": "int",
                "label": "Order"
            }
        ]
    },
    panel_controls: {
        "foreign_keys": {
            "control_id": "controls",
            "panel_id": "panels"
        },
        label: "Panel Controls",
        fields: [
            nameField,
            {
                "name": "control_id",
                "type": "fk",
                "label": "Control"
            },
            {
                "name": "panel_id",
                "type": "fk",
                "label": "Panel"
            },
            {
                name: "idx",
                type: "int",
                label: "Order"
            }
        ]
    },
    rooms: {
        "label": "Rooms",
        "fields": [
            nameField,
        ]
    },
    watcher_rules: {
        label: "Action Triggers",
        foreign_keys: {
            watched_control_id: "controls",
            action_control_id: "controls"
        },
        fields: [
            {
                name: "trigger_control_id",
                type: "fk",
                label: "Trigger Control"
            },
            {
                name: "action_control_id",
                type: "fk",
                label: "Action Control"
            },
            {
                name: "action_control_value",
                type: "watcher-action-value",
                label: "Action Value"
            },
            {
                name: "enabled",
                type: "bool",
                label: "Enabled?"
            },
            {
                name: "value_test",
                type: "select-static",
                label: "Value Test",
                options: [
                    { name: "any", value: "any" },
                    { name: "=", value: "=" },
                    { name: "<", value: "<" },
                    { name: ">", value: ">" }
                ]
            },
            {
                name: "trigger_value",
                type: "string",
                label: "Trigger Value"
            },
        ]
    }
};
//# sourceMappingURL=data-service-schema.js.map