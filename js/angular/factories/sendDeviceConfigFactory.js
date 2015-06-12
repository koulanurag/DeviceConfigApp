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

            ws.onerror = function (event) {
                callback_function(false);
                console.log("websocket: error");
            };
            
            ws.onmessage = function (event) {
                
                DeviceConfig.prototype.sendDataSuccess(JSON.parse(event.data));
                callback_function(true);
                console.log("websocket: message", event);

            };

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "configure";
            jsonrpc_method.params = [];
            jsonrpc_method.params[0] = JSON.stringify(params);
            jsonrpc_method.id = "10";

            ws.send(JSON.stringify(jsonrpc_method));
            console.log("websocket: send", jsonrpc_method);

        };

        DeviceConfig.prototype.sendDataSuccess = function (response) {
            this.status = JSON.parse(response.result);
            console.log('loadDataSuccess')
        };

        DeviceConfig.prototype.getStatus = function () {
            return this.status;
        };

        return new DeviceConfig();

    }]);