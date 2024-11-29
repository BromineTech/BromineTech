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
                    await sql`
                        INSERT INTO "Issue" (
                            "IssueId", 
                            "ProjectId", 
                            "IssueName", 
                            "IssueDescription", 
                            "IssueStatus", 
                            "IssueLabel", 
                            "CreatedBy", 
                            "MilestoneId", 
                            "Assigned", 
                            "SubIssueOf"
                        ) 
                        VALUES (
                            uuid_generate_v4(), 
                            ${ws.projectId}, 
                            ${action.detail.issueName}, 
                            ${action.detail.issueDescription}, 
                            ${action.detail.issueStatus}, 
                            ${action.detail.issueLabel}, 
                            ${createdBy},                         
                            ${action.detail.milestoneId}, 
                            ${action.detail.assigned}, 
                            ${action.detail.subIssueOf}
                        )
                        RETURNING *

                    `;
                    break;

                  case "delete":
                    await sql`
                    DELETE FROM "Issue"
                    WHERE "ProjectId" = ${ws.projectId} 
                    AND "IssueId" = ${issueId}
                    RETURNING *
                    `;
                    break;
                }
              }
              if (action.subField === "milestone") {//yaha milestone change hoga
                switch (action.type) {

                  case "add":
                    await sql`INSERT INTO "Milestone" (
                                          "MilestoneId", 
                                          "ProjectId", 
                                          "MilestoneName", 
                                          "MilestoneDescription", 
                                          "MilestoneTarget"
                                      ) 
                                      VALUES (
                                          uuid_generate_v4(), 
                                          ${ws.projectId}, 
                                          ${action.detail.milestoneName}, 
                                          ${action.detail.milestoneDescription}, 
                                          ${action.detail.milestoneTarget}
                                      )
                                      RETURNING `;
                    break;

                  case "delete":
                    await sql`
                    DELETE FROM "Milestone"
                    WHERE "ProjectId" = ${ws.projectId} 
                    AND "MilestoneId" = ${action.detail.milestoneId}
                    RETURNING *
                    `;
                    break;
                }
              }
              if (action.subField === "assign") {//yaha pe issue ka assign change hoga
                switch (action.type) {

                  case "add":
                    await sql`
                    UPDATE "Issue"
                    SET "Assigned" = ${action.detail.assigned}
                    WHERE "ProjectId" = ${ws.projectId}
                    AND "IssueId" = ${action.detail.issueId}
                    RETURNING *
                    `;
                    break;

                  case "delete":
                    await sql`
                    UPDATE "Issue"
                    SET "Assigned" = NULL
                    WHERE "ProjectId" = ${ws.projectId}
                    AND "IssueId" = ${action.detail.issueId}
                    RETURNING *
                    `;
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
            if (isActivity) { // yaha pe sirf Activity table ke sath chhedkhni hoga. baki chize isAction ke andr hongi, jo ki iske niche likha hai just
              /* Activity: {isComment: true ya false, 
                            isEvent: true ya false,
                            commentDetails: agr isComment true rha to {},
                            eventDetails: agr isEvent true rha to {
                            eventSet: anyone of values "milestone", "status", "label", "assign" (bascically enums)
                            eventType: anyone of values "add" or "remove",
                            eventInfo: yaha pe string hoga jo btayega is event ko
                            newStatus:
                            newLabel:
                            newAssigned:
                            eventIssueId:
                            eventmemberId: //ye member id kaha se lana hai wahi dekhna hai. mtlb frontend se backend me kaise bhejna hai
                            }
              } */

              
            if(isComment) {
            // commments and replies se deal krna hai
              switch (activity.commentDetails.operation) {
                case "add":
                    await sql`
                    INSERT INTO "Activity" (
                      "ActivityId", 
                      "ActivityDesc", 
                      "ReplyTo", 
                      "MemberId", 
                      "ActivityTime", 
                      "Type", 
                      "IssueId"
                      ) 
                      VALUES (
                          uuid_generate_v4(), 
                          ${activity.commentDetails.comment},
                          NULL, 
                          ${activity.commentDetails.memberId}, 
                          NOW(), 
                          "comment", 
                          ${activity.commentDetails.issueId}
                      )
                      RETURNING * `;
                  break;
                ////////////
                ////////////
                ///SecVul///
                ////////////
                ////////////
                case "delete":
                  await sql`
                    DELETE FROM "Activity"
                    WHERE "ActivityId" = ${activity.commentDetails.activityId} 
                    AND "MemberId" = ${activity.commentDetails.memberId}
                    RETURNING *`;
                  break;

              }


            }
            if (isEvent) {
              // events se deal karenge. example: gitesh created this issue. rajeev added december milestone to this issue. rajeev removed the september lable from this issue
              // milestone, status, label, assign
              switch (activity.eventDetails.eventSet) {
                case "milestone":  // yaha pe milestone ki activities ayengi (rajeev added/removed xyz miletsone to this issue)
                    await sql`
                              INSERT INTO "Activity" (
                                "ActivityId", 
                                "ActivityDesc", 
                                "ReplyTo", 
                                "MemberId", 
                                "ActivityTime", 
                                "Type", 
                                "IssueId"
                                ) 
                                VALUES (
                                    uuid_generate_v4(), 
                                    ${activity.eventDetails.eventInfo},
                                    NULL, 
                                    ${memberId}, 
                                    NOW(), 
                                    "event", 
                                    ${activity.eventDetails.eventIssueId}
                                )
                                RETURNING * `;
                // iska action isAction wale block me handle ho rha hai. mtlb milestone table usme update ho rha hai.
                  break;

                case "status":
                  
                    await sql`INSERT INTO "Activity" (
                              "ActivityId", 
                              "ActivityDesc", 
                              "ReplyTo", 
                              "MemberId", 
                              "ActivityTime", 
                              "Type", 
                              "IssueId"
                              ) 
                              VALUES (
                                  uuid_generate_v4(), 
                                  ${activity.eventDetails.eventInfo},
                                  NULL, 
                                  ${memberId}, 
                                  NOW(), 
                                  "event", 
                                  ${activity.eventDetails.eventIssueId}
                              )
                              RETURNING * `;
                              // iska action isAction me handle ho rha hai. mtlb Issue table me IssueStatus us block me update ho rha hai
                  break;

                case "label":
                    await sql`INSERT INTO "Activity" (
                              "ActivityId", 
                              "ActivityDesc", 
                              "ReplyTo", 
                              "MemberId", 
                              "ActivityTime", 
                              "Type", 
                              "IssueId"
                              ) 
                              VALUES (
                                  uuid_generate_v4(), 
                                  ${activity.eventDetails.eventInfo},
                                  NULL, 
                                  ${memberId}, 
                                  NOW(), 
                                  "event", 
                                  ${activity.eventDetails.eventIssueId}
                              )
                              RETURNING * `;
                              // iska Action apn isAction wale block me handle kr rhe hai. mtlb IssueLabel us block me update kr rhe hai
                  break;

                case "assign":
                    await sql`INSERT INTO "Activity" (
                              "ActivityId", 
                              "ActivityDesc", 
                              "ReplyTo", 
                              "MemberId", 
                              "ActivityTime", 
                              "Type", 
                              "IssueId"
                              ) 
                              VALUES (
                                  uuid_generate_v4(), 
                                  ${activity.eventDetails.eventInfo},
                                  NULL, 
                                  ${memberId}, 
                                  NOW(), 
                                  "event", 
                                  ${activity.eventDetails.eventIssueId}
                              )
                              RETURNING * `;
                    // isAction wale if statement me iska action handle ho rha hai. Issue table update usme ho rha hai.
                  break;
              }
            }
            }
            if (isAction) {
              if (action.subField === "assignIssueTo") { // ye assign kr rha hai ki kisko dena hai issue
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Issue"
                              SET "Assigned" = ${action.detail.assigned}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;

                  case "delete":
                    await sql`UPDATE "Issue"
                              SET "Assigned" = ${null}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;
                }
              }

              if (action.subField === "status") { // yha pe issue me status asdd ya remove kr rhe hai
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Issue"
                              SET "IssueStatus" = ${action.detail.newStatus}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;

                  case "delete":
                    await sql`UPDATE "Issue"
                              SET "IssueStatus" = ${null}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;
                }
              }
              if (action.subField === "label") { // yha pe issue me status asdd ya remove kr rhe hai
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Issue"
                              SET "IssueLabel" = ${action.detail.newLabel}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;

                  case "delete":
                    await sql`UPDATE "Issue"
                              SET "IssueLabel" = ${null}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;
                }
              }
              if (action.subField === "assignSubIssueTo") { // yaha pe apn subIssue kisi person ko assign krte hai
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Issue"
                              SET "Assigned" = ${action.detail.assigned}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;

                  case "delete":
                    await sql`UPDATE "Issue"
                              SET "Assigned" = ${null}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;
                }
              }
              if (action.subField === "milestone") {  //assign a milestone to this issue
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Issue"
                              SET "MilestoneId" = ${action.detail.milestoneId}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;

                  case "delete":
                    await sql`UPDATE "Issue"
                              SET "MilestoneId" = ${null}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;
                }
              }
              if (action.subField === "subIssue") {    // yaha pe child issue ka parent issue choose krna hai.
                switch (action.type) {

                  case "add":
                    await sql`UPDATE "Issue"
                              SET "SubIssueOf" = ${action.detail.subIssueOf}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
                    break;

                  case "delete":
                    await sql`UPDATE "Issue"
                              SET "SubIssueOf" = ${null}
                              WHERE "ProjectId" = ${ws.projectId}
                              AND "IssueId" = ${action.detail.issueId}
                              RETURNING *`;
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
