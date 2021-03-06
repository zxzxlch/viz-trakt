import range from 'lodash/range';
import { NextApiRequest, NextApiResponse } from 'next';
import { getEpisodeRatings as getTraktEpisodeRatings } from '../../../../../../../../lib/trakt';
import { APIRatingsData } from '../../../../../../../../lib/types';

export default async function ratings(req: NextApiRequest, res: NextApiResponse) {
  const { showId, season, episode } = req.query as { [key: string]: string };

  try {
    const data = await getTraktEpisodeRatings(showId, parseInt(season), parseInt(episode)).then(
      parse,
    );
    res.status(200).json(data);
  } catch (error) {
    res.status(500).send(`${error}`);
  }
}

function parse(data: any): APIRatingsData {
  const { rating, votes, distribution: _distribution } = data;
  const distribution = range(0, 10).map((n) => _distribution[(n + 1).toString()]);
  return { rating, votes, distribution };
}
