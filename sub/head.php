<?php
include(__DIR__ . "/config.php");

/**
$mysqli  = mysqli_connect($g_db_host, $g_db_user, $g_db_pass, $g_db_schema);
if (mysqli_connect_errno($mysqli)) {
    error_log("Failed to connect to MySQL: " . mysqli_connect_error());
    exit();
}
**/


// Use $ctx to determine what kind of document we will be returning
if (! isset($ctx)) {
    $ctx = "html";
    if (preg_match("/\.json$/", $_SERVER['PHP_SELF'])) {
        $ctx = "json";
    }
}

require("controller-lib.php");
checkpoint("start");
require(__DIR__ . "/auth.php");


// Define the $resp global array
$resp = array("status" => 0);