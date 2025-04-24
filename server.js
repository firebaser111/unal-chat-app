const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('New client connected');
  
  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
  });

  ws.send('Connected to WebSocket server');
});

console.log('WebSocket server is running on ws://localhost:8080');
