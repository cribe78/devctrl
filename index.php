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
    <script src="/bower_components/angular-material/angular-material.js"></script>
    <script src="/js/socket.io.js"></script>
    <script src="/js/socket.js"></script>
    <script src="/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="/js/dev-ctrl.js"></script>

    <base href="/" />
    <link rel="stylesheet" href="/bower_components/angular-material/angular-material.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=RobotoDraft:300,400,500,700,400italic">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link rel="stylesheet" href="/css/dev-ctrl.css">
    <link rel="stylesheet" href="/css/font-sizes.css">
    <meta name="viewport" content="initial-scale=1" />
    <title>DWI DevCtrl</title>
</head>
<body layout="row" ng-controller="MainCtrl as main">
    <md-sidenav layout="column"
                class="md-sidenav-left md-whiteframe-z2"
                md-component-id="left"
                md-is-locked-open="$mdMedia('gt-md')">
        <div layout="row" layout-align="left center">
            <md-button ng-click="main.toggleSidenav('left')" hide-gt-md class="md-icon-button">
                <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
            </md-button>
            <md-icon show-gt-md md-font-set="material-icons">settings</md-icon>
            <span flex class="text-display-1 md-primary md-hue-1">DWI DevCtrl</span>
        </div>
        <md-content flex role="navigation">
            <coe-menu items="main.menu.items"></coe-menu>
        </md-content>
    </md-sidenav>
    <div layout="column" flex>
        <md-toolbar layout="row" layout-align="center center">
            <md-button ng-if="main.menu.isFirstLevel()" ng-click="main.toggleSidenav('left')" hide-gt-md class="md-icon-button">
                <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
            </md-button>
            <md-button ng-if="! main.menu.isFirstLevel()" ng-click="main.go(main.menu.parentState())">
                <md-icon aria-label="Back" md-font-set="material-icons">chevron_left</md-icon>
            </md-button>
            <span flex class="title text-headline">{{main.menu.pageTitle()}}</span>
        </md-toolbar>
        <md-content layout="column" flex layout-margin id="content">
            <ui-view></ui-view>
        </md-content>
    </div>
</body>
</html>