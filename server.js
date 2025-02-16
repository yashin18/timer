// server.js
const WebSocket = require('ws');
const http = require('http');

// Create a basic HTTP server (needed for WebSocket to work)
const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('WebSocket server is running.');
});

// Create a WebSocket server on top of the HTTP server
const wss = new WebSocket.Server({ server });

// Variable to store the countdown time
let timeRemaining = 0;
let isRunning = false;

// Listen for WebSocket connections
wss.on('connection', (ws) => {
    console.log('New connection established.');

    // Send initial state to the client
    ws.send(JSON.stringify({ timeRemaining, isRunning }));

    // Handle incoming messages (e.g., start, stop, reset commands)
    ws.on('message', (message) => {
        const data = JSON.parse(message);

        // If the message contains a new time or action
        if (data.action === 'startStop') {
            isRunning = !isRunning;
        } else if (data.action === 'reset') {
            timeRemaining = data.time || 0;
            isRunning = false;
        } else if (data.action === 'setTime') {
            timeRemaining = data.time;
        }

        // Update all connected clients with the new state
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify({ timeRemaining, isRunning }));
            }
        });
    });
});

// Start the HTTP server on port 3000
server.listen(3000, () => {
    console.log('WebSocket server running on ws://localhost:3000');
});
