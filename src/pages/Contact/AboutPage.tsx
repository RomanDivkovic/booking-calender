import styles from './index.module.scss';
import Typography from '../../components/Typography/Typography';

function AboutPage() {
  return (
    <div className={styles.container}>
      <div>
        <Typography variant="h1">About</Typography>
        <Typography variant="p">Testing</Typography>
      </div>
    </div>
  );
}

export default AboutPage;
