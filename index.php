<?php
    $public = 0;
    include(__DIR__ . "/sub/head.php");
    $ng_ver = "1.4.7";
?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="EN"
      lang="EN"
      ng-app="DevCtrlApp">
<head>
    <script src="/bower_components/angular/angular.js"></script>
    <script src="/bower_components/angular-animate/angular-animate.min.js"></script>
    <script src="/bower_components/angular-aria/angular-aria.min.js"></script>
    <script src="/bower_components/angular-material/angular-material.js"></script>
    <script src="/js/socket.io.js"></script>
    <script src="/js/socket.js"></script>
    <script src="/bower_components/angular-ui-router/release/angular-ui-router.js"></script>
    <script src="/bower_components/angular-toArrayFilter/toArrayFilter.js"></script>
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
    <div ng-show="main.menu.isSidenavOpen()"
         class="dc-sidenav md-sidenav-left md-whiteframe-z2 "
         layout="column">
        <div layout="row" layout-align="left center">
            <md-button ng-click="main.menu.toggleSidenav('left')" class="dc-sidenav-close md-icon-button">
                <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
            </md-button>
            <span flex class="text-display-1 md-primary md-hue-1">DWI DevCtrl</span>
        </div>
        <md-content flex role="navigation">
            <coe-menu items="main.menu.items"></coe-menu>
        </md-content>
    </div>
    <div layout="column" flex>
        <devctrl-toolbar></devctrl-toolbar>
        <md-content ng-if="main.$mdMedia('max-width: 1000px')"
                    layout="column"
                    flex
                    layout-margin
                    id="content"
                    class="devctrl-main-content">
            <ui-view></ui-view>
        </md-content>
        <md-content ng-if="main.$mdMedia('min-width: 1000px')"
                    layout="column"
                    layout-align="start center"
                    flex
                    layout-margin
                    id="content"
                    class="devctrl-main-content-wide">
            <md-card class="devctrl-main-card">
                <md-card-content>
                    <ui-view></ui-view>
                </md-card-content>
            </md-card>
        </md-content>
    </div>
</body>
</html>