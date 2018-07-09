/**=========================================================
 * Module: EvaluateController.js
 =========================================================*/

App.controller('EvaluateController', ['$scope', '$http', '$rootScope', '$state',
    function ($scope, $http, $rootScope, $state) {
        var loadRelations = function () {
            $http.get($rootScope.url + '/account-service/relations/list?personId=' + $rootScope.account.id)
                .then(function (response) {
                    if (response.data.status === 200) {
                        $scope.relations = response.data.data;
                        $scope.department = $scope.relations[0];
                        loadIndex();
                    } else {
                        $.notify(response.data.message, 'danger');
                    }
                }, function (x) {
                    $.notify('服务器出了点问题，我们正在处理', 'danger');
                });
        }
        var loadIndex = function () {

            $http.get($rootScope.url + '/standard-service/detail/list?departmentId=' + $scope.department.id + '&level=0')
                .then(function (response) {
                    if (response.data.status === 200) {
                        $scope.data = response.data.data;
                        $scope.data.forEach(function (item) {
                            $http.get($rootScope.url + '/standard-service/detail/list?fatherId=' + item.id + '&level=1')
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

        $scope.changeDepartment = loadIndex;

        $scope.totalPoints = 0;

        $scope.operate = function (item, index, step) {
            if (index === 0) {
                var val = item.increaseNum;
                item.increaseNum = doPlus(val, step);
            }
            else if (index === 1) {
                var val = item.decreaseNum;
                item.decreaseNum = doPlus(val, step);
            }
            if (isNaN(item.increaseNum) || item.increaseNum === "") {
                item.increaseNum = 0;
            }
            if (isNaN(item.decreaseNum) || item.decreaseNum === "") {
                item.decreaseNum = 0;
            }
            if (!isNaN(item.totalPoint)) {
                $scope.totalPoints -= item.totalPoint;
            }
            item.totalPoint = item.increaseNum * item.increasePoint - item.decreaseNum * item.decreasePoint;
            $scope.totalPoints += item.totalPoint;
        };

        var doPlus = function (val, step) {
            if (isNaN(val)) {
                val = 0;
            }
            val = Math.abs(val);
            val = Math.floor(val);
            val += step;
            if (val < 0) {
                val = 0;
            }
            return val;
        };

        var
            buildParam = function (url) {
                var param = {
                    method: 'GET',
                    url: url,
                    params: $scope.search
                };
                return param;
            },
            loadData = function (url) {
                // $http(buildParam(url))
                //     .then(function (response) {
                //         if (response.data.status === 200) {
                //             $scope.data = response.data.data.list;
                //         } else {
                //             $.notify(response.data.message, 'danger');
                //         }
                //     }, function (x) {
                //         $.notify('服务器出了点问题，我们正在处理', 'danger');
                //     });
            };

        $scope.submit = function () {
            var check0 = false, check1 = false;
            var standardDate = moment($scope.datePicked).format('YYYY-MM-DD');
            var submitTime = moment().format('YYYY-MM-DD HH:mm:ss');

            $scope.data.forEach(function (data_i, index0, array0) {
                    if (index0 == array0.length - 1) check0 = true;
                    check1 = false;
                    var data0 = {};
                    data0['personId'] = $rootScope.account.id;
                    data0['departmentId'] = $scope.department.departmentId;
                    data0['departmentName'] = $scope.department.departmentName;
                    data0['indexName'] = data_i.indexName;
                    data0['level'] = 0;
                    data0['fatherId'] = 0;
                    data0['standardDate'] = standardDate;
                    data0['submitTime'] = submitTime;
                    $http
                    ({
                        method: 'POST',
                        url: $rootScope.url + '/standard-service/result/add',
                        data: data0
                    })
                        .then(function (response) {
                            if (response.data.status != 200) {
                                //reject(JSON.stringify(response));
                                if (index0 == array0.length - 1) check0 = true;

                                $.notify(response.data.message, 'danger');
                            } else {
                                data_i.items.forEach(function (item, index1, array1) {
                                    if (index1 == array1.length - 1) check1 = true;
                                    if (!isNaN(item.totalPoint) && item.totalPoint !== "") {
                                        var data1 = {};
                                        data1['indexName'] = item.indexName;
                                        data1['departmentId'] = $scope.department.departmentId;
                                        data1['departmentName'] = $scope.department.departmentName;
                                        data1['personId'] = $rootScope.account.id;

                                        data1['increaseName'] = item.increaseName;
                                        data1['increasePoint'] = item.increasePoint;
                                        data1['increaseUnit'] = item.increaseUnit;
                                        data1['increaseNum'] = item.increaseNum;
                                        data1['increaseDetail'] = item.increaseDetail;

                                        data1['decreaseName'] = item.decreaseName;
                                        data1['decreasePoint'] = item.decreasePoint;
                                        data1['decreaseUnit'] = item.decreaseUnit;
                                        data1['decreaseNum'] = item.decreaseNum;
                                        data1['decreaseDetail'] = item.decreaseDetail;

                                        data1['totalPoint'] = item.totalPoint;
                                        data1['level'] = 1;
                                        data1['fatherId'] = response.data.data.id;

                                        data1['standardDate'] = standardDate;
                                        data1['submitTime'] = submitTime;
                                        $http
                                        ({
                                            method: 'POST',
                                            url: $rootScope.url + '/standard-service/result/add',
                                            data: data1
                                        })
                                            .then(function (response1) {
                                                if (index1 == array1.length - 1) check1 = true;
                                                if (response1.data.status != 200) {
                                                    $.notify(response.data.message, 'danger');
                                                } else if (check0 && check1) {
                                                    $state.go('app.result', {
                                                        standardDate:standardDate,
                                                        departmentId: $scope.department.departmentId
                                                    });
                                                }
                                            }, function (x) {
                                                $.notify('服务器出了点问题，我们正在处理', 'danger');
                                            });
                                    } else if (check0 && check1) {
                                        $state.go('app.result');
                                        $state.go('app.result', {
                                            standardDate:standardDate,
                                            departmentId: $scope.department.departmentId
                                        });
                                    }
                                })

                            }
                            ;
                        }, function (x) {
                            $.notify('服务器出了点问题，我们正在处理', 'danger');
                        });

                }
            )
        }

//每个条目不同的部分
//对于每个大项
        /*            $scope.data.forEach(function (data_i, index) {

                        var fatherId = 0;
                        var hasFatherId = false;
                        //对于每个小条目。必须直接遍历小条目，因为有的大项里面没有任何有效记录，就不能加入。
                        data_i.items.forEach(function (item, index) {
                            //对于总分是有效数字的条目
                            if (!isNaN(item.totalPoint) && item.totalPoint !== "") {
                                //如果大项还没加入过，先提交大项条目，获取fatherId
                                if (!hasFatherId) {
                                    dataPost.indexName = data_i.indexName;
                                    dataPost.level = data_i.level;
                                    dataPost.fatherId = 0;
                                    console.log(JSON.stringify(dataPost));
                                    $http.post($rootScope.url + '/standard-service/result/add', dataPost).then(function (response) {
                                        if (response.data.status === 200) {

                                            fatherId = response.data.data.id;
                                            console.log('add level 0 fatherID=' + fatherId);

                                            //提交该小条目。放到这里面是为了配合异步传输机制。
                                            dataPost.indexName = item.indexName;
                                            dataPost.increaseName = item.increaseName;
                                            dataPost.increaseNum = item.increaseNum;
                                            dataPost.increasePoint = item.increasePoint;
                                            dataPost.increaseUnit = item.increaseUnit;
                                            dataPost.increaseDetail = item.increaseDetail;
                                            dataPost.decreaseName = item.decreaseName;
                                            dataPost.decreaseNum = item.decreaseNum;
                                            dataPost.decreasePodet = item.decreasePodet;
                                            dataPost.decreaseUnit = item.decreaseUnit;
                                            dataPost.decreaseDetail = item.decreaseDetail;
                                            dataPost.totalPoint = item.totalPoint;
                                            dataPost.level = item.level;
                                            dataPost.fatherId = fatherId;

                                            $http.post($rootScope.url + '/standard-service/result/add', dataPost).then(function (response) {
                                                if (response.data.status === 200) {
                                                    console.log('add okkkk');
                                                } else {
                                                    $.notify(response.data.message, 'danger');
                                                }
                                            }, function (x) {
                                                $.notify('服务器出了点问题，我们正在处理', 'danger');
                                            });

                                        } else {
                                            $.notify(response.data.message, 'danger');
                                        }
                                    }, function (x) {
                                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                                    });
                                    hasFatherId = true;
                                    postFlag = true;
                                }
                                //已经有了fatherId
                                else {
                                    //直接提交该小条目
                                    dataPost.indexName = item.indexName;
                                    dataPost.increaseName = item.increaseName;
                                    dataPost.increaseNum = item.increaseNum;
                                    dataPost.increasePoint = item.increasePoint;
                                    dataPost.increaseUnit = item.increaseUnit;
                                    dataPost.increaseDetail = item.increaseDetail;
                                    dataPost.decreaseName = item.decreaseName;
                                    dataPost.decreaseNum = item.decreaseNum;
                                    dataPost.decreasePodet = item.decreasePodet;
                                    dataPost.decreaseUnit = item.decreaseUnit;
                                    dataPost.decreaseDetail = item.decreaseDetail;
                                    dataPost.totalPoint = item.totalPoint;
                                    dataPost.level = item.level;
                                    dataPost.fatherId = fatherId;

                                    $http.post($rootScope.url + '/standard-service/result/add', dataPost).then(function (response) {
                                        if (response.data.status === 200) {
                                            console.log('add okkkk');
                                        } else {
                                            $.notify(response.data.message, 'danger');
                                        }
                                    }, function (x) {
                                        $.notify('服务器出了点问题，我们正在处理', 'danger');
                                    });
                                }


                                //alert("已提交");
                            }

                        });
                    });
                    if (postFlag) {
                        $state.go('app.result');
                    }
                    else {
                        $.notify('填写内容为空', 'danger');
                    }
                };*/

        $scope.reset = function (item) {
            $scope.totalPoints -= item.totalPoint;
            item.increaseNum = "";
            item.increaseDetail = "";
            item.decreaseNum = "";
            item.decreaseDetail = "";
            item.totalPoint = "";
        };
        $scope.resetAll = function () {
            $scope.data.forEach(function (data_i, index) {
                data_i.items.forEach(function (item) {
                    //对于总分是有效数字的条目
                    if (!isNaN(item.totalPoint) && item.totalPoint !== "") {
                        $scope.reset(item);
                    }
                });
            });
        };

//把日期格式2018/04/20替换为2018-04-20
// $scope.datePicked = (new Date()).toLocaleDateString().replace(/\//g, '-');
        $scope.datePicked = moment().format('YYYY-MM-DD');
//页面载入时日历是否自动打开
        $scope.opened = {
            start: false,
            end: false
        };
        $scope.dateOptions = {
            datepickerMode: 'year',
            formatYear: 'yyyy',
            startingDay: 1,
            formatDayTitle: 'yyyy年M月',
        };

        $scope.open = function ($event, attr) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened[attr] = true;
        };

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();
        loadRelations();
    }])
;
