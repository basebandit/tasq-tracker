'use strict';

describe('Tasks Model', function () {

    beforeEach(module('Tracker.Common'));

    afterEach(inject(function($httpBackend) {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    }));

    it('Should get all', inject(function(TasksModel, $httpBackend, $rootScope) {
        var response = [];
        $httpBackend.when(
            'GET', 'https://tasq-tracker.firebaseio.com/clients/1/tasks/.json'
        ).respond(response);

        $rootScope.$broadcast('onCurrentUserId', 1);

        var promise = TasksModel.all();
        $httpBackend.flush();
        
        promise.then(function(result) {
            expect(result).toEqual(response);
        });
        $rootScope.$digest();
    }));

    it('Should fetch', inject(function(TasksModel, $httpBackend, $rootScope) {
        var response = {};
        $httpBackend.when(
            'GET', 'https://tasq-tracker.firebaseio.com/clients/1/tasks/1.json'
        ).respond(response);

        $rootScope.$broadcast('onCurrentUserId', 1);

        var promise = TasksModel.fetch(1);
        $httpBackend.flush();

        promise.then(function(result) {
            expect(result.data).toEqual(response);
        });
        $rootScope.$digest();
    }));

    it('Should create', inject(function(TasksModel, $httpBackend, $rootScope) {
        var response = {};
        $httpBackend.when(
            'POST', 'https://tasq-tracker.firebaseio.com/clients/1/tasks/.json'
        ).respond(response);

        $rootScope.$broadcast('onCurrentUserId', 1);

        var promise = TasksModel.create({});
        $httpBackend.flush();

        promise.then(function(result) {
            expect(result.data).toEqual(response);
        });
        $rootScope.$digest();
    }));

    it('Should update', inject(function(TasksModel, $httpBackend, $rootScope) {
        var response = {};
        $httpBackend.when(
            'PUT', 'https://tasq-tracker.firebaseio.com/clients/1/tasks/1.json'
        ).respond(response);

        $rootScope.$broadcast('onCurrentUserId', 1);

        var promise = TasksModel.update(1, {});
        $httpBackend.flush();

        promise.then(function(result) {
            expect(result.data).toEqual(response);
        });
        $rootScope.$digest();
    }));

    it('Should destroy', inject(function(TasksModel, $httpBackend, $rootScope) {
        var response = {};
        $httpBackend.when(
            'DELETE', 'https://tasq-tracker.firebaseio.com/clients/1/tasks/1.json'
        ).respond(response);

        $rootScope.$broadcast('onCurrentUserId', 1);

        var promise = TasksModel.destroy(1);
        $httpBackend.flush();

        promise.then(function(result) {
            expect(result.data).toEqual(response);
        });
        $rootScope.$digest();
    }));
});
