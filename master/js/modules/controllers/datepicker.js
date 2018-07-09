/**=========================================================
 * Module: datepicker.js
 * Provides a simple demo for bootstrap datepicker
 =========================================================*/

App.controller('DatepickerCtrl', ['$scope', function ($scope) {
    $scope.open = function ($event) {
        $event.preventDefault();
        $event.stopPropagation();

        $scope.opened = true;
    };

    $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1,
        formatDayTitle: 'yyyy年M月'
    };

    $scope.format = 'yyyy年M月d日';
}]);
