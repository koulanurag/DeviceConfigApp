ngDevices.factory('deviceListFactory', [ '$http',
    function ($http) {
        
        

        function DeviceList() {

            this.defaults = {

                endpointGETMethod: 'get',

                endpointURL: 'json/devices'

            };

        }

        DeviceList.prototype.loadData = function (callback_function) {

            var params = {};
            
            var ws = new_websocket(); 

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "get_echosounder_list";
            jsonrpc_method.params = [];            
            jsonrpc_method.id = "2";

            ws.onerror = function (event) {
                console.log("websocket: error");
                callback_function(false);
            };

            ws.onmessage = function (event) {

                console.log("websocket: onmessage", event);

                try {
                    
                    var response = JSON.parse(event.data);

                    if (response.id == jsonrpc_method.id) {
                        DeviceList.prototype.loadDataSuccess(response);
                        callback_function(true);
                    };

                } catch (e) {
                    console.log("JSON.parse error", event, e);
                }
                
            };

            ws.onopen = function () {
                
                setTimeout(function () {                    
                    console.log("websocket: send", jsonrpc_method);
                    ws.send(JSON.stringify(jsonrpc_method));
                }, 1000);

            };

        };
         DeviceList.prototype.loadEchosounderConfiguration = function (callback_function) {

            var params = {};
            
            var ws = new_websocket(); 

            var jsonrpc_method = {};
            jsonrpc_method.jsonrpc = "2.0";
            jsonrpc_method.method = "get_echosounder_configuration";
            jsonrpc_method.params = [];            
            jsonrpc_method.id = "2";//change it as required

            ws.onerror = function (event) {
                console.log("websocket: error");
                callback_function(false);
            };

            ws.onmessage = function (event) {

                console.log("websocket: onmessage", event);

                try {
                    
                    var response = JSON.parse(event.data);

                    if (response.id == jsonrpc_method.id) {
                        DeviceList.prototype.loadEchoConfigSuccess(response);
                        callback_function(true);
                    };

                } catch (e) {
                    console.log("JSON.parse error", event, e);
                }
                
            };

            ws.onopen = function () {
                
                setTimeout(function () {                    
                    console.log("websocket: send", jsonrpc_method);
                    ws.send(JSON.stringify(jsonrpc_method));
                }, 1000);

            };

        };       

        DeviceList.prototype.loadEchoConfigSuccess = function (response) {
                        
            try {
                this.echosounderConfig = JSON.parse(response.result);
            } catch (e) {
                console.log("JSON.parse error", response, e);
            }

        }; 
        DeviceList.prototype.getEchosounderConfiguration = function (response) {
                        
            return this.echosounderConfig;

        };          

        DeviceList.prototype.loadDataSuccess = function (response) {
                        
            try {
                this.data = JSON.parse(response.result);
            } catch (e) {
                console.log("JSON.parse error", response, e);
            }

        };

        DeviceList.prototype.getData = function () {

            return this.data;

        };

        return new DeviceList();

    }]);