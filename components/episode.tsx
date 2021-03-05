import { useMemo } from 'react';
import { IEpisode } from '../lib/types';

type Props = IEpisode & {};

export function getEpisodeId(season: number, episode: number) {
  const episodeFormatted = episode.toLocaleString('en-US', {
    minimumIntegerDigits: 2,
  });
  return `${season}×${episodeFormatted}`;
}

export default function Episode({
  traktURL,
  season,
  number,
  title,
  overview,
  firstAired,
  rating,
  votes,
  ratingDistribution,
}: Props) {
  const episodeId = useMemo(() => getEpisodeId(season, number), [season, number]);
  return (
    <div className="space-y-1 py-4">
      <div className="flex-1 font-bold space-x-1.5">
        <span>{episodeId}</span>
        <span>{title}</span>
      </div>
      <div>{overview}</div>
      <div className="flex space-x-4 items-center">
        <div className="flex items-center">
          <div className="px-1.5 py-1 rounded-lg font-mono font-semibold text-sm text-white bg-blue-600">
            {rating.toFixed(1)}/10
          </div>
          <small className="ml-2 text-xs text-gray-600">{votes.toLocaleString()} votes</small>
        </div>
        <div>
          <a className="text-blue-600" href={traktURL}>
            View on Trakt
          </a>
        </div>
      </div>
    </div>
  );
}
