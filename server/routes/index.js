const express = require('express');
const router = express.Router();
const insertIntoUser = require('../middlewares/insertIntoUser');
const sql = require('../dbConfig');
const getRandomString = require('../utils/randomString');
const getDbId = require('../middlewares/getDbId');

router.get('/', (req, res) => {


  if (req.oidc.isAuthenticated()) {
    res.redirect('/project/all');
    return;
  }

  res.json("Login Button")
});

module.exports = router;
