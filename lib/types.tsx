export interface IShow {
  slug: string;
  title: string;
  year: number;
  overview: string;
  traktId: string;
  traktURL: string;
  rating: number;
  votes: number;
  ratingDistribution?: IRatingDistribution;
}

export interface ISeason {
  traktURL: string;
  number: number;
  title: string;
  overview: string;
  episodes: Array<IEpisode>;
}

export interface IEpisode {
  traktURL: string;
  season: number;
  number: number;
  title: string;
  overview: string;
  firstAired: Date;
  rating: number;
  votes: number;
  ratingDistribution?: IRatingDistribution;
}

export interface IRatingDistribution {
  '1': number;
  '2': number;
  '3': number;
  '4': number;
  '5': number;
  '6': number;
  '7': number;
  '8': number;
  '9': number;
  '10': number;
}
