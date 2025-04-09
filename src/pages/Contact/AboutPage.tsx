import styles from './index.module.scss';
import Typography from '../../components/Typography/Typography';

function AboutPage() {
  return (
    <div className={styles.container}>
      <div>
        <Typography variant="h1">About</Typography>
        <Typography variant="p">Text</Typography>
      </div>
    </div>
  );
}

export default AboutPage;
