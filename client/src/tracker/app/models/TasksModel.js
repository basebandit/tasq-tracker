angular.module('Tracker.Common')
    .service('TasksModel',
        function ($http, EndpointConfigService, UtilsService) {
            var service = this,
                MODEL = '/tasks/';

            service.all = function () {
                return $http.get(EndpointConfigService.getUrl(
                    MODEL + EndpointConfigService.getCurrentFormat()))
                        .then(
                            function(result) {
                                return UtilsService.objectToArray(result);
                            }
                        );
            };

            service.fetch = function (task_id) {
                return $http.get(
                    EndpointConfigService.getUrlForId(MODEL, task_id)
                );
            };

            service.create = function (task) {
                return $http.post(
                    EndpointConfigService.getUrl(MODEL + EndpointConfigService.getCurrentFormat()), task
                );
            };

            service.update = function (task_id, task) {
                return $http.put(
                    EndpointConfigService.getUrlForId(MODEL, task_id), task
                );
            };

            service.destroy = function (task_id) {
                return $http.delete(
                    EndpointConfigService.getUrlForId(MODEL, task_id)
                );
            };
        });
