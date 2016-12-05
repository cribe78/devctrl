<?php
$ctx = "json";
require("sub/head.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $lines = file($g_log_file);
    $linecount = count($lines);

    $firstline = $linecount > 500 ? $linecount - 500 : 0;

    $resp['applog'] = array();

    for($idx = $firstline; $idx < $linecount; $idx++) {
        $resp['applog'][] = rtrim($lines[$idx]);
    }

    jsonResponse();
}

errorResponse("Request method {$_SERVER['REQUEST_METHOD']} not supported for this resource", 400);