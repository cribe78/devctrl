"use strict";
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
        "foreign_keys": {
            "endpoint_id": "endpoints"
        },
        "fields": [
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
                    { name: "button", value: "button" },
                    { name: "F32 Multibutton", value: "f32-multibutton" },
                    { name: "Level Meter", value: "level" },
                    { name: "Select", value: "select" },
                    { name: "Select (readonly)", value: "select-readonly" },
                    { name: "Slider", value: "slider" },
                    { name: "2D Slider", value: "slider2d" },
                    { name: "Switch", value: "switch" },
                    { name: "button set", value: "button-set" }
                ]
            },
            {
                "name": "control_type",
                "type": "select-static",
                "label": "Control Type",
                options: [
                    { name: "boolean", value: "boolean" },
                    { name: "int", value: "int" },
                    { name: "range", value: "range" },
                    { name: "rtlevel", value: "rtlevel" },
                    { name: "string", value: "string" },
                    { name: "object", value: "object" },
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
                    { name: "Switch Group", value: "switch-group" }
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
        label: "Watcher Rules",
        foreign_keys: {
            watched_control_id: "controls",
            action_control_id: "controls"
        },
        fields: [
            nameField,
            {
                name: "watched_control_id",
                type: "fk",
                label: "Watched Control"
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
                name: "action_control_id",
                type: "fk",
                label: "Action Control"
            },
            {
                name: "action_control_value",
                type: "object",
                label: "Action Value"
            },
            {
                name: "enabled",
                type: "boolean",
                label: "Enabled?"
            }
        ]
    }
};
//# sourceMappingURL=data-service-schema.js.map