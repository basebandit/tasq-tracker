angular.module('Tracker.Taskboard')
    .controller('TaskboardCtrl',
        function ($scope, $log, TasksModel, UsersModel,
                    TASK_STATUSES, TASK_TYPES) {
        var Taskboard = this;

        Taskboard.detailsVisible = true;
        Taskboard.currentTaskId = null;
        Taskboard.currentTask = null;
        Taskboard.editedTask = {};
        Taskboard.tasks = [];

        Taskboard.types = TASK_TYPES;
        Taskboard.statuses = TASK_STATUSES;

        Taskboard.users = {};

        UsersModel.all()
            .then(function (result) {
                Taskboard.users = (result !== null && result.length > 0) ? result : [{name: 'Please create a user'}];
                $log.debug('RESULT', result);
            }, function (reason) {
                $log.debug('REASON', reason);
            });

        Taskboard.setCurrentTask = function (task) {
            $log.debug(task);
            Taskboard.currentTaskId = task.id;
            Taskboard.currentTask = task;
            Taskboard.editedTask = angular.copy(Taskboard.currentTask);
        };

        Taskboard.getTasks = function () {
            TasksModel.all()
                .then(function (result) {
                    Taskboard.tasks = (result !== 'null') ? result : {};
                    $log.debug('RESULT', result);
                }, function (reason) {
                    $log.debug('REASON', reason);
                });
        };

        Taskboard.createTask = function () {
            TasksModel.create(Taskboard.editedTask)
                .then(function (result) {
                    Taskboard.getTasks();
                    Taskboard.resetForm();
                    $log.debug('RESULT', result);
                }, function (reason) {
                    $log.debug('ERROR', reason);
                });
        };

        Taskboard.updateTask = function () {
            var fields = ['title', 'description', 'criteria', 'status', 'type', 'reporter', 'assignee'];

            fields.forEach(function (field) {
                Taskboard.currentTask[field] = Taskboard.editedTask[field]
            });

            TasksModel.update(Taskboard.currentTaskId, Taskboard.editedTask)
                .then(function (result) {
                    Taskboard.getTasks();
                    Taskboard.resetForm();
                    $log.debug('RESULT', result);
                }, function (reason) {
                    $log.debug('REASON', reason);
                });
        };

        Taskboard.updateCancel = function () {
            Taskboard.resetForm();
        };

        Taskboard.showMessages = function (field) {
            return Taskboard.detailsForm[field].$touched
                && Taskboard.detailsForm[field].$invalid;
        };

        Taskboard.resetForm = function () {
            Taskboard.currentTask = null;
            Taskboard.editedTask = {};

            Taskboard.detailsForm.$setPristine();
            Taskboard.detailsForm.$setUntouched();
        };

        Taskboard.setDetailsVisible = function (visible) {
            Taskboard.detailsVisible = visible;
        };

        Taskboard.isEmptyStatus = function (status) {
            var empty = true;
            if (Taskboard.tasks) {
                Taskboard.tasks.forEach(function (task) {
                    if (task.status === status) empty = false;
                });
            }

            return empty;
        };

        Taskboard.insertAdjacent = function (target, task, insertBefore) {
            if (target === task) return;

            var fromIdx = Taskboard.tasks.indexOf(task);
            var toIdx = Taskboard.tasks.indexOf(target);

            if (!insertBefore) toIdx++;

            if (fromIdx >= 0 && toIdx >= 0) {
                Taskboard.tasks.splice(fromIdx, 1);

                if (toIdx >= fromIdx) toIdx--;

                Taskboard.tasks.splice(toIdx, 0, task);

                task.status = target.status;
            }
        };

        Taskboard.finalizeDrop = function (task) {
            TasksModel.update(task.id, task)
                .then(function (result) {
                    $log.debug('RESULT', result);
                }, function (reason) {
                    $log.debug('REASON', reason);
                });
        };

        Taskboard.changeStatus = function (task, status) {
            task.status = status.name;
        };

        $scope.$on('taskDeleted', function () {
            Taskboard.getTasks();
            Taskboard.resetForm();
        });

        Taskboard.getTasks();
    });
