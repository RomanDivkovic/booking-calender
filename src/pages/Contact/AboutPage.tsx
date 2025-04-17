import styles from './index.module.scss';
import Typography from '../../components/Typography/Typography';
import Loader from '../../components/Loader/Loader';

function AboutPage() {
  return (
    <div className={styles.container}>
      <Loader show={true} />
      <div className={styles.cardWrapper}>
        <div className={styles.card3D}>
          <div className={styles.front}>
            <Typography variant="h1">Om oss</Typography>
            <Typography variant="p">
              Vi är en app för att boka gemensamma resurser som tvättstuga 🧺
              eller andra hushållstjänster. Vår kalender synkar allt i realtid!
              ⚡
            </Typography>
          </div>
          <div className={styles.back}>
            <Typography variant="h1">🔥 Tech stack</Typography>
            <Typography variant="p">
              React + TypeScript
              <br />
              Firebase Realtime DB
              <br />
              FullCalendar + Vercel
              <br />
              ❤️ by Roman
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
