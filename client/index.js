// client/app.js

import { pick } from 'lodash';
import React from 'react';
import { render } from 'react-dom';
import Show from './components/Show';
import defaultCss from './styles/default.scss';
import css from './styles/show.scss';

const data = JSON.parse($('#data').val());
var showProps = pick(data, ['title', 'year', 'seasons', 'ratings']);
Object.assign(showProps, {
  id: data.ids.trakt,
  slug: data.ids.slug,
});

render(<Show {...showProps} />, $('#root').get(0));
