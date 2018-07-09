/**=========================================================
 * Module: access-login.js
 =========================================================*/

App.controller('LoginFormController', ['$scope', '$rootScope', '$http', '$state', function ($scope, $rootScope, $http, $state) {

    $scope.account = {};
    $scope.authMsg = '';

    $scope.login = function () {
        $scope.authMsg = '正在登陆中...';
        //$state.go('app.evaluate');
        $http
        ({
            method: 'POST',
            url: $rootScope.url + '/account-service/person/login?account=' + $scope.account.username + '&password=' + $scope.account.password
        })
            .then(function (response) {
                if (response.data.status != 200) {
                    $scope.authMsg = response.data.message;
                } else {
                    $rootScope.account = response.data.data;
                    $state.go('app.evaluate');
                }
                ;
            }, function (x) {
                $scope.authMsg = '服务器出了点问题，我们正在处理';
            });
    };

}]);
