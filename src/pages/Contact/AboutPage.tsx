import styles from './index.module.scss';
import Typography from '../../components/Typography/Typography';
import Loader from '../../components/Loader/Loader';
import Accordion from '../../components/Accordion/Accordion';

function AboutPage() {
  return (
    <div className={styles.container}>
      <Loader show={true} />

      <div className={styles.content}>
        <Typography variant="h1" align="center" margin={{ b: 20 }}>
          About the app
        </Typography>

        <Accordion title="💡 What is this app?">
          <Typography variant="p">
            This is a shared booking app for resources like laundry rooms,
            household items, or anything that needs scheduling within a group.
            All data is synced in real time between users!
          </Typography>
        </Accordion>

        <Accordion title="🧪 Features">
          <ul>
            <li>✅ Create & view events in real time</li>
            <li>📱 Optimized for mobile and desktop</li>
            <li>👥 Every user can see all bookings, but only edit their own</li>
            <li>🔒 Firebase Auth for secure login</li>
          </ul>
        </Accordion>

        <Accordion title="🛠 Tech stack">
          <ul>
            <li>⚛️ React + TypeScript</li>
            <li>🔥 Firebase Realtime Database</li>
            <li>📆 FullCalendar.js</li>
            <li>💾 Vercel for deployment</li>
          </ul>
        </Accordion>

        <Accordion title="👨‍💻 Developers">
          <Typography variant="p">
            Built by Roman Divkovic & Anna Widfeldt with love ❤️
          </Typography>
        </Accordion>
      </div>
    </div>
  );
}

export default AboutPage;
