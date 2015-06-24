ngDevices.config(
    ['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider
            .otherwise('/');

        $stateProvider
            .state('default', {
                url: '/',
                views: {
                    'default': {
                        controller: 'devicesCtrl',
                        templateUrl: 'views/devices.html'
                    }
                }

            })
            .state('add', {
                url: '/add',
                views: {
                    'default': {
                        controller: 'deviceCtrl',
                        templateUrl: 'views/deviceConfig.html'
                    }
                }

            })
            .state('status',{
                url: '/status',
                views: {
                    'default': {
                        controller: 'deviceCtrl',
                        templateUrl: 'views/deviceConfig.html'
                    }
                }
            });

        $stateProvider
            .state('error', {
                url: '/error',
                views: {
                    'default': {
                        templateUrl: 'views/error.html'
                    }
                }
            })
            .state('error.500', {
                url: '/500'
            });
    }]
);
