const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');
const insertIntoUser = require('../middlewares/insertIntoUser');
const sql = require('../dbConfig');
const getRandomString = require('../utils/randomString');
const getDbId = require('../middlewares/getDbId');

router.get('/', (req, res) => {

// try {
//   if (req.oidc.isAuthenticated()) {
//     res.redirect('/project/all');
//   }
// } catch {
//   res.status(500).send("Internal Server Error")
// }
  res.send("Hello")
});

module.exports = router;
