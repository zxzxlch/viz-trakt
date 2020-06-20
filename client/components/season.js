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
      totalPlays: null,
    };
  }

  render() {
    const playValues = this.state.episodes
      .filter((episode) => !!episode)
      .map((episode) => episode.plays);

    const episodes = this.state.episodes.map((episode, index) => {
      let episodeProps = Object.assign({}, episode);

      if (!episode) {
        Object.assign(episodeProps, {
          number: index + 1,
        });
      }

      const indexTitle = `${this.props.number}x${episodeProps.number.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
      })}`;
      Object.assign(episodeProps, {
        maxPlays: this.props.maxPlays,
        indexTitle,
      });

      return <Episode key={indexTitle} {...episodeProps} />;
    });

    return (
      <div
        className={seasonClassName}
        ref={(node) => {
          this.node = node;
        }}
      >
        <a href="#" onClick={(event) => this.toggleExpanded(event)}>
          <div className="row rowSeason">
            <div className="col colTitle">
              <span className="title">Season {this.props.number}</span>
              <span className="subtitle">{this.props.airedEpisodes} episodes</span>
            </div>
          </div>
        </a>
        <ul className="episodes">{episodes}</ul>
      </div>
    );
  }

  componentDidMount() {
    if (this.props.expandedOnMount) {
      this.toggleExpanded();
    }
  }

  toggleExpanded(event) {
    if (event) event.preventDefault();

    this.node.classList.toggle('expanded');

    if (!this.state.loading) {
      this.loadEpisodes();
    }
  }

  loadEpisodes() {
    this.setState({ loading: true });

    let promises = Array(this.props.airedEpisodes)
      .fill(null)
      .map((val, index) => {
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
  expandedOnMount: PropTypes.bool,
};

export default Season;
