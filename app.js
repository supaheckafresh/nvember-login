'use strict';

let mongoose = require('mongoose'),
  passport = require('passport'),
  LocalStrategy = require('passport-local'),
  _ = require('lodash'),
  Promise = require('bluebird'),
  compare = Promise.promisify(require('bcrypt').compare),
  session = require('express-session');

mongoose.connect(process.env.MONGO_URI);
let db = mongoose.connection;
db.on('open', () => console.log('Database Connected'));
db.on('error', () => console.log('Problem connecting to database'));

require('./models/users');

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(
  {usernameField: 'email'},
  (email, password, done) => {
    console.log({email, password});
    let User = mongoose.model('User'),
      Promise = require('bluebird'),
      compare = Promise.promisify(require('bcrypt').compare);

    User.findOne({email})
      .then(user => {
        if (!user) {
          done(new Error('There is no user found with that email address.'));
        } else {
          compare(password, user.password)
            .then(res => {
              if (!res) return done(new Error('That password seems to be incorrect.'));
              console.log(user);
              done(null, user);
            })
            .catch(done);
        }
      })
      .catch(done);
}));

passport.serializeUser((user, next) => {
  next(null, user);
});

passport.deserializeUser((user, next) => {
  next(null, user);
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
