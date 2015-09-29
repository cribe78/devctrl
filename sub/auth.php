<?php
include(__DIR__ . "/../vendor/autoload.php");
use OAuth\OAuth2\Service\Locus;
use OAuth\Common\Storage\Session;
use OAuth\Common\Consumer\Credentials;

session_start();



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
    //Perform login via locus oauth2
    $storage = new Session();
    $credentials = new Credentials(
        $g_oauth_client,
        $g_oauth_secret,
        $g_base_url . "index.php");

    $serviceFactory = new \OAuth\ServiceFactory();
    /** @var $locusService Locus */
    $locusService = $serviceFactory->createService('locus',
        $credentials,
        $storage,
        array('profile', 'openid', 'email'));

    if (! empty($_GET['code'])) {
        // retrieve the CSRF state parameter
        $state = isset($_GET['state']) ? $_GET['state'] : null;

        // This was a callback request from google, get the token
        $locusService->requestAccessToken($_GET['code'], $state);

        // Send a request with it
        $result = json_decode($locusService->request('userinfo'), true);

        if (!$result) {
            errorResponse("Unauthorized", 401);
        }
        //Do something with userinfo
        $select_user = $mysqli->prepare(
            "select user_id, glid, groups from users where glid = ?"
        );

        if (! $select_user) {
            errorResponse("prepare select_user error: {$mysqli->error}");
        }

        $glid = $result['preferred_username'];
        $groups = $result['groups'];
        $select_user->bind_param('s', $glid);

        if (! $select_user->execute()) {
            errorResponse("select_user error {$select_user->error}");
        }

        $res = $select_user->get_result();

        // Create/update user record
        $user_id = false;
        if ($row = $res->fetch_assoc()) {
            $user_id = $row['user_id'];
        }

        if ($user_id) {
            coe_mysqli_prepare_bind_execute(
                "update users set glid = ?, groups = ? where user_id = ?",
                'ssi',
                array( &$glid, &$groups, &$user_id)
            );
        }
        else {
            coe_mysqli_prepare_bind_execute(
                "insert into users (glid, groups) values (?, ?)",
                'ss',
                array( &$glid, &$groups)
            );

            $user_id = $mysqli->insert_id;
        }

        // Update client record
        coe_mysqli_prepare_bind_execute(
            "update clients set added_user_id = ?",
            'i',
            array(&$user_id)
        );

        $logged_in = 1;

        if (groupsHasClientAccess($result['groups'])) {
            $client_access = 1;
        }

    }
    elseif (!empty($_GET['error'])) {
        errorResponse($_GET['error'], 401);
    }
    else {
        $url = $locusService->getAuthorizationUri();
        header('Location: ' . $url);
        exit();
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
