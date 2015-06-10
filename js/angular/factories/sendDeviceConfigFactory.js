ngDevices.factory('sendDeviceConfigFactory', [ '$http',
    function ($http) {

        function DeviceConfig() {

            this.defaults = {

                endpointGETMethod: 'get',

                endpointURL: 'json/devicesConfig',
                
                device: 'device',
                transducers: 'transducers',
                transmitPower:'transmitPower',
                pingMode: 'pingMode',
                pingInterval:'pingInterval',

            };

        }        

        DeviceConfig.prototype.sendData = function (callback_function, device,transmitPower,pingMode,pingInterval,transducers) {

            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if(transmitPower !==''){
                params[this.defaults.transmitPower] = transmitPower;
            }
            if(pingMode !==''){
                params[this.defaults.pingMode] = pingMode;
            }
            if(pingInterval !==''){
                params[this.defaults.pingInterval] = pingInterval;
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