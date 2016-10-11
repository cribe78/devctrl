<?php

/**
 * Type values:
 *   fk  -  foreign key
 *   enum  - string restricted to values defined in enum_vals
 */

$g_schema = array(
    'endpoints' => array(
        'pk' => 'control_endpoint_id',
        'fk_name' => 'name',
        'foreign_keys' => array(
            'endpoint_type_id' => 'endpoint_types',
        ),
        'label' => 'Endpoints',
        'fields' => array(
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Endpoint Name'
            ),
            array(
                'name' => 'endpoint_type_id',
                'type' => 'fk',
                'label' => 'Endpoint Type',
            ),
            array(
                'name' => 'ip',
                'type' => 'string',
                'label' => 'IP Address',
            ),
            array(
                'name' => 'port',
                'type' => 'int',
                'label' => 'Port',
            ),
            array(
                'name' => 'status',
                'type' => 'string',
                'label' => 'Status',
                'input_disabled' => true
            ),
            array(
                'name' => 'enabled',
                'type' => 'bool',
                'label' => 'Enabled?',
            )
        ),
    ),
    'control_log' => array(
        'db' => 'mongo',
        'pk' => '_id',
        'label' => 'Control Log',
        'foreign_keys' => array(
            'control_id' => 'controls',
            'client_id' => 'clients'
        ),
        'fields' => array(
            array(
                'name' => 'control_id',
                'type' => 'fk',
                'label' => 'Control'
            ),
            array(
                'name' => 'client_id',
                'type' => 'fk',
                'label' => 'Client'
            ),
            array(
                'name' => 'new_value',
                'type' => 'string',
                'label' => 'New Value'
            ),
            array(
                'name' => 'old_value',
                'type' => 'string',
                'label' => 'Old Value'
            ),
            array(
                'name' => 'ts',
                'type' => 'ts',
                'label' => 'Timestamp'
            )
        )
    ),
    'controls' => array(
        'pk' => '_id',
        'fk_name' => 'command',
        'label' => 'Controls',
        'foreign_keys'=> array(
            'enum_id' => 'enums',
            'endpoint_id' => 'endpoints'
        ),
        'fields' => array(
            array(
                'name' => 'endpoint_id',
                'type' => 'fk',
                'label' => 'Endpoint',
            ),
            array(
                'name' => 'ctid',
                'type' => 'string',
                'label' => 'CTID',
            ),
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            ),
            array(
                'name' => 'usertype',
                'type' => 'enum',
                'label' => 'User Type',
            ),
            array(
                'name' => 'control_type',
                'type' => 'enum',
                'label' => 'Control Type',
            ),
            array(
                'name' => 'enum_id',
                'type' => 'fk',
                'label' => 'Enum',
            ),
            array(
                'name' => 'poll',
                'type' => 'bool',
                'label' => 'Poll?'
            ),
            array(
                'name' => 'config',
                'type' => 'object',
                'label' => 'Default Config'
            ),
            array(
                'name' => 'value',
                'type' => 'string',
                'label' => 'Value'
            )
        ),

    ),
    'endpoint_types' => array(
        'pk' => 'endpoint_type_id',
        'fk_name' => 'name',
        'label' => 'Endpoint Types',
        'fields' => array(
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            ),
            array(
                'name' => 'communicatorClass',
                'type' => 'string',
                'label' => 'Communicator Class'
            )
        )
    ),
    'enums' => array(
        'pk' => 'enum_id',
        'fk_name' => 'name',
        'label' => 'Enums',
        'fields' => array(
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            )
        )
    ),
    'enum_vals' => array(
        'pk' => 'enum_val_id',
        'foreign_keys' => array(
            'enum_id' => 'enums'
        ),
        'label' => 'Enum Values',
        'fields' => array(
            array(
                'name' => 'enum_id',
                'type' => 'fk',
                'label' => 'Enum'
            ),
            array(
                'name' => 'value',
                'type' => 'string',
                'label' => 'Value'
            ),
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            ),
            array(
                'name' => 'enabled',
                'type' => 'bool',
                'label' => 'Enabled?'
            )
        )
    ),
    'panels' => array(
        'pk' => 'panel_id',
        'fk_name' => 'name',
        'foreign_keys' => array(
            'room_id' => 'rooms'
        ),
        'label' => 'Panels',
        'fields' => array(
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            ),
            array(
                'name' => 'room_id',
                'type' => 'fk',
                'label' => 'Room'
            ),
            array(
                'name' => 'grouping',
                'type' => 'string',
                'label' => 'Subgroup',
            ),
            array(
                'name' => 'type',
                'type' => 'enum',
                'label' => 'Type'
            ),
            array(
                'name' => 'panel_index',
                'type' => 'int',
                'label' => 'Order'
            )
        )
    ),
    'panel_controls' => array(
        'pk' => 'panel_control_id',
        'foreign_keys' => array(
            'control_id' => 'controls',
            'panel_id' => 'panels'
        ),
        'label' => 'Panel Controls',
        'fields' => array(
            array(
                'name' => 'control_id',
                'type' => 'fk',
                'label' => 'Control'
            ),
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            ),
            array(
                'name' => 'panel_id',
                'type' => 'fk',
                'label' => 'Panel'
            )
        )
    ),
    'rooms' => array(
        'pk' => 'room_id',
        'fk_name' => 'name',
        'label' => 'Rooms',
        'fields' => array(
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            )
        )
    )
);