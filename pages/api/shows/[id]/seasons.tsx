import { NextApiRequest, NextApiResponse } from 'next';
import { getSeasons } from '../../../../lib/trakt';
import type { ISeason, IEpisode } from '../../../../lib/types';

function parseData(showId: string, data: any): Array<ISeason> {
  return data.map((season: any) => parseSeasons(showId, season));
}

function parseSeasons(showId: string, data: any): ISeason {
  const { number, title, overview, episodeCount, episodes } = data;
  const traktURL = `https://trakt.tv/shows/${showId}/seasons/${number}`;

  return {
    number,
    title,
    traktURL,
    overview,
    episodeCount,
    episodes: episodes.map((episode: any) => parseEpisode(traktURL, number, episode)),
  };
}

function parseEpisode(seasonURL: string, season: number, data: any): IEpisode {
  const { number, title, overview, rating, votes, first_aired: firstAired } = data;
  const traktURL = `${seasonURL}/episodes/${number}`;

  return {
    season,
    number,
    title,
    overview,
    firstAired: new Date(firstAired),
    rating,
    votes,
    traktURL,
  };
}

export default async function seasons(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  try {
    const data = await getSeasons(id as string).then((data) => parseData(id as string, data));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
}
