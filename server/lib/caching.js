// lib/caching.js
// Where we load json files from local storage to ease load on Trakt API

const fs = require('fs');

let cacheInterval = 5 * 24 * 60 * 60; // 24 hours
// ^ If the cache is less than this many minutes old, serve it

module.exports = {
  setCacheInterval: function(interval) {
    cacheInterval = interval;
  },

  writeCacheWithPath: function(path, object) {
    let pathComponents = path.split('/');
    let intermediatePath = '';

    // Create directories for path
    for (let i = 0; i < pathComponents.length - 1; i++) {
      let pathComponent = pathComponents[i];
      pathComponent = pathComponent + '/';
      intermediatePath = intermediatePath + pathComponent;

      if (fs.existsSync(intermediatePath) != true) {
        fs.mkdirSync(intermediatePath);
      }
    }

    // Write JSON to path
    fs.writeFile(path, JSON.stringify(object), function(err) {
      if (err) throw err;
      else console.log('Cache write succeeded: ' + path);
    });
  },

  readCacheWithPath: function(path) {
    let shouldSendCache = false;

    // Check if we should use cache (< cacheInterval)
    if (fs.existsSync(path)) {
      let cachedTime = fs.statSync(path).ctime;

      if (new Date().getTime() / 1000.0 - cachedTime / 1000.0 < cacheInterval) {
        shouldSendCache = true;
      }
    }

    if (!shouldSendCache) return null;
    else return JSON.parse(fs.readFileSync(path, 'utf8'));
  },
};
