import React from 'react';
import styles from './Alert.module.scss';

interface AlertButton {
  text: string;
  onPress: () => void;
}

interface CustomAlertProps {
  title: string;
  body: string;
  buttons: AlertButton[];
  visible: boolean;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({
  title,
  body,
  buttons,
  visible,
  onClose
}) => {
  // Hanterar att stänga alerten
  const handleButtonClick = (onPress: () => void) => {
    onPress();
    onClose();
  };

  // Visa inte alerten om `visible` är false
  if (!visible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.alert}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.body}>{body}</p>
        <div className={styles.buttons}>
          {buttons.map((button, index) => (
            <button
              key={index}
              className={styles.button}
              onClick={() => handleButtonClick(button.onPress)}
            >
              {button.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
