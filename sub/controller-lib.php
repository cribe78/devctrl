<?php

include(__DIR__ . "/schema.php");


$id_idx = 1;

$log = array();


function adminAuthCheck($do_logon = false) {
    //global $mysqli;
    global $resp;
    global $USESSION;

    $db = getMongoDb();

    $admin_identifier = '';

    if (isset($_COOKIE['admin_identifier'])) {
        $admin_identifier = $_COOKIE['admin_identifier'];
    }

    $resp['user'] = array(
        'username' => null,
        'admin' => false,
        'client_id' => $USESSION['client_id']);

    // Admin authentication
    if ($admin_identifier) {
        /**
        $select_admin = $mysqli->prepare(
            "select users.user_id, users.glid, users.groups,
                admin_sessions.admin_session_id, admin_sessions.expiration
                from admin_sessions
                left join users on admin_sessions.user_id = users.user_id
                where admin_sessions.identifier = ?");
        if (! $select_admin)
            errorResponse("prepare select_admin error: {$mysqli->error}");

        error_log("loading admin session $admin_identifier");

        $select_admin->bind_param('s', $admin_identifier);
        if (! $select_admin->execute())
            errorResponse("select_admin error: {$mysqli->error}");

        $res = $select_admin->get_result();
        **/

        $admin_session = $db->admin_sessions->findOne(array("identifier" => $admin_identifier));

        if (! $admin_session) {
            if ($do_logon) {
                adminAuthSetIdAndRedirect();
            }

            return false;
        }

        $admin_user = array('_id' => null);
        if (isset($admin_session['user_id'])) {
            $admin_user = $db->users->findOne(array("_id" => $admin_session['user_id']));
        }

        if ($admin_user['_id'] == null) {
            if ($do_logon) {
                /* @var $locusService OAuth\OAuth2\Service\Locus */
                $locusService = getLocusService();
                $resp['location'] = (string)$locusService->getAuthorizationUri();

                if (! $resp['location']) {
                    errorResponse("failed to get authorization URI (2)");
                }

                errorResponse("Admin login required", 401);
            }

            return false;
        }

        if (time() > $admin_session['expiration']) {
            if ($do_logon) {
                errorResponse("Admin authorization expired {$admin_user['glid']}", 401);
            }

            return false;
        }

        $resp['user']['username'] = $admin_user['glid'];

        if (! groupsHasAdminAccess($admin_user['groups'])) {
            if ($do_logon) {
                errorResponse("Insufficient access for user {$admin_user['glid']}", 401);
            }

            return false;
        }

        $new_expiration = time() + 60 * 60; // another hour


        $db->admin_sessions->update(
            array("_id" => $admin_identifier),
            array( '$set' => array("expiration" => $new_expiration))
        );
        /**
        coe_mysqli_prepare_bind_execute(
            "update admin_sessions set expiration = ? where identifier = ?",
            'is',
            array(&$new_expiration, &$admin_identifier));

         * */

        setcookie('admin_identifier', $admin_identifier, $new_expiration, "/");

        $resp['user']['admin'] = true;
        return true;
    }
    else {
        if ($do_logon) {
            adminAuthSetIdAndRedirect();
        }

        return false;
    }
}

function adminAuthSetIdAndRedirect() {
    global $resp;
    $db = getMongoDb();

    $admin_identifier = uniqid();
    $admin_expire = time() + 60 * 60;
    setcookie('admin_identifier', $admin_identifier, $admin_expire, "/");

    /**
    coe_mysqli_prepare_bind_execute(
        "insert into admin_sessions (identifier, expiration) values (?, ?)",
        'si',
        array(&$admin_identifier, &$admin_expire));
     * */

    $db->admin_sessions->insert(array(
        "_id" => strval(new MongoId()),
        "identifier" => $admin_identifier,
        "expiration" => $admin_expire
    ));

    $locusService = getLocusService();
    $resp['location'] = (string)$locusService->getAuthorizationUri();

    if (! $resp['location']) {
        errorResponse("failed to get authorization URI");
    }

    errorResponse("Admin login required", 401);
}

function alertControlDaemon($ce_id, $token = "POLL") {
    // Send a UDP message to a control daemon, alerting it to 
    // check the command queue for new commands

    $endpoints = getTableData("endpoints", true);

    if (! isset($endpoints[$ce_id])) {
        serverError("endpoint $ce_id not found");
    }

    $ce = $endpoints[$ce_id];

    if (! $ce['enabled']) {
        return;
    }

    $port = $ce['daemon_port'];
    $pid = $ce['daemon_pid'];

    if ( $port == 0 ) {
        $ps = exec("ps $pid");
        if (preg_match("/pcontrol-daemon --ce=$/", $ps)) {
            error_log("{$ce['name']} daemon still starting... maybe next time");
            return;
        }
        else {
            error_log("process $pid not found, relaunching");
            launchControlDaemon($ce_id);
            return;
        }
    }

    $fp = stream_socket_client("udp://127.0.0.1:$port", $errno, $errstr);
    if (! $fp) {
        error_log("{$ce['name']} could not connect to control daemon at port $port)");
        launchControlDaemon($ce_id);
        return;
    }
    stream_set_timeout($fp, 2);

    fwrite($fp, $token);
    //error_log("$token sent to control daemon");
    $pollresp = fread($fp, 3);

    if ($pollresp == "ACK") {
        fclose($fp);
        //error_log("ACK received from control daemon");
        return;
    }
    error_log("{$ce['name']} NO ACK received (pid $pid)");

    launchControlDaemon($ce_id);
}

$checkpoints = array();

function checkpoint($msg) {
    global $checkpoints;
    static $starttime = 0;

    if (! $starttime) $starttime = microtime(true);

    $elapsed = microtime(true) - $starttime;
    $elapsed = floor($elapsed * 1000);
    $checkpoints[] = "{$elapsed}ms : $msg";
}
/**
 * @param $sql string the sql statement to execute
 * @param $types string type identifier characters for bind
 * @param $params array array of references to bind values
 * @param null $conn
 */
/**
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
 * */

function devctrl_include_templates() {
    $dir = new RecursiveDirectoryIterator(dirname(__FILE__) . "/../ng/");
    $iterator = new RecursiveIteratorIterator($dir);

    foreach ($iterator as $path => $object) {
        if (is_file($path) && substr_compare($path, ".html", -5) === 0) {
            readfile($path);
        }
    }
}


function getLocusService() {
    global $g_oauth_client;
    global $g_oauth_secret;
    global $g_base_url;

    static $locusService = false;

    if ($locusService) {
        return $locusService;
    }

    //Perform login via locus oauth2
    $storage = new OAuth\Common\Storage\Session();
    $credentials = new OAuth\Common\Consumer\Credentials(
        $g_oauth_client,
        $g_oauth_secret,
        $g_base_url . "index.php");

    $serviceFactory = new \OAuth\ServiceFactory();
    /** @var $locusService Locus */
    $locusService = $serviceFactory->createService('locus',
        $credentials,
        $storage,
        array('profile', 'openid', 'email'));

    return $locusService;
}

function getMongoDb() {
    global $g_mongodb;
    static $m = false;

    if (! $m) {
        $m = new MongoClient();
    }

    $db = $m->$g_mongodb;

    return $db;
}

function getPathKeys() {
    $info = $_SERVER['PATH_INFO'];
    $info = preg_replace('/^\//', '', $info);  //strip a leading slash
    $keys = explode("/", $info);

    return $keys;
}

function getPostData() {
    $postdata = file_get_contents("php://input");

    //error_log("post data: $postdata");
    $post = json_decode($postdata, true);

    return $post;
}

function getTableData($table, $use_cache = false, $where_cond = "") {
    //global $mysqli;
    global $g_schema;
    $table = getTableName($table);
    return getTableDataMongo($table, $where_cond);
}

function getTableDataMysql($table, $use_cache = false, $where_cond = "") {
    global $mysqli;
    global $g_schema;

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

function getTableDataMongo($collection, $query) {
    $db = getMongoDb();

    if ($query == "") {
        $query = array();
    }

    $cursor = $db->$collection->find($query);

    $rows = array();

    foreach ($cursor as $doc) {
        $rows[strval($doc["_id"])] = $doc;
    }

    return $rows;
}


function getTableName($input) {
    global $g_schema;

    if (isset($g_schema[$input])) {
        return $input;
    }
}

function getTableType($name) {
    global $g_schema;

    if (isset($g_schema[$name]['db'])) {
        return $g_schema[$name]['db'];
    }

    return 'mongo';
}

function groupsHasAdminAccess($groupsStr) {
    return groupsStringHasGroups(
        $groupsStr,
        array('DW-FS-ADMIN', 'DW-WS-ADMINS')
    );
}

function groupsHasClientAccess($groupsStr) {
    return groupsStringHasGroups(
        $groupsStr,
        array('CFA-Digital Worlds Institute-Staff Users',
            'COE-L-ETC',
            'DW-WS-ADMINS')
    );
}


/**
 * @param $groupsStr string  A shibboleth UFADGroupsDN string of group names
 * @param $groupsArray array An array of individual groups. If one or more match the groupsStr, return true
 *
 * @return bool Whether the $groupsStr matches a member of the $groupsArray
 */

function groupsStringHasGroups($groupsStr, $groupsArray) {
    $groups_long = explode(";", $groupsStr);

    $groups = array();

    foreach($groups_long as $group_long) {
        $parts = explode(",", $group_long);
        if (strpos($parts[0], "CN=") === 0) {
            $groups[] = substr($parts[0], 3);
        }
    }

    foreach ($groupsArray as $group) {
        if (array_search($group, $groups) !== false) {
            return true;
        }
    }

    return false;
}


function groupsStripOUDC($groupsStr) {
    $groups_long = explode(";", $groupsStr);

    $groups = array();

    foreach($groups_long as $group_long) {
        $parts = explode(",", $group_long);
        if (strpos($parts[0], "CN=") === 0) {
            $groups[] = $parts[0];
        }
    }

    $res = implode(";", $groups);
    return $res;
}


function errorResponse($error, $response_code = 200) {
    global $resp;
    $resp['error'] = $error;
    error_log($error);

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
    elseif ($response_code === 401) {
        header($_SERVER['SERVER_PROTOCOL'] . ' 401 Unauthorized', true, 401);
    }

    header('Content-type: application/json');

    $response = stringifyMongoIds($response);
    echo(json_encode($response));
    exit();
}

function launchControlDaemon($ce_id) {
    $db = getMongoDb();

    $endpoints = getTableData("endpoints", true);
    $ce = $endpoints[$ce_id];
    $status = "disabled";

    /**
    $update_endpoint = $mysqli->prepare(
        "update control_endpoints set status = ?, daemon_pid = 0, daemon_port = 0 where control_endpoint_id = ? ");

    if (! $update_endpoint) {
        serverError("$ce_id update_endpoint prepare error: {$mysqli->error}");
    }

    $update_endpoint->bind_param('si', $status, $ce_id);
    */

    $process = exec("ps ax | grep \"pcontrol-daemon --ce=$ce_id\"");

    if (preg_match("/^(\d+)\s/", $process, $matches)) {
        exec("kill $matches[1]");
        error_log("pcontrol-daemon process $matches[1] killed");
    }

    if ($ce['enabled']) {
        $exec_str = __DIR__ . "/../pcontrol/pcontrol-daemon --ce=$ce_id";
        error_log("{$ce['name']} launching pcontrol-daemon: $exec_str");
        exec($exec_str);
        $status = "launched";
    }

    $db->endpoints->update(
        array("_id" => $ce_id),
        array( '$set' =>
            array(
                "status" => $status,
                "daemon_pid" => 0,
                "daemon_port" => 0
            )
        )
    );

    /**
    if (! $update_endpoint->execute()) {
        serverError("$ce_id update_endpoint execute error: {$update_endpoint->error}");
    }
     * */
}

function logControlChange($control_id, $new_value, $previous_value) {
    global $USESSION;

    $db = getMongoDb();
    $control_log = $db->control_log;

    $logdoc = array(
        "_id" => strval(new MongoId()),
        "control_id" => $control_id,
        "new_value" => $new_value,
        "old_value" => $previous_value,
        "client_id" => $USESSION['client_id'],
        "ts" => new MongoDate()
    );

    $control_log->insert($logdoc);

    return $logdoc;
}

function logDataChange($table, $pk, $action) {
    global $USESSION;
    static $log_opened = false;

    if (! $log_opened) {
        openlog("devctrl", LOG_PID, LOG_LOCAL4);
    }

    syslog(LOG_INFO, $table . "[$pk] $action by {$USESSION['name']}");
}


function paramTypeChar($paramType) {
    if ($paramType === 'int' || $paramType === 'bool' || $paramType === 'fk') {
        return 'i';
    }

    return 's';
}


function publishDataUpdate($update) {
    global $g_messenger_host;
    global $g_messenger_port;

    $socket = socket_create(AF_INET, SOCK_STREAM, SOL_TCP);

    $result = socket_connect($socket, $g_messenger_host, $g_messenger_port);
    if (! $result) {
        error_log("failed to connect to messenger server");
        return;
    }

    $message = json_encode($update);

    socket_write($socket, $message, strlen($message));
    socket_close($socket);
}

$insert_log = '';



function sanitizeId($id) {
    return $id;  //strval(intval($id));
}

function serverError($message) {
    errorResponse($message, 500);
}


function stringifyMongoIds($arr) {
    foreach ($arr as $key => $val) {
        if (is_object($val) && get_class($val) == 'MongoId') {
            $arr[$key] = strval($val);
        }
        if (is_array($val)) {
            $arr[$key] = stringifyMongoIds($val);
        }
    }

    return $arr;
}

function syncControls() {
    //global $mysqli;
    $db = getMongoDb();

    $endpoints = getTableData('endpoints');
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



    // Check that all combinations of endpoint and template exist
    foreach ($endpoints as $cei => $ce_row) {
        $eti = $ce_row['endpoint_type_id'];
        if (isset($ct_lut[$eti])) {
            foreach ($ct_lut[$eti] as $cti => $ct_row) {
                // Lookup if a control is already defined for this ce/ct pair
                if (! (isset($c_lut[$cei]) && isset($c_lut[$cei][$cti]))) {
                    $control = array(
                        '_id' => strval(new MongoId()),
                        'control_template_id' => $cti,
                        'control_endpoint_id' => $cei,
                        'enum_id' => $ct_row['enum_id'],
                        'name' => ''
                    );

                    if (! $db->controls->insert($control)) {
                        serverError("insert control error");
                    }
                }
            }
        }
    }
}







    

