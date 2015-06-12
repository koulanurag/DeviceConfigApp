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

            //var ws = new WebSocket("ws://localhost:8080");
            var ws = new_websocket(); 

            ws.onerror = function (event) {
                callback_function(false);
                console.log("websocket: error");
            };

            ws.onmessage = function (event) {

                console.log("websocket: message", event);

                var received_json_message = JSON.parse(event.data);

                if (received_json_message.result) {

                    DeviceList.prototype.loadDataSuccess(received_json_message);
                    callback_function(true);

                };
                
            };

            ws.onopen = function () {
                
                setTimeout(function () {
                    // retrive device list
                    ws.send("{\"jsonrpc\": \"2.0\", \"method\": \"get_echosounder_list\", \"params\": [], \"id\": 1}");
                    console.log("websocket: send 'get_echosounder_list'");
                }, 1000);

            };

        };

        DeviceList.prototype.loadDataSuccess = function (response) {
                        
            this.data = JSON.parse(response.result);

        };

        DeviceList.prototype.getData = function () {

            return this.data;

        };

        return new DeviceList();

    }]);