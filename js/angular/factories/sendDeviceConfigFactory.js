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
                newWindowStatus: 'newWindowStatus',
                hardwareChannel:'hardware_channel',
                softwareChannel:'software_channel'

            };

        }        

        DeviceConfig.prototype.sendData = function (device,transmitPower,pingMode,pingInterval,transducers,callback_function) {
            
            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transmitPower !== '') {

                if (transmitPower == "12.5") {
                    params[this.defaults.transmitPower] = 5;
                } else if (transmitPower == "50") {
                    params[this.defaults.transmitPower] = 10;
                } else {
                    params[this.defaults.transmitPower] = 20;
                }                
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
            
            var ws = new_websocket();            

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "configure";
            jsonrpc_method.params = [];
            jsonrpc_method.params[0] = JSON.stringify(params);
            jsonrpc_method.id = "10";

            ws.onerror = function (event) {
                console.log("websocket: error");
                callback_function(false);                
            };
            
            ws.onmessage = function (event) {                                                               

                try {

                    var response = JSON.parse(event.data);
                    console.log("websocket: onmessage", response);

                    if (response.id == jsonrpc_method.id) {
                        DeviceConfig.prototype.sendDataSuccess(response);
                        callback_function(true);
                    }

                } catch (e) {
                    console.log("JSON.parse error", event, e);
                }

            };            

            console.log("websocket: send", jsonrpc_method);
            ws.send(JSON.stringify(jsonrpc_method));            

        };

        DeviceConfig.prototype.sendDataSuccess = function (response) {            
            
            try {

                console.log('loadDataSuccess response:', response);
                this.status = JSON.parse(response.result);

            } catch (e) {
                console.log("JSON.parse error", response, e);
            }
            
        };

        DeviceConfig.prototype.getStatus = function () {
            return this.status;
        };
        DeviceConfig.prototype.changeRecordingStatus = function (device,transducerName,hardwareChannel,softwareChannel,newRecordingStatus,callback_function) {
            
            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transducerName !== '') {
                params[this.defaults.transducerName] = transducerName;
            }
            if (hardwareChannel !== '') {
                params[this.defaults.hardwareChannel] = hardwareChannel;
            }
            if (softwareChannel !== '') {
                params[this.defaults.softwareChannel] = softwareChannel;
            }
            if (newRecordingStatus !== '') {
                params[this.defaults.newRecordingStatus] = newRecordingStatus;
            }
            var ws = new_websocket();
            
            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "changeRecordingStatus";
            jsonrpc_method.params = [];
            jsonrpc_method.params[0] = JSON.stringify(params);
            jsonrpc_method.id = "11";

            ws.onerror = function (event) {
                console.log("websocket: error");
                callback_function(false, null);                
            };
            
            ws.onmessage = function (event) {
                
                try {

                    var response = JSON.parse(event.data);
                    console.log("websocket: message", response);

                    var json_result = JSON.parse(response.result);

                    if (response.id == jsonrpc_method.id) {
                        callback_function(true, json_result);
                    }

                } catch (e) {
                    console.log("JSON.parse error", event, e);
                }                

            };            

            console.log("websocket: send", jsonrpc_method);
            ws.send(JSON.stringify(jsonrpc_method));            

        };
        DeviceConfig.prototype.getRecordingStatus = function () {
            return this.recordingStatus;
        };
        DeviceConfig.prototype.changeWindowStatus = function (device,transducerName,hardwareChannel,softwareChannel,newWindowStatus,callback_function) {
            
            var params = {};

            if (device !== '') {
                params[this.defaults.device] = device;
            }
            if (transducerName !== '') {
                params[this.defaults.transducerName] = transducerName;
            }
            if (hardwareChannel !== '') {
                params[this.defaults.hardwareChannel] = hardwareChannel;
            }
            if (softwareChannel !== '') {
                params[this.defaults.softwareChannel] = softwareChannel;
            }
            if (newWindowStatus !== '') {
                params[this.defaults.newWindowStatus] = newWindowStatus;
            }
            var ws = new_websocket();

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "changeWindowStatus";
            jsonrpc_method.params = [];
            jsonrpc_method.params[0] = JSON.stringify(params);
            jsonrpc_method.id = "12";
            
            ws.onerror = function (event) {
                console.log("websocket: error");
                callback_function(false, null);                
            };
            
            ws.onmessage = function (event) {

                try {

                    var response = JSON.parse(event.data);
                    console.log("websocket: message", response);

                    var json_result = JSON.parse(response.result);

                    if (response.id == jsonrpc_method.id) {                        
                        callback_function(true, json_result);
                    }

                } catch (e) {
                    console.log("JSON.parse error", event, e);
                }

            };            

            console.log("websocket: send", jsonrpc_method);
            ws.send(JSON.stringify(jsonrpc_method));            

        };
        DeviceConfig.prototype.getWindowStatus = function () {
            console.log("getWindowStatus", this.windowStatus);
            return this.windowStatus;
        };
        return new DeviceConfig();

    }]);