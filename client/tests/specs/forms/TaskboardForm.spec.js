'use strict';

describe('Taskboard form', function() {
    var scope, ctrl;

    beforeEach(module('Tracker.Taskboard'));
    beforeEach(module('Tracker.Templates'));

    beforeEach(inject(function($q, $rootScope, $controller, $templateCache, $compile) {
        var UsersModel = {
            all: function() {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }
        };

        var TasksModel = {
            all: function() {
                var deferred = $q.defer();
                deferred.resolve({});
                return deferred.promise;
            }
        };

        scope = $rootScope.$new();

        ctrl = $controller('TaskboardCtrl', {
            $scope: scope,
            TASK_STATUSES: {},
            TASK_TYPES: {},
            UsersModel: UsersModel,
            TasksModel: TasksModel
        });

        scope.taskboard = ctrl;

        var templateHtml = $templateCache.get('src/tracker/taskboard/tmpl/taskboard.html');
        var formElem = angular.element(templateHtml);
        $compile(formElem)(scope);

        scope.$digest()
    }));

    it('should be invalid by default', function() {
        expect(ctrl.detailsForm.$invalid).toBeTruthy();
    });

    it('should be valid with populated fields', function() {
        ctrl.editedTask = {
            title: 'Title',
            status: 'To Do',
            type: 'Enhancement',
            reporter: 'Ruth Mareri',
            assignee: 'Racheal Mareri'
        };

        scope.$digest();

        expect(ctrl.detailsForm.$valid).toBeTruthy();
    });
});
