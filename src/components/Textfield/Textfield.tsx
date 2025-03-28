import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './Textfield.module.scss';
import { marginToCssProp } from '../../utils/functions';
import Typography from '../Typography/Typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

type Margin =
  | { t?: number | string }
  | { b?: number | string }
  | { l?: number | string }
  | { r?: number | string }
  | { h?: number | string }
  | { v?: number | string }
  | undefined;

type TextFieldProps = {
  label: string;
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isDisabled?: boolean;
  isError?: boolean;
  errorMessage?: string | undefined | null;
  margin?: Margin;
  type?: 'text' | 'password' | 'email';
};

const TextField: React.FC<TextFieldProps> = ({
  label,
  value,
  onChange,
  isError = false,
  isDisabled,
  errorMessage,
  margin,
  type = 'text'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Convert margin to a CSSProperties object
  const marginStyles = marginToCssProp(margin);

  const textFieldClass = classNames({
    [styles['text-field']]: true,
    [styles['text-field-disabled']]: isDisabled,
    [styles['text-field-error']]: isError
  });

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div
      className={styles['text-field-container']}
      style={{ margin: marginStyles }}
    >
      <Typography align="left" variant="label" className={styles.label}>
        {label}
      </Typography>
      <div className={styles['input-wrapper']}>
        <input
          className={textFieldClass}
          type={type === 'password' && !isVisible ? 'password' : 'text'}
          value={value}
          onChange={onChange}
          disabled={isDisabled}
        />
        {type === 'password' && (
          <button
            onClick={toggleVisibility}
            className={styles['toggle-password']}
            type="button"
          >
            <FontAwesomeIcon icon={isVisible ? faEyeSlash : faEye} />
          </button>
        )}
      </div>
      {isError && errorMessage && (
        <Typography
          align="left"
          variant="label-error"
          className={styles['error-message']}
        >
          {errorMessage}
        </Typography>
      )}
    </div>
  );
};

export default TextField;
