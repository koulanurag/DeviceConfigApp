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

            ws.onopen = function () {                
                ws.send("whatever"); // retrive device list
                console.log("websocket: send 'whatever'");
            };

            ws.onmessage = function (event) {

                DeviceList.prototype.loadDataSuccess(event);
                callback_function(true);
                console.log("websocket: message", event);

            };

            ws.onerror = function (event) {
                callback_function(false);
                console.log("websocket: error");
            };
            
 /*          return $http(
                {
                    method: this.defaults.endpointGETMethod,
                    url: this.defaults.endpointURL,
                    params: params,
                    cache: false
                }
            ).then($.proxy(DeviceList.prototype.loadDataSuccess, this));
*/
        };

        DeviceList.prototype.loadDataSuccess = function (response) {
            
            this.data = JSON.parse(response.data);

        };

        DeviceList.prototype.getData = function () {

            return this.data;

        };

        return new DeviceList();

    }]);