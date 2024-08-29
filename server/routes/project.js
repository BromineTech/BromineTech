const express = require('express');
const router = express.Router();
const { z } = require("zod");
const { requiresAuth } = require('express-openid-connect');
const insertIntoUser = require('../middlewares/insertIntoUser');
const sql = require('../dbConfig');
const getRandomString = require('../utils/randomString');
const getDbId = require('../middlewares/getDbId');




// zod schemas
const inviteSchema = z.object({
  inviteeEmail: z.string().email("Invalid email address"),
  invitedForRole: z.enum(["Guest", "Admin", "Contributor"]).default("Guest"),
});
const updateMemberSchema = z.object({
  inviteeEmail: z.string().email("Invalid email address"),
  invitedForRole: z.enum(["Guest", "Admin", "Contributor"]),
});

// Get all projects
router.get('/all', requiresAuth(), insertIntoUser, async (req, res) => {
  const email = req.oidc.user.email;
  try {
    const allProjects = await sql`
      SELECT p."ProjectName", p."ProjectStatus", p."ProjectTarget", p."ProjectDescription"
      FROM "User" u
      JOIN "Member" m ON u."UserId" = m."UserId"
      JOIN "Project" p ON m."ProjectId" = p."ProjectId"
      WHERE u."Email" = ${email};
    `;
    res.json(allProjects);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Create a new project
router.post('/createproject', requiresAuth(), async (req, res) => {
  const email = req.oidc.user.email;
  const { ProjectName, ProjectDescription = null } = req.body;
  const memberRole = 'Admin';
  const randomString = getRandomString();

  try {
    const getUserId = await sql`
      SELECT "UserId"
      FROM "User"
      WHERE "Email" = ${email};
    `;
    const userId = getUserId[0]?.UserId;
    if (!userId) throw new Error('User not found');

    const insertIntoProject = await sql`
      INSERT INTO "Project" ("ProjectId", "ProjectName", "ProjectDescripton")
      VALUES (uuid_generate_v4(), ${ProjectName}, ${ProjectDescription})
      RETURNING "ProjectId";
    `;


    const projectId = insertIntoProject[0]?.ProjectId;
    if (!projectId) throw new Error('Project insertion failed');

    await sql`
    INSERT INTO "Member" ("MemberId", "UserId", "ProjectId", "MemberRole")
    VALUES (uuid_generate_v4(), ${userId}, ${projectId}, ${memberRole});
  `;
    
    const projectUrlResult = await sql`
     INSERT INTO "DNS" ("dnsId", "dbId", "url")
     VALUES (uuid_generate_v4(), ${projectId}, ${randomString})
     RETURNING "url";
    `;
    const projectUrlId = projectUrlResult[0].url


    res.redirect(`/project/${projectUrlId}/overview`);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get project overview
router.get('/:projectUrlId/overview', requiresAuth(), getDbId, async (req, res) => {
  const email = req.oidc.user.email;

  const projectId = req.projectId;
  console.log("q")
  try {
    const result = await sql`
      SELECT 
        p."ProjectId", p."ProjectName", p."ProjectDescription", p."ProjectStatus",
        p."ProjectTarget", p."ProjectStart", m."MilestoneId", m."MilestoneName",
        m."MilestoneTarget", l."LinkId", l."InfoLink", mb."MemberRole", u."UserName"
      FROM "User" u
      JOIN "Member" mb ON u."UserId" = mb."UserId"
      JOIN "Project" p ON mb."ProjectId" = p."ProjectId"
      LEFT JOIN "Milestone" m ON p."ProjectId" = m."ProjectId"
      LEFT JOIN "Link" l ON p."ProjectId" = l."ProjectId"
      WHERE u."Email" = ${email} AND p."ProjectId" = ${projectId};
    `;
    
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get project issues
router.get('/:projectUrlId/issues', requiresAuth(), getDbId, async (req, res) => {
  const email = req.oidc.user.email;
  const projectId = req.projectId;
  try {
    const result = await sql`
      SELECT 
        i."IssueId", i."IssueName", i."IssueStatus", i."IssueLabel", m."MilestoneName",
        m."MilestoneId", i."Assigned", i."SubIssueOf"
      FROM "User" u
      JOIN "Member" mb ON u."UserId" = mb."UserId"
      JOIN "Project" p ON mb."ProjectId" = p."ProjectId"
      JOIN "Issue" i ON p."ProjectId" = i."ProjectId"
      LEFT JOIN "Milestone" m ON i."MilestoneId" = m."MilestoneId"
      WHERE u."Email" = ${email} AND p."ProjectId" = ${projectId};
    `;
    res.status(200).json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get specific issue details
router.get('/:projectUrlId/issue/:issueId', requiresAuth(), getDbId, async (req, res) => {
  const email = req.oidc.user.email;
  const projectId = req.projectId;
  const issueId = req.issueId;
  try {
    const result = await sql`
      SELECT 
        i."IssueId", i."IssueName", i."IssueStatus",i."IssueDescription" i."IssueLabel", m."MilestoneName",
        m."MilestoneId", i."Assigned", i."SubIssueOf", a."ActivityId", a."ActivityDesc",
        a."ReplyTo", a."MemberId", a."ActivityTime", u2."UserName" AS "ActivityUserName"
      FROM "User" u
      JOIN "Member" mb ON u."UserId" = mb."UserId"
      JOIN "Project" p ON mb."ProjectId" = p."ProjectId"
      JOIN "Issue" i ON p."ProjectId" = i."ProjectId"
      LEFT JOIN "Milestone" m ON i."MilestoneId" = m."MilestoneId"
      JOIN "Activity" a ON i."IssueId" = a."IssueId"
      JOIN "Member" mb2 ON a."MemberId" = mb2."MemberId"
      JOIN "User" u2 ON mb2."UserId" = u2."UserId"
      WHERE u."Email" = ${email} AND p."ProjectId" = ${projectId} AND i."IssueId" = ${issueId};
    `;
    res.status(200).json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// 
// email template daala bacha hai
// 


// Add a new member to a project
router.post('/:projectUrlId/addmember', requiresAuth(), getDbId, async (req, res) => {
  const inviterEmail = req.oidc.user.email;
  const inviterName = req.oidc.user.name;
  const projectId = req.projectId;
  console.log(projectId)
  
  const result = inviteSchema.safeParse(req.body);

  if (!result.success) {
      // If validation fails, send a 400 response with the errors
      return res.status(400).json({ errors: result.error.issues });
  }

  const { inviteeEmail, invitedForRole = 'Guest' } = req.body;
  try {
    const inviterMember = await sql`
      SELECT m."MemberId"
      FROM "Member" m
      JOIN "User" u ON m."UserId" = u."UserId"
      WHERE u."Email" = ${inviterEmail} AND m."ProjectId" = ${projectId};
    `;
    console.log(inviterMember)
    const inviterMemberId = inviterMember[0]?.MemberId;
    if (!inviterMemberId) throw new Error('Member not found');

  
   const insertIntoInvites = await sql`
      INSERT INTO "Invites" ("InvitesId", "InvitedBy", "InvitedToProjectId", "InvitedEmail", "InvitedForRole")
      VALUES (uuid_generate_v4(), ${inviterMemberId}, ${projectId}, ${inviteeEmail}, ${invitedForRole})
      RETURNING "InvitesId";
    `;

    const invitesId = insertIntoInvites[0]?.invitesId;
 

    await sql`
    SELECT m."MemberId"
    FROM "Member" m
    JOIN "Project" p ON m."ProjectId" = p."ProjectId"
    WHERE m."MemberId" = ${inviterMemberId} AND m."ProjectId" = ${projectId};
  `;

  const getProjectName = await sql`
  SELECT p."ProjectName"
  FROM "Member" m
  JOIN "Project" p ON m."ProjectId" = p."ProjectId"
  WHERE m."MemberId" = ${inviterMemberId} AND m."ProjectId" = ${projectId};
`;


  const projectName = getProjectName[0]?.ProjectName;


    // email template daalna bacha hai.



    // Email logic 
    const to = `${inviteeEmail}`;
    const subject = `You have been invited to join ${projectName}`;
    const bodyContent = `
    <div style="width: 600px; height: auto; border: 1px solid #000; padding: 20px; box-sizing: border-box; position: relative;">
        <!-- Space for logo at the top -->
        <div style="height: 60px; padding:10px 10px 10px 0px ">
        <img src="https://bromine.tech/logo.jpg" alt="banner of Bromine" style="border-radius: 15px; padding: 5px; width: 60px; height: auto;">
        </div>
                <!-- Horizontal line for separation -->
            <hr style="border: 1px solid #ccc; margin: 20px 0;">
        <div>
            <div style="font-weight: bold; font-size: 1.6em; line-height: 1.2em; margin-botton: 10px">
                <p style="margin: 0;">${inviterName}</p>
                <p style="margin: 0;">(${inviterEmail})</p>
                <p style="margin: 0;">invited you to join in the Project: ${projectName}.</p>
            </div>

            <p>Use Bromine to plan, organise, lead and control your projects and crush your deadlines.</p>


            <!-- Horizontal line for separation -->
            <hr style="border: 1px solid #ccc; margin: 20px 0;">
    
            <!-- Button -->
            <a href="https://bromine.tech/invite/${invitesId}" style="display: inline-block; padding: 10px 20px; margin-top: 20px; font-size: 16px; color: #fff; background-color: #007BFF; text-decoration: none; border-radius: 5px;">Join Your Team</a>
        </div>
    </div>
    `;
    const subscribed = true;
    const name = 'Bromine';
    const headers = {};
    
    // Properly stringify the requestBody object
    const requestBody = JSON.stringify({
        to: to,
        subject: subject,
        body: bodyContent,
        subscribed: subscribed,
        name: name,
        headers: headers
    });
    
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.USE_PLUNK_API_KEY}`
        },
        body: requestBody
    };
    
    
        const response = await fetch('https://api.useplunk.com/v1/send', options);
        const data = await response.json();
        console.log(data);
        if(data.error){
        res.status(500).json({error:"Invite Not Sent"})
        return;
        }
        
        res.status(200).json({success:"Invite Sent"})
        
    
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle invite acceptance
router.get('/invite/:inviteId', requiresAuth(), insertIntoUser, async (req, res) => {
  const { inviteId } = req.params;
  const email = req.oidc.user.email;
  try {
    const emailInInvitesTable = await sql`
      SELECT "InvitedEmail", "InvitedForRole", "InvitedToProjectId"
      FROM "Invites"
      WHERE "InvitesId" = ${inviteId};
    `;
    if (emailInInvitesTable[0]?.InvitedEmail === email) {
      const { InvitedForRole, InvitedToProjectId } = emailInInvitesTable[0];
      const invitedForRole = InvitedForRole 
      const projectId = InvitedToProjectId
      const getUserId = await sql`
        SELECT "UserId"
        FROM "User"
        WHERE "Email" = ${email};
      `;
      const userId = getUserId[0]?.UserId;
      await sql`
        INSERT INTO "Member" ("MemberId", "UserId", "ProjectId", "MemberRole")
        VALUES (uuid_generate_v4(), ${userId}, ${projectId}, ${invitedForRole});
      `;

      const getProjectUrl = await sql `
      SELECT "url"
      FROM "DNS"
      WHERE "dbId" = ${projectId}
      `

      const projectUrlId = getProjectUrl[0]?.url;
      res.redirect(`/project/${projectUrlId}/overview`);
    } else {
      res.redirect(`/project/all`);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// route to update member role
router.post('/:projectUrlId/updateMemberRole', requiresAuth(), getDbId, async (req, res) => {
  const projectId = req.projectId;
  const adminEmail = req.oidc.user.email;

  const result = updateMemberSchema.safeParse(req.body);

  if (!result.success) {
      // If validation fails, send a 400 response with the errors
      return res.status(400).json({ errors: result.error.issues });
  }

 const { memberEmail, memberRole } = req.body;
  try {
    // check if the member inviting is admin or not
    const checkRole = await sql`
      SELECT m."MemberRole"
      FROM "Member" m 
      JOIN "User" u
      ON m."UserId" = u."UserId"
      WHERE u."Email" = ${adminEmail}
      AND m."ProjectId" = ${projectId};
    `;
    console.log(checkRole);
    const role = checkRole[0]?.MemberRole;
    console.log(role);
    if(role !== 'Admin'){
      res.json({
        error:"Unauthorised"
      })
      return
    }

    const getUserId = await sql`
      SELECT "UserId"
      FROM "User"
      WHERE "Email" = ${memberEmail};
    `;
    const userId = getUserId[0]?.UserId;
    if (!userId) throw new Error('User not found');

    const updateMemberRole = await sql`
      UPDATE "Member"
      SET "MemberRole" = ${memberRole}
      WHERE "ProjectId" = ${projectId}
      AND "UserId" = ${userId}
      RETURNING *; 

    `;
    if (updateMemberRole.count === 0) {
      return res.status(404).json({ error: 'No such user found in this project' });
    }    


      res.status(200).json({ success: 'Member Role updated'});
    } catch (err) {
      console.error('Error executing query', err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
  });

module.exports = router;
