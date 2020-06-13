// config/routes.js
'use strict';

module.exports = (app) => {
  const auth = require('../controllers/auth');
  const shows = require('../controllers/shows');
  const search = require('../controllers/search');

  // app.get('/auth/new', auth.new);
  // app.get('/auth/callback', auth.callback);

  app.get('/', search.getQuery);
  app.get('/search', search.getQuery);
  app.get('/shows/:showId', shows.getShow);
  app.get('/shows/:showId/seasons/:season/episodes/:episode', shows.getEpisode);

  // Trakt API calls
  
};
