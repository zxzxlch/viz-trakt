// client/components/Show.js

import { pick as _pick } from 'lodash';
import React, { Component, PropTypes } from 'react';
import Season from './season';
import RatingBar from './rating-bar';
import {
  show as showClassName,
  title as showTitleClassName,
  ratingBox as ratingBoxClassName,
  episodesTable as episodesTableClassName,
} from '../styles/show.scss';

class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      maxPlays: 0,
    };
  }

  render() {
    const seasons = this.props.seasons.map((season) => {
      const seasonProps = _pick(
        season,
        'number',
        'title',
        'overview',
        'rating',
        'votes',
        'episodeCount',
        'airedEpisodes',
      );
      Object.assign(seasonProps, {
        url: `${this.url()}/seasons/${season.number}`,
        traktUrl: `${this.getTraktUrl()}/seasons/${season.number}`,
        maxPlays: this.state.maxPlays,
        updateMaxPlays: (value) => this.updateMaxPlays(value),
      });
      return <Season key={season.number} {...seasonProps} />;
    });

    return (
      <div className={showClassName}>
        <div className="header">
          <h1 className={showTitleClassName}>
            {this.props.title} ({this.props.year})
          </h1>
          <div className={ratingBoxClassName}>
            <div className="ratingBarContainer">
              <RatingBar {...this.props.ratings} />
            </div>
            <div className="rating" title={`${this.props.ratings.votes} ratings`}>
              {this.props.ratings.rating.toFixed(1)}
            </div>
          </div>
        </div>
        <div className={episodesTableClassName}>
          <div className="header row">
            <div className="col colEp">Ep</div>
            <div className="col colTitle">Title</div>
            <div className="col colRatingBar">Rating</div>
            <div className="col colRating"></div>
            <div className="col colPlaysBar">Plays</div>
            <div className="col colPlays"></div>
          </div>
          {seasons}
        </div>
      </div>
    );
  }

  url() {
    return `${process.env.APP_BASE_URL}/shows/${this.props.id}`;
  }

  getTraktUrl() {
    return `https://trakt.tv/shows/${this.props.slug}`;
  }

  updateMaxPlays(value) {
    this.setState((state, props) => {
      if (state.maxPlays < value) {
        return { maxPlays: value };
      }
    });
  }
}

// 'title', 'year', 'ids', 'overview', 'rating', 'votes'
Show.propTypes = {
  id: React.PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  slug: PropTypes.string,
  traktUrl: PropTypes.string,
  title: PropTypes.string,
  year: PropTypes.number,
  seasons: PropTypes.arrayOf(PropTypes.shape(Season.propTypes)),
  ratings: PropTypes.shape(RatingBar.propTypes),
};

export default Show;
