<?php
// Set default values and load installation specific values 
// for application  
$g_db_user = 'dwi-devctrl';
$g_db_pass = ' ';
$g_db_host = '127.0.0.1';
$g_db_schema = 'devctrl';
$g_oauth_client = 'devctrl';
$g_oauth_secret = 'devctrl';
$g_title = 'DWI DevCtrl';
$g_log_file = '/var/log/devctrl/devctrl.log';
$g_base_url = 'https://devctrl.dwi.ufl.edu/';
$g_messenger_host = "127.0.0.1";
$g_messenger_port = 2879;
$g_mongodb = 'devctrl';

if (file_exists(__DIR__ . "/config.local.php")) {
    include(__DIR__ . "/config.local.php");
}
