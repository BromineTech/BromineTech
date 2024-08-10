const express = require('express');
const router = express.Router();
const { requiresAuth } = require('express-openid-connect');

router.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user.nickname));
});

module.exports = router;
