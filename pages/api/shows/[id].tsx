import { NextApiRequest, NextApiResponse } from 'next';
import { getShow } from '../../../lib/trakt';
import type { IShow } from '../../../lib/types';

function parseData(data: any): IShow {
  const { title, year, ids, overview, rating, votes } = data;
  const { trakt: traktId, slug } = ids;
  const traktURL = `https://trakt.tv/shows/${slug}`;

  return {
    slug,
    title,
    year,
    overview,
    traktId,
    traktURL,
    rating,
    votes,
  };
}

export default async function show(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;

  try {
    const data = await getShow(id as string).then((data) => parseData(data));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
}
