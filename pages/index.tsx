import Head from "next/head";
import Layout, { SITE_TITLE } from "../components/layout";
import utilStyles from "../styles/utils.module.sass";

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{SITE_TITLE}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>hi.</p>
      </section>
    </Layout>
  );
}
