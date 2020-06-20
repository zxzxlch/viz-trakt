// client/components/episode.js

import React, { Component, PropTypes } from 'react';
import RatingBar from './rating-bar';
import PlaysBar from './plays-bar';
import { episode as episodeClassName } from '../styles/episode.scss';

class Episode extends Component {
  render() {
    if (!this.props.ratings || !this.props.plays) {
      return (
        <li className={`${episodeClassName} row`}>
          <div className="col colEp">{this.props.indexTitle}</div>
          <div className="col colPlaceholder animatePulse"></div>
        </li>
      );
    }

    const ratingBar = <RatingBar {...this.props.ratings} />;
    const votes = (
      <div className="subtitle">{this.props.ratings.votes.toLocaleString('en-US')} ratings</div>
    );

    return (
      <li className={`${episodeClassName} row`}>
        <div className="col colRatingBar">{ratingBar}</div>
        <div>
          <div className="col colEp">{this.props.indexTitle}</div>
          <div
            className="col colTitle"
            title={this.props.overview}
            onClick={() => this.toggleDetails()}
          >
            {this.props.title}
          </div>
          <div className="col colRating" title={`${this.props.ratings.votes} ratings`}>
            <div className="value">{this.props.ratings.rating.toFixed(1)}</div>
            <div>{this.props.ratings.votes}</div>
          </div>
        </div>
        <div className="col colDetails" ref={(node) => (this.detailsBox = node)}>
          <div>
            <a href={this.props.traktUrl} target="_blank">
              Trakt
            </a>
          </div>
          <div>{this.props.overview}</div>
        </div>
      </li>
    );
  }

  toggleDetails() {
    this.detailsBox.classList.toggle('expanded');
  }
}

Episode.propTypes = {
  number: PropTypes.number,
  traktUrl: PropTypes.string,
  indexTitle: PropTypes.string,
  title: PropTypes.string,
  overview: PropTypes.string,
  ratings: PropTypes.shape(RatingBar.propTypes),
  plays: PropTypes.number,
  maxPlays: PropTypes.number,
};

export default Episode;
