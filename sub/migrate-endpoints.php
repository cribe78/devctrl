<?php
if (php_sapi_name() !== 'cli') {
    print "This script may only be called from the command line\n";
    exit();
}

include(__DIR__ . "/config.php");
require("controller-lib.php");

$db = getMongoDb();


$endpoints = getTableDataMongo("control_endpoints", array());


foreach ($endpoints as $ep_id => $ep) {
    $db->endpoints->insert($ep);
}