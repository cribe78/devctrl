<?php
$ctx = "json";
require("sub/head.php");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $resp['schema'] = $g_schema;

    jsonResponse($resp);
}
