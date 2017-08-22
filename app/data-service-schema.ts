

import {Control} from "./shared/Control";
import {Endpoint} from "./shared/Endpoint";
import {OptionSet} from "./shared/OptionSet";
import {DCSerializable, IDCFieldDefinition, IDCTableDefinition} from "./shared/DCSerializable";
import {ActionTrigger} from "./shared/ActionTrigger";
import {EndpointType} from "./shared/EndpointType";
import {Panel} from "./shared/Panel";
import {PanelControl} from "./shared/PanelControl";
import {Room} from "./shared/Room";


export interface DSSchemaDefinition {
    [index: string] : IDCTableDefinition
}


let schema : DSSchemaDefinition = {};
schema[ActionTrigger.tableStr] = DCSerializable.typeTableDefinition(ActionTrigger);
schema[Control.tableStr] = DCSerializable.typeTableDefinition(Control);
schema[Endpoint.tableStr] = DCSerializable.typeTableDefinition(Endpoint);
schema[EndpointType.tableStr] = DCSerializable.typeTableDefinition(EndpointType);
schema[OptionSet.tableStr] = DCSerializable.typeTableDefinition(OptionSet);
schema[Panel.tableStr] = DCSerializable.typeTableDefinition(Panel);
schema[PanelControl.tableStr] = DCSerializable.typeTableDefinition(PanelControl);
schema[Room.tableStr] = DCSerializable.typeTableDefinition(Room);

export let dataServiceSchema = schema;

