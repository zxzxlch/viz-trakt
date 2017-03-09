// client/components/season.js

import React, { Component, PropTypes } from 'react';
import Episode from './episode';
import { season as seasonClassName } from '../styles/season.scss';

class Season extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      episodes: Array(props.airedEpisodes).fill(null),
      avgRating: null,
      totalPlays: null
    };
  }
  
  render() {
    const playValues = this.state.episodes.filter(episode => !!episode).map(episode => episode.plays);

    const episodes = this.state.episodes.map((episode, index) => {
      let episodeProps = Object.assign({}, episode);
      if (!episode) {
        Object.assign(episodeProps, {
          number: index + 1,
        });
      }
      episodeProps.indexTitle = `${this.props.number}x${episodeProps.number.toLocaleString('en-US', { minimumIntegerDigits: 2 })}`;
      return <Episode key={episodeProps.indexTitle} {...episodeProps} />
    });

    return (
      <div className={seasonClassName} ref={(node) => { this.node = node; }}>
        <a href="#" onClick={(event) => this.toggleExpanded(event)}>
          <div className="row rowSeason">
            <div className="col colTitle">
              <div className="title">Season {this.props.number}</div>
              <div className="subtitle">{this.props.airedEpisodes} episodes</div>
            </div>
            <div className="col colRatingBar"></div>
            <div className="col colRating">
              <div className="value">{this.state.avgRating}</div>
              <div className="subtitle">average</div>
            </div>            
            <div className="col colPlaysBar"></div>
            <div className="col colPlays">
              <div className="value">{this.state.totalPlays}</div>
              <div className="subtitle">total</div>
            </div>
          </div>
        </a>
        <ul className="episodes">
          {episodes}
        </ul>
      </div>
    )
  }

  toggleExpanded(event) {
    event.preventDefault();

    this.node.classList.toggle('expanded');

    if (!this.state.loading) {
      this.loadEpisodes();
    }
  }

  loadEpisodes() {
    this.setState({ loading: true });

    let promises = Array(this.props.airedEpisodes).fill(null).map((val, index) => {
      const episodeNumber = index + 1;
      const url = `${this.props.url}/episodes/${episodeNumber}`;
      return $.get(url)
       .done((data) => {
          this.updateEpisode(episodeNumber, data);
       })
       .catch((err) => {
         console.error(err);
       });
    });

    Promise.all(promises).then(() => console.log('All episodes loaded'));
  }
  
  updateEpisode(episodeNumber, data) {
    const episode = Object.assign({}, data, { 
      number: episodeNumber,
      traktUrl: this.url,
      maxPlays: this.props.maxPlays,
      traktUrl: `${this.props.traktUrl}/episodes/${episodeNumber}`,
    });

    this.setState((state, props) => {
      const { episodes } = state;
      episodes[episodeNumber - 1] = episode;
      return { episodes };
    });

    this.props.updateMaxPlays(data.plays);
  }
}

Season.propTypes = {
  traktUrl: PropTypes.string,
  number: PropTypes.number,
  title: PropTypes.string,
  overview: PropTypes.string,
  rating: PropTypes.number,
  votes: PropTypes.number,
  episodeCount: PropTypes.number,
  airedEpisodes: PropTypes.number,
  maxPlays: PropTypes.number,
  updateMaxPlays: PropTypes.func,
};

export default Season;
