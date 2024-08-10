const WebSocket = require('ws');

function initializeWebSocketServer(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established.');

    // Handle incoming messages
    ws.on('message', (message) => {
      console.log('Received:', message);

      // Example: Route-specific handling (e.g., for the /project route)
      if (message.includes('project')) {
        console.log('Project-specific WebSocket message:', message);
        // Add your project-specific logic here
      }

      // Send a response
      ws.send('Message received');
    });

    // Handle connection close
    ws.on('close', () => {
      console.log('WebSocket connection closed.');
    });
  });

  
}

module.exports = { initializeWebSocketServer };
