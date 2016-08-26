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

require("controller-lib.php");

$tablename = $argv[1];

$data = getTableData($tablename);
$db = getMongoDb();
$table = $db->$tablename;



foreach ($data as $id => $record) {
    $doc = array();

    $table->insert($record);
}