var ws;

function new_websocket() {

    if (typeof ws === "undefined") {
        console.log('new instance created')
        ws = new WebSocket("ws://localhost:8080");
    }

    return ws;
}

/*
ngDevices.factory('webSocketFactory',[
    function () {

        function WebSocket() {

            this.defaults = {

                endpointURL: 'ws://localhost:8080'

            };

        }

        WebSocket.prototype.openConnection = function () {


            this.ws = new WebSocket(this.defaults.endpointURL);

            this.ws.onopen = function()
            {
                console.log('connection open')
            }

            this.ws.onerror = function () {
                console.log('error in connection')
            };
        };
        WebSocket.prototype.getWebSocket = function () {

            return this.ws;

        };

        return new WebSocket();

    }]);*/
