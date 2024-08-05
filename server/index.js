require('dotenv').config();
const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const app = express();
const port = process.env.PORT || 4000;



const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.AUTH0_BASE_URL,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL
};

app.use(auth(config));

// landing page (get request)
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});

// "/project/all" route, yaha pe projectsdikhenge user ke saare (get request)
app.get('/project/all',requiresAuth(), (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const name = req.oidc.user.name;
  const nickname = req.oidc.name.nickname;
  const pfp = req.oidc.user.picture;

  //sql query

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});


// "/createproject" yaha pe user project post karega (post route)
app.post('/createproject',requiresAuth(), (req, res) => {

  const email = req.oidc.user.email; //used for sql query only

  //sql query

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});


// "/project/[id]/overview" id= project's id (get request)
app.get('/project/:projectId/overview',requiresAuth(), (req, res) => {

  const email = req.oidc.user.email; //used for sql query only

  const projectId = req.params.projectId
  console.log(projectId)

  //sql query

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});

// "/project/[id]/issues" id= project's id (get request)
app.get('/project/:projectId/issues',requiresAuth(), (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const projectId = req.params.projectId

  //sql query

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});


// "/project/[id]/issue/[id]" (get)
app.get('/project/:projectId/issue/:issueId',requiresAuth(), (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;


  //sql query

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});

// "/project/[id]/addmember" (post)
app.post('/project/:projectId/addmember',requiresAuth(), (req, res) => {

  const email = req.oidc.user.email; //used for sql query only
  const projectId = req.params.projectId;
  


  //sql query

  res.json(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');

});


// app.get('/profile', requiresAuth(), (req, res) => {
//   res.send(JSON.stringify(req.oidc.user));
// });

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
