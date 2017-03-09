// client/app.js

import { pick as _pick } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { render } from 'react-dom';
import Show from './components/show';
import defaultCss from './styles/default.scss';
import css from './styles/show.scss';

const data = JSON.parse($('#data').val());
var showProps = _pick(data, ['title', 'year', 'seasons', 'ratings']);
Object.assign(showProps, {
  id: data.ids.trakt,
  slug: data.ids.slug
});

render(
  <Show {...showProps} />,
  $('#root').get(0)
);

window.addEventListener('click', event => {
  if(event.target.tagName === 'A' && event.target.getAttribute('href') === '#') {
    event.preventDefault();
  }
});
