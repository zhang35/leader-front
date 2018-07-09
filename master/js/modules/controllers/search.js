/**=========================================================
 * Module: SearchController.js
 =========================================================*/

App.controller('SearchController', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {

        $rootScope.IncreaseTypeList = [{
            key: 0,
            value:"全部"
        },
            {
                key:1,
                value: "仅显示扣分"
            },
            {
                key:2,
                value: "仅显示得分"
            }
        ];

        $rootScope.CommentTypeList = [{
            key: 0,
            value:"全部"
        },
            {
                key:1,
                value: "仅显示含评语结果"
            },
            {
                key:2,
                value: "仅显示无评语结果"
            }
        ];

        $scope.search = {
            increaseType: 0,
            commentType: 0,
            timeStart: '',
            timeEnd: '',
            page: 1,
            size: 2
        };
        $scope.timeStart = '';
        $scope.timeEnd = '';
        $scope.opened = {
            start: false,
            end: false
        };

        var
            buildParam = function () {
                var param = {
                    method: 'GET',
                    url:$rootScope.url+'/standard-service/result/search',
                    params: $scope.search
                };
                return param;
            },
            loadData = function () {
                $http(buildParam())
                    .then(function (response) {
                        if (response.data.status === 200) {
                            $scope.items = response.data.data.list;
                            $scope.totalItems = response.data.data.total;
                        } else {
                            $.notify(response.data.message, 'danger');
                        }
                    }, function (x) {
                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                    });
            },
            resetList = function () {
                $scope.search.page = 1;


                if (!!$scope.timeStart) {
                    var date = new Date($scope.timeStart);
                    $scope.search.timeStart=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 00:00:00';

                  //  $scope.search.timeStart = $scope.timeStart + ' 00:00:00';
                }

                if (!!$scope.timeEnd) {
                    var date = new Date($scope.timeEnd);
                    $scope.search.timeEnd=date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' 23:59:59' ;

                   // $scope.search.timeEnd = $scope.timeEnd + ' 23:59:59';
                }

                loadData();
            };

        $scope.pageChanged = loadData;
        $scope.searchList = resetList;
        $scope.dateOptions = {
            datepickerMode: 'year',
            formatYear: 'yyyy',
            startingDay: 1,
            formatDayTitle: 'yyyy年M月'
        };

        $scope.open = function ($event, attr) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened[attr] = true;
        };

        $scope.resetSearch = function () {
            $scope.totalItems = 0;
            $scope.search.commentType = 0;
            $scope.search.timeStart = '';
            $scope.search.timeEnd = '';
            $scope.timeStart = '';
            $scope.timeEnd = '';
            resetList();
        };

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();

        resetList();
    }]);
