/**=========================================================
 * Module: adstatistics.js
 =========================================================*/

App.controller('MCustomerstatisticsController', ['$scope', '$http',
    function ($scope, $http) {
        $http
            .get('/merchant/getMCustomerStatistics.action')
            .then(function (response) {
                    if (response.data.status) {
                        $scope.totalcount = response.data.data.totalcount;
                        $scope.femalecount = response.data.data.femalecount;
                        $scope.malecount = response.data.data.malecount;
                        $scope.provincename = response.data.data.provincename;
                        $scope.citycount = response.data.data.citycount;
                        $scope.provincecount = response.data.data.provincecount;
                        $scope.language_zh_CN = response.data.data.language_zh_CN;
                        $scope.cityname = response.data.data.cityname;
                        $scope.language_other = response.data.data.language_other;
                        //语言
                        $('.sparkline2').sparkline([$scope.language_zh_CN, $scope.language_other],
                            {
                                type: 'pie',
                                height: '200',
                                width: '100%',
                                offset: '90',
                                sliceColors: ['#44B549', '#4A90E2', '#990099'],
                                fillColor: '',
                                tooltipFormat: '{{offset:offset}}：{{value}}',
                                tooltipValueLookups: {
                                    'offset': ['中文', '其它']
                                }
                            }
                        )
                        ;
                        //性别
                        $('.sparkline1').sparkline([$scope.malecount, $scope.femalecount],
                            {
                                type: 'pie',
                                height: '200',
                                width: '100%',
                                offset: '90',
                                sliceColors: ['#44B549', '#4A90E2', '#990099'],
                                tooltipFormat: '{{offset:offset}}：{{value}}',
                                tooltipValueLookups: {
                                    'offset': ['男', '女']
                                }
                            }
                        )
                        ;
                    }
                    else {
                        $.notify(response.data.msg, 'danger');
                    }
                },
                function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                }
            )
        ;
        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();
    }])
;