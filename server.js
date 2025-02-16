<<<<<<< HEAD
const WebSocket = require("ws"); 
const http = require("http");

// Create HTTP server
const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain",
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Security-Policy": "default-src *; connect-src * ws: wss:"
    });
    res.end("WebSocket server is running.");
});

// Attach WebSocket server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
        console.log("Received:", message);

        // Broadcast the message to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });
});

// Start the server on Railway
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
});
=======
const https = require('https');
const fs = require('fs');
const WebSocket = require('ws');
const express = require('express');

// Load SSL from Railway environment variables
const serverOptions = {
    key: fs.readFileSync('/etc/letsencrypt/live/billiardtv.ir/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/billiardtv.ir/fullchain.pem')
};

// Create Express app
const app = express();
const server = https.createServer(serverOptions, app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);

        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => console.log('Client disconnected'));
});

// Start server
const PORT = process.env.PORT || 443;
server.listen(PORT, () => {
    console.log(`WebSocket Server running on https://billiardtv.ir`);
});
>>>>>>> c1590de (Initial commit)
