<?php
/**
 * Created by PhpStorm.
 * User: chris
 * Date: 8/13/14
 * Time: 11:50 AM
 */

$mic_xpoints = array( 1 => true, 5 => true);

$gentner_ports = array(
    "in" => array(1 => "Mic 1",
                  7 => "Mic 2",
                  8 => "Mic 3",
                  9 => "V4",
                  11 => "PGM"),
    "out" => array( 1 => "Online",
                    3 => "House",
                    5 => "Full Mix"),
    "xpoints" => array(
        1 => $mic_xpoints,
        7 => $mic_xpoints,
        8 => $mic_xpoints,
        9 => array( 3 => true, 5 => true),
        11 => array( 1 => true, 3 => true, 5 => true))
);
