import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { IEpisode, APIRatingsData, IRatingDistribution } from '../lib/types';
import RatingsGraph from './ratingsGraph';

type Props = IEpisode & {
  getEpisodeId: (season: number, episode: number) => any;
  ratingsAPIPath: string;
};

export default function Episode({
  traktURL,
  season,
  number,
  title,
  overview,
  firstAired,
  rating: _rating,
  votes: _votes,
  getEpisodeId,
  ratingsAPIPath,
}: Props) {
  const episodeId = useMemo(() => getEpisodeId(season, number), [season, number]);
  const { data: ratingsData, error } = useSWR<APIRatingsData, any>(ratingsAPIPath, {
    initialData: { rating: _rating, votes: _votes, distribution: null },
    revalidateOnMount: true,
    revalidateOnFocus: false,
  });

  if (error) console.error(`Failed to load ${ratingsAPIPath}: ${error}`);
  const { rating, votes, distribution } = ratingsData;

  useEffect(() => {
    console.log(`Fetched ${ratingsAPIPath}`);
    console.log(ratingsData);
  }, [ratingsData]);

  return (
    <div className="flex-col py-4 space-y-3 ">
      <div className="w-full sm:w-16 sm:h-12">
        <RatingsGraph {...ratingsData} />
      </div>
      <div className="space-y-1">
        <div className="flex-1 font-semibold space-x-1.5 text-lg">
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
            <a className="text-blue-600" href={traktURL} target="_blank">
              View on Trakt
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
