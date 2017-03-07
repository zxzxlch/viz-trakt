// controllers/auth.js
'use strict';

const trakt = require('../lib/trakt');

exports.new = (req, res) => {
  res.redirect(trakt.getAuthorizeURL());
}

exports.callback = (req, res) => {
  let code = req.query.code;
  
  if (!code) {
    res.status(400).send('Invalid request. Missing code parameter.');
    return;
  }
  
  trakt.getToken(code).subscribe((body) => {
    req.session.token = body.access_token;
    res.redirect('/');
  }, (error) => {
    console.error(`Unable to get access token — ${error}`);
    res.status(400).send(error)
  });
}

exports.logout = (req, res) => {
  req.session = null;
  res.redirect('/');
};
