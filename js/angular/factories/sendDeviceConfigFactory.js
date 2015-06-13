ngDevices.factory('sendDeviceConfigFactory', [ '$http',
    function ($http) {

        function DeviceConfig() {

            this.defaults = {

                device: 'device',
                deviceStatus:'deviceStatus',
                transducers: 'transducers',
                transmitPower:'transmitPower',
                pingMode: 'pingMode',
                pingInterval:'pingInterval',
                transducerName:'transducerName',
                newRecordingStatus: 'newRecordingStatus',
                newWindowStatus: 'newWindowStatus'


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
                
                console.log("ws.onmessage: sendData", event);
                console.log("websocket: message", event);
                DeviceConfig.prototype.sendDataSuccess(JSON.parse(event.data));
                callback_function(true);                

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
            console.log('loadDataSuccess response:', response)
            this.status = JSON.parse(response.result);
        };

        DeviceConfig.prototype.getStatus = function () {
            return this.status;
        };
        DeviceConfig.prototype.changeRecordingStatus = function (device,transducerName,newRecordingStatus,callback_function) {
            
            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transducerName !== '') {
                params[this.defaults.transducerName] = transducerName;
            }
            if (newRecordingStatus !== '') {
                params[this.defaults.newRecordingStatus] = newRecordingStatus;
            }
            var ws = new_websocket();
            
            ws.onerror = function (event) {
                callback_function(false, null);
                console.log("websocket: error");
            };
            
            ws.onmessage = function (event) {
                
                console.log("websocket: message", event);
                var result = JSON.parse(JSON.parse(event.data).result); //it can be improved                
                callback_function(true, result);

            };

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "changeRecordingStatus";
            jsonrpc_method.params = [];
            jsonrpc_method.params[0] = JSON.stringify(params);
            jsonrpc_method.id = "10"; //may be it has to bechanged

            ws.send(JSON.stringify(jsonrpc_method));
            console.log("websocket: send", jsonrpc_method);

        };
        DeviceConfig.prototype.getRecordingStatus = function () {
            return this.recordingStatus;
        };
        DeviceConfig.prototype.changeWindowStatus = function (device,transducerName,newWindowStatus,callback_function) {
            
            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transducerName !== '') {
                params[this.defaults.transducerName] = transducerName;
            }
            if (newWindowStatus !== '') {
                params[this.defaults.newWindowStatus] = newWindowStatus;
            }
            var ws = new_websocket();
            
            ws.onerror = function (event) {
                callback_function(false, null);
                console.log("websocket: error");
            };
            
            ws.onmessage = function (event) {

                console.log("websocket: message", event);
                var result = JSON.parse(JSON.parse(event.data).result);//it can be improved
                callback_function(true, result);                

            };

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "changeWindowStatus";
            jsonrpc_method.params = [];
            jsonrpc_method.params[0] = JSON.stringify(params);
            jsonrpc_method.id = "10"; //may be it has to bechanged

            ws.send(JSON.stringify(jsonrpc_method));
            console.log("websocket: send", jsonrpc_method);

        };
        DeviceConfig.prototype.getWindowStatus = function () {
            console.log("getWindowStatus", this.windowStatus);
            return this.windowStatus;
        };
        return new DeviceConfig();

    }]);