// lib/helpers.js
'use strict';

const Rx = require('rxjs/Rx');

exports.processResponse = function([response, body]) {
  return Rx.Observable.create((observer) => {
    let { statusCode } = response;
    // Check for status code 200
    if (statusCode == 200) {
      observer.next(body);
      observer.complete();
    } else {
      let error = `Request failed with status code ${statusCode}`;

      if (body.error_description) 
        error += ' — ' + body.error_description;
      
      console.error(response.headers, response.statusMessage);
      
      observer.error(error);
    }
  });
}
