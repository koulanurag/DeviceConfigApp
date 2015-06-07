ngDevices.factory('deviceListFactory', [ '$http',
    function ($http) {


        function DeviceList() {

            this.defaults = {

                endpointGETMethod: 'get',

                endpointURL: 'json/devices'

            };

        }

        DeviceList.prototype.loadData = function () {
            var params = {};
            return $http(
                {
                    method: this.defaults.endpointGETMethod,
                    url: this.defaults.endpointURL,
                    params: params,
                    cache: false
                }
            ).then($.proxy(DeviceList.prototype.loadDataSuccess, this));
        };

        DeviceList.prototype.loadDataSuccess = function (response) {

            this.data = response.data;

        };

        DeviceList.prototype.getData = function () {

            return this.data;

        };

        return new DeviceList();

    }]);

/*var deviceFactoryResolve = {

    loadData: ['$q', '$stateParams', 'deviceListFactory', '$state',
        function ($q, $stateParams, deviceListFactory, $state) {
            var deferred = $q.defer();
            deviceListFactory.loadData()
                .then(function (response) {
                    deferred.resolve(response);
                }, function (response) {
                    console.log("There was an error while retrieving device list");
                    $state.go('error');
                    deferred.reject(response);
                });
            return deferred.promise;
        }]
}*/