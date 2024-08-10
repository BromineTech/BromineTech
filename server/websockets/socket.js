const WebSocket = require('ws');

// A map to store WebSocket connections grouped by route and IDs
const groups = {};

// Initialize WebSocket server
function initializeWebSocketServer(server) {
  const wss = new WebSocket.Server({ noServer: true });

  // Handle WebSocket upgrade requests
  server.on('upgrade', (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  });

  // Handle new WebSocket connections
  wss.on('connection', (ws, req) => {
    const urlParts = req.url.split('/');
    const route = urlParts[1];
    const projectId = urlParts[2];
    const innerRoute = urlParts[3];
    const issueId = urlParts[4];
    console.log(innerRoute)
    // Initialize the route and project if not present
    if (!groups[route]) {
      groups[route] = {};
    }
    if (!groups[route][projectId]) {
      groups[route][projectId] = {};
    }
    if (issueId) {
        console.log("1")
      if (!groups[route][projectId][issueId]) {
        console.log("2")
        groups[route][projectId][issueId] = new Set();
      }
      groups[route][projectId][issueId].add(ws);
    } 
    
    if (!issueId){
        console.log("3")
        if(innerRoute==='overview'){
      if (!groups[route][projectId]['overview']) {
        groups[route][projectId]['overview'] = new Set();
      }
      groups[route][projectId]['overview'].add(ws);
    } 
    if(innerRoute==='issues'){
        if (!groups[route][projectId]['issues']) {
            groups[route][projectId]['issues'] = new Set();
          }
          groups[route][projectId]['issues'].add(ws);
    }

    }

    console.log(`New WebSocket connection established in route ${route}, project ${projectId}, issue ${issueId || 'overview'}.`);

    ws.on('message', (message) => {
      const parsedMessage = message.toString();
      console.log(`Received in route ${route}, project ${projectId}, issue ${issueId || 'overview'}:`, parsedMessage);
      if(issueId){
        broadcastMessageToRouteProjectIssue(route, projectId,null, issueId, parsedMessage)
      } else {
        broadcastMessageToRouteProjectIssue(route, projectId,innerRoute, null, parsedMessage)
      }

    });

    ws.on('close', () => {
      console.log(`WebSocket connection closed in route ${route}, project ${projectId}, issue ${issueId || 'overview'}.`);
      if (issueId) {
        groups[route][projectId][issueId].delete(ws);
        if (groups[route][projectId][issueId].size === 0) {
          delete groups[route][projectId][issueId];
        }
      } else {
        groups[route][projectId]['overview'].delete(ws);
        if (groups[route][projectId]['overview'].size === 0) {
          delete groups[route][projectId]['overview'];
        }
      }

      // Cleanup empty groups and routes
      if (Object.keys(groups[route][projectId]).length === 0) {
        delete groups[route][projectId];
      }
      if (Object.keys(groups[route]).length === 0) {
        delete groups[route];
      }
    });
  });
}

// Broadcast a message to a specific route, project, and optionally issue
function broadcastMessageToRouteProjectIssue(route, projectId, innerRoute, issueId, message) {
  if (issueId) {
    if (!groups[route] || !groups[route][projectId] || !groups[route][projectId][issueId]) return;

    groups[route][projectId][issueId].forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
          console.log(`Message sent to route ${route}, project ${projectId}, issue ${issueId}:`, message);
        } catch (error) {
          console.error(`Error sending message to client in route ${route}, project ${projectId}, issue ${issueId}:`, error);
        }
      } else {
        console.warn(`Client in route ${route}, project ${projectId}, issue ${issueId} is not open.`);
      }
    });
  } else {
    if(innerRoute==='overview'){
        if (groups[route] && groups[route][projectId]) {
            const overviewClients = groups[route][projectId]['overview'] || new Set();
            
            
            overviewClients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                try {
                  client.send(message);
                  console.log(`Message sent to route ${route}, project ${projectId}, overview:`, message);
                } catch (error) {
                  console.error(`Error sending message to client in route ${route}, project ${projectId}, overview:`, error);
                }
              }
            });
          }
    }
    
    if(innerRoute==='issues'){
        if (groups[route] && groups[route][projectId]) {
            const issuesClients = groups[route][projectId]['issues'] || new Set();
            
            
            issuesClients.forEach((client) => {
              if (client.readyState === WebSocket.OPEN) {
                try {
                  client.send(message);
                  console.log(`Message sent to route ${route}, project ${projectId}, issues:`, message);
                } catch (error) {
                  console.error(`Error sending message to client in route ${route}, project ${projectId}, overview:`, error);
                }
              }
            });
          }
    }

    
  }
}

module.exports = { initializeWebSocketServer, broadcastMessageToRouteProjectIssue };
