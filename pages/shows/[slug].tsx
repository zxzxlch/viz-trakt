import useSWR from 'swr';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '../../components/layout';
import SearchBox from '../../components/search-box';
import type { IShow } from '../../lib/types';
import Seasons from '../../components/seasons';

interface Props {
  show: IShow;
}

function ShowPage({ show }: Props) {
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
              <a className="text-blue-600" href={traktURL}>
                {title} on Trakt
              </a>
            </div>
          </div>
          <div>
            <Seasons showId={slug} />
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
  try {
    const res = await fetch(`${process.env.SITE_BASE_URL}/api/shows/${params.slug}`);
    const show = await res.json();

    return {
      props: { show },
    };
  } catch (error) {
    console.error(error);
  }
}

export default ShowPage;
