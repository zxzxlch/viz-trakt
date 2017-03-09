// lib/trakt.js
'use strict';

const _ = require('lodash');
const Rx = require('rxjs/Rx');
const url = require('url');
const request = require('request');
const config = require('../config/config');
const processResponse = require('../lib/helpers').processResponse;

const callbackUrl = url.resolve(config.rootUrl, '/auth/callback');
const apiBaseUrl = 'https://api.trakt.tv';

var baseRequest = request.defaults({
    baseUrl: apiBaseUrl,
    url: '',
    json: true,
    headers: {
      'trakt-api-version': 2,
      'trakt-api-key': process.env.TRAKT_CLIENT_ID
    }
});

exports.getAuthorizeURL = () => {
  let authorizeUrl = url.parse('https://trakt.tv/oauth/authorize');
  authorizeUrl.query = {
    response_type: 'code',
    client_id: process.env.TRAKT_CLIENT_ID,
    redirect_uri: callbackUrl
  };
  return url.format(authorizeUrl);
};

exports.getToken = (code) => {
  return Rx.Observable.bindNodeCallback(request.post)({
    baseUrl: apiBaseUrl,
    url: '/oauth/token',
    json: true,
    body: {
      code,
      client_id: process.env.TRAKT_CLIENT_ID,
      client_secret: process.env.TRAKT_CLIENT_SECRET,
      redirect_uri: callbackUrl,
      grant_type:	'authorization_code'
    }
  })
    .concatMap(processResponse);
};

exports.search = (query) => {
  return Rx.Observable.bindNodeCallback(baseRequest)({
    url: '/search/movie,show',
    qs: { 
      query
    }
  })
    .concatMap(processResponse)
    .map(results => {
      return results.map(result => {
        let parsed = _.pick(result, ['type', 'score']);
        return Object.assign(parsed, result.show || result.movie);
      });  
    });
};

exports.getShow = (showId) => {
  return Rx.Observable.bindNodeCallback(baseRequest)({
    url: `/shows/${showId}`,
    qs: { extended: 'full' }
  })
    .concatMap(processResponse)
    .map((body) => _.pick(body, ['title', 'year', 'ids', 'overview', 'rating', 'votes']));
};

exports.getShowRatings = (showId) => {
  return Rx.Observable
    .bindNodeCallback(baseRequest)({
      url: `/shows/${showId}/ratings`,
    })
    .concatMap(processResponse);
};

exports.getSeasons = (showId) => {
  return Rx.Observable.bindNodeCallback(baseRequest)({
    url: `/shows/${showId}/seasons`,
    qs: { extended: 'full' }
  })
    .concatMap(processResponse)
    .map((body) => {
      return body
        .filter(season => season.number != 0)
        .map(season => {
          let { episode_count: episodeCount, aired_episodes: airedEpisodes } = season;
          return _.assign(
            _.pick(season, ['number', 'title', 'overview', 'rating', 'votes']), 
            { episodeCount, airedEpisodes }
          );
        });
    });
};

exports.getEpisode = (showId, seasonNumber, episodeNumber) => {
  return Rx.Observable
    .bindNodeCallback(baseRequest)({
      url: `/shows/${showId}/seasons/${seasonNumber}/episodes/${episodeNumber}`,
      qs: { extended: 'full' }
    })
    .concatMap(processResponse)
    .map(body => {
      let data = _.pick(body, ['season', 'number', 'title', 'ids', 'overview']);
      let indexTitle = `${data.season}x${data.number.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
      return _.assign(data, { indexTitle });
    });
};

exports.getEpisodeRatings = (showId, seasonNumber, episodeNumber) => {
  return Rx.Observable
    .bindNodeCallback(baseRequest)({
      url: `/shows/${showId}/seasons/${seasonNumber}/episodes/${episodeNumber}/ratings`,
    })
    .concatMap(processResponse);
};

exports.getEpisodeStats = (showId, seasonNumber, episodeNumber) => {
  return Rx.Observable
    .bindNodeCallback(baseRequest)({
      url: `/shows/${showId}/seasons/${seasonNumber}/episodes/${episodeNumber}/stats`,
    })
    .concatMap(processResponse);
};
