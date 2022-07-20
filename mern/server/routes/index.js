const express = require('express');
const router = express.Router();

const passportAuth0 = require('../auth/auth0');

router.get('/login', function(req, res, next) {
  res.send('Go back and register!');
});

router.get('/auth/auth0', passportAuth0.authenticate('auth0'));

router.get('/auth/auth0/callback',
  passportAuth0.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication
    res.json(req.user);
});


router.get('/test2', (req, res) => {
  res.json({
    name: "tobi",
    age: 99
   })
})

router.get('/test',
  passportAuth0.authenticate('auth0', { failureRedirect: '/login', failureMessage: true }),
  function(req, res) {
    res.json(req.user.username);
  });

module.exports = router;