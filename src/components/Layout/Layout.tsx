import { Footer } from '../Footer/Footer';
import Header from '../Header/Header';
import styles from './Layout.module.scss';
import { useAuth } from '../../utils/useAuth'; // 👈

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth(); // 👈
  const signedIn = !!user; // 👈

  return (
    <div className={styles.layout}>
      <Header />
      <main className="flex-1 p-6">{children}</main>
      <Footer signedIn={signedIn} />
    </div>
  );
}
