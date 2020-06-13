// client/components/rating-bar.js

import { scaleQuantize } from 'd3';
import { range } from 'lodash';
import React, { Component, PropTypes } from 'react';
import { playsBar as playsBarClassName } from '../styles/plays-bar.scss';

const maxBars = 5;
const scale = scaleQuantize()
  .domain([0, 1])
  .range(range(0, maxBars));

const PlaysBar = (props) => {
  const fillCount = scale(props.fillRatio);

  const bars = Array(maxBars)
    .fill(null)
    .map((value, index) => {
      const className = fillCount < index ? 'bar' : 'bar filled';
      return <div key={index} className={className}></div>;
    });

  return <div className={playsBarClassName}>{bars}</div>;
};

PlaysBar.propTypes = {
  fillRatio: PropTypes.number.isRequired,
};

export default PlaysBar;
