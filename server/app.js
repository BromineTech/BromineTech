const express = require('express');
const { auth } = require('express-openid-connect');
const app = express();
const port = process.env.PORT || 4000;

const http = require('http');
// const { initializeWebSocketServer } = require('./websockets/socket');
const { initializeWebSocketServer, broadcastMessageToRouteProjectIssue } = require('./websockets/socket');


const auth0Config = require('./auth0Config');
const indexRoutes = require('./routes/index');
const profileRoutes = require('./routes/profile');
const projectRoutes = require('./routes/project');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(auth(auth0Config));


app.use('/', indexRoutes);
app.use('/profile', profileRoutes);
app.use('/project', projectRoutes);

const server = http.createServer(app);
initializeWebSocketServer(server);


server.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


