import { NextApiRequest, NextApiResponse } from 'next';
import { search as traktSearch } from '../../lib/trakt';

export interface ISearchResult {
  mediaType: 'show' | 'movie';
  title: string;
  year: number;
  traktId: string;
  slug: string;
}

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { q },
  } = req;

  const parse = (d: any): ISearchResult => {
    const { type, show, movie } = d;
    const mediaInfo = show || movie;
    const {
      title,
      year,
      ids: { id: traktId, slug },
    } = mediaInfo;
    return { mediaType: type, title, year, traktId, slug };
  };

  try {
    const data = await traktSearch(typeof q == 'string' ? q : q[0]);
    const parsedData = data.slice(0, 7).map((d: any) => parse(d));
    res.status(200).json(parsedData);
  } catch (error) {
    res.status(500).send(error);
  }
}
