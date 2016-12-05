<?php
require(__DIR__ . "/../vendor/autoload.php");

session_start();

$logged_in = 0;
$client_access = 0;
$admin_access = 0;
$client_expiration = time() + 60 * 60 * 24 * 365; // another year

$identifier = 'nouser';

if (isset($_COOKIE['identifier'])) {
    $identifier = $_COOKIE['identifier'];
    $identifier_set = true;
}

$public = isset($public) ? $public : false;

$USESSION = array();
$db = getMongoDb();

error_log("identifier: $identifier, query string: {$_SERVER['QUERY_STRING']}");

// Client authentication
if ($identifier != 'nouser') {
    //error_log("loading session $identifier");
    $client = $db->clients->findOne(array("identifier" => $identifier));

    if ($client) {
        $user = $db->users->findOne(array("_id" => $client['added_user_id']));
        if (! $user) {
            $user = array('_id' => NULL, 'glid' => '', 'groups' => '');
        }

        $USESSION['client_id'] = $client['_id'];
        $USESSION['user_id'] = $user['_id'];
        $USESSION['name'] = $client['name'];
        $USESSION['identifier'] = $identifier;

        $USESSION['glid'] = $user['glid'];
        $USESSION['groups'] = $user['groups'];

        if ($user['_id']) {
            $logged_in = 1;
        }

        if (groupsHasClientAccess($USESSION['groups'])) {
            $client_access = 1;
        }
        else {
            error_log("no client access for {$USESSION['groups']}");

        }
    }
    else {
        //$identifier = 'nouser';
        echo "Login error occured (unrecognized identifier)";
        error_log("unrecognized identifier $identifier");
        exit();
    }
}

if ($identifier == 'nouser') {
    $identifier = uniqid();
    $client = array(
        "_id" => strval(new MongoId()),
        "identifier" => $identifier,
        "name" => $_SERVER['REMOTE_ADDR'],
        "added_user_id" => '',
        "time_added" => date("c")
    );

    $db->clients->insert($client);

    $USESSION['client_id'] = $client['_id'];
    $USESSION['identifier'] = $identifier;

    error_log("client {$USESSION['client_id']} added, identifier=$identifier");
}

setcookie('identifier', $identifier, $client_expiration, "/");

if (! empty($_GET['code'])) {
    $locusService = getLocusService();

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
    $glid = $result['preferred_username'];
    $groups = groupsStripOUDC($result['groups']);

    $user = $db->users->findOne(array("glid" => $glid));

    if ($user) {
        if ($user['groups'] !== $groups) {
            $db->users->update(
                array("_id" => $user['_id']),
                array( '$set' => array('groups' => $groups))
            );
        }
    }
    else {
        $user = array(
            '_id' => strval(new MongoId()),
            'glid' => $glid,
            'groups' => $groups
        );

        $db->users->insert($user);
    }
    // Create/update user record

    $db->clients->update(
        array('identifier' => $identifier),
        array( '$set' => array('added_user_id' => $user['_id']))
    );

    $logged_in = 1;

    if (groupsHasClientAccess($result['groups'])) {
        $client_access = 1;
    }

    // Set the user id for an admin session
    if (isset($_COOKIE['admin_identifier'])) {
        $admin_identifier = $_COOKIE['admin_identifier'];

        $db->admin_sessions->update(
            array('identifier' => $admin_identifier),
            array( '$set' => array('user_id' => $user['_id']))
        );
    }

    if (isset($_SESSION['location'])) {
        header("Location: " . $_SESSION['location']);
    }
}



if (! ($logged_in || $public)) {
    $locusService = getLocusService();

    if (!empty($_GET['error'])) {
        errorResponse($_GET['error'], 401);
    }
    else {
        $url = $locusService->getAuthorizationUri();
        $_SESSION['location'] = $_SERVER['REQUEST_URI'];
        header('Location: ' . $url);
        exit();
    }
}

if (! ($public || $client_access)) {
    errorResponse("Unauthorized", 401);
}
