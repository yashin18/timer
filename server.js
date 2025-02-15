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
