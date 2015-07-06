<?php
$mysqli  = mysqli_connect("127.0.0.1", "pict", "DWCONTROL", "pictcontrol");
if (mysqli_connect_errno($mysqli)) {
    error_log("Failed to connect to MySQL: " . mysqli_connect_error());
}


for ($i = 4; $i < 350; $i++) {
    $delete_cmd_idxs = $mysqli->prepare(
        "delete from cmd_idxs where cmd_idx < {$i}000000"
    );

    if ($delete_cmd_idxs->execute()) {
        print("cmd_idx group $i deleted\n");
    }
    else {
       print("error deleting cmd_idxs: {$delete_cmd_idxs->error}\n");
    }
}
