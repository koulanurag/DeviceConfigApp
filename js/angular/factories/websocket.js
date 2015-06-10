var ws;

function new_websocket() {

    if (typeof ws === "undefined") {
        ws = new WebSocket("ws://localhost:8080");
    }

    return ws;
}