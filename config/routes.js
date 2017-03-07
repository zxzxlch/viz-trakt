// config/routes.js
'use strict';

module.exports = (app) => {
  const auth = require('../controllers/auth');
  const shows = require('../controllers/shows');
  
  app.get('/', (req, res) => {
    res.render('index');
  });
  
  app.get('/auth/new', auth.new);
  app.get('/auth/callback', auth.callback);
  app.get('/shows/:showId', shows.show);
  app.get('/shows/:showId/seasons/:season/episodes/:episode', shows.getEpisode);
};