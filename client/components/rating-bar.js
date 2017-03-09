// client/components/rating-bar.js

import * as d3 from "d3";
import React, { Component, PropTypes } from 'react';
import { ratingBar as ratingBarClassName } from '../styles/rating-bar.scss';

const scaleExponent = 2;
const colorRange = ['#D8EAEB', '#FF0000'];

class RatingBar extends Component {
  render() {
    const ratingUnits = d3.entries(this.props.distribution)
      .map(d => {
        d.key = parseInt(d.key);
        return d;
      })
      .sort((a, b) => d3.ascending(a.key, b.key))
      .map(d => {
        const percentage = (d.value / this.props.votes * 100).toFixed(1) + '%';
        const style = {
          backgroundColor: this.scaleColor()(d.value)
        };
        return <div key={d.key} className="barUnit" title={`${d.key} — ${percentage}`} style={style}></div>
      });

    const markerStyles = { left: `${this.props.rating * 10}%` };

    return (
      <div className={ratingBarClassName} ref={(node) => this.node = node}>
        <div className="bar">{ratingUnits}</div>
        <div className="marker" style={markerStyles}></div>
      </div>
    );
  }

  scaleColor() {
    return d3.scalePow()
      .exponent(scaleExponent)
      //.exponent(0.5)
      //.domain(d3.extent(d3.values(this.props.distribution)))
      .domain([0, d3.max(d3.values(this.props.distribution))])
      //.domain([0, this.props.votes])
      .range(colorRange);
  }
};

RatingBar.propTypes = {
  rating: PropTypes.number.isRequired,
  votes: PropTypes.number.isRequired,
  distribution: PropTypes.objectOf(PropTypes.number).isRequired,
};

export default RatingBar;
