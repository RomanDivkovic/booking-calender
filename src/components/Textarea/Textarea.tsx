import Typography from '../Typography/Typography';
import React from 'react';
import scss from './TextArea.module.scss';

interface TextAreaProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea: React.FC<TextAreaProps> = ({ label, value, onChange }) => {
  return (
    <div className={scss.container}>
      <Typography variant="label">{label}</Typography>
      <textarea
        className={scss['text-area']}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default TextArea;
