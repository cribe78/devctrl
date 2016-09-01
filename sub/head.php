<?php
include(__DIR__ . "/config.php");


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