import styles from './TimePicker.module.scss';
import React from 'react';

interface Props {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

const TimePicker: React.FC<Props> = ({ label, value, onChange }) => {
  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <input
        className={styles.input}
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default TimePicker;
