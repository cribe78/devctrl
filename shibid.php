<?php

$public = 1;
include(__DIR__ . "/sub/head.php");

pclog("shib proxy data posted");

$data = coe_shib_proxy_receive_data();

if ($data) {
    $select_user = $mysqli->prepare(
        "select user_id, glid, groups from users where glid = ?"
    );

    if (! $select_user) {
        errorResponse("prepare select_user error: {$mysqli->error}");
    }

    $glid = $data['glid'];
    $groups = $data['UFADGroupsDN'];
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

    pclog("shib proxy data processed!");
}