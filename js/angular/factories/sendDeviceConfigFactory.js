ngDevices.factory('sendDeviceConfigFactory', [ '$http',
    function ($http) {

        function DeviceConfig() {

            this.defaults = {

                endpointGETMethod: 'get',

                endpointURL: 'json/devicesConfig',
                
                device: 'device',
                deviceStatus:'deviceStatus',
                transducers: 'transducers',
                transmitPower:'transmitPower',
                pingMode: 'pingMode',
                pingInterval:'pingInterval'

            };

        }        

        DeviceConfig.prototype.sendData = function (device,deviceStatus,transmitPower,pingMode,pingInterval,transducers,callback_function) {
            
            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (deviceStatus !== '') {
                params[this.defaults.deviceStatus] = deviceStatus;
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
            
            ws.onmessage = function (event) {

                console.log("recieved response from server");

                DeviceConfig.prototype.sendDataSuccess(event);
                callback_function(true);
            };

            ws.onerror = function (event) {
                callback_function(false);
            };

            ws.send(params);

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