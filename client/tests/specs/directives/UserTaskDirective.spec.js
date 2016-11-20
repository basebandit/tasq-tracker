'use strict';

describe('usertask Directive', function () {
    var userTask,
        element,
        TasksModel,
        $rootScope;

    beforeEach(module('Tracker.User'));

    beforeEach(inject(function($q, $compile, _$rootScope_, _TasksModel_) {
        $rootScope = _$rootScope_;

        var directiveMarkup = angular.element('<li usertask></li>');
        element = $compile(directiveMarkup)($rootScope);
        userTask = element.scope().userTask;

        TasksModel = _TasksModel_;

        spyOn(TasksModel, 'destroy').and.callFake(function() {
            var deferred = $q.defer();
            deferred.resolve('data');
            return deferred.promise;
        });

        spyOn($rootScope,'$broadcast').and.callThrough();
    }));

    it('should delete a task', function() {
        userTask.deleteTask('0');

        expect(TasksModel.destroy).toHaveBeenCalledWith('0');

        $rootScope.$digest();

        expect($rootScope.$broadcast).toHaveBeenCalledWith('taskDeleted');
    });
});
