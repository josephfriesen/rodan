import Link from 'next/link';
import utilStyles from '@styles/utils.module.sass';
import styles from '@styles/layout.module.sass';
import '@styles/global.css';

export const SITE_TITLE = 'RODAN';

export default function RootPage({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={utilStyles.headingLg}>
          <Link href="/" className={utilStyles.colorInherit}>
            {SITE_TITLE}
          </Link>
        </h1>
      </header>
      <main>{children}</main>
    </div>
  );
}
