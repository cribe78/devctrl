<?php
$ctx = "json";
require("sub/head.php");

if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $path_key = getPathKeys();
    $post_data = getPostData();

    $pc_id = sanitizeId($path_key[0]);

    $controls = getTableData("controls", true, "where control_id = $pc_id");

    $control = $controls[$pc_id];
    $prev_value = $control['value'];
    $control['value'] = $post_data['value'];

    $update = array( 'add' => array( 'control_log' => array()));
    $changeRecord = logControlChange($pc_id, $control['value'], $prev_value);
    $update['add']['control_log'][$changeRecord['_id']] = $changeRecord;

    queueCommand($control);
    alertControlDaemon($control['control_endpoint_id']);

    publishDataUpdate($update);
    jsonResponse();
}

errorResponse("Request method {$_SERVER['REQUEST_METHOD']} not supported for this resource", 400);