<?php
$public = 0;
include(__DIR__ . "/sub/head.php");

setcookie('admin_identifier', null, -1, "/");
$resp['user'] = array('username' => null, 'admin' => false);
jsonResponse();
