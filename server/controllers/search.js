// controllers/search.js
'use strict';

const trakt = require('../lib/trakt');

exports.getQuery = (req, res) => {
  const { q } = req.query;

  if (!q) {
    res.render('search');
    return;
  }

  trakt.search(q).subscribe(
    (results) => {
      res.render('search', { results });
    },
    (error) => {
      console.error(error);
      res.sendStatus(400);
    },
  );
};
