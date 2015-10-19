<?php
$public = 0;
include(__DIR__ . "/sub/head.php");


if (adminAuthCheck()) {
    $resp['admin'] = true;
    jsonResponse();
}