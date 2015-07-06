goog.provide("DevCtrl.IconConfig");

DevCtrl.IconConfig = ['$mdIconProvider', function($mdIconProvider) {
    var sets  = [
        'action', 'alert', 'av', 'communication',
        'content', 'device', 'editor', 'file',
        'hardware', 'image', 'maps', 'navigation',
        'notification', 'social', 'toggle'
    ];

    angular.forEach(sets, function(iset) {
        $mdIconProvider.iconSet(iset, 'images/svg-sprite/svg-sprite-' + iset + '.svg');
    });

}];