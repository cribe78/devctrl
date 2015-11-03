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
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/<?=$ng_ver?>/angular-animate.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/<?=$ng_ver?>/angular-aria.min.js"></script>
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
    <div ng-show="main.showSidenav"
         class="dc-sidenav md-whiteframe-z2">
        <div layout="row" layout-align="left center">
            <md-button ng-click="main.toggleSidenav('left')"  class="md-icon-button">
                <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
            </md-button>
            <md-icon show-gt-md md-font-set="material-icons">settings</md-icon>
            <span flex class="text-display-1 md-primary md-hue-1">DWI DevCtrl</span>
        </div>
        <md-content flex role="navigation">
            <coe-menu items="main.menu.items"></coe-menu>
            <p ng-repeat="x in [1,2,3,4,5,6,7,8,9,0]">Test {{x}}</p>
            <p ng-repeat="x in [1,2,3,4,5,6,7,8,9,0]">Test {{x}}</p>
        </md-content>
    </div>

    <div layout="column" flex class="level1div">

    <md-toolbar>
        <md-button ng-click="main.toggleSidenav('left')"
                   class="md-icon-button"
                   ng-hide="main.showSidenav">
            <md-icon aria-label="Menu"  md-font-set="material-icons" >menu</md-icon>
        </md-button>
        Toolbar
    </md-toolbar>



            <md-content layout="column" id="content" flex>
                <md-card>
                    <md-list>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                        <md-list-item>
                            Content
                        </md-list-item>
                    </md-list>
                </md-card>
            </md-content>


    </div>

</body>
</html>