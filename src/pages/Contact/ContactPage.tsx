import Typography from '../../components/Typography/Typography';
import styles from './Contact.module.scss';
import { motion } from 'framer-motion';
import roman from '../../assets/images/roman.jpeg';
import anna from '../../assets/images/anna.jpeg';
import spinner from '../../assets/icons/spinner.svg';
import LinkTo from '../../components/LinkTo/LinkTo';

export const ContactPage = () => {
  return (
    <div className={styles.container}>
      <div>
        <Typography align="center" variant="h2">
          Our contacts
        </Typography>
        <div className={styles.cardFlip}>
          <motion.div
            className={styles.cardInner}
            whileHover={{ rotateX: 8, rotateY: 8 }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className={styles.cardFront}>
              <img
                src={anna}
                alt="Anna Widfeldt"
                className={styles.profileImage}
              />
            </div>
            <div className={styles.cardBack}>
              <Typography variant="h3">Anna Widfeldt</Typography>
              <LinkTo mailto="widfeldtanna@gmail.com">
                widfeldtanna@gmail.com
              </LinkTo>
              <LinkTo margin={{ t: 20 }} to="0707580465">
                0707580465
              </LinkTo>
            </div>
          </motion.div>
        </div>

        <div className={styles.cardFlip}>
          <motion.div
            className={styles.cardInner}
            whileHover={{ rotateX: 8, rotateY: 8 }}
            onMouseLeave={(e) => (e.currentTarget.style.transform = '')}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <div className={styles.cardFront}>
              <img
                src={roman}
                alt="Roman Divkovic"
                className={styles.profileImage}
              />
            </div>
            <div className={styles.cardBack}>
              <Typography variant="h3">Roman Divkovic</Typography>
              <LinkTo mailto="divkovicroman@gmail.com">
                divkovicroman@gmail.com
              </LinkTo>
              <LinkTo margin={{ t: 20 }} to="0707580465">
                0707580465
              </LinkTo>
            </div>
          </motion.div>
        </div>

        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          style={{
            marginTop: '60px',
            display: 'inline-block',
            transformStyle: 'preserve-3d',
            filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))'
          }}
        >
          <img
            src={spinner}
            alt="3D Cube Icon"
            width="260"
            height="260"
            style={{
              transform: 'rotateX(25deg) rotateZ(10deg)',
              transition: 'transform 0.3s ease-in-out'
            }}
          />
        </motion.div>
      </div>
    </div>
  );
};
