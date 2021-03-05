import React, { useState, useCallback, useEffect } from 'react';
import useSWR from 'swr';
import Episode, { getEpisodeId } from './episode';
import { ISeason } from '../lib/types';

type Props = {
  showId: string;
};

export default function Seasons({ showId }: Props) {
  const [currentSeasonNum, setCurrentSeasonNum] = useState(1);
  const [currentSeason, setCurrentSeason] = useState<ISeason>(null);
  const { data: seasons, error } = useSWR<Array<ISeason>, string>(`/api/shows/${showId}/seasons`);

  useEffect(() => {
    if (!seasons || seasons.length === 0) return setCurrentSeason(null);
    const filtered = seasons.filter((s) => s.number === currentSeasonNum);
    setCurrentSeason(filtered[0]);
  }, [seasons, currentSeasonNum]);

  if (error) return <div>failed to load</div>;

  if (!seasons) return <div>loading...</div>;

  const selector = (
    <select className="p-2 rounded-md font-medium bg-gray-200 text-gray-800">
      {seasons.map((season) => {
        const { number } = season;
        return (
          <option value="{number}" selected={number === currentSeasonNum}>
            Season {number}
          </option>
        );
      })}
    </select>
  );

  function currentSeasonRender() {
    if (!currentSeason) return null;
    return (
      <div>
        <div className="flex space-x-4 items-center text-lg">
            <div>{selector}</div>
            <div className="text-gray-600 text-base">{currentSeason.episodes.length || '0'} episodes</div>
        </div>
        <div className="divide-y">
          {currentSeason.episodes.map((episode) => (
            <Episode key={getEpisodeId(episode.season, episode.number)} {...episode} />
          ))}
        </div>
      </div>
    );
  }

  return currentSeasonRender();
}
