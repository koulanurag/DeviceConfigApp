ngDevices.config(
    ['$stateProvider', '$urlRouterProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $httpProvider) {

        $urlRouterProvider
            .otherwise('/');

        $stateProvider
            .state('default', {
                url: '/',
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
