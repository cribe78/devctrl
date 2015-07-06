<?php
session_start();

include("/var/www/html/locus.education.ufl.edu/coe_shib_proxy.php");

$logged_in = 0;
$client_access = 0;
$admin_access = 0;
$client_expiration = time() + 60 * 60 * 24 * 365; // another year

$identifier = 'nouser';

if (isset($_COOKIE['identifier'])) {
    $identifier = $_COOKIE['identifier'];
}

$public = isset($public) ? $public : false;

$USESSION = array();

// Client authentication
if ($identifier != 'nouser') {
    $select_user = $mysqli->prepare(
        "select users.user_id, users.glid, users.groups,
                clients.client_id, clients.name
                from clients
                left join users on clients.added_user_id = users.user_id
                where clients.identifier = ?");
    if (! $select_user)
        errorResponse("prepare select_user error: {$mysqli->error}");

    pclog(LOG_INFO, "loading session $identifier");

    $select_user->bind_param('s', $identifier);
    if (! $select_user->execute())
        errorResponse("select_user error: {$mysqli->error}");

    $res = $select_user->get_result();

    if ($row = $res->fetch_assoc()) {
        $USESSION['client_id'] = $row['client_id'];
        $USESSION['user_id'] = $row['user_id'];
        $USESSION['glid'] = $row['glid'];
        $USESSION['name'] = $row['name'];
        $USESSION['identifier'] = $identifier;
        $USESSION['groups'] = $row['groups'];

        if ($row['user_id']) {
            $logged_in = 1;
        }

        if (groupsHasClientAccess($USESSION['groups'])) {
            $client_access = 1;
        }
    }
}
else {
    //TODO: add new client record
    $insert_client = $mysqli->prepare(
        "insert into clients (identifier, name) value (?, ?)"
    );

    if (! $insert_client) {
        errorResponse("prepare insert_client error: {$mysqli->error}");
    }

    $insert_client->bind_param('ss', $identifier, $client_name);

    $client_name = $_SERVER['REMOTE_ADDR'];
    $identifier = uniqid();

    if (! $insert_client->execute()) {
        errorResponse("insert_client error: {$insert_client->error}");
    }

    $USESSION['client_id'] = $mysqli->insert_id;
    $USESSION['identifier'] = $identifier;
}

setcookie('identifier', $identifier, $client_expiration, "/");

$admin_identifier = '';

// Admin authentication
if ($admin_identifier) {
    $update_session = $mysqli->prepare(
        "update sessions set expiration = ? where identifier = ?");
    if (!$update_session)
        errorResponse("prepare update_session error: {$mysql->error}");

    $update_session->bind_param('is', $new_expiration, $identifier);
    if (!$update_session->execute())
        errorResponse("update_session error: {$mysqli->error}");
}


if (! ($logged_in || $public)) {
    $login = coe_shib_proxy_auth_url( $identifier, $g_base_url . "shibid.php", $g_base_url . $_SERVER['REQUEST_URI']);

    if ( $ctx == 'html' )  {
        $_SESSION['request'] = $_SERVER['REQUEST_URI'];

        header("Location: $login");
        exit();
    }
    else {
        errorResponse("Unauthorized", 401);
    }
}

if (! ($public || $client_access)) {
    errorResponse("Unauthorized", 401);
}


function groupsHasClientAccess($groupsStr) {
    $authorized_groups = array(
        'CFA-Digital Worlds Institute-Staff Users',
        'COE-L-ETC'
    );

    $groups_long = explode(";", $groupsStr);

    $groups = array();

    foreach($groups_long as $group_long) {
        $parts = explode(",", $group_long);
        if (strpos($parts[0], "CN=") === 0) {
            $groups[] = substr($parts[0], 3);
        }
    }

    foreach ($authorized_groups as $group) {
        if (array_search($group, $groups) !== false) {
            return true;
        }
    }

    return false;
}

?>
