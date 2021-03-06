import React, { useState, useCallback, useEffect } from 'react';
import Episode from './episode';
import { ISeason } from '../lib/types';

type Props = {
  showId: string;
  seasons: Array<ISeason>;
};

export default function Seasons({ showId, seasons }: Props) {
  const [currentSeasonNum, setCurrentSeasonNum] = useState(1);
  const [currentSeason, setCurrentSeason] = useState<ISeason>(null);

  const selectOnChange = useCallback(
    (e) => {
      setCurrentSeasonNum(parseInt(e.target.value));
    },
    [setCurrentSeasonNum],
  );

  useEffect(() => {
    if (!seasons || seasons.length === 0) return setCurrentSeason(null);
    const filtered = seasons.filter((s) => s.number === currentSeasonNum);
    setCurrentSeason(filtered[0]);
  }, [seasons, currentSeasonNum]);

  const selector = (
    <div className="relative flex">
      <div className="absolute top-0 right-0 w-8 h-full flex items-center text-gray-700 pointer-events-none">
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <select
        className="px-3 py-2 pr-10 rounded-md font-medium bg-gray-200 text-gray-800 appearance-none"
        value={currentSeasonNum}
        onChange={selectOnChange}
      >
        {seasons.map((season) => {
          const { number } = season;
          return (
            <option key={number} value={number}>
              Season {number}
            </option>
          );
        })}
      </select>
    </div>
  );

  return !currentSeason ? null : (
    <div>
      <div className="flex space-x-4 items-center text-lg">
        <div>{selector}</div>
        <div className="text-gray-600 text-base">
          {currentSeason.episodes.length || '0'} episodes
        </div>
      </div>
      <div className="space-y-2">
        {currentSeason.episodes.map((episode) => {
          const { season, number } = episode;
          return (
            <Episode
              key={getEpisodeId(season, number)}
              ratingsAPIPath={`/api/shows/${showId}/seasons/${season}/episode/${number}/ratings`}
              getEpisodeId={getEpisodeId}
              {...episode}
            />
          );
        })}
      </div>
    </div>
  );
}

function getEpisodeId(season: number, episode: number) {
  const episodeFormatted = episode.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  return `${season}×${episodeFormatted}`;
}
