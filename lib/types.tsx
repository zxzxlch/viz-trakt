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
}

export type IRatingDistribution = Array<number>;

export interface APIRatingsData {
  rating: number;
  votes: number;
  distribution: IRatingDistribution;
}
