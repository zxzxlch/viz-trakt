// server.js
'use strict';

require('dotenv').config();

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');

var app = express();
var config = require('./config/config');

app.set('trust proxy', 1); // trust first proxy
app.set('views', config.root + '/views');
app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Cookie session
app.use(cookieSession({
  name: 'session',
  secret: process.env.APP_SECRET,
  maxAge: 30 * 24 * 60 * 60 * 1000 // 1 month
}));

// Reset flash
app.use((req, res, next) => {
  let app = req.app;
  res.locals = res.locals || {};
  res.locals.flash = app.locals.flash;
  app.locals.flash = null;
  next();
});

// Redirect to /auth/new if token doesn't exist
// app.use((req, res, next) => {
//   // Skip /auth routes
//   if (/\/auth/i.test(req.path)) {
//     next();
//     return;
//   }
  
//   // Check for token
//   if (req.session.token) {
//     next();
//   } else {
//     res.redirect('/auth/new');
//   }
// });

require('./config/routes')(app);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
