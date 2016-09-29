<?php
$ctx = "json";
require("sub/head.php");
checkpoint("post head");
$db = getMongoDb();

errorResponse("You can't use this no more");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $table = isset($_GET['table']) ? $_GET['table'] : false;

    if (! $table) {
        error_log("path info: " . $_SERVER['PATH_INFO']);
        $keys = getPathKeys();
        $table = $keys[0];
    }

    $tableName = getTableName($table);

    if (! $table) {
        serverError("Error: $table is not a valid table name");
    }
    $table = $tableName;

    $rows = getTableData($table);

    checkpoint("data fetched");
    $resp['add'] = array ( $table => $rows);
    $resp['checkpoints'] = $checkpoints;
    jsonResponse($resp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    adminAuthCheck(true);
    $post = getPostData();
    $table = getTableName($post['tableName']);

    if (! $table) {
        serverError("Error: {$post['tableName']} is not a valid table name");
    }


    $doc = $post['fields'];
    $doc['_id'] = strval(new MongoId());
    $db->$table->insert($doc);

    $id = $doc['_id'];
    $row = getTableData($table, false, array("_id" => $id));

    $resp['add'] = array($table => $row);

    logDataChange($table, $id, "added ($log_values)");

    // Special cases where more actions are needed
    if ($table == 'endpoints' || $table == 'control_templates') {
        syncControls();
        $resp['add']['controls'] = getTableData('controls');
    }

    $update = array( 'add' => $resp['add']);

    publishDataUpdate($update);
    jsonResponse($resp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    adminAuthCheck(true);
    $keys = getPathKeys();
    $post = getPostData();

    $table = getTableName($keys[0]);
    $id = sanitizeId($keys[1]);

    unset($post['_id']);  // MongoDB doesn't support updating the primary key
    $db->$table->update(array("_id" => $id), array( '$set' => $post));

    logDataChange($table, $id, "updated");

    $row = getTableData($table, false, array("_id" => $id));

    $resp['add'] = array($table => $row);
    $update = array( 'add' => $resp['add']);
    publishDataUpdate($update);
    jsonResponse($resp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    adminAuthCheck(true);
    $keys = getPathKeys();

    $table = getTableName($keys[0]);

    $id = sanitizeId($keys[1]);

    $db->$table->remove(array("_id" => $id));

    error_log("record $id deleted from $table");
    logDataChange($table, $id, "deleted");

    $objs = array( $table => array( $id => ''));

    $resp['delete'] = $objs;
    $update  = array('delete' => $objs);
    publishDataUpdate($update);
    jsonResponse($resp);
}

serverError("reached end of data.php without returning");