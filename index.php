<?php
    $public = 0;
    include(__DIR__ . "/sub/head.php");
    $ng_ver = "1.4.1";
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="EN"
      lang="EN"
      ng-app="DevCtrlApp">
<head>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/<?=$ng_ver?>/angular.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/<?=$ng_ver?>/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/<?=$ng_ver?>/angular-aria.min.js"></script>
    <script src="/js/angular-material.js"></script>
    <script src="/js/angular-debounce.js"></script>
    <script src="/js/socket.io.js"></script>
    <script src="/js/socket.js"></script>
    <script src="/js/angular-ui-router.js"></script>
    <script src="/dev-ctrl.js"></script>

    <base href="/" />
    <link rel="stylesheet" href="/css/angular-material.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="/css/dev-ctrl.css">
    <link rel="stylesheet" href="/css/font-sizes.css">
    <meta name="viewport" content="initial-scale=1" />
    <title>DWI DevCtrl</title>
</head>
<body layout="column" ng-controller="MainCtrl as main">
    <md-toolbar layout="row">
        <md-button ng-click="main.toggleSidenav('left')" hide-gt-md class="md-icon-button">
            <md-icon aria-label="Menu" md-svg-icon="navigation:ic_menu_24px"></md-icon>
        </md-button>
        <h1 class="md-toolbar-tools" layout-align-gt-sm="center">DevCtrl</h1>
    </md-toolbar>
    <div layout="row" flex>
        <md-sidenav layout="column"
                    class="md-sidenav-left md-whiteframe-z2"
                    md-component-id="left"
                    md-is-locked-open="$mdMedia('gt-md')">
            <md-content flex role="navigation">
                <coe-menu items="main.menu.items"></coe-menu>
            </md-content>
        </md-sidenav>
        <md-content layout="column" flex layout-margin id="content">
            <ui-view></ui-view>
        </md-content>
    </div>
</body>
</html>