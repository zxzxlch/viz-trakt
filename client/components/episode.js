// client/components/episode.js

import React, { Component, PropTypes } from 'react';
import RatingBar from './rating-bar';
import PlaysBar from './plays-bar';
import { episode as episodeClassName } from '../styles/episode.scss';

class Episode extends Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

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

    const { expanded: isExpanded } = this.state;

    return (
      <li className={`${episodeClassName} row${isExpanded ? ' expanded' : ''}`}>
        <div className="row colRatingBar">{ratingBar}</div>
        <div className="row header">
          <div className="col colEp">{this.props.indexTitle}</div>
          <div className="col colTitle" title={this.props.overview}>
            {this.props.title}
          </div>
          <div className="col colRating" title={`${this.props.ratings.votes} ratings`}>
            {this.props.ratings.rating.toFixed(1)}
          </div>
        </div>
        <div className="row details" ref={(node) => (this.detailsBox = node)}>
          <div>{this.props.ratings.votes} ratings</div>
          <div>{this.props.overview}</div>
          <div>
            <a href={this.props.traktUrl} target="_blank">
              View on Trakt
            </a>
          </div>
        </div>
        <div className="row">
          <a href="#" onClick={this.toggleExpanded}>
            Show {isExpanded ? 'less' : 'more'}
          </a>
        </div>
      </li>
    );
  }

  toggleExpanded(event) {
    event.preventDefault();
    this.setState((state) => ({
      expanded: !state.expanded,
    }));
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
