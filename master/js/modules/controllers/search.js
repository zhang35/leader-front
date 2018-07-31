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

        $scope.PersonList = [{
            key: 0,
            value:"请选择",
        }
        ];


        $rootScope.DepartmentList = [{
            key: 0,
            value:"请选择",
        }];

        $scope.timeStart = moment().subtract(7, 'days').format('YYYY-MM-DD')
        $scope.timeEnd = moment().format('YYYY-MM-DD');
        // $scope.timeStart = '';
        // $scope.timeEnd = '';
        //默认为最近一周的成绩
        $scope.search = {
            increaseType: 0,
            commentType: 0,
            timeStart: '',
            timeEnd: '',
            page: 1,
            size: 10,
            personId: 0,
            departmentId: 0
        };

        $scope.opened = {
            start: false,
            end: false
        };

        var loadRelations = function () {
            $http.get($rootScope.url + '/account-service/relations/list?personId=' + $rootScope.account.id)
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.relations = response.data.data;
                    $scope.department = $scope.relations[0];
                    loadDepartments();
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
            
        }

        var loadDepartments = function(){
         var httpUrl = "";
            //常委查看所有部门
            if ($rootScope.account.role === 1){
                httpUrl = $rootScope.url + '/account-service/department/list?departmentType=2';
            }
            //部门领导只看自己领导的部门
            else if($rootScope.account.role ===2 ){
                httpUrl = $rootScope.url + '/account-service/department/list?id=' + $rootScope.account.leader;
            }

            $http.get(httpUrl)
            .then(function (response) {
                if (response.data.status === 200) {
                    response.data.data.forEach(function(item){
                        var department = {};
                        department.key = item.id;
                        department.value = item.departmentName;
                        $rootScope.DepartmentList.push(department);
                    });
                    $scope.search.department = 0;

                    // $scope.loadPersons();
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            }); 
        }

        $scope.loadPersons = function(){
            //当前部门下的人员
            var httpUrl = $rootScope.url + '/account-service/person/list?role=3&leader=' + $scope.search.departmentId;
            $http.get(httpUrl)
            .then(function (response) {
                if (response.data.status === 200) {

                    $scope.PersonList = [{
                        key: 0,
                        value:"请选择",
                    }
                    ];

                    response.data.data.forEach(function(item){
                        var person = {};
                        if (item.role===3){
                            person.key = item.id;
                            person.value = item.username;
                            $scope.PersonList.push(person);
                        }
                    })

                    $scope.search.personId = 0;

                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
        }

        var buildParam = function () {
            var param = {
                method: 'GET',
                url:$rootScope.url+'/standard-service/result/search',
                params: $scope.search
            };
            return param;
        };
        $scope.loadData = function () {
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
       };

       $scope.commentChanged = function(item){
        item.commentChanged = true;
    }

    $scope.saveComment = function(){
        var data = [];
        var data_i = {};
        $scope.items.forEach(function (item) {
            if (item.commentChanged){
                data_i.standId = item.id;
                data_i.leaderId = $rootScope.account.id;
                data_i.commentContent = item.commentContent;
                data_i.commentTime = moment().format('YYYY-MM-DD HH:mm:ss');

                data.push(data_i);
            }
        });

        $http({
            method: 'POST',
            url: $rootScope.url + '/standard-service/comment/add-batch',
            data: data
        }).then(function (response) {
            if (response.data.status != 200) {
                $.notify(response.data.message, 'danger');
            } 
            else {
                $.notify("评语保存成功！", 'success');
                $scope.loadData();
            }
        })
    }


        //前端所能交互的函数loadData也必须在$scope中。
        // $scope.loadData = loadData();

        $scope.disableComment = true;

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

        $(window).resize(function () {
            var d = $('#container');
            d.height($(window).height() - d.offset().top);
        });
        $(window).resize();


        loadRelations();
    }]);
