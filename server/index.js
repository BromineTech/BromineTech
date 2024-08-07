const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const app = express();
const port = process.env.PORT || 4000;
const auth0Config = require('./auth0Config');
const sql = require('./dbConfig');
const insertIntoUser = require('./middlewares/insertIntoUser');

// *********************************
// invite route likhna bacha hua hai
//***********************************

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(auth(auth0Config));

// landing page (get request)
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});

app.get('/profile',requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// "/project/all" route, yaha project show karenge saare user ke aur user ka data User table mei daalenge
app.get('/project/all',requiresAuth(), insertIntoUser, async (req, res) => {

  const email = req.oidc.user.email; 
  const name = req.oidc.user.name;
  const nickname = req.oidc.nickname;
  const pfp = req.oidc.user.picture;

  try {
    const allProjects = await sql`
    SELECT p."ProjectName"
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


// "/createproject" yaha pe user project post karega (post route)

app.post('/createproject',requiresAuth(), async (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const ProjectName = req.body.ProjectName;
  const memberRole = 'Admin';


  try {
    const getUserId = await sql`
    SELECT "UserId"
    FROM "User"
    WHERE "Email" = ${email};
    `;

    const userId = getUserId[0]?.UserId;
    if (!userId) {
      throw new Error('User not found');
    }

    const insertIntoProject = await sql`
    INSERT INTO "Project" ("ProjectId", "ProjectName")
    VALUES (
        uuid_generate_v4(),
        ${ProjectName}
    )
    RETURNING "ProjectId";
    `;

    const projectId = insertIntoProject[0]?.ProjectId;
    if (!projectId) {
      throw new Error('Project insertion failed');
    }

    const insertIntoMember = await sql`
    INSERT INTO "Member" ("MemberId", "UserId", "ProjectId", "MemberRole")
    VALUES (
        uuid_generate_v4(),
        ${userId},
        ${projectId},
        ${memberRole}
    );
    `;

    console.log('Member inserted successfully');

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});


// "/project/[id]/overview" id= project's id (get request)
app.get('/project/:projectId/overview',requiresAuth(), async (req, res) => {

  const email = req.oidc.user.email; //used for sql query only

  const projectId = req.params.projectId
  console.log(projectId)

  try {
    // Use tagged template literals to query the database
    const result = await sql`
    SELECT 
    p."ProjectId",
    p."ProjectName",
    p."ProjectDescription",
    p."ProjectStatus",
    p."ProjectTarget",
    p."ProjectStart",
    m."MilestoneId",
    m."MilestoneName",
    m."MilestoneTarget",
    l."LinkId",
    l."InfoLink"
    FROM 
        "User" u
    JOIN 
        "Member" mb ON u."UserId" = mb."UserId"
    JOIN 
        "Project" p ON mb."ProjectId" = p."ProjectId"
    LEFT JOIN 
        "Milestone" m ON p."ProjectId" = m."ProjectId"
    LEFT JOIN 
        "Link" l ON p."ProjectId" = l."ProjectId"
    WHERE 
        u."Email" = ${email}
        AND p."ProjectId" = ${projectId};
    `;
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

});

// "/project/[id]/issues" id= project's id (get request)
app.get('/project/:projectId/issues',requiresAuth(), async (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const projectId = req.params.projectId

  try {
    const result = await sql`
    SELECT 
    i."IssueId", 
    i."IssueName", 
    i."IssueStatus", 
    i."IssueLabel", 
    m."MilestoneName", 
    m."MilestoneId", 
    i."Assigned",
    i."SubIssueOf"
    FROM 
        "User" u
    JOIN 
        "Member" mb ON u."UserId" = mb."UserId"
    JOIN 
        "Project" p ON mb."ProjectId" = p."ProjectId"
    JOIN 
        "Issue" i ON p."ProjectId" = i."ProjectId"
    LEFT JOIN 
        "Milestone" m ON i."MilestoneId" = m."MilestoneId"
    WHERE 
        u."Email" = ${email}
        AND p."ProjectId" = ${projectId};
    `;
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});


// "/project/[id]/issue/[id]" (get)
app.get('/project/:projectId/issue/:issueId',requiresAuth(), async (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;


  try {
    const result = await sql`
    SELECT 
    i."IssueId", 
    i."IssueName", 
    i."IssueStatus", 
    i."IssueLabel", 
    m."MilestoneName", 
    m."MilestoneId", 
    i."Assigned", 
    i."SubIssueOf",
    a."ActivityId",
    a."ActivityDesc",
    a."ReplyTo",
    a."MemberId",
    a."ActivityTime",
    u2."UserName" AS "ActivityUserName"
    FROM 
        "User" u
    JOIN 
        "Member" mb ON u."UserId" = mb."UserId"
    JOIN 
        "Project" p ON mb."ProjectId" = p."ProjectId"
    JOIN 
        "Issue" i ON p."ProjectId" = i."ProjectId"
    LEFT JOIN 
        "Milestone" m ON i."MilestoneId" = m."MilestoneId"
    JOIN 
        "Activity" a ON i."IssueId" = a."IssueId"
    JOIN 
        "Member" mb2 ON a."MemberId" = mb2."MemberId"
    JOIN 
        "User" u2 ON mb2."UserId" = u2."UserId"
    WHERE 
        u."Email" = ${email}
        AND p."ProjectId" = ${projectId}
        AND i."IssueId" = ${issueId};
    `;
    res.json(result);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});

// "/project/[id]/addmember" (post)
// email api yaha par likhna bacha hai
app.post('/project/:projectId/addmember',requiresAuth(), async (req, res) => {

  const inviterEmail = req.oidc.user.email; //used for sql query only
  const projectId = req.params.projectId;
  const inviteeEmail = req.body.inviteeEmail;
  
  try {
    const inviterMemberIdMemberId = await sql`
    SELECT m."MemberId"
    FROM "Member" m
    JOIN "User" u ON m."UserId" = u."UserId"
    WHERE u."Email" = ${inviterEmail}
    AND m."ProjectId" = ${projectId};
    `;

    if (inviterMemberId.length === 0) {
      throw new Error('Member not found');
    }


    const insertIntoInvites = await sql`
      INSERT INTO "Invites" ("InvitesId", "InvitedBy", "InvitedToProjectId", "InvitedEmail")
      VALUES (
          uuid_generate_v4(),
          ${inviterMemberId},
          ${projectId},
          ${inviteeEmail}
      );
    `;

    if (insertIntoInvites.length === 0) {
      throw new Error('Member not found');
    }
    //yaha
    //    email
    //         ka 
    //           logic
    //                likhna
    //                      hai
    res.status(200).json({ success: 'invite sent' });

  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});


// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
