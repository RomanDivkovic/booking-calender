import { Card } from '@mui/material';
import Typography from '../../components/Typography/Typography';
import styles from './Contact.module.scss';

export const ContactPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles['content-container']}>
        <Typography variant="h2">Contact</Typography>

        <Card className={styles.card}>
          <Typography variant="h3">Anna Widfeldt</Typography>
          <Typography variant="p">widfeldtanna@gmail.com</Typography>
          <Typography variant="p">0707580465</Typography>
        </Card>

        <Card className={styles.card}>
          <Typography variant="h3">Roman Divkovic</Typography>
          <Typography variant="p">divkovicroman@gmail.com</Typography>
          <Typography variant="p">0707580465</Typography>
        </Card>
      </div>
    </div>
  );
};
