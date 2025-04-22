import { useState } from 'react';
import styles from './index.module.scss';
import Typography from '../../components/Typography/Typography';
import Loader from '../../components/Loader/Loader';
import Accordion from '../../components/Accordion/Accordion';

const accordionData = [
  {
    title: 'What is this app?',
    content: `This app helps manage shared resources like laundry rooms or household bookings. Everyone sees the calendar in real time.`
  },
  {
    title: 'Who can use it?',
    content: `Anyone in the household! All users can view events, but only edit their own.`
  },
  {
    title: 'What tech is it built with?',
    content: `React, TypeScript, Firebase Realtime Database, FullCalendar, and Vercel.`
  },
  {
    title: 'Is it mobile-friendly?',
    content: `Yes! The UI is fully responsive and works beautifully on phones and tablets.`
  }
];

function AboutPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className={styles.container}>
      <Loader show={true} />

      <div className={styles.cardWrapper}>
        <div className={styles.card3D}>
          <div className={styles.front}>
            <Typography variant="h1">About Us</Typography>
            <Typography variant="p">
              We are an app for booking shared resources like laundry 🧺 or
              other household services. Our calendar syncs everything in real
              time! ⚡
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

      <div className={styles.accordionGrid}>
        {accordionData.map((item, index) => (
          <Accordion
            key={index}
            title={item.title}
            isOpen={openIndex === index}
            onToggle={() => handleToggle(index)}
          >
            <Typography variant="p">{item.content}</Typography>
          </Accordion>
        ))}
      </div>
    </div>
  );
}

export default AboutPage;
