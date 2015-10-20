<?php
$public = 0;
include(__DIR__ . "/sub/head.php");

$do_logon = false;
if (isset($_GET['logon']) && $_GET['logon']) {
    $do_logon = true;
    if (isset($_GET['location'])) {
        // Save a location to redirect to after logon
        $_SESSION['location'] = $_GET['location'];
    }
}

adminAuthCheck($do_logon);
jsonResponse();

