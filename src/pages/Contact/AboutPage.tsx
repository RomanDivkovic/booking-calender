import { useState } from 'react';
import styles from './index.module.scss';
import Typography from '../../components/Typography/Typography';
import Loader from '../../components/Loader/Loader';
import Accordion from '../../components/Accordion/Accordion';

const accordionData = [
  {
    title: 'What is this app?',
    content: `This app helps manage shared resources for laundry room in household to book and let everyone know when it's going to be used. Everyone sees the calendar in real time, since that room is also a bathroom for the person living downstairs this is needed .`
  },
  {
    title: 'Who can use it?',
    content: `Anyone in the household! All users can view events, but only edit their own and book. We only save the events and you can choose to delete them if you want afterwards`
  },
  {
    title: 'What tech is it built with?',
    content: `React, TypeScript, Firebase Realtime Database & auth, FullCalendar, and Vercel.`
  },
  {
    title: 'Is it mobile-friendly?',
    content: `Yes! The UI is fully responsive and works beautifully on phones and tablets.`
  }
];

// Helper to split into 2 columns
const splitArray = <T,>(arr: T[]): [T[], T[]] => {
  const mid = Math.ceil(arr.length / 2);
  return [arr.slice(0, mid), arr.slice(mid)];
};

function AboutPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [left, right] = splitArray(
    accordionData.map((a, i) => ({ ...a, id: `acc-${i}` }))
  );

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <div className={styles.topSection}>
          <div className={styles.loaderBox}>
            <Loader show={true} />
          </div>

          <div className={styles.cardWrapper}>
            <div className={styles.card3D}>
              <div className={styles.front}>
                <Typography variant="h1">About Us</Typography>
                <Typography variant="p">
                  We are an app for booking shared resources like laundry 🧺 or
                  other household services. Our calendar syncs everything in
                  real time! ⚡
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

        <div className={styles.accordionGrid}>
          {[left, right].map((column, idx) => (
            <div key={idx} className={styles.accordionColumn}>
              {column.map((item) => (
                <Accordion
                  key={item.id}
                  title={item.title}
                  isOpen={openId === item.id}
                  onToggle={() => toggleAccordion(item.id)}
                >
                  <Typography variant="p">{item.content}</Typography>
                </Accordion>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
