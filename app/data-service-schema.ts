

import {Control} from "./shared/Control";
import {Endpoint} from "./shared/Endpoint";
import {OptionSet} from "./shared/OptionSet";
export type DSFieldType = "string" | "int" | "bool" | "select-static" | "fk" | "object" | "watcher-action-value";

export interface DSFieldDefinition {
    name: string;
    type: DSFieldType;
    label: string;
    options?: {
        name : string;
        value : string;
    }[],
    input_disabled?: boolean;
}

export interface DSTableDefinition {
    label: string;
    foreign_keys? : {
        [index: string] : string;
    };
    fields: DSFieldDefinition[]
}

export interface DSSchemaDefinition {
    [index: string] : DSTableDefinition
}


export let dataServiceSchema : DSSchemaDefinition = {
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

    controls: {
    },
    endpoint_types: {
    },

    panels: {

    },
     **/
};