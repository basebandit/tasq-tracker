angular.module('Tracker.User')
    .controller('UserCtrl',
        function ($routeParams, user, tasks) {
            var myUser = this;

            myUser.userId = $routeParams['userId'];
            myUser.user = user.data;


            myUser.getAssignedTasks = function (userId, tasks) {
                var assignedTasks = {};

                Object.keys(tasks, function(key, value) {
                    if (value.assignee == userId){
                         assignedTasks[key] = tasks[key];
                    }
                });

                return assignedTasks;
            };

            myUser.tasks = myUser.getAssignedTasks(myUser.userId, tasks);
        });
