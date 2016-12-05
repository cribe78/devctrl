<?php
if (php_sapi_name() !== 'cli') {
    print "This script may only be called from the command line\n";
    exit();
}


include(__DIR__ . "/config.php");
$mysqli  = mysqli_connect($g_db_host, $g_db_user, $g_db_pass, $g_db_schema);
if (mysqli_connect_errno($mysqli)) {
    error_log("Failed to connect to MySQL: " . mysqli_connect_error());
    exit();
}

// Use $ctx to determine what kind of document we will be returning
$ctx = "json";
require("controller-lib.php");

$endpoints = getTableData('endpoints');

foreach ($endpoints as $ce_id => $endpoint) {
    alertControlDaemon($ce_id, 'ALV?');
}

sleep(5);

// Get updated endpoints
$endpoints = getTableData('endpoints');

$resp = array( 'add' =>
    array(
        'endpoints' => $endpoints
    )
);

echo(json_encode($resp));