import { NextApiRequest, NextApiResponse } from 'next';
import { getShow } from '../../../lib/trakt';

export interface IShowResult {
  slug: string;
  title: string;
  year: number;
  overview: string;
  traktId: string;
  traktUrl: string;
  seasons: Array<IShowSeasonResult>;
  ratings?: IShowRatingsResult;
}

export interface IShowSeasonResult {
  traktUrl: string;
  number: number;
  title: string;
  overview: string;
  rating: number;
  votes: number;
  episodeCount: number;
  airedEpisodes: number;
  maxPlays: number;
}

export interface IShowRatingsResult {
  rating: number;
  votes: number;
  distribution?: any;
}

export default async function show(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  const parseShowData = (d: any): IShowResult => {
    const { title, year, ids, overview, rating, votes } = d;
    const { trakt: traktId, slug } = ids;
    const traktUrl = `https://trakt.tv/shows/${slug}`;
    return {
      slug,
      title,
      year,
      overview,
      traktId,
      traktUrl,
      seasons: [],
      ratings: { rating, votes },
    };
  };
  
  try {
    const data = await getShow(id as string);
    const parsedData = parseShowData(data);
    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).send(error);
  }
}
