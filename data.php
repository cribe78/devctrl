<?php
$ctx = "json";
require("sub/head.php");
checkpoint("post head");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $table = getTableName($_GET['table']);

    if (! $table) {
        serverError("Error: {$_GET['table']} is not a valid table name");
    }

    $rows = getTableData($table);

    checkpoint("data fetched");
    $resp['add'] = array ( $table => $rows);
    $resp['checkpoints'] = $checkpoints;
    jsonResponse($resp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    adminAuthCheck();
    $post = getPostData();
    $table = getTableName($post['tableName']);

    if (! $table) {
        serverError("Error: {$post['tableName']} is not a valid table name");
    }

    $fields = $g_schema[$table]['fields'];

    $values = array();
    $types = '';
    $qs = array();
    $log_values = '';
    foreach ($fields as $field) {
        if (isset($post['fields'][$field['name']])) {
            if ($field['type'] == 'object') {
                $post['fields'][$field['name']] = json_encode($post['fields'][$field['name']]);
            }

            $values[$field['name']] = &$post['fields'][$field['name']];
            $qs[] = '?';

            $log_values .= "{$field['name']} = {$post['fields'][$field['name']]}, ";

            $types .= paramTypeChar($field['type']);
        }
    }

    $insert_query = "insert into $table ("
                . implode(",", array_keys($values))
                . ") values ("
                . implode(",", $qs) . ")";

    coe_mysqli_prepare_bind_execute($insert_query, $types, $values);

    $id = $mysqli->insert_id;
    $pk = $g_schema[$table]['pk'];
    $row = getTableData($table, false, "where $pk = $id");

    $resp['add'] = array($table => $row);

    logDataChange($table, $id, "added ($log_values)");

    // Special cases where more actions are needed
    if ($table == 'control_endpoints' || $table == 'control_templates') {
        syncControls();
        $resp['add']['controls'] = getTableData('controls');
    }

    jsonResponse($resp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    adminAuthCheck();
    $keys = getPathKeys();
    $post = getPostData();

    $table = getTableName($keys[0]);
    $id = sanitizeId($keys[1]);
    $schema = $g_schema[$keys[0]];
    $pk = $schema['pk'];

    if (! is_string($pk)) {
        errorResponse("updates on multikey tables not implemented", 400);
    }

    $values = array();
    $types = '';
    $description = '';
    foreach ($schema['fields'] as $field) {
        if (isset($post[$field['name']])) {
            if ($field['type'] == 'object') {
                $post[$field['name']] = json_encode($post[$field['name']]);
            }

            $values[] = &$post[$field['name']];
            $terms[] = "{$field['name']} = ?";

            $description .= "{$field['name']} = {$post[$field['name']]}, ";

            $types .= paramTypeChar($field['type']);
        }
    }

    $values[] = &$id;
    $types .= 'i';

    $update_query = "update $table set "
        . implode(", ", $terms)
        . " where $pk = ?";

    coe_mysqli_prepare_bind_execute($update_query, $types, $values);

    logDataChange($table, $id, "updated ($description)");

    $row = getTableData($table, false, "where $pk = $id");

    $resp['add'] = array($table => $row);
    jsonResponse($resp);
}
elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    adminAuthCheck();
    $keys = getPathKeys();

    $table = getTableName($keys[0]);
    $schema = $g_schema[$table];
    $id = sanitizeId($keys[1]);
    $pk = $schema['pk'];

    $delete_sql = "delete from $table where $pk = ?";

    coe_mysqli_prepare_bind_execute($delete_sql, 'i', array(&$id));

    error_log("record $id deleted from $table");
    logDataChange($table, $id, "deleted");

    $objs = array( $table => array( $id => ''));

    $resp['delete'] = $objs;
    jsonResponse($resp);
}

serverError("reached end of data.php without returning");