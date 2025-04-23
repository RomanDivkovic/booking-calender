import { useState } from 'react';
import styles from './Contact.module.scss';
import Typography from '../../components/Typography/Typography';
import LinkTo from '../../components/LinkTo/LinkTo';
import { motion } from 'framer-motion';

import annaImg from '../../assets/images/anna.jpeg';
import romanImg from '../../assets/images/roman.jpeg';

const ContactCard = ({
  image,
  name,
  email,
  phone,
  genderSymbol
}: {
  image: string;
  name: string;
  email: string;
  phone: string;
  genderSymbol: string;
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      setIsFlipped((prev) => !prev);
    }
  };

  return (
    <div className={styles.cardFlip} onClick={handleClick}>
      <div className={`${styles.cardInner} ${isFlipped ? styles.flipped : ''}`}>
        <div className={styles.cardFront}>
          <img src={image} alt={name} className={styles.profileImage} />
          <motion.div
            className={styles.genderSymbol}
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          >
            {genderSymbol}
          </motion.div>
        </div>
        <div className={styles.cardBack}>
          <Typography variant="h3">{name}</Typography>
          <LinkTo mailto={email}>{email}</LinkTo>
          <LinkTo margin={{ t: 20 }} to={phone}>
            {phone}
          </LinkTo>
        </div>
      </div>
    </div>
  );
};

export const ContactPage = () => {
  return (
    <div className={styles.container}>
      <Typography align="center" variant="h2" margin={{ b: 4 }}>
        Our contacts
      </Typography>

      <div className={styles.cardRow}>
        <ContactCard
          image={annaImg}
          name="Anna Widfeldt"
          email="widfeldtanna@gmail.com"
          phone="0707580465"
          genderSymbol="♀️"
        />
        <ContactCard
          image={romanImg}
          name="Roman Divkovic"
          email="divkovicroman@gmail.com"
          phone="0707580465"
          genderSymbol="♂️"
        />
      </div>
    </div>
  );
};
