/**=========================================================
 * Module: ResultController.js
 =========================================================*/

App.controller('ResultController', ['$scope', '$http', '$rootScope', '$state', '$stateParams',
    function ($scope, $http, $rootScope, $state, $stateParams) {
        $scope.standardDate = moment($stateParams.standardDate).format('YYYY年MM月DD日');
        var loadResults = function () {

            $http({
                method: 'GET',
                url: $rootScope.url + '/standard-service/result/list',
                params: {
                    standardDate: $stateParams.standardDate,
                    departmentId: $stateParams.departmentId,
                    personId: $rootScope.account.id,
                    level: 0,
                }
            })
                .then(function (response) {
                    if (response.data.status === 200) {
                        $scope.data = response.data.data;
                        $scope.data.forEach(function (item) {
                            $http.get($rootScope.url + '/standard-service/result/list?fatherId=' + item.id + '&level=1')
                                .then(function (response) {
                                    if (response.data.status === 200) {
                                        item['items'] = response.data.data;
                                    } else {
                                        $.notify(response.data.message, 'danger');
                                    }
                                }, function (x) {
                                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                                });
                        })
                    } else {
                        $.notify(response.data.message, 'danger');
                    }
                }, function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                });

        }

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();

        loadResults();

        $scope.back = function () {
            $state.go('app.evaluate');
        };
    }]);
