<?php

/**
 * Type values:
 *   fk  -  foreign key
 *   enum  - string restricted to values defined in enum_vals
 */

$g_schema = array(
    'admin_sessions' => array(
        'pk' => 'admin_session_id',
        'foreign_keys' => array(
            'user_id' => 'users',
        ),
        'fields' => array(
            array(
                'name' => 'identifier',
                'type' => 'string',
                'label' => 'Identifier'
            ),
            array(
                'name' => 'user_id',
                'type' => 'fk',
                'label' => 'User'
            ),
            array(
                'name' => 'expiration',
                'type' => 'int',
                'label' => 'Expiration'
            )
        )
    ),
    'clients' => array(
        'pk' => 'client_id',
        'fk_name' => 'name',
        'label' => 'Clients',
        'foreign_keys' => array(
            'added_user_id' => 'users',
        ),
        'fields' => array(
            array(
                'name' => 'identifier',
                'type' => 'string',
                'label' => 'Identifier'
            ),
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Name'
            ),
            array(
                'name' => 'added_user_id',
                'type' => 'fk',
                'label' => 'User'
            ),
            array(
                'name' => 'time_added',
                'type' => 'string',
                'label' => 'Time Added'
            )
        )
    ),
    'controls' => array(
        'pk' => 'control_id',
        'fk_name' => 'name',
        'label' => 'Controls',
        'foreign_keys' => array(
            'control_endpoint_id' => 'endpoints',
            'control_template_id' => 'control_templates',
            'enum_id' => 'enums'
        ),
        'fields' => array(
            array(
                'name' => 'control_endpoint_id',
                'type' => 'fk',
                'label' => 'Control Endpoint'
            ),
            array(
                'name' => 'control_template_id',
                'type' => 'fk',
                'label' => 'Control Template'
            ),
            array(
                'name' => 'value',
                'type' => 'string',
                'label' => 'Value',
            ),
            array(
                'name' => 'enum_id',
                'type' => 'fk',
                'label' => 'Enum',
            ),
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Control Name'
            ),
            array(
                'name' => 'config',
                'type' => 'object',
                'label' => 'Config'
            )
        )
    ),
    'endpoints' => array(
        'pk' => 'control_endpoint_id',
        'fk_name' => 'name',
        'foreign_keys' => array(
            'endpoint_type_id' => 'endpoint_types',
        ),
        'label' => 'Control Endpoints',
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
                'name' => 'daemon_port',
                'type' => 'int',
                'label' => 'Daemon Port',
                'input_disabled' => true
            ),
            array(
                'name' => 'daemon_pid',
                'type' => 'int',
                'label' => 'Daemon Pid',
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
    'control_templates' => array(
        'pk' => 'control_template_id',
        'fk_name' => 'command',
        'label' => 'Control Templates',
        'foreign_keys'=> array(
            'enum_id' => 'enums',
            'endpoint_type_id' => 'endpoint_types'
        ),
        'fields' => array(
            array(
                'name' => 'endpoint_type_id',
                'type' => 'fk',
                'label' => 'Endpoint Type',
            ),
            array(
                'name' => 'name',
                'type' => 'string',
                'label' => 'Control Template Name'
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
                'name' => 'command',
                'type' => 'string',
                'label' => 'Command',
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
    ),
    'users' => array(
        'pk' => 'user_id',
        'fields' => array(
            array(
                'name' => 'glid',
                'type' => 'string',
                'label' => 'GLID'
            ),
            array(
                'name' => 'groups',
                'type' => 'string',
                'label' => 'Groups'
            ),
        )
    ),
);