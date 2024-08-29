const WebSocket = require('ws');
require('dotenv').config();
const sql =  require('../dbConfig')
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

    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
      const { 
        route= null,
        issueId= null,
        field= null,
        isText= null,
        text= null,
        isComment= null,
        Comment= null,
        isActivity= null,
        Activity= null
       } = parsedMessage;

       try {

        try {
          if (isText) {
            await sql`INSERT INTO text_table (project_id, issue_id, text) VALUES (${projectId}, ${issueId}, ${text})`;
          }
          if (isComment) {
            await sql`INSERT INTO comment_table (project_id, issue_id, comment) VALUES (${projectId}, ${issueId}, ${Comment})`;
          }
          if (isActivity) {
            await sql`INSERT INTO activity_table (project_id, issue_id, activity) VALUES (${projectId}, ${issueId}, ${Activity})`;
          }
        } catch (dbError) {
          console.error("Database operation error:", dbError);
          // Handle database-specific errors, e.g., notify the client, etc.
        }


            // Broadcast the message to other clients
            try {
              broadcastMessageToMembers(projectId, route, issueId, parsedMessage);
            } catch (broadcastError) {
              console.error("Broadcasting error:", broadcastError);
              // Handle broadcasting errors, e.g., log the issue, etc.
            }
       } catch(err) {
        console.log("Websockt OnMessage handler: ", err);
       }


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
