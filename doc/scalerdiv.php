<?php 
$keystone_sliders = array("A" => [ "label" => "Top Left H",
                                   "min" => 0,
                                   "max" => 650 ],
                          "B" => [ "label" => "Top Left V",
                                   "min" => 0,
                                   "max" => 650 ],
                          "C" => [ "label" => "Bottom Left H",
                                   "min" => -0,
                                   "max" => 650 ],
                          "D" => [ "label" => "Bottom Left V",
                                   "min" => -650,
                                   "max" => 0 ],
                          "E" => [ "label" => "Top Right H",
                                   "min" => -650,
                                   "max" => 0 ],
                          "F" => [ "label" => "Top Right V",
                                   "min" => 0,
                                   "max" => 650 ],
                          "G" => [ "label" => "Bottom Right H",
                                   "min" => -650,
                                   "max" => 0 ],
                           "H" => [ "label" => "Bottom Right V",
                                    "min" => -650,
                                    "max" => 0 ]);

$s_radio_id = getID();
$test_id = getID();
$scaling_id = getID();
$source_id = getID();
$keystone_id = getID();

radioBar("scaler", $p, "BA");
radioBar("scaler", $p, "AB");
radioBar("scaler", $p, "FA");

?>

<div class='keystonediv ui-widget-content'> 
    <div id='keystoneheader' class="ui-widget-header" >
        <span class='stoolbarlabel'>Keystone Controls</span>
    </div>
    <div class='keystonesliderdiv'>
    <div class='keystonedivleft'>
<?
    numberControl('scaler', $p, 'FAB', "ktlv");
    numberControl('scaler', $p, 'FAA', "ktlh");
    numberControl('scaler', $p, 'FAC', "kblh");
    numberControl('scaler', $p, 'FAD', "kblv");
?>
    </div>
    <div class='keystonedivright'>
<?
    numberControl('scaler', $p, 'FAF', "ktrv");
    numberControl('scaler', $p, 'FAE', "ktrh");
    numberControl('scaler', $p, 'FAG', "kbrh");
    numberControl('scaler', $p, 'FAH', "kbrv");
?>

    </div>
    </div>
</div>


<div class="sposition ui-widget-content" >
    <div class="spositionheader ui-widget-header ui-corner-all">Position Controls</div>
<?    
    numberControl("scaler", $p, "ACA", "inline-div");  
    numberControl("scaler", $p, "ACB", "inline-div");
?>  
</div>
<?
    $left_id = getID();
    $right_id = getID();
    $top_id = getID();
    $bottom_id = getID();
?>

<div class="sedges ui-widget-content">
    <div class="sedgesheader ui-widget-header ui-corner-all">Edge Blending</div>
    <div class='edgeleft'>
        <input type='checkbox' data-ut='checkbox' data-tt='scaler' data-tn='<?=$p?>'
          data-cn='FFB' id='<?=$left_id?>' class='pcontrol' />
        <label for='<?=$left_id?>'>Left</label> 
        <?  numberControl("scaler", $p, "FFF", "inline-div"); ?> 
    </div>
    <div class='edgetop'>
        <input type='checkbox' data-ut='checkbox' data-tt='scaler' data-tn='<?=$p?>'
          data-cn='FFD' id='<?=$top_id?>' class='pcontrol' />
        <label for='<?=$top_id?>'>Top</label> 
        <?  numberControl("scaler", $p, "FFH", "inline-div"); ?>  
    </div>      
    <div class='edgeright'>    
        <input type='checkbox' data-ut='checkbox' data-tt='scaler' data-tn='<?=$p?>'
          data-cn='FFC' id='<?=$right_id?>' class='pcontrol' />
        <label for='<?=$right_id?>'>Right</label> 
        <?  numberControl("scaler", $p, "FFG", "inline-div"); ?> 
    </div>    
    <div class='edgebottom'>
        <input type='checkbox' data-ut='checkbox' data-tt='scaler' data-tn='<?=$p?>'
          data-cn='FFA' id='<?=$bottom_id?>' class='pcontrol' />
        <label for='<?=$bottom_id?>'>Bottom</label>
        <?  numberControl("scaler", $p, "FFE", "inline-div"); ?>
    </div>        
</div>
<div id='s<?=$p?>sourcetb' class="scaler<?=$p?> ui-widget-header">
    <span>Input Res:</span>    
    <span id="s<?=$p?>inputres" data-tt='scaler' data-tn='<?=$p?>' data-ut='display' data-cn='EA'
      class='pcontrol ui-state-highlight'> </span>
    <span>Firmware Rev:</span>    
    <span id="s<?=$p?>inputres" data-tt='scaler' data-tn='<?=$p?>' data-ut='display' data-cn='EI'
      class='pcontrol ui-state-highlight'> </span>
    <span>Test Pattern:</span>
    <span id="<?=$test_id?>" class="pcontrol"  
          data-ut='radio' data-cn='CB' data-tt='scaler' data-tn='<?=$p?>'>
<?
radioHTML($test_id, "z", "Off");
radioHTML($test_id, "A0", "1");
radioHTML($test_id, "A1", "2");
radioHTML($test_id, "A2", "3");
radioHTML($test_id, "A3", "4");
?>
    </span>
    <button class='targetrefresh' data-tt='scaler' data-tn='<?=$p?>'>Refresh</button>
</div>
