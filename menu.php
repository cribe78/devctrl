<?php
$ctx = "json";
require("sub/head.php");

$config_tables = array();

foreach ($g_schema as $table_name => $table) {
    $config_tables[] = array(
        "text" => $table['label'],
        "state" => array(
            'name' => "root.config.table",
            'params' => array(
                'table' => $table_name
            )
        )
    );
}

$room_rows  = getTableData('rooms');
$rooms = array();

foreach ($room_rows as $room_id => $row) {
    $rooms[] = array(
        "text" => $row['name'],
        "state" => array(
            'name' => "root.room",
            'params' => array(
                'name' =>  $row['name']
            )
        )
    );
}



$resp['menu'] = array(
    "items" => array(
        array(
            "text" => "Locations",
            "state" => "root.rooms",
            "submenu" => $rooms
        ),
        array(
            "text" => "Configuration",
            "state" => "root.config.all",
            "submenu" => $config_tables
        )
    )
);

jsonResponse($resp);