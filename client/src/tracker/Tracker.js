var myModule = angular.module('Tracker', [
    'ngRoute',
    'ngAnimate',
    'firebase',
    'ngMessages',
    'Tracker.Common',
    'Tracker.Dashboard',
    'Tracker.Login',
    'Tracker.Taskboard',
    'Tracker.Help',
    'Tracker.User',
    'auth0',
    'angular-jwt',
    'angular-storage'
]);

myModule.config(function($routeProvider, $httpProvider, $provide,
    authProvider, CURRENT_BACKEND, jwtInterceptorProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'src/tracker/taskboard/tmpl/taskboard.html',
            controller: 'TaskboardCtrl',
            controllerAs: 'taskboard',
            requiresLogin: true
        })
        .when('/dashboard', {
            templateUrl: 'src/tracker/dashboard/tmpl/dashboard.html',
            controller: 'DashboardCtrl',
            controllerAs: 'dashboard',
            requiresLogin: true
        })
        .when('/help', {
            templateUrl: 'src/tracker/help/tmpl/help.html',
            controller: 'HelpCtrl',
            controllerAs: 'help',
            //requiresLogin: false
        })
        .when('/users', {
            templateUrl: 'src/tracker/user/tmpl/users.html',
            controller: 'UsersCtrl',
            controllerAs: 'users',
            requiresLogin: true
        })
        .when('/users/:userId', {
            templateUrl: 'src/tracker/user/tmpl/user.html',
            controller: 'UserCtrl',
            controllerAs: 'myUser',
            requiresLogin: true,
            resolve: {
                user: function($route, $routeParams, UsersModel) {
                    var userId = $route.current.params['userId'] ? $route.current.params['userId'] : $routeParams['userId'];
                    return UsersModel.fetch(userId);
                },
                stories: function($rootScope, TasksModel) {
                    return TasksModel.all();
                }
            }
        })
        .when('/login', {
            templateUrl: 'src/tracker/login/tmpl/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'login'
        })
        .otherwise({ redirectTo: '/' });

    // Auth0 Authentication
    //authProvider.init({
    // domain: 'tasq-tracker.auth0.com',
    // clientID: 'BTCY8bZ2h2mh9dAcHWlLje0w34y5yGO7'
    //});
    // Auth0 Authentication
    authProvider.init({
        domain: 'angello.auth0.com',
        clientID: 'Fq8hKAkghu45WpnqrYTc6dbvXhBUdP7l'
    });

    // Loading interceptor
    $httpProvider.interceptors.push('loadingInterceptor');

    // Request interceptor
    if (CURRENT_BACKEND === 'firebase') {
        jwtInterceptorProvider.authPrefix = '';
    }

    jwtInterceptorProvider.tokenGetter = function(store) {
        return store.get('userToken');
    };

    $httpProvider.interceptors.push('jwtInterceptor');




    // Decorator
    // Use the `decorator` solution to substitute or attach behaviors to
    // original service instance; @see angular-mocks for more examples....
    $provide.decorator('$log', function($delegate) {
        // TODO Extract this into a utility service
        function timeStamp() {
            // Create a date object with the current time
            var now = new Date();

            // Create an array with the current month, day and time
            var date = [now.getMonth() + 1, now.getDate(), now.getFullYear()];

            // Create an array with the current hour, minute and second
            var time = [now.getHours(), now.getMinutes(), now.getSeconds()];

            // Determine AM or PM suffix based on the hour
            var suffix = (time[0] < 12) ? "AM" : "PM";

            // Convert hour from military time
            time[0] = (time[0] < 12) ? time[0] : time[0] - 12;

            // If hour is 0, set it to 12
            time[0] = time[0] || 12;

            // If seconds and minutes are less than 10, add a zero
            for (var i = 1; i < 3; i++) {
                if (time[i] < 10) {
                    time[i] = "0" + time[i];
                }
            }

            // Return the formatted string
            return date.join("/") + " " + time.join(":") + " " + suffix;
        }

        // Save the original $log.debug()
        var debugFn = $delegate.debug;

        $delegate.debug = function() {
            // Prepend timestamp
            arguments[0] = timeStamp() + ' - ' + arguments[0];

            // Call the original with the output prepended with formatted timestamp
            debugFn.apply(null, arguments)
        };

        return $delegate;
    });
});

myModule.factory('loadingInterceptor', function(LoadingService) {
    var loadingInterceptor = {
        request: function(config) {
            LoadingService.setLoading(true);
            return config;
        },
        response: function(response) {
            LoadingService.setLoading(false);
            return response;
        }
    };
    return loadingInterceptor;
});

myModule.run(function($rootScope, LoadingService, LoginService) {
    $rootScope.$on('$routeChangeStart', function(e, curr, prev) {
        LoadingService.setLoading(true);
    });

    $rootScope.$on('$routeChangeSuccess', function(e, curr, prev) {
        LoadingService.setLoading(false);
    });

    $rootScope.$on('$locationChangeStart', function() {
        LoginService.authenticateUser();
    });
});

myModule.value('TASK_STATUSES', [
    { name: 'To Do' },
    { name: 'In Progress' },
    { name: 'Progress Review' },
    { name: 'QA Review' },
    { name: 'Verified' }
]);

myModule.value('TASK_TYPES', [
    { name: 'Feature' },
    { name: 'Enhancement' },
    { name: 'Repair' },
    { name: 'Assembly' }
]);

myModule.constant('Firebase', window.Firebase);
