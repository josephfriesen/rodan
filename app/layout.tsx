import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import utilStyles from "../styles/utils.module.sass";
import styles from "../styles/layout.module.sass";
import "@styles/global.css";

export const SITE_TITLE = "RODAN";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body>
        <div className={styles.container}>
          <Head>
            <link rel="icon" href="/favicon.ico" />
            <meta name="description" content="RODAN" />
            <meta name="og:title" content={SITE_TITLE} />
          </Head>
          <header className={styles.header}>
            <h1 className={utilStyles.headingLg}>
              <Link href="/" className={utilStyles.colorInherit}>
                {SITE_TITLE}
              </Link>
            </h1>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
