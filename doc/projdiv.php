<?php
$powr_id = getID();
$shut_id = getID();
$mute_id = getID();
$freeze_id = getID();
$test_id = getID();
$scaling_id = getID();
$input_id = getID();
$lmod_id = getID();
?>
<div class='ppowrdiv ui-widget-header ui-corner-all'>
    <input type='checkbox' id='<?=$powr_id?>'  class='screen<?=$p?> pcontrol'
    data-cn='POWR' data-tn='<?=$p?>' data-tt='proj' data-ut='checkbox'   />
    <label for='<?=$powr_id?>'>Power</label>
    <input type='checkbox' id='<?=$shut_id?>'  class='screen<?=$p?> pcontrol'
    data-cn='SHUT' data-tn='<?=$p?>' data-tt='proj' data-ut='checkbox'   />
    <label for='<?=$shut_id?>'>Shutter</label>
    <input type='checkbox' id='<?=$mute_id?>'  class='screen<?=$p?> pcontrol'
    data-cn='PMUT' data-tn='<?=$p?>' data-tt='proj' data-ut='checkbox'   />
    <label for='<?=$mute_id?>'>Picture Mute</label>
    <input type='checkbox' id='<?=$freeze_id?>'  class='screen<?=$p?> pcontrol'
    data-cn='FRZE' data-tn='<?=$p?>' data-tt='proj' data-ut='checkbox'   />
    <label for='<?=$freeze_id?>'>Freeze</label>
</div>
<?
    radioBar('proj', $p, 'IABS');
    radioBar('proj', $p, 'SABS');
?>

<div class='pzoomdiv ui-widget-header ui-corner-all'>
    <div class='ptoolbarlabel'>Zoom:</div>

    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='ZOIN' data-value='1'>
    In1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='ZOIN' data-value='2' >
    In2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='ZOIN' data-value='3'>
    In3</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='ZOUT' data-value='1'> 
    Out1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='ZOUT' data-value='2'> 
    Out2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='ZOUT' data-value='3'>
    Out3</button>
</div>

<div class='pfocusdiv ui-widget-header ui-corner-all'>
    <div class='ptoolbarlabel'>Focus:</div>

    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='FOIN' data-value='1'>
    In1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='FOIN' data-value='2' >
    In2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='FOIN' data-value='3'>
    In3</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='FOUT' data-value='1'> 
    Out1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='FOUT' data-value='2'> 
    Out2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='FOUT' data-value='3'>
    Out3</button>
</div>

<div class='pshiftupdiv ui-widget-header ui-corner-all'>
    <div class='ptoolbarlabel'>Lens Shift (U/D):</div>

    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSUP' data-value='1'>
    Up1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSUP' data-value='2' >
    Up2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSUP' data-value='3'>
    Up3</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSDW' data-value='1'> 
    Down1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSDW' data-value='2'> 
    Down2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSDW' data-value='3'>
    Down3</button>
</div>

<div class='pshiftlrdiv ui-widget-header ui-corner-all'>
    <div class='ptoolbarlabel'>Lens Shift (L/R):</div>

    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSLF' data-value='1'>
    Left1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSLF' data-value='2' >
    Left2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSLF' data-value='3'>
    Left3</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSRH' data-value='1'> 
    Right1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSRH' data-value='2'> 
    Right2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='LSRH' data-value='3'>
    Right3</button>
</div>

<div class='pirisdiv ui-widget-header ui-corner-all'>
    <div class='ptoolbarlabel'>Iris:</div>

    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='IROP' data-value='1'>
    Open1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='IROP' data-value='2' >
    Open2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='IROP' data-value='3'>
    Open3</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='IRCL' data-value='1'> 
    Close1</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='IRCL' data-value='2'> 
    Close2</button>
    <button class='pcontrol' data-tt='proj' data-tn='<?=$p?>'
        data-ut='button'   data-cn='IRCL' data-value='3'>
    Close3</button>
</div>


<div class="ui-widget-content">
   <div class='ui-widget-header ui-corner-all'>Picture Controls</div>
    
<?
    numberControl("proj", $p, "BRIG", "inline-div");
    numberControl("proj", $p, "CNTR", "inline-div");
    numberControl("proj", $p, "SHRP", "inline-div");

?>
</div>

<?
    radioBar('proj', $p, 'GABS');
    radioBar('proj', $p, 'LMOD');
    radioBar('proj', $p, 'TEST');
?>

<div class='pstatsdiv ui-widget-header ui-corner-all'>
    <span>Power Status:</span>
    <span class='pcontrol ui-state-highlight' data-tt='proj' data-tn='<?=$p?>'  
          data-cn='POST' data-ut='display'></span>
    <span>L1 Runtime:</span>
    <span class='pcontrol ui-state-highlight' data-tt='proj' data-tn='<?=$p?>'  
          data-cn='LTR1' data-ut='display'></span>
    <span>L1 Status:</span>
    <span class='pcontrol ui-state-highlight' data-tt='proj' data-tn='<?=$p?>'  
          data-cn='LST1' data-ut='display'></span>
    <span>L2 Runtime:</span>
    <span class='pcontrol ui-state-highlight' data-tt='proj' data-tn='<?=$p?>'  
          data-cn='LTR2' data-ut='display'></span>
    <span>L2 Status:</span>
    <span class='pcontrol ui-state-highlight' data-tt='proj' data-tn='<?=$p?>'  
          data-cn='LST2' data-ut='display'></span>
    <button class='targetrefresh' data-tt='proj' data-tn='<?=$p?>'>Refresh</button>
</div>
