<?php
/**
 * Created by PhpStorm.
 * User: chris
 * Date: 7/17/14
 * Time: 11:21 AM
 *
 * Configuration file for the controlVconsole app.  This script outputs JSON data that controlV uses to create
 * it's control objects
 */

require("sub/controldefs.php");
require("sub/gentner-ports.php");

$xcontrol_config = array(
    "targets" => array(
        "xap800" => array(
            1 => array()
        )
    ),
    "commands" => $commands
);


for ($i = 1; $i <= 12; $i++) {
    $lvl_dev_val = $i > 8 ? "L" : "M";

    if (isset($gentner_ports["in"][$i])) {
        $xcontrol_config["targets"]["xap800"][1]["inputs"][] = array(
            "unique-id" => "input-$i",
            "number" => $i,
            "title" => $gentner_ports["in"][$i],
            "cn-meter" => "LVL $i $lvl_dev_val A",
            "cn-mute" => "MUTE $i $lvl_dev_val",
            "cn-gain" => "GAIN $i $lvl_dev_val A"
        );
    }

    if (isset($gentner_ports["out"][$i])) {
        $xcontrol_config["targets"]["xap800"][1]["outputs"][] = array(
            "unique-id" => "output-$i",
            "number" => $i,
            "title" => $gentner_ports["out"][$i],
            "cn-meter" => "LVL $i O A",
            "cn-mute" => "MUTE $i O",
            "cn-gain" => "GAIN $i O A"
        );
    }


    for($o = 1; $o <= 12; $o++) {
        if (isset($gentner_ports["xpoints"][$i]) &&
                is_array($gentner_ports["xpoints"][$i]) &&
                isset($gentner_ports["xpoints"][$i][$o]) &&
                $gentner_ports["xpoints"][$i][$o] == true) {
            $xcontrol_config["targets"]["xap800"][1]["xpoints"][] = array(
                "unique-id" => "xpoint-$i-$o",
                "title" => $gentner_ports["in"][$i],
                "input" => "input-$i",
                "output" => "output-$o",
                "cn-gain" => "MTRXLVL $i $lvl_dev_val $o O",
                "cn-mute" => "MTRX $i $lvl_dev_val $o O",
                "cn-lvl" => "LVL $i $lvl_dev_val A"
            );
        }
    }
}


echo(json_encode($xcontrol_config));