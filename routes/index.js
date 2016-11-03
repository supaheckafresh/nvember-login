'use strict';

const express = require('express'),
  router = express.Router(),
  passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  if (req.user) {
    res.json({
      message: 'we still have a user',
      user: req.user,
      session: req.session
    });
  } else {
    res.json({
      message: 'oops, we don\'t have a user'
    });
  }
});

router.post('/login',
  passport.authenticate('local'),

  (req, res, next) => {
  res.json({
    user: req.user,
    session: req.session,
    message: 'successful sign-in'
  })
});

module.exports = router;
