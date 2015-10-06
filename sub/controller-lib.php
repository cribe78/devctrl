<?php

include(__DIR__ . "/schema.php");


$id_idx = 1;

$log = array();


function alertControlDaemon($control, $token = "POLL") {
    // Send a UDP message to a control daemon, alerting it to 
    // check the command queue for new commands

    $control_endpoints = getTableData("control_endpoints", true);

    $ce_id = $control['control_endpoint_id'];
    if (! isset($control_endpoints[$ce_id])) {
        serverError("control_endpoint $ce_id not found");
    }

    $ce = $control_endpoints[$ce_id];

    if (! $ce['enabled']) {
        return;
    }

    $port = $ce['daemon_port'];
    $pid = $ce['daemon_pid'];

    if ( $port == 0 ) {
        $ps = exec("ps $pid");
        if (preg_match("/pcontrol-daemon --ce=$/", $ps)) {
            pclog("{$ce['name']} daemon still starting... maybe next time");
            return;
        }
        else {
            pclog("process $pid not found, relaunching");
            launchControlDaemon($control);
            return;
        }
    }

    $fp = stream_socket_client("udp://127.0.0.1:$port", $errno, $errstr);
    if (! $fp) {
        pclog("{$ce['name']} could not connect to control daemon at port $port)");
        launchControlDaemon($control);
        return;
    }
    stream_set_timeout($fp, 2);

    fwrite($fp, $token);
    //pclog("$token sent to control daemon");
    $pollresp = fread($fp, 3);

    if ($pollresp == "ACK") {
        fclose($fp);
        //pclog("ACK received from control daemon");
        return;
    }
    pclog("{$ce['name']} NO ACK received (pid $pid)");

    launchControlDaemon($control);
}

/**
 * @param $sql string the sql statement to execute
 * @param $types string type identifier characters for bind
 * @param $params array array of references to bind values
 * @param null $conn
 */
function coe_mysqli_prepare_bind_execute($sql, $types, $params, $conn = null) {
    global $mysqli;

    if (! isset($conn)) {
        $conn = $mysqli;
    }

    $stmt = $conn->prepare($sql);

    if (! $stmt) {
        serverError("error preparing statement: $sql {$mysqli->error}");
    }

    $args = array($types);
    $args = array_merge($args, $params);
    if (! call_user_func_array(array($stmt, "bind_param"), $args)) {
        serverError("prepare_bind_execute bind_param error: {$stmt->error}");
    }

    if (! $stmt->execute()) {
        serverError("prepare_bind_execute execute error: {$stmt->error}");
    }
}

function devctrl_include_templates() {
    $dir = new RecursiveDirectoryIterator(dirname(__FILE__) . "/../ng/");
    $iterator = new RecursiveIteratorIterator($dir);

    foreach ($iterator as $path => $object) {
        if (is_file($path) && substr_compare($path, ".html", -5) === 0) {
            readfile($path);
        }
    }
}


function getCmdIdx() {
    global $mysqli;
    $add_idx = $mysqli->prepare(
        "insert into cmd_idxs () values ()");

    if (! $add_idx->execute()) {
        dwlog("insert cmd_idx error: $add_idx->error");
        return 0;
    }

    return $mysqli->insert_id;
}


function getID() {
    global $id_idx;
    $id = "id$id_idx";
    $id_idx++;

    return $id;
}

function getPathKeys() {
    $info = $_SERVER['PATH_INFO'];
    $info = preg_replace('/^\//', '', $info);  //strip a leading slash
    $keys = explode("/", $info);

    return $keys;
}

function getPostData() {
    $postdata = file_get_contents("php://input");
    $post = json_decode($postdata, true);

    return $post;
}

function getTableData($table, $use_cache = false, $where_cond = "") {
    global $mysqli;
    global $g_schema;
    $table = getTableName($table);

    if (! $table) {
        serverError("Error: {$_GET['table']} is not a valid table name");
    }

    static $cache = array();

    if ($use_cache && isset($cache[$table])) {
        return $cache[$table];
    }

    $res = $mysqli->query("select * from $table $where_cond");

    if (! $res) {
        serverError("select $table error: {$mysqli->error}");
    }

    $pk = $g_schema[$table]['pk'];
    $fields = $g_schema[$table]['fields'];

    $rows = array();
    while ($row  = $res->fetch_assoc()) {
        foreach ($fields as $field) {
            if (is_numeric($row[$field['name']]) && ($field['type'] != 'string' || $field['name'] == 'value')) {
                $row[$field['name']] = intval($row[$field['name']]);
            }
            elseif ($field['type'] == 'object') {
                $row[$field['name']] = json_decode($row[$field['name']]);
            }
        }

        $rows[$row[$pk]] = $row;
    }

    $cache[$table] = $rows;
    return $rows;
}

function getTableName($input) {
    global $g_schema;

    if (isset($g_schema[$input])) {
        return $input;
    }
}


function errorResponse($error, $response_code = 200) {
    global $resp;
    $resp['error'] = $error;
    pclog($error);

    jsonResponse($resp, $response_code);
}

function jsonResponse($response = "", $response_code = 200) {
    // By convention, use the global array $resp
    // to hold the json response
    global $resp;

    if (! $response) {
        $response = $resp;
    }

    if ($response_code === 500) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 500 Internal Server Error', true, 500);
    }

    header('Content-type: application/json');
    echo(json_encode($response));
    exit();
}

function launchControlDaemon($control) {
    global $mysqli;

    $control_endpoints = getTableData("control_endpoints", true);
    $ce_id  = $control['control_endpoint_id'];
    $ce = $control_endpoints[$ce_id];

    $process = exec("ps ax | grep \"pcontrol-daemon --ce=$ce_id\"");

    if (preg_match("/^(\d+)\s/", $process, $matches)) {
        exec("kill $matches[1]");
        pclog("pcontrol-daemon process $matches[1] killed");

        $delete_daemon = $mysqli->prepare(
            "update control_endpoints set daemon_pid = 0, daemon_port = 0 where control_endpoint_id = ? ");

        if (! $delete_daemon) {
            serverError("$ce_id update_endpoint prepare error: {$mysqli->error}");
        }

        $delete_daemon->bind_param('i', $ce_id);
        if (! $delete_daemon->execute()) {
            serverError("$ce_id update_endpoint execute error: {$delete_daemon->error}");
        }
    }

    if ($ce['enabled']) {
        $exec_str = __DIR__ . "/../pcontrol/pcontrol-daemon --ce=$ce_id";
        pclog("{$ce['name']} launching pcontrol-daemon: $exec_str");
        exec($exec_str);
    }
}


function paramTypeChar($paramType) {
    if ($paramType === 'int' || $paramType === 'bool' || $paramType === 'fk') {
        return 'i';
    }

    return 's';
}


$insert_log = '';

function pclog($msg) {
    error_log($msg);
}
    

function pingControlDaemons() {
    global $active_targets;
    foreach ($active_targets as $tt => $tna) {
        foreach ($tna as $tn => $tv) {
            alertControlDaemon($tt, $tn, "ALV?");
        }
    }
}

function setPControl($tt, $tn, $ct, $cn, $value) {
    if ($tt == 'proj' || 
        $tt == 'audio-onkyo' ||
        $tt == 'switcher-dxp' ||
        $tt == 'scaler' ) {
        queueCommand($tt, $tn, $ct, $cn, $value);
        alertControlDaemon($tt, $tn);
    }
    elseif ($tt === 'delay') {
        usleep($value);
    }
    else {
        pclog("setPControl: unhandled tt: $tt");
    }
}

function queueCommand($control) {
    global $mysqli;

    $queue_command = $mysqli->prepare(
        "insert into command_queue
        (control_id, status, value)
            value (?, 'QUEUED', ?)");

    $queue_command->bind_param('is', $control['control_id'], $control['value']);
    if (! $queue_command->execute()) {
        error_log("execute queue command error: {$mysqli->error}");
    }

    
    pclog("command queued: {$control['control_id']} : {$control['value']}");
}

function queueSlaveCommands($tt, $tn, $ct, $cn, $value) {
    global $mysqli;

    $fetch_slaves = $mysqli->prepare(
        "select s.target_type, s.target_num, s.command_type, s.command_name, s.value
            from slave_commands s
            inner join master_commands m
            on m.master_command_id = s.master_command_id
            where m.target_type = ?
            and m.target_num = ?
            and m.command_name = ?");

    if (! $fetch_slaves) {
        pclog("prepare fetch_slaves error: {$mysqli->error}");
        jsonResponse();
    }

    $fetch_slaves->bind_param('sis', $tt, $tn, $cn);

    if (! $fetch_slaves->execute()) {
        pclog("execute fetch_slaves error: {$mysqli->error}");
        jsonResponse();
    }

    $fetch_slaves->bind_result($stt, $stn, $sct, $scn, $svalue);
    $fetch_slaves->store_result();

    while ($fetch_slaves->fetch()) {
        $ett = $stt == NULL ? $tt : $stt;
        $etn = $stn == NULL ? $tn : $stn;
        $ect = $sct == NULL ? $ct : $sct;
        $ecn = $scn == NULL ? $cn : $scn;
        $evalue = $svalue == NULL ? $value : $svalue;

        queueCommand($ett, $etn, $ect, $ecn, $evalue);
    }
}



/*
 * Given the name of a table and an array containing a row of data,
 * construct a value representing the primary key
 */
function rowPrimaryKey($table, $row) {
    global $g_schema;

    if (! isset($g_schema[$table]['pk'])) {
        serverError("rowPrimaryKey: No primary key set for $table");
    }

    $pk = $g_schema[$table]['pk'];

    if (is_string($pk)) {
        return $row[$pk];
    }
    elseif (is_array($pk)) {
        $pks = array();
        foreach ($pk as $column) {
            $pks[] = $row[$column];
        }

        $pk_str = implode(".", $pks);

        return $pk_str;
    }
    else {
        serverError("rowPrimaryKey: Primary key type not identified for $table");
    }
}

function sanitizeId($id) {
    return strval(intval($id));
}

function serverError($message) {
    errorResponse($message, 500);
}


function syncControls() {
    global $mysqli;

    $control_endpoints = getTableData('control_endpoints');
    $control_templates = getTableData('control_templates');

    $controls = getTableData('controls');

    // Index controls by endpoint and template
    $c_lut = array();

    foreach($controls as $c_id => $row) {
        $cei = $row['control_endpoint_id'];
        $cti = $row['control_template_id'];

        if (! isset($c_lut[$cei])) {
            $c_lut[$cei] = array();
        }
        if (! isset($c_lut[$cei][$cti])) {
            $c_lut[$cei][$cti] = array();
        }

        $c_lut[$cei][$cti][$c_id] = $row;
    }

    // Index templates by endpoint_type
    $ct_lut = array();
    foreach ($control_templates as $ct_id => $row) {
        $eti = $row['endpoint_type_id'];
        if (! isset($ct_lut[$eti])) {
            $ct_lut[$eti] = array();
        }

        $ct_lut[$eti][$ct_id] = $row;
    }


    // Prepare insert statement
    $insert_stmt = $mysqli->prepare("insert into controls
        (control_template_id, control_endpoint_id, enum_id, name)
        values (?, ?, ?, ?)");

    $ei = '';
    $name = '';
    $insert_stmt->bind_param('iiis', $cti, $cei, $ei, $name);

    // Check that all combinations of endpoint and template exist
    foreach ($control_endpoints as $cei => $ce_row) {
        $eti = $ce_row['endpoint_type_id'];
        if (isset($ct_lut[$eti])) {
            foreach ($ct_lut[$eti] as $cti => $ct_row) {
                // Lookup if a control is already defined for this ce/ct pair
                if (! (isset($c_lut[$cei]) && isset($c_lut[$cei][$cti]))) {
                    $ei = $ct_row['enum_id'];
                    $name = $ce_row['name'] . " : " . $ct_row['name'];
                    if (! $insert_stmt->execute()) {
                        serverError("insert control error: {$mysqli->error}");
                    }
                }
            }
        }
    }
}







    

