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

        $rootScope.PersonList = [{
            key: 0,
            value:"全部"
        }
        ];

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
            personId: 0
        };

        $scope.opened = {
            start: false,
            end: false
        };

        var loadPersons = function(){
            $http.get($rootScope.url + '/account-service/person/list?leader=' + $rootScope.account.id)
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.persons = response.data.data;
                    
                    var person = {};
                    response.data.data.forEach(function(person){
                        person.key = person.id;
                        person.value = person.username;
                       $rootScope.PersonList.push(person);
                    })
                } else {
                    $.notify(response.data.message, 'danger');
                }
            }, function (x) {
                $.notify('服务器出了点问题，我们正在处理', 'danger');
            });
        }

        var loadRelations = function () {
            $http.get($rootScope.url + '/account-service/relations/list?personId=' + $rootScope.account.id)
            .then(function (response) {
                if (response.data.status === 200) {
                    $scope.relations = response.data.data;
                    $scope.department = $scope.relations[0];
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

        loadPersons();

        $scope.loadData();
    }]);
