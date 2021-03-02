import { NextApiRequest, NextApiResponse } from 'next';
import { search as traktSearch } from '../../lib/trakt';

export default async function search(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { q },
  } = req;

  try {
    const data = await traktSearch(typeof q == 'string' ? q : q[0]);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(error);
  }
}
