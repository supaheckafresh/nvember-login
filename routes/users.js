'use strict';

var express = require('express');
var router = express.Router();
let mongoose = require('mongoose'),
  User = mongoose.model('User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/', (req, res, next) => {
  console.log('post user');
  let newUser = new User(req.body);
  newUser.save();
  res.json({newUser});
});

module.exports = router;
