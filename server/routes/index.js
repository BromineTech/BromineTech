const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/', (req, res) => {

  if (req.oidc.isAuthenticated()) {
    res.redirect('/project/all');
  }
  
});

module.exports = router;
