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

        DeviceConfig.prototype.sendData = function (device, transducers, callback_function) {

            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transducers !== '') {
                params[this.defaults.transducers] = transducers;
            }

            //var ws = new WebSocket("ws://localhost:8080");
            var ws = new_websocket();

            ws.onopen = function () {
                ws.send(params);
            }
            ws.onmessage = function (event) {
                DeviceConfig.prototype.sendDataSuccess(event);
                callback_function(true);
            };

            ws.onerror = function (event) {
                callback_function(false);
            };            

            /*return $http(
                {
                    method: this.defaults.endpointGETMethod,
                    url: this.defaults.endpointURL,
                    params: params,
                    cache: false
                }
            ).then($.proxy(DeviceConfig.prototype.sendDataSuccess, this));*/
        };

        DeviceConfig.prototype.sendDataSuccess = function (response) {
            this.status = JSON.parse(response.data);
            console.log('loadDataSuccess')
        };

        DeviceConfig.prototype.getStatus = function () {
            return this.status;
        };

        return new DeviceConfig();

    }]);