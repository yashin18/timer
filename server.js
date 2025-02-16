const WebSocket = require("ws");
const http = require("http");

const server = http.createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("WebSocket server is running.");
});

const wss = new WebSocket.Server({ server });

let timeRemaining = 0;
let isRunning = false;
let timerInterval = null;

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.send(JSON.stringify({ timeRemaining, isRunning }));

    ws.on("message", (message) => {
        const data = JSON.parse(message);

        if (data.command === "startStop") {
            isRunning = data.isRunning;
            if (isRunning) {
                if (timerInterval) clearInterval(timerInterval);
                timerInterval = setInterval(() => {
                    if (timeRemaining > 0) {
                        timeRemaining--;
                        broadcast();
                    } else {
                        clearInterval(timerInterval);
                        isRunning = false;
                        broadcast();
                    }
                }, 1000);
            } else {
                clearInterval(timerInterval);
            }
        }

        if (data.command === "reset") {
            timeRemaining = data.timeRemaining;
            isRunning = false;
            clearInterval(timerInterval);
            broadcast();
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

function broadcast() {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ timeRemaining, isRunning }));
        }
    });
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
