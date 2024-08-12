const WebSocket = require('ws');
require('dotenv').config();

// A map to store WebSocket connections grouped by project ID
const connections = {};

// Initialize WebSocket server
function initializeWebSocketServer(server) {
  const wss = new WebSocket.Server({ noServer: true });

  // Handle WebSocket upgrade requests
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  //   server.on('upgrade', (request, socket, head) => {
  //   const origin = request.headers.origin;

  //   // Validate the origin header (e.g., allow only from https://example.com)
  //   if (origin !== `${process.env.ORIGIN_URL}`) {
  //     socket.destroy(); // Reject the connection if the origin is not allowed
  //     return;
  //   }

  //   wss.handleUpgrade(request, socket, head, (ws) => {
  //     wss.emit('connection', ws, request);
  //   });
  // });

  // Handle new WebSocket connections
  wss.on('connection', (ws, req) => {
    const urlParts = req.url.split('/');
    const projectId = urlParts[2];

    // Initialize the project if not present
    if (!connections[projectId]) {
      connections[projectId] = new Set();
    }

    connections[projectId].add(ws);

    console.log(`New WebSocket connection established for project ${projectId}.`);

    ws.on('message', (message) => {
      const parsedMessage = JSON.parse(message);
      const { route, issueId, text } = parsedMessage;

      console.log(`Received message for project ${projectId}, route ${route}${issueId ? ', issue ' + issueId : ''}:`, parsedMessage);

      broadcastMessageToMembers(projectId, route, issueId, parsedMessage);
    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed for project ${projectId}.`);
      connections[projectId].delete(ws);

      // Cleanup empty project groups
      if (connections[projectId].size === 0) {
        delete connections[projectId];
      }
    });
  });
}

// Broadcast a message to a specific project and optionally a route and issue
function broadcastMessageToMembers(projectId, route, issueId, message) {
  if (!connections[projectId]) return;

  connections[projectId].forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(JSON.stringify({ route, issueId, message }));
        console.log(`Message sent to project ${projectId}${route ? ', route ' + route : ''}${issueId ? ', issue ' + issueId : ''}:`, message);
      } catch (error) {
        console.error(`Error sending message to client in project ${projectId}:`, error);
      }
    }
  });
}

module.exports = { initializeWebSocketServer };
