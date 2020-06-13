// lib/trakt.js
'use strict';

const _ = require('lodash');
const { Observable, from, of, bindNodeCallback } = require('rxjs');
const { concatMap, map, tap } = require('rxjs/operators');
const url = require('url');
const axios = require('axios').default;
const querystring = require('querystring');
const config = require('../config/config');
const { readCacheWithPath, writeCacheWithPath } = require('./caching');

const callbackUrl = url.resolve(config.rootUrl, '/auth/callback');
const apiBaseUrl = 'https://api.trakt.tv';

const traktAxios = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'trakt-api-version': 2,
    'trakt-api-key': process.env.TRAKT_CLIENT_ID,
  },
});

function traktRequestOrCachedObs(url, opts = {}, skipCache = false) {
  // Form path from request URL and params
  let path = url;
  if (opts.params) {
    path = `${path}?` + querystring.stringify(opts.params);
  }
  const cachePath = `.cache/api${path}`;

  // Check path
  if (!skipCache) {
    var cachedResult = readCacheWithPath(cachePath);

    if (cachedResult != null) {
      // Load from cache
      /* DEBUG */ console.log(`Cache hit. Returning cached result for ${path}`);
      return of(cachedResult);
    }
  }

  // Send API call to Trakt
  return from(traktAxios.get(url, opts)).pipe(
    concatMap(processResponse),
    tap((data) => writeCacheWithPath(cachePath, data)), // Write to cache
  );
}

function processResponse({ data, headers, status, statusText }) {
  return new Observable((observer) => {
    // Check for status code 200
    if (status == 200) {
      observer.next(data);
      observer.complete();
    } else {
      let error = `Request failed with status code ${status}`;

      if (data.error_description) error += ' — ' + data.error_description;

      console.error(headers, statusText);

      observer.error(error);
    }
  });
}

exports.getAuthorizeURL = () => {
  let authorizeUrl = url.parse('https://trakt.tv/oauth/authorize');
  authorizeUrl.query = {
    response_type: 'code',
    client_id: process.env.TRAKT_CLIENT_ID,
    redirect_uri: callbackUrl,
  };
  return url.format(authorizeUrl);
};

exports.getToken = (code) => {
  return bindNodeCallback(request.post)({
    baseUrl: apiBaseUrl,
    url: '/oauth/token',
    json: true,
    body: {
      code,
      client_id: process.env.TRAKT_CLIENT_ID,
      client_secret: process.env.TRAKT_CLIENT_SECRET,
      redirect_uri: callbackUrl,
      grant_type: 'authorization_code',
    },
  }).pipe(concatMap(processResponse));
};

exports.search = (query) => {
  return traktRequestOrCachedObs('/search/movie,show', {
    params: { query },
  }).pipe(
    map((results) => {
      return results.map((result) => {
        let parsed = _.pick(result, ['type', 'score']);
        return Object.assign(parsed, result.show || result.movie);
      });
    }),
  );
};

exports.getShow = (showId) => {
  return traktRequestOrCachedObs(`/shows/${showId}`, {
    params: { extended: 'full' },
  }).pipe(
    map((body) => _.pick(body, ['title', 'year', 'ids', 'overview', 'rating', 'votes'])),
  );
};

exports.getShowRatings = (showId) => {
  return traktRequestOrCachedObs(`/shows/${showId}/ratings`)
};

exports.getSeasons = (showId) => {
  return traktRequestOrCachedObs(`/shows/${showId}/seasons`, {
    params: { extended: 'full' },
  }).pipe(
    map((body) => {
      return body
        .filter((season) => season.number != 0)
        .map((season) => {
          let { episode_count: episodeCount, aired_episodes: airedEpisodes } = season;
          return _.assign(_.pick(season, ['number', 'title', 'overview', 'rating', 'votes']), {
            episodeCount,
            airedEpisodes,
          });
        });
    }),
  );
};

exports.getEpisode = (showId, seasonNumber, episodeNumber) => {
  return traktRequestOrCachedObs(`/shows/${showId}/seasons/${seasonNumber}/episodes/${episodeNumber}`, {
    params: { extended: 'full' },
  }).pipe(
    map((body) => {
      let data = _.pick(body, ['season', 'number', 'title', 'ids', 'overview']);
      let indexTitle = `${data.season}x${data.number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      })}`;
      return _.assign(data, { indexTitle });
    }),
  );
};

exports.getEpisodeRatings = (showId, seasonNumber, episodeNumber) => {
  return traktRequestOrCachedObs(`/shows/${showId}/seasons/${seasonNumber}/episodes/${episodeNumber}/ratings`)
};

exports.getEpisodeStats = (showId, seasonNumber, episodeNumber) => {
  return traktRequestOrCachedObs(`/shows/${showId}/seasons/${seasonNumber}/episodes/${episodeNumber}/stats`)
};
