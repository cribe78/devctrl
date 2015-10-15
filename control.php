<?php
$ctx = "json";
require("sub/head.php");

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $path_key = getPathKeys();
    $post_data = getPostData();

    $pc_id = $path_key[0];
    $control = $post_data;
    $control['control_id'] = $pc_id;

    queueCommand($control);
    alertControlDaemon($control['control_endpoint_id']);

    jsonResponse();
}

errorResponse("Request method {$_SERVER['REQUEST_METHOD']} not supported for this resource", 400);