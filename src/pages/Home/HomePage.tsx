import LinkTo from '../../components/LinkTo/LinkTo';
import Typography from '../../components/Typography/Typography';
import styles from './Home.module.scss';

export default function HomePage() {
  return (
    <div className={styles.container}>
      <Typography variant="h1">Booking calender for sommerway 3</Typography>
      <p>To check your bookings and dates press below 📅</p>
      <LinkTo to={'/calender'}>Calender</LinkTo>
    </div>
  );
}
