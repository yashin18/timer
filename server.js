const WebSocket = require("ws"); 
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running.");
});

const wss = new WebSocket.Server({ server });

let timers = {
    1: { timeRemaining: 0, interval: null },
    2: { timeRemaining: 0, interval: null }
};

function startTimer(timer) {
    if (timers[timer].interval) return; // Prevent duplicate intervals

    timers[timer].interval = setInterval(() => {
        if (timers[timer].timeRemaining > 0) {
            timers[timer].timeRemaining--;
        } else {
            clearInterval(timers[timer].interval);
            timers[timer].interval = null;
        }
        broadcast({ timer, timeRemaining: timers[timer].timeRemaining });
    }, 1000);
}

function stopTimer(timer) {
    clearInterval(timers[timer].interval);
    timers[timer].interval = null;
}

function resetTimer(timer) {
    stopTimer(timer);
    timers[timer].timeRemaining = 0;
    broadcast({ timer, timeRemaining: 0 });
}

function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
        const data = JSON.parse(message);
        if (data.action === "start") {
            timers[data.timer].timeRemaining = data.time;
            startTimer(data.timer);
        } else if (data.action === "stop") {
            stopTimer(data.timer);
        } else if (data.action === "reset") {
            resetTimer(data.timer);
        }
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
