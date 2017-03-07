// config/config.js
'use strict';

var path = require('path');
var rootPath = path.normalize(__dirname + '/..');

module.exports = {
  root: rootPath,
  rootUrl: process.env.APP_BASE_URL,
  app: {
    name: process.env.APP_NAME
  }
};