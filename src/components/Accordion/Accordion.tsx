import React, { useState } from 'react';
import styles from './Accordion.module.scss';
import { Icon } from '../Icon/Icon';

type AccordionProps = {
  title: string;
  children: React.ReactNode;
};

const Accordion = ({ title, children }: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.accordion}>
      <button className={styles.accordionHeader} onClick={toggleAccordion}>
        <span>{title}</span>
        <Icon
          name={'chevron-down'}
          size="md"
          color="primary"
          className={`${styles.icon} ${isOpen ? styles.rotate : ''}`}
        />
      </button>
      {isOpen && <div className={styles.accordionBody}>{children}</div>}
    </div>
  );
};

export default Accordion;
