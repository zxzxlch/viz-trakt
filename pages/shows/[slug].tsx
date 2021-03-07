import { useRouter } from 'next/router';
import { getShow as getTraktShow, getSeasons as getTraktSeasons } from '../../lib/trakt';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import SearchBox from '../../components/search-box';
import Seasons from '../../components/seasons';
import type { IShow, ISeason, IEpisode } from '../../lib/types';

interface Props {
  show: IShow;
  seasons: Array<ISeason>;
}

function ShowPage({ show, seasons }: Props) {
  const router = useRouter();

  // If props have not been loaded
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { slug, title, year, overview, traktURL, rating, votes } = show;

  return (
    <Layout>
      <div>
        <Head>
          <title>
            {title} ({year}) - viz-trakt
          </title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <nav className="py-4">
          <Link href="/">
            <a className="mr-5 sm:flex sm:flex-shrink sm:items-center sm:mr-8">
              <Image
                className="w-4 h-4"
                src="/images/tv-retro.svg"
                width="40"
                height="40"
                alt="Homepage"
              />
              <h1 className="hidden text-3xl font-bold sm:block sm:ml-2">viz-trakt</h1>
            </a>
          </Link>
        </nav>
        <div className="">
          <SearchBox />
        </div>
        <main className="mt-12">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold">
              {title} ({year})
            </h1>
            <p className="text-lg">{overview}</p>
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
          <div>
            <Seasons key={`${slug}`} seasons={seasons} showId={slug} />
          </div>
        </main>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { slug: showId } = params;
  try {
    const fetchShow = getTraktShow(showId);
    const fetchSeasons = getTraktSeasons(showId);

    const { show, seasons } = await Promise.all([fetchShow, fetchSeasons]).then(
      ([show, seasons]) => {
        return {
          show: parseShowData(show),
          seasons: parseSeasonsData(showId, seasons),
        };
      },
    );

    return {
      props: { show, seasons },
      revalidate: 60 * 60 * 24 * 7, // revalidate once a week at most
    };
  } catch (error) {
    console.error(`Can't getStaticProps for Show page: ${error}`);
  }
}

function parseShowData(data: any): IShow {
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

function parseSeasonsData(showId: string, data: any): Array<ISeason> {
  return data.map((season: any) => parseSeasons(showId, season));
}

function parseSeasons(showId: string, data: any): ISeason {
  const { number, title, overview, episodes = [] } = data;
  const traktURL = `https://trakt.tv/shows/${showId}/seasons/${number}`;

  return {
    number,
    title,
    traktURL,
    overview,
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
    firstAired,
    rating,
    votes,
    traktURL,
  };
}

export default ShowPage;
