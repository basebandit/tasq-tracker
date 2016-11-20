angular.module('Tracker.Dashboard')
    .controller('DashboardCtrl',
    function (TasksModel, TASK_STATUSES, TASK_TYPES) {
        var dashboard = this;
        dashboard.types = TASK_TYPES;
        dashboard.statuses = TASK_STATUSES;
        dashboard.tasks = [];

        TasksModel.all()
            .then(function (tasks) {
                var arr = [];
                for (var key in tasks) {
                    arr.push(tasks[key]);
                }
                dashboard.tasks = arr;
            });
    });
