import Head from "next/head";
import Link from "next/link";
import { GetStaticProps } from "next";
import { getSortedPostsData } from "../lib/posts";
import Date from "../components/date";
import Layout, { SITE_TITLE } from "../components/layout";
import utilStyles from "../styles/utils.module.sass";

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData();

  return {
    props: {
      allPostsData,
    },
  };
};

export default function Home({ allPostsData }: {
  allPostsData: {
    date: string;
    title: string;
    id: string;
  }[]
}) {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>hi.</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Blog</h2>
        <ul className={utilStyles.list}>
          {allPostsData.map(({ id, date, title }) => (
            <li className={utilStyles.listItem} key={id}>
              <Link href={`/posts/${id}`}>{title}</Link>
              <br />
              <small className={utilStyles.lightText}>
                <Date dateString={date} />
              </small>
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  );
}
