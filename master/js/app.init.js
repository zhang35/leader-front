if (typeof $ === 'undefined') {
    throw new Error('This application\'s JavaScript requires jQuery');
}


// APP START
// ----------------------------------- 

var App = angular.module('vsp', ['ngRoute', 'ngAnimate', 'ngStorage', 'ngCookies', 'ui.bootstrap', 'ui.router', 'oc.lazyLoad', 'cfp.loadingBar', 'ngSanitize', 'ngResource', 'tmh.dynamicLocale', 'ui.utils'])
    .run(["$rootScope", "$state", "$stateParams", '$window', '$templateCache', function ($rootScope, $state, $stateParams, $window, $templateCache) {
        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;

        //$rootScope.url = 'http://59.110.125.195:8088/standard-0.0.1-SNAPSHOT/remove-me';
        $rootScope.url = '/apis/remove-me';
       /* if (window.location.href.indexOf('indexing') > 0) {
            $rootScope.url = 'www.standard.com';
        } else {
            $rootScope.url = '/apis/remove-me';

        }*/

        // Uncomment this to disable template cache
        /*$rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
         if (typeof(toState) !== 'undefined'){
         $templateCache.remove(toState.templateUrl);
         }
         });*/

        // Scope Globals
        // -----------------------------------

        $rootScope.app = {
            name: ' 量化考评系统',
            description: '管理后台',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false
            },
            useFullLayout: false,
            hiddenFooter: false,
            viewAnimation: 'ng-fadeInUp'
        };

    }]);
