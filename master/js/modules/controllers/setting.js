/**=========================================================
 * Module: GraphController.js
 =========================================================*/

 App.controller('SettingController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.oldPassError = false;
        $scope.newPassError = false;
        $scope.oldPassEmpty = false;
        $scope.newPassEmpty = false;
        $scope.oldPass = "";
        $scope.newPass = "";
        $scope.newPassRepeat = "";
        $scope.submit = function(){
            if ($scope.oldPass == ""){
                $scope.oldPassError = false;
                $scope.newPassError = false;
                $scope.oldPassEmpty = true;
                $scope.newPassEmpty = false;
            }
            else if ($scope.oldPass !== $rootScope.account.password){
                $scope.oldPassError = true;
                $scope.newPassError = false;
                $scope.oldPassEmpty = false;
                $scope.newPassEmpty = false;
            }
            else if ($scope.newPass == ""){
                $scope.oldPassError = false;
                $scope.newPassError = false;
                $scope.oldPassEmpty = false;
                $scope.newPassEmpty = true;
            }
            else if ($scope.newPass !== $scope.newPassRepeat){
                $scope.oldPassError = false;
                $scope.newPassError = true;
                $scope.oldPassEmpty = false;
                $scope.newPassEmpty = false;
            }
            else{
                $scope.oldPassError = false;
                $scope.newPassError = false;
                $scope.oldPassEmpty = false;
                $scope.newPassEmpty = false;

                var newAccount = $rootScope.account;
                newAccount.password = $scope.newPass;
                $http({
                    method : 'post',
                    url: $rootScope.url + '/account-service/person/edit',
                    data: newAccount
                })
                .then(function (response){
                    if (response.data.status !== 200){
                        $notify(response.data.message, 'danger');
                    }
                    else{
                        $rootScope.account.password = newAccount.password;
                        $scope.newPass = "";
                        $scope.oldPass = "";
                        $scope.newPassRepeat = "";
                        $.notify("信息更新成功!", 'success');
                    }
                });
            }
        };
    }]);

