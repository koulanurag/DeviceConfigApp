ngDevices.factory('sendDeviceConfigFactory', [ '$http',
    function ($http) {

        function DeviceConfig() {

            this.defaults = {

                endpointGETMethod: 'get',

                endpointURL: 'json/devicesConfig',
                
                device: 'device',
                transducers: 'transducers'

            };

        }

        DeviceConfig.prototype.sendData = function (device,transducers) {
            var params = {};
            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transducers !== '') {
                params[this.defaults.transducers] = transducers;
            }
            return $http(
                {
                    method: this.defaults.endpointGETMethod,
                    url: this.defaults.endpointURL,
                    params: params,
                    cache: false
                }
            ).then($.proxy(DeviceConfig.prototype.sendDataSuccess, this));
        };

        DeviceConfig.prototype.sendDataSuccess = function (response) {
            this.status = response.data;
            console.log('loadDataSuccess')
        };

        DeviceConfig.prototype.getStatus = function () {
            return this.status;
        };

        return new DeviceConfig();

    }]);