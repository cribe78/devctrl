<?php
if (php_sapi_name() !== 'cli') {
    print "This script may only be called from the command line\n";
    exit();
}


include(__DIR__ . "/config.php");
$mysqli  = mysqli_connect($g_db_host, $g_db_user, $g_db_pass, $g_db_schema);
if (mysqli_connect_errno($mysqli)) {
    error_log("Failed to connect to MySQL: " . mysqli_connect_error());
    exit();
}

require("controller-lib.php");

$db = getMongoDb();
$key_map = array();


// First copy records
foreach ($g_schema as $tname => $tstruct) {
    if ( ! (isset($tstruct['db']) && $tstruct['db'] == 'mongo')) {
        echo "cloning data from $tname... ";
        $tdata = getTableDataMysql($tname);
        $tmongo = $db->$tname;

        if ($tmongo->count()) {
            echo "\n dropping existing collection $tname\n";
            $tmongo->drop();
            $tmongo->$db->$tname;
        }

        $clone_count = 0;

        foreach ($tdata as $id => $record) {
            $clone_count++;
            $record['_id'] = strval(new MongoId());
            $tmongo->insert($record);
        }

        echo "$clone_count records copied\n";
    }
}



// Build key map
foreach ($g_schema as $tname => $tstruct) {
    echo "building keymap for $tname... ";
    $key_map[$tname] = array();
    $tmongo = $db->$tname;
    $cursor = $tmongo->find(array());

    foreach ($cursor as $record) {
        if ($tstruct['pk'] !== '_id') {
            $mysql_id = $record[$tstruct['pk']];
            $key_map[$tname][$mysql_id] = $record['_id'];
        }
    }

    echo "$tname keymap built\n";
}


//Then update keys
foreach ($g_schema as $tname => $tstruct) {

    echo "update keys for $tname... ";
    $tmongo = $db->$tname;
    $update_count = 0;

    foreach ($key_map[$tname] as $id => $mongo_id) {
        $record = $tmongo->findOne(array("_id" => $mongo_id));

        if (isset($tstruct['foreign_keys'])) {
            foreach ($tstruct['foreign_keys'] as $field => $fktable) {
                $mysql_id = $record[$field];

                if ($mysql_id) {
                    if (!is_numeric($mysql_id)) {
                        echo "this is odd...";
                    }
                    $_id = $key_map[$fktable][$mysql_id];
                    $record[$field] = $_id;
                }
            }
        }

        unset($record[$tstruct['pk']]);
        $tmongo->update(array('_id' => $mongo_id), $record);

        $update_count++;
    }

    echo "$update_count records updated\n";

}

