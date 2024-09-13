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
    ws.projectId = projectId;

    // Initialize the project if not present
    if (!connections[projectId]) {
      connections[projectId] = new Set();
    }

    connections[projectId].add(ws);

    console.log(`New WebSocket connection established for project ${projectId}.`);

    ws.on('message', async (message) => {
      const parsedMessage = JSON.parse(message);
      const { 
        route,
        issueId= null,
        milestoneId= null,
        temporaryId= null,
        field= null,
        isText= null,
        text= null,
        isActivity= null,
        activity= null,
        isAction= null,
        action= null
       } = parsedMessage;

       try {

        try {
          if (route === "overview") {
            if (isText) {
              if (field === "projectName") {
                await sql`UPDATE "Project"
                    SET "ProjectName" = ${text}
                    FROM "DNS"
                    WHERE "Project"."ProjectId" = "DNS"."dbId"
                    AND "DNS"."url" = ${ws.projectId}`;
              }
              if (field === "projectDescription") {
                await sql`UPDATE "Project"
                    SET "ProjectDescription" = ${text}
                    FROM "DNS"
                    WHERE "Project"."ProjectId" = "DNS"."dbId"
                    AND "DNS"."url" = ${ws.projectId}`;
              }
              if (field === "milestoneName") {
                await sql`UPDATE "Milestone"
                    SET "MilestoneName" = ${text}
                    FROM "DNS"
                    WHERE "Milestone"."ProjectId" = "DNS"."dbId"
                    AND "DNS"."url" = ${ws.projectId}`;
              }
              if (field === "milestoneDescription") {
                await sql`UPDATE "Milestone"
                    SET "MilestoneDescription" = ${text}
                    FROM "DNS"
                    WHERE "Milestone"."ProjectId" = "DNS"."dbId"
                    AND "DNS"."url" = ${ws.projectId}`;
              }
            }
            if (isAction) {
              if (action.subField === "projectStartDate") { // check for redundancy of queries
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Project"
                          SET "ProjectStart" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Project"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;
                  
                  case "update":
                    await sql`UPDATE "Project"
                          SET "ProjectStart" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Project"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;
                }
              }
              if (action.subField === "projectTargetDate") { // check for redundancy of queries
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Project"
                          SET "ProjectTarget" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Project"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;
                  
                  case "update":
                    await sql`UPDATE "Project"
                          SET "ProjectTarget" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Project"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;
                }
              }
              if (action.subField === "projectStatus") {
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Project"
                          SET "ProjectStatus" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Project"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;
                  
                  case "update":
                    await sql`UPDATE "Project"
                          SET "ProjectStatus" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Project"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;
                }
              }
              if (action.subField === "link") { // see delete operation. how to give linkId and review delete query
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Link"
                          SET "InfoLink" = ${action.detail} 
                          FROM "DNS"
                          WHERE "Link"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
                    break;

                  case "delete":
                    await sql`DELETE FROM "Link"
                              USING "DNS"
                              WHERE "Link"."LinkId" = ${action.detail}  -- Replace with the specific LinkId
                              AND "Link"."ProjectId" = "DNS"."dbId"
                              AND "DNS"."url" = ${ws.projectId} `;
                    break;
                }
              }
              if (action.subField === "milestone") {//yaha pe milestone create hoga ya delete hoga and review delete query
                switch (action.type) {

                  case "add":
                    await sql`INSERT INTO "Milestone" ("MilestoneId", "ProjectId", "MilestoneName", "MilestoneTarget")
                              SELECT 
                                  uuid_generate_v4(),
                                  "Project"."ProjectId",
                                  'New Milestone Name',
                                  '2023-12-31'
                              FROM 
                                  "Project"
                              JOIN 
                                  "DNS" ON "Project"."ProjectId" = "DNS"."dbId"
                              WHERE 
                                  "DNS"."url" = 'your_provided_url'`;
                      break;

                  case "delete":
                    await sql`DELETE FROM "Milestone"
                              USING "DNS"
                              WHERE "Milestone"."ProjectId" = "DNS"."dbId"
                              AND "DNS"."url" = ${ws.projectId}
                              AND "Milestone"."MilestoneId" = 'your_specific_milestone_id'`;
                    break;
                }
              }
              if (action.subField === "milestoneTargetDate") { // review delete query
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Milestone"
                              SET "MilestoneTarget" = '2023-12-31'
                              FROM "DNS"
                              WHERE "Milestone"."ProjectId" = "DNS"."dbId"
                              WHERE "MilestoneId" = 'your_specific_milestone_id'
                              AND "DNS"."url" = ${ws.projectId}`;
                    break;

                  case "delete":
                    await sql`UPDATE "Milestone"
                              SET "MilestoneTarget" = ${null}
                              FROM "DNS"
                              WHERE "Milestone"."ProjectId" = "DNS"."dbId"
                              WHERE "MilestoneId" = 'your_specific_milestone_id'
                              AND "DNS"."url" = ${ws.projectId}`;
                    break;
                }
              }
            }
          }
          if (route === "issues") {
            if (isAction) {
              if (action.subField === "issue") {//yaha pe issue create hoga ya delete hoga
                switch (action.type) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
              if (action.subField === "milestone") {//yaha milestone change hoga
                switch (action.type) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
              if (action.subField === "assign") {//yaha pe issue ka assign change hoga
                switch (action.activityType) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
            }
          }
          if (issueId === "issueId") {
            if (isText) {
              if (field === "issueName") {
                await sql`UPDATE "Issue"
                          SET "IssueName" = ${text}
                          FROM "DNS"
                          WHERE "Issue"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
              }
              if (field === "issueDescription") {
                await sql`UPDATE "Issue"
                          SET "IssueDescription" = ${text}
                          FROM "DNS"
                          WHERE "Issue"."ProjectId" = "DNS"."dbId"
                          AND "DNS"."url" = ${ws.projectId}`;
              }
            }
            if (isActivity) {
    
            }
            if (isAction) {
              if (action.subField === "assignIssueTo") {
                switch (action.activityType) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
              if (action.subField === "assignSubIssueTo") {
                switch (action.type) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
              if (action.subField === "milestone") {
                switch (action.activityType) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
              if (action.subField === "subIssue") {
                switch (action.type) {

                  case "add":
                    await sql``;
                    break;

                  case "delete":
                    await sql``;
                    break;
                }
              }
            }
          }
          
        } catch (dbError) {
          console.error("Database operation error:", dbError);
          // Handle database-specific errors, e.g., notify the client, etc.
        }


            // Broadcast the message to other clients
            try {
              broadcastMessageToMembers(ws.projectId, route, issueId, parsedMessage);
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
