import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '../components/layout';
import SearchBox from '../components/search-box';

export default function Home() {
  return (
    <Layout>
      <div>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <nav className="flex py-4">
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
          <div className="flex-1">
            <SearchBox />
          </div>
        </nav>
        <main></main>
        <footer></footer>
      </div>
    </Layout>
  );
}
