import Head from 'next/head';
import Layout from '../components/layout';
import SearchBox from '../components/search-box';
import styles from '../styles/Home.module.css';

export default function Home() {
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Next App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={styles.main}>
          <h1 className={styles.title}>
            <img src="/images/tv-retro.svg" width="24" />
            viz-trakt
          </h1>
          <div>
            <SearchBox />
          </div>
        </main>
        <footer className={styles.footer}></footer>
      </div>
    </Layout>
  );
}
