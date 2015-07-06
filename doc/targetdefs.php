<?php
/**
 * Created by PhpStorm.
 * User: chris
 * Date: 7/23/14
 * Time: 12:14 PM
 */

/**
$screen_list = array(1, 2, 3, 4, 5);
$screen_names = array( 1 => "Far Left",
    2 => "Left",
    3 => "Center",
    4 => "Right",
    5 => "Far Right" );
$screen_icons = array( 1 => "screen1.png",
    2 => "screen2.png",
    3 => "screen3.png",
    4 => "screen4.png",
    5 => "screen5.png");

$target_ports = array();
$target_ports['proj']['ip'] = array( 1 => "192.168.1.100",
    2 => "192.168.1.101",
    3 => "192.168.1.102",
    4 => "192.168.1.103",
    5 => "192.168.1.104");
$target_ports['proj']['port'] = array( 1 => 1025 );

$target_ports['proj-benq']['ip'] = array( 1 => "10.5.162.225");
$target_ports['proj-benq']['port'] = array( 1 => 28841,
    2 => 28842,
    3 => 28843);

$target_ports['scaler']['ip'] = array(    1 => "192.168.1.200",
    2 => "192.168.1.201",
    3 => "192.168.1.202",
    4 => "192.168.1.203",
    5 => "192.168.1.204");
$target_ports['scaler']['port'] = array( 1 => 30001);

$target_ports['switcher-dxp']['ip'] = array( 1 => "10.5.162.202",
    2 => "10.5.162.220");
$target_ports['switcher-dxp']['port'] = array( 1 => 23);

$target_ports['audio-onkyo']['ip'] = array( 1 => "controller.dwi.ufl.edu");
$target_ports['audio-onkyo']['port'] = array( 1 => 4001);

$target_ports['audio-onkyo-eth']['ip'] = array( 1 => "10.5.162.226");
$target_ports['audio-onkyo-eth']['port'] = array( 1 => 60128);

 **/
$target_ports['xap800']['ip'] = array( 1 => "192.168.10.21");
$target_ports['xap800']['port'] = array( 1 => 4003);

$active_targets = array(
    "xap800" => array(
        1 => true
    )
);