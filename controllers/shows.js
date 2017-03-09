// controllers/shows.js
'use strict';

const _ = require('lodash');
const Rx = require('rxjs/Rx');
const trakt = require('../lib/trakt');

exports.getShow = (req, res) => {
  const { showId } = req.params;

  const show = trakt.getShow(showId);
  const seasons = trakt.getSeasons(showId).map(seasons => { return { seasons } });
  const ratings = trakt.getShowRatings(showId).map(ratings => { return { ratings } });

  Rx.Observable.of(show, seasons, ratings)
    .mergeAll(2)
    .reduce((acc, curr) => Object.assign({}, acc, curr), {})
    .subscribe(show => {
      res.render('show', { show });
    }, error => {
      console.error(error);
      res.sendStatus(400);
    });
};

exports.getEpisode = (req, res) => {
  let { showId, season: seasonNumber, episode: episodeNumber } = req.params;
  seasonNumber = parseInt(seasonNumber);
  episodeNumber = parseInt(episodeNumber);

  const episode = trakt.getEpisode(showId, seasonNumber, episodeNumber);
  
  const ratings = trakt.getEpisodeRatings(showId, seasonNumber, episodeNumber)
    .map(ratings => { return { ratings } });
    
  const plays = trakt.getEpisodeStats(showId, seasonNumber, episodeNumber)
    .map(stats => { return { plays: stats.plays } });

  Rx.Observable.of(episode, ratings, plays)
    .mergeAll(2)
    .reduce((acc, curr) => Object.assign({}, acc, curr), {})
    .subscribe(data => {
      res.json(data);
    }, error => {
      console.error(error);
      res.sendStatus(400);
    });
};
