/**=========================================================
 * Module: config.js
 * App routes and resources configuration
 =========================================================*/

App.config(['$stateProvider', '$locationProvider', '$urlRouterProvider', 'RouteHelpersProvider',
    function ($stateProvider, $locationProvider, $urlRouterProvider, helper) {
        'use strict';

        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);

        // defaults to dashboard
        $urlRouterProvider.otherwise('/login');

        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                controller: 'AppController',
                resolve: helper.resolveFor('fastclick', 'modernizr', 'icons', 'screenfull', 'animo', 'sparklines', 'slimscroll', 'classyloader', 'toaster', 'whirl', 'bootbox', 'moment')
            })
            .state('app.search', {
                url: '/search',
                title: '检索本人绩效',
                templateUrl: helper.basepath('search.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'SearchController'
            })
            .state('app.evaluate', {
                url: '/evaluate',
                title: '填写个人考评',
                templateUrl: helper.basepath('evaluate.html'),
                resolve: helper.resolveFor('ngDialog', 'moment'),
                controller: 'EvaluateController'
            })
            .state('app.result', {
                url: '/result',
                title: '查看本人绩效',
                params:{
                    standardDate: '',
                    departmentId: -1
                },
                templateUrl: helper.basepath('result.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'ResultController'
            })
            .state('app.setting', {
                url: '/setting',
                title: '个人信息维护',
                templateUrl: helper.basepath('setting.html'),
                resolve: helper.resolveFor('ngDialog'),
                controller: 'SearchController'
            })
            .state('app.graph', {
                url: '/graph',
                title: '查看本人成长曲线',
                templateUrl: helper.basepath('graph.html'),
                resolve: helper.resolveFor('ngDialog', 'chartjs'),
                controller: 'GraphController'
            })
            .state('login', {
                url: '/login',
                title: '登录',
                templateUrl: 'app/pages/login.html'
            })
            .state('logout', {
                url: '/logout',
                title: '登录',
                templateUrl: 'app/pages/login.html'
            })
        ;


    }]).config(['$ocLazyLoadProvider', 'APP_REQUIRES', function ($ocLazyLoadProvider, APP_REQUIRES) {
    'use strict';

    // Lazy Load modules configuration
    $ocLazyLoadProvider.config({
        debug: false,
        events: true,
        modules: APP_REQUIRES.modules
    });

}]).config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider, $compileProvider, $filterProvider, $provide) {
        'use strict';
        // registering components after bootstrap
        App.controller = $controllerProvider.register;
        App.directive = $compileProvider.directive;
        App.filter = $filterProvider.register;
        App.factory = $provide.factory;
        App.service = $provide.service;
        App.constant = $provide.constant;
        App.value = $provide.value;

    }]).config(['tmhDynamicLocaleProvider', function (tmhDynamicLocaleProvider) {

    tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');

    // tmhDynamicLocaleProvider.useStorage('$cookieStore');

}]).config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeBar = true;
    cfpLoadingBarProvider.includeSpinner = false;
    cfpLoadingBarProvider.latencyThreshold = 500;
    cfpLoadingBarProvider.parentSelector = '.wrapper > section';
}]).factory('httpInterceptor',
    function ($q, $rootScope) {
        return {
            'request': function (config) {
                return config;
            },
            'response': function (response) {
                return response || $q.when(response);
                },
            'requestError': function (rejection) {
                return response;
            },
            'responseError': function (rejection) {
                return $q.reject(rejection);
            }
        };
    })
    .config(function ($httpProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
    })


