// controllers/shows.js
'use strict';

const of = require('rxjs').of;
const { map, mergeAll, reduce } = require('rxjs/operators');
const trakt = require('../lib/trakt');

exports.getShow = (req, res) => {
  const { showId } = req.params;

  const show = trakt.getShow(showId);
  const seasons = trakt.getSeasons(showId).pipe(
    map((seasons) => {
      return { seasons };
    }),
  );
  const ratings = trakt.getShowRatings(showId).pipe(
    map((ratings) => {
      return { ratings };
    }),
  );

  of(show, seasons, ratings)
    .pipe(
      mergeAll(2),
      reduce((acc, curr) => Object.assign({}, acc, curr), {}),
    )
    .subscribe(
      (show) => {
        res.render('show', { show });
      },
      (error) => {
        console.error(error);
        res.sendStatus(400);
      },
    );
};

exports.getEpisode = (req, res) => {
  let { showId, season: seasonNumber, episode: episodeNumber } = req.params;
  seasonNumber = parseInt(seasonNumber);
  episodeNumber = parseInt(episodeNumber);

  const episode = trakt.getEpisode(showId, seasonNumber, episodeNumber);

  const ratings = trakt.getEpisodeRatings(showId, seasonNumber, episodeNumber).pipe(
    map((ratings) => {
      return { ratings };
    }),
  );

  const plays = trakt.getEpisodeStats(showId, seasonNumber, episodeNumber).pipe(
    map((stats) => {
      return { plays: stats.plays };
    }),
  );

  of(episode, ratings, plays)
    .pipe(
      mergeAll(2),
      reduce((acc, curr) => Object.assign({}, acc, curr), {}),
    )
    .subscribe(
      (data) => {
        res.json(data);
      },
      (error) => {
        console.error(error);
        res.sendStatus(400);
      },
    );
};
